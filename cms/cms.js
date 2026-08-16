(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const state = { zip:null, files:new Map(), root:'', pages:[], page:null, pagePath:null, selected:null, layers:[], history:[], future:[], zoom:1, fitPreview:true, viewport:'desktop', blobs:new Map(), trainings:[], dirty:false, previewMode:false, textEditingActive:false, textSelectionActive:false };
  const els = {
    zipInput:$('#zipInput'), openZipBtn:$('#openZipBtn'), chooseZipBtn:$('#chooseZipBtn'), welcomeOpenBtn:$('#welcomeOpenBtn'), projectDrop:$('#projectDrop'), projectLoaded:$('#projectLoaded'), projectName:$('#projectName'), projectMeta:$('#projectMeta'),
    pageList:$('#pageList'), layersList:$('#layersList'), preview:$('#previewFrame'), device:$('#deviceFrame'), canvasStage:$('#canvasStage'), welcome:$('#welcome'), exportBtn:$('#exportBtn'), saveDraftBtn:$('#saveDraftBtn'), saveState:$('#saveState'), breadcrumb:$('#breadcrumb'), inspector:$('#inspector'), inspectorEmpty:$('#inspectorEmpty'), selectedLabel:$('#selectedLabel'), selectedTag:$('#selectedTag'), toast:$('#toast'), undo:$('#undoBtn'), redo:$('#redoBtn'), fitViewport:$('#fitViewportBtn'),
    calendar:$('#calendarDialog'), trainingList:$('#trainingList'), trainingForm:$('#trainingForm'), media:$('#mediaDialog'), mediaGrid:$('#mediaGrid'), previewModeBtn:$('#previewModeBtn'), viewportScope:$('#viewportScope'), restoreDraftBtn:$('#restoreDraftBtn'), welcomeRestoreBtn:$('#welcomeRestoreBtn'), draftMeta:$('#draftMeta'), welcomeDraftMeta:$('#welcomeDraftMeta')
  };
  const imageExt = /\.(png|jpe?g|webp|gif|svg|avif)$/i;
  const htmlExt = /\.html?$/i;
  const ignoredPages = /(kurs-stacjonarny|material-stacjonarny|generator-zaswiadczen|\/cms\/)/i;

  function toast(msg){ els.toast.textContent=msg; els.toast.classList.add('is-visible'); clearTimeout(toast.t); toast.t=setTimeout(()=>els.toast.classList.remove('is-visible'),2400); }
  function setDirty(value=true){ state.dirty=value; els.saveState.innerHTML=`<i></i> ${value?'Zmiany od ostatniego zapisu':'Gotowy do edycji'}`; }
  function rootless(path){ return state.root && path.startsWith(state.root) ? path.slice(state.root.length) : path; }
  function fullPath(path){ return state.root + String(path).replace(/^\/+/, ''); }
  function basename(path){ return path.split('/').filter(Boolean).pop() || path; }
  function pageTitle(path, html){ const doc=new DOMParser().parseFromString(html,'text/html'); return doc.querySelector('title')?.textContent?.split(/[|—-]/)[0].trim() || basename(path).replace(/\.html?$/,''); }

  const draftDbName='edukacja-bez-granic-cms';
  const draftProjectStore='projects';
  const draftMetaStore='meta';
  const draftKey='ostatni-projekt';
  function openDraftDb(){return new Promise((resolve,reject)=>{if(!('indexedDB' in window)){reject(new Error('Ta przeglądarka nie obsługuje zapisu roboczego'));return}const request=indexedDB.open(draftDbName,1);request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(draftProjectStore))db.createObjectStore(draftProjectStore,{keyPath:'id'});if(!db.objectStoreNames.contains(draftMetaStore))db.createObjectStore(draftMetaStore,{keyPath:'id'})};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error||new Error('Nie udało się otworzyć pamięci przeglądarki'))})}
  async function getDraftRecord(storeName){const db=await openDraftDb();return new Promise((resolve,reject)=>{const request=db.transaction(storeName,'readonly').objectStore(storeName).get(draftKey);request.onsuccess=()=>{resolve(request.result||null);db.close()};request.onerror=()=>{reject(request.error);db.close()}})}
  async function putDraftRecord(project,meta){const db=await openDraftDb();return new Promise((resolve,reject)=>{const tx=db.transaction([draftProjectStore,draftMetaStore],'readwrite');tx.objectStore(draftProjectStore).put(project);tx.objectStore(draftMetaStore).put(meta);tx.oncomplete=()=>{resolve();db.close()};tx.onerror=()=>{reject(tx.error||new Error('Nie udało się zapisać projektu'));db.close()};tx.onabort=()=>{reject(tx.error||new Error('Zapis projektu został przerwany'));db.close()}})}
  function formatDraftDate(value){return new Intl.DateTimeFormat('pl-PL',{dateStyle:'short',timeStyle:'short'}).format(new Date(value))}
  function setDraftButtons(meta){const exists=!!meta;[els.restoreDraftBtn,els.welcomeRestoreBtn].forEach(button=>{if(button)button.hidden=!exists});[els.draftMeta,els.welcomeDraftMeta].forEach(label=>{if(!label)return;label.hidden=!exists;label.textContent=exists?`Ostatni zapis: ${formatDraftDate(meta.savedAt)} · ${meta.name}`:''})}
  async function refreshDraftAvailability(){try{setDraftButtons(await getDraftRecord(draftMetaStore))}catch{setDraftButtons(null)}}
  function showDraftSavedStatus(savedAt){state.dirty=false;els.saveState.innerHTML=`<i></i> Zapisano roboczo ${new Intl.DateTimeFormat('pl-PL',{hour:'2-digit',minute:'2-digit'}).format(new Date(savedAt))}`}

  async function saveDraft(){if(!state.zip||!state.files.size)return;document.activeElement?.blur();await new Promise(resolve=>requestAnimationFrame(resolve));saveCurrentPage();persistTrainings();const savedAt=Date.now(),name=els.projectName.textContent||'Portal';const totalBytes=[...state.files.values()].reduce((sum,bytes)=>sum+(bytes.byteLength||bytes.length||0),0);const project={id:draftKey,schema:1,savedAt,name,root:state.root,pagePath:state.pagePath,viewport:state.viewport,files:[...state.files.entries()]};const meta={id:draftKey,savedAt,name,totalBytes,fileCount:state.files.size,pageCount:state.pages.length};const oldText=els.saveDraftBtn.textContent;els.saveDraftBtn.disabled=true;els.saveDraftBtn.textContent='Zapisywanie…';els.saveState.innerHTML='<i></i> Zapisywanie wersji roboczej…';try{navigator.storage?.persist?.().catch(()=>{});await putDraftRecord(project,meta);showDraftSavedStatus(savedAt);setDraftButtons(meta);toast('Zapis roboczy został zachowany w przeglądarce')}catch(error){console.error(error);setDirty(true);toast(error?.name==='QuotaExceededError'?'Brak miejsca w pamięci przeglądarki':'Nie udało się zapisać wersji roboczej')}finally{els.saveDraftBtn.disabled=false;els.saveDraftBtn.textContent=oldText}}

  async function restoreDraft(){const buttons=[els.restoreDraftBtn,els.welcomeRestoreBtn];buttons.forEach(button=>{if(button)button.disabled=true});els.saveState.innerHTML='<i></i> Wczytywanie zapisu roboczego…';try{const record=await getDraftRecord(draftProjectStore);if(!record?.files?.length)throw new Error('Brak zapisu roboczego');state.blobs.forEach(URL.revokeObjectURL);state.blobs.clear();state.files=new Map(record.files.map(([path,bytes])=>[path,bytes instanceof Uint8Array?bytes:new Uint8Array(bytes)]));const names=[...state.files.keys()];state.zip={draft:true};state.root=record.root||detectRoot(names);state.pages=names.filter(n=>htmlExt.test(n)&&!ignoredPages.test(n)).map(n=>rootless(n)).sort((a,b)=>(a==='index.html'?-1:b==='index.html'?1:a.localeCompare(b,'pl')));state.history=[];state.future=[];state.page=null;state.pagePath=null;state.viewport=['desktop','tablet','mobile'].includes(record.viewport)?record.viewport:'desktop';$$('.viewport-switch button').forEach(button=>button.classList.toggle('is-active',button.dataset.viewport===state.viewport));els.device.className='device-frame '+state.viewport;updateViewportScope();els.projectDrop.hidden=true;els.projectLoaded.hidden=false;els.projectName.textContent=record.name||'Zapis roboczy portalu';els.projectMeta.textContent=`${names.length} plików · ${state.pages.length} stron · zapis roboczy`;els.exportBtn.disabled=false;els.saveDraftBtn.disabled=false;els.previewModeBtn.disabled=false;els.welcome.hidden=true;els.device.hidden=false;renderPages();const first=state.pages.includes(record.pagePath)?record.pagePath:(state.pages.includes('index.html')?'index.html':state.pages[0]);if(first)await loadPage(first,true);loadTrainings();showDraftSavedStatus(record.savedAt);toast('Wczytano ostatni zapis roboczy')}catch(error){console.error(error);els.saveState.innerHTML='<i></i> Nie udało się wczytać zapisu';toast('Nie udało się wczytać wersji roboczej')}finally{buttons.forEach(button=>{if(button)button.disabled=false})}}

  async function openZip(file){
    if(!file) return;
    try{
      els.saveState.innerHTML='<i></i> Wczytywanie paczki…';
      const zip=await JSZip.loadAsync(file);
      state.zip=zip; state.files.clear(); state.pages=[]; state.blobs.forEach(URL.revokeObjectURL); state.blobs.clear();
      const names=Object.keys(zip.files).filter(n=>!zip.files[n].dir && !/\/(?:__MACOSX|\.DS_Store)/.test(n));
      state.root=detectRoot(names);
      await Promise.all(names.map(async n=>state.files.set(n, await zip.files[n].async('uint8array'))));
      state.pages=names.filter(n=>htmlExt.test(n)&&!ignoredPages.test(n)).map(n=>rootless(n)).sort((a,b)=>(a==='index.html'?-1:b==='index.html'?1:a.localeCompare(b,'pl')));
      state.history=[]; state.future=[]; state.page=null; state.pagePath=null;
      els.projectDrop.hidden=true; els.projectLoaded.hidden=false; els.projectName.textContent=file.name; els.projectMeta.textContent=`${names.length} plików · ${state.pages.length} stron`;
      els.exportBtn.disabled=false; els.saveDraftBtn.disabled=false; els.previewModeBtn.disabled=false; els.welcome.hidden=true; els.device.hidden=false; renderPages(); setDirty(false);
      const first=state.pages.includes('index.html')?'index.html':state.pages[0]; if(first) await loadPage(first);
      loadTrainings(); toast('Paczka została otwarta');
    }catch(err){ console.error(err); toast('Nie udało się otworzyć tej paczki ZIP'); els.saveState.innerHTML='<i></i> Błąd wczytywania'; }
  }
  function detectRoot(names){ const first=names[0]||''; const seg=first.split('/')[0]; return names.every(n=>n.startsWith(seg+'/'))?seg+'/':''; }
  function bytesText(bytes){ return new TextDecoder().decode(bytes); }
  function textBytes(text){ return new TextEncoder().encode(text); }
  function setFile(path,data){ state.files.set(fullPath(path), typeof data==='string'?textBytes(data):data); setDirty(); }
  function getText(path){ const b=state.files.get(fullPath(path)); return b?bytesText(b):''; }

  function renderPages(){
    els.pageList.innerHTML='';
    state.pages.forEach(async path=>{
      const html=getText(path); const b=document.createElement('button'); b.className='page-item'+(path===state.pagePath?' is-active':''); b.textContent=pageTitle(path,html); b.title=path; b.onclick=()=>loadPage(path); els.pageList.append(b);
    });
  }

  async function createPage(){
    if(!state.zip){ toast('Najpierw otwórz paczkę projektu'); return; }
    const title=prompt('Nazwa nowej strony:','Nowa strona'); if(!title)return;
    let slugName=slug(title)||'nowa-strona', path=slugName+'.html', i=2;
    while(state.files.has(fullPath(path))) path=slugName+'-'+i+++'.html';
    const source=getText(state.pagePath||'index.html');
    const doc=new DOMParser().parseFromString(source||'<!doctype html><html lang="pl"><head><meta charset="utf-8"></head><body><main></main></body></html>','text/html');
    doc.title=title+' — Edukacja bez granic';
    const main=doc.querySelector('main')||doc.body;
    main.innerHTML=`<section style="padding:clamp(64px,10vw,140px) clamp(24px,7vw,120px)"><h1 style="font-size:clamp(48px,8vw,112px);font-weight:400;line-height:.95">${escapeHtml(title)}</h1><p style="max-width:720px;font-size:20px;line-height:1.6">Kliknij ten tekst, aby rozpocząć edycję nowej strony.</p></section>`;
    setFile(path,'<!doctype html>\n'+doc.documentElement.outerHTML);
    state.pages.push(path); state.pages.sort((a,b)=>(a==='index.html'?-1:b==='index.html'?1:a.localeCompare(b,'pl'))); renderPages(); await loadPage(path,true); toast('Nowa strona została utworzona');
  }

  async function loadPage(path, skipSave=false){
    if(state.pagePath && !skipSave) saveCurrentPage();
    state.pagePath=path; state.selected=null; renderPages(); showInspector(null); els.breadcrumb.textContent=`${basename(els.projectName.textContent)} / ${path}`;
    const html=getText(path); if(!html){ toast('Nie można odczytać strony'); return; }
    state.page=html;
    const rendered=await preparePreviewHtml(html,path);
    els.preview.srcdoc=rendered;
    els.preview.onload=()=>{ setTimeout(()=>{ buildLayers(); postPreviewMode(); postResponsiveViewport(); if(state.fitPreview)fitViewport(); },120); };
  }

  async function preparePreviewHtml(html,pagePath){
    const doc=new DOMParser().parseFromString(html,'text/html');
    doc.querySelectorAll('[src],[href],[poster],[srcset]').forEach(el=>{
      ['src','href','poster'].forEach(attr=>{ const v=el.getAttribute(attr); if(v && isLocal(v)){ el.setAttribute(`data-cms-original-${attr}`,v); const resolved=resolvePath(pagePath,v); const url=assetUrl(resolved); if(url) el.setAttribute(attr,url); } });
      if(el.hasAttribute('srcset')) el.removeAttribute('srcset');
    });
    const style=doc.createElement('style'); style.id='cms-bridge-style'; style.textContent=`html.cms-editing *{cursor:default!important}html.cms-editing [data-cms-hover]{outline:1px dashed #16877f!important;outline-offset:2px}html.cms-editing [data-cms-selected]{outline:2px solid #11a49a!important;outline-offset:3px;position:relative!important}html.cms-editing:not(.cms-navigation) a{cursor:default!important}html.cms-editing:not(.cms-navigation) img{cursor:grab!important;touch-action:none!important;user-select:none!important;-webkit-user-drag:none!important}html.cms-editing:not(.cms-navigation) :is(h1,h2,h3,h4,h5,h6,p,blockquote,li,figcaption){cursor:move!important;touch-action:none!important;user-select:none!important}html.cms-editing:not(.cms-navigation) [data-cms-editing-text]{cursor:text!important;touch-action:auto!important;user-select:text!important;outline:2px solid #8c5cc4!important;outline-offset:4px}html.cms-editing:not(.cms-navigation) [data-cms-editing-text] *{cursor:text!important;user-select:text!important}html.cms-editing:not(.cms-navigation) [data-cms-dragging],html.cms-editing:not(.cms-navigation) [data-cms-resizing]{cursor:grabbing!important;outline:2px solid #11a49a!important;outline-offset:3px}#cms-resize-overlay{position:fixed!important;z-index:2147483646!important;display:none;pointer-events:none!important;border:2px solid #11a49a!important;box-sizing:border-box!important}#cms-resize-overlay .cms-resize-handle{all:initial!important;position:absolute!important;display:block!important;width:13px!important;height:13px!important;border:2px solid #fff!important;border-radius:50%!important;background:#11a49a!important;box-shadow:0 1px 5px rgba(0,0,0,.28)!important;pointer-events:auto!important;box-sizing:border-box!important}#cms-resize-overlay [data-dir="e"]{right:-8px!important;top:50%!important;transform:translateY(-50%)!important;cursor:ew-resize!important}#cms-resize-overlay [data-dir="s"]{left:50%!important;bottom:-8px!important;transform:translateX(-50%)!important;cursor:ns-resize!important}#cms-resize-overlay [data-dir="se"]{right:-8px!important;bottom:-8px!important;cursor:nwse-resize!important}html.cms-navigation a,html.cms-navigation button{cursor:pointer!important}html.cms-navigation [data-cms-selected]{outline:0!important}`; doc.head.append(style);
    const bridge=doc.createElement('script'); bridge.id='cms-bridge-script'; bridge.textContent=bridgeCode(); doc.body.append(bridge);
    doc.documentElement.classList.add('cms-editing');
    return '<!doctype html>\n'+doc.documentElement.outerHTML;
  }
  function isLocal(v){ return !/^(?:https?:|data:|blob:|mailto:|tel:|javascript:|#)/i.test(v); }
  function resolvePath(pagePath,rel){ const clean=rel.split(/[?#]/)[0]; const base=pagePath.includes('/')?pagePath.slice(0,pagePath.lastIndexOf('/')+1):''; const parts=(base+clean).split('/'); const out=[]; parts.forEach(p=>{ if(!p||p==='.')return; if(p==='..')out.pop(); else out.push(p); }); return out.join('/'); }
  function mime(path){ const e=path.split('.').pop().toLowerCase(); return ({css:'text/css',js:'text/javascript',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',gif:'image/gif',svg:'image/svg+xml',mp4:'video/mp4',m4a:'audio/mp4',woff:'font/woff',woff2:'font/woff2'})[e]||'application/octet-stream'; }
  function assetUrl(path){ const key=fullPath(path); if(state.blobs.has(key)) return state.blobs.get(key); const bytes=state.files.get(key); if(!bytes) return null; let data=bytes;
    if(/\.css$/i.test(path)){ let css=bytesText(bytes); css=css.replace(/url\((['"]?)(?!data:|https?:|#)([^)'"?]+)\1\)/gi,(m,q,u)=>{const url=assetUrl(resolvePath(path,u));return url?`url("${url}")`:m}); data=textBytes(css); }
    const url=URL.createObjectURL(new Blob([data],{type:mime(path)})); state.blobs.set(key,url); return url;
  }
  function bridgeCode(){ return `(function(){
    let selected=null,uid=0,responsiveUid=0,navigationMode=false,activeViewport='desktop',drag=null,resizeState=null,resizeOverlay=null,keepImageRatio=true,textEditing=null,savedRange=null;
    const label=e=>{if(e===document.body)return 'Tło całej strony';const t=(e.textContent||'').trim().replace(/\\s+/g,' ').slice(0,48);return t||e.getAttribute('alt')||e.className||e.tagName};
    const id=e=>{if(!e.dataset.cmsId)e.dataset.cmsId='cms-'+(++uid);return e.dataset.cmsId};
    const logoLike=e=>e.tagName==='IMG'&&/logo|logotyp|brand|wup|erasmus|unia|europej/i.test([e.getAttribute('src'),e.getAttribute('alt'),e.className,e.id].join(' '));
    const textBlockLike=e=>!!e&&/^(H[1-6]|P|BLOCKQUOTE|LI|FIGCAPTION)$/.test(e.tagName);
    const buttonLike=e=>!!e&&(e.tagName==='BUTTON'||(e.tagName==='A'&&(/btn|button|cta|status|calendar-link|download|open-|nav-signups|nav-online/i.test([e.className,e.id].join(' '))||e.getAttribute('role')==='button')));
    const editableTextLike=e=>textBlockLike(e)||buttonLike(e);
    const buttonFrom=e=>{const candidate=e?.closest?.('button,a');return buttonLike(candidate)?candidate:null};
    const movableFrom=e=>e?.tagName==='IMG'?e:(buttonFrom(e)||e?.closest?.('h1,h2,h3,h4,h5,h6,p,blockquote,li,figcaption')||null);
    const resizableLike=e=>!!e&&(e.tagName==='IMG'||buttonLike(e));
    const number=(v,fallback=0)=>{const n=parseFloat(v);return Number.isFinite(n)?n:fallback};
    const responsiveProps=new Set(['translate','width','height','maxWidth','minWidth','marginTop','marginRight','marginBottom','marginLeft','paddingTop','paddingRight','paddingBottom','paddingLeft','fontSize','lineHeight','letterSpacing','textAlign','display','objectFit','objectPosition','backgroundSize','backgroundPosition','backgroundRepeat']);
    const viewportAttr={desktop:'data-cms-desktop-style',tablet:'data-cms-tablet-style',mobile:'data-cms-mobile-style'};
    const viewportMedia={desktop:'(min-width:1025px)',tablet:'(min-width:601px) and (max-width:1024px)',mobile:'(max-width:600px)'};
    document.querySelectorAll('[data-cms-responsive-id]').forEach(e=>{const n=number((e.getAttribute('data-cms-responsive-id')||'').replace(/\\D/g,''));responsiveUid=Math.max(responsiveUid,n)});
    const responsiveId=e=>{if(!e.dataset.cmsResponsiveId)e.dataset.cmsResponsiveId='r'+(++responsiveUid);return e.dataset.cmsResponsiveId};
    const responsiveData=(e,viewport)=>{try{return JSON.parse(e.getAttribute(viewportAttr[viewport])||'{}')}catch{return{}}};
    const cssName=name=>name.replace(/[A-Z]/g,m=>'-'+m.toLowerCase());
    const rebuildResponsiveCss=()=>{let sheet=document.getElementById('cms-responsive-layout-styles');const rules=[];document.querySelectorAll('[data-cms-responsive-id]').forEach(e=>{const rid=e.dataset.cmsResponsiveId;if(!/^r\\d+$/.test(rid))return;Object.keys(viewportAttr).forEach(viewport=>{const data=responsiveData(e,viewport),declarations=Object.entries(data).filter(([name,value])=>responsiveProps.has(name)&&value!==''&&value!=null).map(([name,value])=>cssName(name)+':'+String(value).replace(/[{}]/g,'')+'!important').join(';');if(declarations){const selector='[data-cms-responsive-id="'+rid+'"][data-cms-responsive-id="'+rid+'"][data-cms-responsive-id="'+rid+'"]';rules.push('@media '+viewportMedia[viewport]+'{'+selector+'{'+declarations+'}}')}})});if(!rules.length){sheet?.remove();return}if(!sheet){sheet=document.createElement('style');sheet.id='cms-responsive-layout-styles';document.head.append(sheet)}sheet.textContent='/* Układ responsywny zapisany przez CMS */\\n'+rules.join('\\n')};
    const applyResponsiveStyles=(e,styles,viewport=activeViewport)=>{const data=responsiveData(e,viewport);Object.entries(styles).forEach(([name,value])=>{if(!responsiveProps.has(name))return;if(value===''||value==null)delete data[name];else data[name]=String(value)});responsiveId(e);if(Object.keys(data).length)e.setAttribute(viewportAttr[viewport],JSON.stringify(data));else e.removeAttribute(viewportAttr[viewport]);rebuildResponsiveCss()};
    rebuildResponsiveCss();
    const info=e=>{const c=getComputedStyle(e),r=e.getBoundingClientRect();return{
      id:id(e),tag:e.tagName.toLowerCase(),label:label(e),text:e===document.body?'':(e.children.length?e.innerHTML:e.textContent),plain:e.textContent||'',
      isImage:e.tagName==='IMG',isLogo:logoLike(e),isTextBlock:textBlockLike(e),isButton:buttonLike(e),src:e.tagName==='IMG'?(e.dataset.cmsOriginalSrc||e.getAttribute('src')):'',alt:e.tagName==='IMG'?(e.alt||''):'',href:e.tagName==='A'?(e.dataset.cmsOriginalHref||e.getAttribute('href')||''):'',target:e.getAttribute('target')||'',
      styles:{fontSize:number(c.fontSize),fontWeight:c.fontWeight,fontFamily:c.fontFamily,fontStyle:c.fontStyle,textDecorationLine:c.textDecorationLine,letterSpacing:c.letterSpacing==='normal'?0:number(c.letterSpacing),textTransform:c.textTransform,lineHeight:Math.round((number(c.lineHeight,number(c.fontSize,16)*1.2)/number(c.fontSize,16))*100)/100,color:c.color,backgroundColor:c.backgroundColor,backgroundImage:e.dataset.cmsOriginalBackgroundImage||c.backgroundImage,backgroundSize:c.backgroundSize,backgroundPosition:c.backgroundPosition,backgroundRepeat:c.backgroundRepeat,textAlign:c.textAlign,width:Math.round(r.width),maxWidth:number(c.maxWidth),borderRadius:number(c.borderRadius),borderWidth:number(c.borderWidth),borderColor:c.borderColor,opacity:number(c.opacity,1),filter:c.filter,translate:c.translate,display:c.display,marginTop:number(c.marginTop),marginRight:number(c.marginRight),marginBottom:number(c.marginBottom),marginLeft:number(c.marginLeft),paddingTop:number(c.paddingTop),paddingRight:number(c.paddingRight),paddingBottom:number(c.paddingBottom),paddingLeft:number(c.paddingLeft),objectFit:c.objectFit,objectPosition:c.objectPosition,height:Math.round(r.height),inlineHeight:e.style.height||'',inlineWidth:e.style.width||'',inlineMarginLeft:e.style.marginLeft||'',inlineMarginRight:e.style.marginRight||''}
    }};
    const ensureResizeOverlay=()=>{if(resizeOverlay)return resizeOverlay;resizeOverlay=document.createElement('div');resizeOverlay.id='cms-resize-overlay';['e','s','se'].forEach(dir=>{const handle=document.createElement('button');handle.type='button';handle.className='cms-resize-handle';handle.dataset.dir=dir;handle.setAttribute('aria-label','Zmień rozmiar');handle.addEventListener('pointerdown',e=>{if(!selected||!resizableLike(selected))return;e.preventDefault();e.stopPropagation();const r=selected.getBoundingClientRect();resizeState={el:selected,handle,dir,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,width:r.width,height:r.height,ratio:r.width/Math.max(1,r.height)};selected.setAttribute('data-cms-resizing','');handle.setPointerCapture?.(e.pointerId);parent.postMessage({cms:'dragStart'},'*')});resizeOverlay.append(handle)});document.body.append(resizeOverlay);return resizeOverlay};
    const updateResizeOverlay=()=>{const overlay=ensureResizeOverlay();if(navigationMode||textEditing||!selected||!resizableLike(selected)){overlay.style.display='none';return}const r=selected.getBoundingClientRect();Object.assign(overlay.style,{display:'block',left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'})};
    const selectionFormats=()=>({bold:document.queryCommandState?.('bold')||false,italic:document.queryCommandState?.('italic')||false,underline:document.queryCommandState?.('underline')||false,strikeThrough:document.queryCommandState?.('strikeThrough')||false,color:document.queryCommandValue?.('foreColor')||''});
    const publishSelection=active=>parent.postMessage({cms:'selection',active:!!active,formats:active?selectionFormats():{}},'*');
    const finishTextEditing=()=>{if(!textEditing)return;const edited=textEditing;textEditing=null;savedRange=null;edited.removeAttribute('contenteditable');edited.removeAttribute('data-cms-editing-text');parent.postMessage({cms:'textEditing',active:false},'*');publishSelection(false);parent.postMessage({cms:'changed',data:info(edited)},'*');requestAnimationFrame(updateResizeOverlay)};
    const select=e=>{if(selected&&selected!==e)selected.removeAttribute('data-cms-selected');selected=e;selected.setAttribute('data-cms-selected','');parent.postMessage({cms:'selected',data:info(selected)},'*');requestAnimationFrame(updateResizeOverlay)};
    document.addEventListener('mouseover',e=>{if(!navigationMode&&e.target!==document.documentElement&&e.target!==document.body)e.target.setAttribute('data-cms-hover','')});
    document.addEventListener('mouseout',e=>e.target.removeAttribute&&e.target.removeAttribute('data-cms-hover'));
    document.addEventListener('pointerdown',e=>{
      if(e.target.closest?.('#cms-resize-overlay'))return;
      if(textEditing&&textEditing.contains(e.target))return;
      if(textEditing)finishTextEditing();
      const target=movableFrom(e.target);if(navigationMode||e.button>0||!target)return;
      e.preventDefault();e.stopPropagation();select(target);
      const c=getComputedStyle(target),values=String(c.translate||'none').match(/-?\\d+(?:\\.\\d+)?/g)||[];
      drag={el:target,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,baseX:number(values[0]),baseY:number(values[1]),moved:false};
      target.setPointerCapture?.(e.pointerId);parent.postMessage({cms:'dragStart'},'*');
    },true);
    document.addEventListener('pointermove',e=>{
      if(resizeState&&resizeState.pointerId===e.pointerId){e.preventDefault();const dx=e.clientX-resizeState.startX,dy=e.clientY-resizeState.startY;let width=resizeState.width,height=resizeState.height;if(resizeState.dir.includes('e'))width=Math.max(20,resizeState.width+dx);if(resizeState.dir.includes('s'))height=Math.max(20,resizeState.height+dy);if(resizeState.dir==='se'&&keepImageRatio&&resizeState.el.tagName==='IMG'){if(Math.abs(dx)>=Math.abs(dy))height=width/resizeState.ratio;else width=height*resizeState.ratio}applyResponsiveStyles(resizeState.el,{width:Math.round(width)+'px',height:Math.round(height)+'px',maxWidth:'none'});updateResizeOverlay();parent.postMessage({cms:'dragging',data:info(resizeState.el)},'*');return}
      if(!drag||drag.pointerId!==e.pointerId)return;
      const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;
      if(!drag.moved&&Math.hypot(dx,dy)<2)return;
      drag.moved=true;drag.el.setAttribute('data-cms-dragging','');
      const x=Math.max(-500,Math.min(500,Math.round(drag.baseX+dx))),y=Math.max(-500,Math.min(500,Math.round(drag.baseY+dy)));
      applyResponsiveStyles(drag.el,{translate:x+'px '+y+'px'});updateResizeOverlay();parent.postMessage({cms:'dragging',data:info(drag.el)},'*');
    },true);
    const finishPointer=e=>{
      if(resizeState&&resizeState.pointerId===e.pointerId){const current=resizeState;resizeState=null;current.el.removeAttribute('data-cms-resizing');current.handle.releasePointerCapture?.(e.pointerId);e.preventDefault();e.stopPropagation();updateResizeOverlay();parent.postMessage({cms:'changed',data:info(current.el)},'*');return}
      if(!drag||drag.pointerId!==e.pointerId)return;const current=drag;drag=null;current.el.removeAttribute('data-cms-dragging');current.el.releasePointerCapture?.(e.pointerId);if(current.moved){e.preventDefault();e.stopPropagation();updateResizeOverlay();parent.postMessage({cms:'changed',data:info(current.el)},'*')}
    };
    document.addEventListener('pointerup',finishPointer,true);document.addEventListener('pointercancel',finishPointer,true);
    document.addEventListener('click',e=>{if(navigationMode){const a=e.target.closest&&e.target.closest('a[href]');if(a){e.preventDefault();e.stopPropagation();const href=a.dataset.cmsOriginalHref||a.getAttribute('href')||'';if(href.charAt(0)==='#'){const target=document.getElementById(href.slice(1));if(target)target.scrollIntoView({behavior:'smooth'})}else parent.postMessage({cms:'navigate',href:href},'*')}return}if(e.target.closest?.('#cms-resize-overlay')){e.preventDefault();e.stopPropagation();return}if(textEditing&&textEditing.contains(e.target))return;e.preventDefault();e.stopPropagation();select(movableFrom(e.target)||e.target)},true);
    document.addEventListener('dblclick',e=>{if(navigationMode)return;const target=movableFrom(e.target);if(!editableTextLike(target))return;e.preventDefault();e.stopPropagation();if(textEditing&&textEditing!==target)finishTextEditing();select(target);textEditing=target;savedRange=null;target.setAttribute('contenteditable','true');target.setAttribute('data-cms-editing-text','');target.focus();parent.postMessage({cms:'editTextStart'},'*');parent.postMessage({cms:'textEditing',active:true},'*');publishSelection(false)},true);
    document.addEventListener('selectionchange',()=>{if(!textEditing)return;const selection=document.getSelection();if(!selection||!selection.rangeCount||selection.isCollapsed){publishSelection(false);return}const range=selection.getRangeAt(0);if(!textEditing.contains(range.commonAncestorContainer)){publishSelection(false);return}savedRange=range.cloneRange();publishSelection(true)});
    document.addEventListener('input',e=>{if(textEditing&&textEditing.contains(e.target))parent.postMessage({cms:'textInput',data:info(textEditing)},'*')},true);
    document.addEventListener('scroll',updateResizeOverlay,true);addEventListener('resize',updateResizeOverlay);
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&textEditing){e.preventDefault();finishTextEditing();return}const form=/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)||e.target.isContentEditable;if(!form&&(e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='z'){e.preventDefault();parent.postMessage({cms:e.shiftKey?'redoShortcut':'undoShortcut'},'*')}});
    addEventListener('message',e=>{const m=e.data;if(!m||!m.cms)return;
      if(m.cms==='select'){const el=document.querySelector('[data-cms-id="'+m.id+'"]');if(el){if(textEditing&&textEditing!==el)finishTextEditing();select(el)}return}
      if(m.cms==='mode'){navigationMode=!!m.navigation;if(navigationMode)finishTextEditing();document.documentElement.classList.toggle('cms-navigation',navigationMode);document.querySelectorAll('[data-cms-hover]').forEach(el=>el.removeAttribute('data-cms-hover'));updateResizeOverlay();return}
      if(m.cms==='viewport'){activeViewport=['desktop','tablet','mobile'].includes(m.viewport)?m.viewport:'desktop';rebuildResponsiveCss();requestAnimationFrame(()=>{updateResizeOverlay();if(selected)parent.postMessage({cms:'selected',data:info(selected)},'*')});return}
      if(m.cms==='imageResizeOptions'){keepImageRatio=m.keepRatio!==false;return}
      if(!selected)return;
      if(m.cms==='formatSelection'&&textEditing&&savedRange&&['bold','italic','underline','strikeThrough','foreColor'].includes(m.command)){const selection=document.getSelection();selection.removeAllRanges();selection.addRange(savedRange);document.execCommand(m.command,false,m.value??null);if(selection.rangeCount)savedRange=selection.getRangeAt(0).cloneRange();parent.postMessage({cms:'changed',data:info(textEditing)},'*');publishSelection(true);return}
      if(m.cms==='style'){const responsive={},global={};Object.entries(m.styles||{}).forEach(([name,value])=>(responsiveProps.has(name)?responsive:global)[name]=value);if(Object.keys(global).length)Object.assign(selected.style,global);if(Object.keys(responsive).length)applyResponsiveStyles(selected,responsive,m.viewport||activeViewport);updateResizeOverlay();parent.postMessage({cms:'changed',data:info(selected)},'*')}
      if(m.cms==='content'){selected.innerHTML=m.value;parent.postMessage({cms:'changed',data:info(selected)},'*')}
      if(m.cms==='attr'){selected.setAttribute(m.name,m.value);parent.postMessage({cms:'changed',data:info(selected)},'*')}
      if(m.cms==='buttonText'){const candidates=[...selected.querySelectorAll('span,strong,b')].filter(el=>el.textContent.trim()&&!/icon|arrow/i.test(el.className));const target=candidates[0]||selected;target.textContent=m.value;parent.postMessage({cms:'changed',data:info(selected)},'*')}
      if(m.cms==='buttonHref'&&selected.tagName==='A'){selected.dataset.cmsOriginalHref=m.value;selected.setAttribute('href',m.value);parent.postMessage({cms:'changed',data:info(selected)},'*')}
      if(m.cms==='image'){selected.dataset.cmsOriginalSrc=m.path;selected.src=m.url;updateResizeOverlay();parent.postMessage({cms:'changed',data:info(selected)},'*')}
      if(m.cms==='background'){selected.dataset.cmsOriginalBackgroundImage='url("'+m.path+'")';selected.style.backgroundImage='url("'+m.url+'")';selected.style.backgroundRepeat='no-repeat';parent.postMessage({cms:'changed',data:info(selected)},'*')}
      if(m.cms==='clearBackground'){delete selected.dataset.cmsOriginalBackgroundImage;selected.style.backgroundImage='none';selected.style.backgroundColor='transparent';parent.postMessage({cms:'changed',data:info(selected)},'*')}
      if(m.cms==='delete'&&selected!==document.body){const next=selected.parentElement;selected.remove();selected=null;rebuildResponsiveCss();updateResizeOverlay();parent.postMessage({cms:'structure'},'*');if(next)parent.postMessage({cms:'selected',data:info(next)},'*')}
      if(m.cms==='duplicate'&&selected!==document.body){const clone=selected.cloneNode(true);clone.removeAttribute('data-cms-selected');clone.removeAttribute('data-cms-id');clone.removeAttribute('data-cms-responsive-id');responsiveId(clone);selected.after(clone);rebuildResponsiveCss();parent.postMessage({cms:'structure'},'*')}
      if(m.cms==='move'&&selected!==document.body){const p=selected.parentElement;if(m.dir==='up'&&selected.previousElementSibling)p.insertBefore(selected,selected.previousElementSibling);if(m.dir==='down'&&selected.nextElementSibling)p.insertBefore(selected.nextElementSibling,selected);parent.postMessage({cms:'structure'},'*')}
      if(m.cms==='reset'){selected.removeAttribute('style');delete selected.dataset.cmsOriginalBackgroundImage;Object.values(viewportAttr).forEach(attr=>selected.removeAttribute(attr));selected.removeAttribute('data-cms-responsive-id');rebuildResponsiveCss();updateResizeOverlay();parent.postMessage({cms:'changed',data:info(selected)},'*')}
    });
    window.__cmsSerialize=()=>{const d=document.documentElement.cloneNode(true);d.classList.remove('cms-editing','cms-navigation');d.querySelector('#cms-bridge-script')?.remove();d.querySelector('#cms-bridge-style')?.remove();d.querySelector('#cms-resize-overlay')?.remove();d.querySelectorAll('[data-cms-editing-text]').forEach(e=>{e.removeAttribute('data-cms-editing-text');e.removeAttribute('contenteditable')});d.querySelectorAll('[data-cms-id],[data-cms-hover],[data-cms-selected],[data-cms-dragging],[data-cms-resizing]').forEach(e=>{e.removeAttribute('data-cms-id');e.removeAttribute('data-cms-hover');e.removeAttribute('data-cms-selected');e.removeAttribute('data-cms-dragging');e.removeAttribute('data-cms-resizing')});d.querySelectorAll('*').forEach(e=>{['src','href','poster'].forEach(a=>{const o=e.getAttribute('data-cms-original-'+a);if(o!==null){e.setAttribute(a,o);e.removeAttribute('data-cms-original-'+a)}});const bg=e.getAttribute('data-cms-original-background-image');if(bg!==null){e.style.backgroundImage=bg;e.removeAttribute('data-cms-original-background-image')}});return '<!doctype html>\\n'+d.outerHTML};
    parent.postMessage({cms:'ready'},'*')
  })();`; }

  function currentHtml(){ if(!state.pagePath||!els.preview.contentWindow)return ''; try{return els.preview.contentWindow.__cmsSerialize?.()||getText(state.pagePath)}catch{return getText(state.pagePath)} }
  function saveCurrentPage(){ if(!state.pagePath)return; const html=currentHtml(); if(html&&html!==getText(state.pagePath)){setFile(state.pagePath,html);state.page=html} }
  function pushHistory(){ if(!state.pagePath)return; const html=currentHtml(); if(!html)return; const last=state.history[state.history.length-1]; if(!last||last.path!==state.pagePath||last.html!==html)state.history.push({path:state.pagePath,html}); if(state.history.length>80)state.history.shift(); state.future=[]; updateHistory(); }
  function updateHistory(){ els.undo.disabled=!state.history.length; els.redo.disabled=!state.future.length; }
  async function undo(){ const item=state.history.pop(); if(!item)return; const path=state.pagePath,html=currentHtml(); if(path&&html){setFile(path,html);state.future.push({path,html})} setFile(item.path,item.html); await loadPage(item.path,true); updateHistory(); toast('Cofnięto ostatnią zmianę'); }
  async function redo(){ const item=state.future.pop(); if(!item)return; const path=state.pagePath,html=currentHtml(); if(path&&html){setFile(path,html);state.history.push({path,html})} setFile(item.path,item.html); await loadPage(item.path,true); updateHistory(); toast('Przywrócono zmianę'); }

  function buildLayers(){
    const doc=els.preview.contentDocument; if(!doc)return; els.layersList.innerHTML=''; let count=0;
    function add(el,depth){ if(count++>160||depth>4||el.id==='cms-resize-overlay')return; const id=el.dataset.cmsId||(el.dataset.cmsId='layer-'+count); const b=document.createElement('button'); b.className='layer-item'; b.style.setProperty('--depth',depth); b.dataset.tag=el.tagName.toLowerCase(); b.dataset.id=id; b.textContent=layerLabel(el); b.onclick=()=>els.preview.contentWindow.postMessage({cms:'select',id},'*'); els.layersList.append(b); if(depth<3)[...el.children].filter(x=>!['SCRIPT','STYLE'].includes(x.tagName)&&x.id!=='cms-resize-overlay').slice(0,25).forEach(c=>add(c,depth+1)); }
    add(doc.body,0);
  }
  function layerLabel(el){ if(el.tagName==='BODY')return 'Tło całej strony'; const txt=(el.textContent||'').trim().replace(/\s+/g,' ').slice(0,40); return txt||el.getAttribute('alt')||el.id||[...el.classList].slice(0,2).join('.')||el.tagName.toLowerCase(); }
  function showInspector(data){
    const changedElement=state.selected?.id!==data?.id;state.selected=data;if(changedElement){state.textEditingActive=false;state.textSelectionActive=false}els.inspector.hidden=!data; els.inspectorEmpty.hidden=!!data; $$('.layer-item').forEach(x=>x.classList.toggle('is-active',data&&x.dataset.id===data.id));
    if(!data){updateSelectionHint();return}
    els.selectedLabel.textContent=data.label; els.selectedTag.textContent=data.tag.toUpperCase();
    const s=data.styles||{}, isBody=data.tag==='body', isImg=data.tag==='img', isTextBlock=!!data.isTextBlock, isButton=!!data.isButton;
    setVal('contentInput',data.text); $('#contentInput').disabled=isBody;
    ['duplicateBtn','deleteBtn','moveUpBtn','moveDownBtn'].forEach(id=>$('#'+id).disabled=isBody);
    setVal('fontSize',s.fontSize); setVal('fontWeight',numericWeight(s.fontWeight)); setVal('fontFamily',s.fontFamily); if(!$('#fontFamily').value)setVal('fontFamily','');
    setVal('lineHeight',s.lineHeight); setVal('letterSpacing',s.letterSpacing); setVal('textTransform',s.textTransform||'none');
    setVal('elementWidth',s.width); setVal('maxWidth',s.maxWidth); setVal('borderRadius',s.borderRadius);
    ['marginTop','marginRight','marginBottom','marginLeft','paddingTop','paddingRight','paddingBottom','paddingLeft'].forEach(k=>setVal(k,s[k]));
    const tc=rgbHex(s.color), bg=rgbHex(s.backgroundColor); setVal('textColor',tc); setVal('textColorHex',tc); setVal('backgroundColor',bg); setVal('backgroundColorHex',bg);
    setVal('backgroundSize',s.backgroundSize||'cover'); setVal('backgroundPosition',s.backgroundPosition||'center center');
    const opacity=Math.round((Number(s.opacity)||0)*100); setVal('opacityRange',opacity); $('#opacityValue').textContent=opacity+'%';
    $$('.segmented button').forEach(b=>b.classList.toggle('is-active',b.dataset.align===s.textAlign));
    $('#boldBtn').classList.toggle('is-active',parseInt(s.fontWeight)>=600);
    $('#italicBtn').classList.toggle('is-active',s.fontStyle==='italic'||s.fontStyle==='oblique');
    $('#underlineBtn').classList.toggle('is-active',(s.textDecorationLine||'').includes('underline'));
    $('#strikeBtn').classList.toggle('is-active',(s.textDecorationLine||'').includes('line-through'));
    updateSelectionHint();
    $('#buttonControls').hidden=!isButton;
    if(isButton){setVal('buttonText',(data.plain||'').trim());setVal('buttonHref',data.href||'');setVal('buttonTarget',data.target||'');$('#buttonHref').disabled=data.tag!=='a';$('#buttonTarget').disabled=data.tag!=='a';const buttonBg=rgbHex(s.backgroundColor),buttonText=rgbHex(s.color),buttonBorder=rgbHex(s.borderColor);setVal('buttonBackgroundColor',buttonBg);setVal('buttonBackgroundHex',buttonBg);setVal('buttonTextColor',buttonText);setVal('buttonTextHex',buttonText);setVal('buttonBorderColor',buttonBorder);setVal('buttonBorderHex',buttonBorder);setVal('buttonBorderWidth',s.borderWidth);setVal('buttonRadius',s.borderRadius);setVal('buttonPaddingY',Math.round(((s.paddingTop||0)+(s.paddingBottom||0))/2));setVal('buttonPaddingX',Math.round(((s.paddingLeft||0)+(s.paddingRight||0))/2))}
    ['textOffsetX','textOffsetY','resetTextPositionBtn'].forEach(id=>$('#'+id).disabled=!isTextBlock);
    const [textOffsetX,textOffsetY]=translatePixels(s.translate);setVal('textOffsetX',textOffsetX);setVal('textOffsetY',textOffsetY);$('#textOffsetXValue').textContent=textOffsetX+' px';$('#textOffsetYValue').textContent=textOffsetY+' px';
    const imageControlIds=['replaceImageBtn','objectFit','imageHeight','imageMaxWidth','imageWidth','imageWidthRange','keepRatio','imageAlign','imageOffsetX','imageOffsetY','resetImagePositionBtn','cropPositionX','cropPositionY','brightnessRange','altText'];
    imageControlIds.forEach(id=>$('#'+id).disabled=!isImg); $$('#focalGrid button,.logo-presets button').forEach(b=>b.disabled=!isImg);
    if(isImg){
      const url=assetUrl(resolvePath(state.pagePath,data.src)); els.imagePreview.innerHTML=url?`<img src="${url}" alt="">`:'<span>Brak podglądu</span>';
      const width=Math.max(20,Math.round(s.width||20)); $('#imageWidthRange').max=Math.max(900,width); setVal('imageWidthRange',width); setVal('imageWidth',width); setVal('imageMaxWidth',s.maxWidth); setVal('objectFit',s.objectFit||'cover'); setVal('imageHeight',s.height); setVal('altText',data.alt||'');
      $('#keepRatio').checked=!s.inlineHeight||s.inlineHeight==='auto';
      els.preview.contentWindow?.postMessage({cms:'imageResizeOptions',keepRatio:$('#keepRatio').checked},'*');
      const align=s.inlineMarginLeft==='auto'&&s.inlineMarginRight==='auto'?'center':s.inlineMarginLeft==='auto'?'right':s.inlineMarginRight==='auto'?'left':'none'; setVal('imageAlign',align);
      const [offsetX,offsetY]=translatePixels(s.translate); setVal('imageOffsetX',offsetX); setVal('imageOffsetY',offsetY); $('#imageOffsetXValue').textContent=offsetX+' px'; $('#imageOffsetYValue').textContent=offsetY+' px';
      const [cropX,cropY]=positionPercent(s.objectPosition); setVal('cropPositionX',cropX); setVal('cropPositionY',cropY); $('#cropPositionXValue').textContent=cropX+'%'; $('#cropPositionYValue').textContent=cropY+'%';
      $$('#focalGrid button').forEach(b=>b.classList.toggle('is-active',b.dataset.pos===s.objectPosition));
      $$('.logo-presets button').forEach(b=>b.classList.toggle('is-active',(b.dataset.filter||'none')===(s.filter||'none')));
      const brightness=/^brightness\((\d+(?:\.\d+)?)%\)$/.exec(s.filter||''); const brightnessValue=brightness?Math.round(+brightness[1]):100; setVal('brightnessRange',brightnessValue); $('#brightnessValue').textContent=brightnessValue+'%';
      $('#logoControls').classList.toggle('is-logo',!!data.isLogo);
    }else{
      els.imagePreview.innerHTML='<span>Wybierz zdjęcie lub logo w podglądzie strony</span>'; $('#logoControls').classList.remove('is-logo');
    }
  }
  function updateSelectionHint(formats){const hint=$('#selectionHint');if(!hint)return;hint.classList.toggle('is-editing',state.textEditingActive&&!state.textSelectionActive);hint.classList.toggle('is-selection',state.textSelectionActive);hint.textContent=state.textSelectionActive?'Formatujesz tylko zaznaczony fragment. Możesz użyć B, I, U, S albo zmienić jego kolor.':state.textEditingActive?'Tryb edycji tekstu: zaznacz słowo, litery lub dowolny fragment w podglądzie.':'Aby zmienić pojedyncze słowo lub literę, kliknij tekst dwukrotnie w podglądzie, zaznacz fragment i wybierz formatowanie lub kolor.';if(state.textSelectionActive&&formats){$('#boldBtn').classList.toggle('is-active',!!formats.bold);$('#italicBtn').classList.toggle('is-active',!!formats.italic);$('#underlineBtn').classList.toggle('is-active',!!formats.underline);$('#strikeBtn').classList.toggle('is-active',!!formats.strikeThrough);if(formats.color){const color=rgbHex(formats.color);setVal('textColor',color);setVal('textColorHex',color)}}}
  function setVal(id,v){ const e=$('#'+id); if(e)e.value=v??''; }
  function numericWeight(v){ const n=parseInt(v); return [300,400,500,600,700,800].includes(n)?String(n):'400'; }
  function rgbHex(v){ if(!v||v==='transparent'||v.includes('rgba(0, 0, 0, 0)'))return '#ffffff'; const m=v.match(/\d+/g); if(!m)return /^#/.test(v)?v:'#ffffff'; return '#'+m.slice(0,3).map(n=>(+n).toString(16).padStart(2,'0')).join(''); }
  function translatePixels(v){ if(!v||v==='none')return[0,0];const n=String(v).match(/-?\d+(?:\.\d+)?/g)||[];return[Math.round(+n[0]||0),Math.round(+n[1]||0)] }
  function positionPercent(v){ const words=String(v||'center center').replace(/left/g,'0%').replace(/right/g,'100%').replace(/top/g,'0%').replace(/bottom/g,'100%').replace(/center/g,'50%');const n=words.match(/-?\d+(?:\.\d+)?(?=%)/g)||[],x=n[0]===undefined?50:+n[0],y=n[1]===undefined?50:+n[1];return[Math.max(0,Math.min(100,Math.round(x))),Math.max(0,Math.min(100,Math.round(y)))] }
  function post(msg){ els.preview.contentWindow?.postMessage(msg,'*'); setDirty(); }
  function postPreviewMode(){ els.preview.contentWindow?.postMessage({cms:'mode',navigation:state.previewMode},'*'); }
  function postResponsiveViewport(){ els.preview.contentWindow?.postMessage({cms:'viewport',viewport:state.viewport},'*'); }
  function updateViewportScope(){const names={desktop:'KOMPUTER',tablet:'TABLET',mobile:'TELEFON'};if(els.viewportScope)els.viewportScope.textContent=`Układ: ${names[state.viewport]} · położenie i rozmiar tylko dla tego widoku`;}
  function togglePreviewMode(){ state.previewMode=!state.previewMode; els.previewModeBtn.classList.toggle('is-active',state.previewMode); els.previewModeBtn.innerHTML=state.previewMode?'✎ <span>Wróć do edycji</span>':'▶ <span>Podgląd strony</span>'; document.body.classList.toggle('preview-mode',state.previewMode); postPreviewMode(); if(state.previewMode)showInspector(null); toast(state.previewMode?'Tryb podglądu: menu i linki są aktywne':'Tryb edycji: kliknij element na stronie'); }
  async function navigateFromPreview(href){ if(!href)return; if(/^(?:https?:|mailto:|tel:)/i.test(href)){toast('Link zewnętrzny działa po opublikowaniu strony');return} const clean=href.split('#')[0].split('?')[0]; let target=clean==='/'?'index.html':resolvePath(state.pagePath,clean); if(!/\.html?$/i.test(target)&&!target.includes('.'))target=target.replace(/\/$/,'')+'/index.html'; if(state.pages.includes(target)){await loadPage(target);toast('Podgląd: '+pageTitle(target,getText(target)))}else toast('Ta pozycja nie prowadzi do podstrony w paczce'); }
  function style(styles){ pushHistory(); post({cms:'style',styles,viewport:state.viewport}); }
  function formatOrStyle(command,styles){if(state.textSelectionActive){pushHistory();post({cms:'formatSelection',command})}else style(styles)}

  function bindInspector(){
    $('#contentInput').addEventListener('change',e=>{pushHistory();post({cms:'content',value:e.target.value})});
    const styleMap={fontFamily:'fontFamily',fontSize:'fontSize',fontWeight:'fontWeight',lineHeight:'lineHeight',letterSpacing:'letterSpacing',textTransform:'textTransform',backgroundSize:'backgroundSize',backgroundPosition:'backgroundPosition',elementWidth:'width',maxWidth:'maxWidth',borderRadius:'borderRadius',marginTop:'marginTop',marginRight:'marginRight',marginBottom:'marginBottom',marginLeft:'marginLeft',paddingTop:'paddingTop',paddingRight:'paddingRight',paddingBottom:'paddingBottom',paddingLeft:'paddingLeft',imageHeight:'height',imageMaxWidth:'maxWidth',objectFit:'objectFit'};
    Object.entries(styleMap).forEach(([id,prop])=>$('#'+id)?.addEventListener('change',e=>{let v=e.target.value;if(['fontSize','letterSpacing','width','maxWidth','borderRadius','marginTop','marginRight','marginBottom','marginLeft','paddingTop','paddingRight','paddingBottom','paddingLeft','height'].includes(prop))v=(v||0)+'px';style({[prop]:v})}));
    const applyTextColor=value=>{setVal('textColorHex',value);if(state.textSelectionActive){pushHistory();post({cms:'formatSelection',command:'foreColor',value})}else style({color:value})};$('#textColor').oninput=e=>applyTextColor(e.target.value);$('#textColorHex').onchange=e=>applyTextColor(e.target.value);
    [['backgroundColor','backgroundColorHex','backgroundColor']].forEach(([picker,hex,prop])=>{ $('#'+picker).oninput=e=>{setVal(hex,e.target.value);style({[prop]:e.target.value})}; $('#'+hex).onchange=e=>style({[prop]:e.target.value}); });
    $$('.segmented button').forEach(b=>b.onclick=()=>style({textAlign:b.dataset.align})); $$('#focalGrid button').forEach(b=>b.onclick=()=>style({objectPosition:b.dataset.pos}));
    $('#boldBtn').onclick=()=>formatOrStyle('bold',{fontWeight:parseInt(state.selected?.styles?.fontWeight)>=600?'400':'700'});
    $('#italicBtn').onclick=()=>formatOrStyle('italic',{fontStyle:['italic','oblique'].includes(state.selected?.styles?.fontStyle)?'normal':'italic'});
    $('#underlineBtn').onclick=()=>state.textSelectionActive?formatOrStyle('underline',{}):toggleDecoration('underline'); $('#strikeBtn').onclick=()=>state.textSelectionActive?formatOrStyle('strikeThrough',{}):toggleDecoration('line-through');
    $('#opacityRange').oninput=e=>$('#opacityValue').textContent=e.target.value+'%'; $('#opacityRange').onchange=e=>style({opacity:String(+e.target.value/100)});
    $('#backgroundImageBtn').onclick=()=>$('#backgroundInput').click(); $('#backgroundInput').onchange=e=>replaceSelectedBackground(e.target.files[0]);
    $('#clearBackgroundBtn').onclick=()=>{pushHistory();post({cms:'clearBackground'})};
    $('#buttonText').onchange=e=>{pushHistory();post({cms:'buttonText',value:e.target.value})};
    $('#buttonHref').onchange=e=>{pushHistory();post({cms:'buttonHref',value:e.target.value})};
    $('#buttonTarget').onchange=e=>{pushHistory();post({cms:'attr',name:'target',value:e.target.value})};
    [['buttonBackgroundColor','buttonBackgroundHex','backgroundColor'],['buttonTextColor','buttonTextHex','color'],['buttonBorderColor','buttonBorderHex','borderColor']].forEach(([picker,hex,prop])=>{$('#'+picker).oninput=e=>{setVal(hex,e.target.value);style({[prop]:e.target.value})};$('#'+hex).onchange=e=>style({[prop]:e.target.value})});
    $('#buttonBorderWidth').onchange=e=>style({borderWidth:(+e.target.value||0)+'px',borderStyle:+e.target.value?'solid':'none'});$('#buttonRadius').onchange=e=>style({borderRadius:(+e.target.value||0)+'px'});
    const applyButtonPadding=()=>style({paddingTop:(+$('#buttonPaddingY').value||0)+'px',paddingBottom:(+$('#buttonPaddingY').value||0)+'px',paddingLeft:(+$('#buttonPaddingX').value||0)+'px',paddingRight:(+$('#buttonPaddingX').value||0)+'px'});$('#buttonPaddingY').onchange=applyButtonPadding;$('#buttonPaddingX').onchange=applyButtonPadding;
    const applyTextOffset=()=>style({translate:`${+$('#textOffsetX').value||0}px ${+$('#textOffsetY').value||0}px`});
    ['X','Y'].forEach(axis=>{$('#textOffset'+axis).oninput=e=>$('#textOffset'+axis+'Value').textContent=e.target.value+' px';$('#textOffset'+axis).onchange=applyTextOffset});
    $('#resetTextPositionBtn').onclick=()=>{setVal('textOffsetX',0);setVal('textOffsetY',0);$('#textOffsetXValue').textContent='0 px';$('#textOffsetYValue').textContent='0 px';style({translate:'none'})};
    const applyImageWidth=value=>{const v=Math.max(20,+value||20);setVal('imageWidthRange',v);setVal('imageWidth',v);const styles={width:v+'px'};if($('#keepRatio').checked)styles.height='auto';style(styles)};
    $('#imageWidthRange').oninput=e=>setVal('imageWidth',e.target.value); $('#imageWidthRange').onchange=e=>applyImageWidth(e.target.value); $('#imageWidth').onchange=e=>applyImageWidth(e.target.value);
    $('#keepRatio').onchange=e=>{els.preview.contentWindow?.postMessage({cms:'imageResizeOptions',keepRatio:e.target.checked},'*');style({height:e.target.checked?'auto':Math.max(40,state.selected?.styles?.height||40)+'px'})};
    $('#imageAlign').onchange=e=>{const value=e.target.value,map={none:{display:'',marginLeft:'',marginRight:''},left:{display:'block',marginLeft:'0px',marginRight:'auto'},center:{display:'block',marginLeft:'auto',marginRight:'auto'},right:{display:'block',marginLeft:'auto',marginRight:'0px'}};style(map[value]||map.none)};
    const applyImageOffset=()=>style({translate:`${+$('#imageOffsetX').value||0}px ${+$('#imageOffsetY').value||0}px`});
    ['X','Y'].forEach(axis=>{$('#imageOffset'+axis).oninput=e=>$('#imageOffset'+axis+'Value').textContent=e.target.value+' px';$('#imageOffset'+axis).onchange=applyImageOffset});
    $('#resetImagePositionBtn').onclick=()=>{setVal('imageOffsetX',0);setVal('imageOffsetY',0);$('#imageOffsetXValue').textContent='0 px';$('#imageOffsetYValue').textContent='0 px';style({translate:'none'})};
    const applyCrop=()=>style({objectPosition:`${$('#cropPositionX').value}% ${$('#cropPositionY').value}%`});
    ['X','Y'].forEach(axis=>{$('#cropPosition'+axis).oninput=e=>$('#cropPosition'+axis+'Value').textContent=e.target.value+'%';$('#cropPosition'+axis).onchange=applyCrop});
    $$('.logo-presets button').forEach(b=>b.onclick=()=>style({filter:b.dataset.filter}));
    $('#brightnessRange').oninput=e=>$('#brightnessValue').textContent=e.target.value+'%'; $('#brightnessRange').onchange=e=>style({filter:`brightness(${e.target.value}%)`});
    $('#altText').onchange=e=>{pushHistory();post({cms:'attr',name:'alt',value:e.target.value})}; $('#duplicateBtn').onclick=()=>{pushHistory();post({cms:'duplicate'})}; $('#deleteBtn').onclick=()=>{if(confirm('Usunąć zaznaczony element?')){pushHistory();post({cms:'delete'})}}; $('#moveUpBtn').onclick=()=>{pushHistory();post({cms:'move',dir:'up'})}; $('#moveDownBtn').onclick=()=>{pushHistory();post({cms:'move',dir:'down'})}; $('#resetStylesBtn').onclick=()=>{pushHistory();post({cms:'reset'})};
    $('#replaceImageBtn').onclick=()=>$('#imageInput').click(); $('#imageInput').onchange=e=>replaceSelectedImage(e.target.files[0]);
  }

  function toggleDecoration(token){ const current=(state.selected?.styles?.textDecorationLine||'').split(/\s+/).filter(x=>x&&x!=='none'); const next=current.includes(token)?current.filter(x=>x!==token):[...current,token]; style({textDecorationLine:next.join(' ')||'none'}); }

  async function replaceSelectedBackground(file){ if(!file||!state.selected)return; const path=uniqueMediaPath(file.name); setFile(path,new Uint8Array(await file.arrayBuffer())); state.blobs.delete(fullPath(path)); pushHistory(); post({cms:'background',path:relativeFromPage(state.pagePath,path),url:assetUrl(path)}); toast('Tło zostało ustawione'); }

  async function replaceSelectedImage(file){ if(!file||state.selected?.tag!=='img')return; const path=uniqueMediaPath(file.name); const bytes=new Uint8Array(await file.arrayBuffer()); setFile(path,bytes); state.blobs.delete(fullPath(path)); const url=assetUrl(path); pushHistory(); post({cms:'image',path:relativeFromPage(state.pagePath,path),url}); showInspector({...state.selected,src:relativeFromPage(state.pagePath,path)}); toast('Zdjęcie zostało podmienione'); }
  function uniqueMediaPath(name){ const safe=name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._-]+/g,'-').toLowerCase(); let p='grafiki/uploads/'+safe, i=2; while(state.files.has(fullPath(p))){const dot=safe.lastIndexOf('.');p='grafiki/uploads/'+safe.slice(0,dot)+'-'+i+++safe.slice(dot)}return p; }
  function relativeFromPage(page,path){ const depth=(page.match(/\//g)||[]).length; return '../'.repeat(depth)+path; }

  function loadTrainings(){
    const published=getText('assets/site-data.js');
    const match=published.match(/window\.portalSiteData\s*=\s*(\{[\s\S]*\});?\s*$/);
    try{
      const data=match?JSON.parse(match[1]):JSON.parse(getText('data/site-data.json'));
      state.trainings=Array.isArray(data.trainings)?data.trainings:[];
    }catch{ state.trainings=[]; }
    renderTrainings();
  }
  function renderTrainings(){ els.trainingList.innerHTML=''; state.trainings.forEach((t,i)=>{ const b=document.createElement('button');b.className='training-row';b.innerHTML=`<strong>${escapeHtml(t.title||'Bez nazwy')}</strong><span>${t.date||'Termin wkrótce'} · ${t.time||''}</span>`;b.onclick=()=>editTraining(i);els.trainingList.append(b)}); }
  function editTraining(i){ const t=state.trainings[i]||{}; setVal('trainingIndex',i); setVal('trTitle',t.title);setVal('trShortTitle',t.shortTitle);setVal('trSource',t.source);setVal('trDate',t.date);setVal('trTime',t.time);setVal('trPlace',t.place);setVal('trGroup',t.group||'new');setVal('trColor',t.color||'#16877f');setVal('trAudience',t.audience);setVal('trDescription',(t.description||[]).join('\n\n'));setVal('trLink',t.link);$('#trOpen').checked=!!t.open;$$('.training-row').forEach((r,n)=>r.classList.toggle('is-active',n===i)); }
  function saveTraining(e){e.preventDefault();const i=+$('#trainingIndex').value;const old=state.trainings[i]||{};const t={...old,id:old.id||slug($('#trTitle').value),title:$('#trTitle').value,shortTitle:$('#trShortTitle').value,source:$('#trSource').value,date:$('#trDate').value,time:$('#trTime').value,place:$('#trPlace').value,group:$('#trGroup').value,color:$('#trColor').value,audience:$('#trAudience').value,description:$('#trDescription').value.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean),link:$('#trLink').value,open:$('#trOpen').checked,button:$('#trOpen').checked?'Zapisz się':'Sprawdź terminarz'};state.trainings[i]=t;persistTrainings();renderTrainings();editTraining(i);toast('Termin został zapisany');}
  function persistTrainings(){ let data={contact:{email:'pr@wup-katowice.pl',phone:'32 757 33 84'},trainings:state.trainings};try{const raw=getText('data/site-data.json');data={...JSON.parse(raw),trainings:state.trainings}}catch{}setFile('data/site-data.json',JSON.stringify(data,null,2)+'\n');setFile('assets/site-data.js','window.portalSiteData = '+JSON.stringify(data,null,2)+';\n'); }
  function newTraining(){ const i=state.trainings.length; state.trainings.push({id:'nowe-szkolenie',group:'new',source:'Projekt Edukacja bez granic',title:'Nowe szkolenie',shortTitle:'Nowe szkolenie',date:'',time:'',place:'Wojewódzki Urząd Pracy w Katowicach, ul. Sokolska 29',audience:'',description:[''],color:'#16877f',image:'grafiki/fake-news.jpg',logo:'grafiki/logo-projektu-symbol-transparent.png',open:false,link:'',button:'Sprawdź terminarz'});renderTrainings();editTraining(i); }
  function deleteTraining(){const i=+$('#trainingIndex').value;if(!Number.isInteger(i)||!state.trainings[i])return;if(confirm('Usunąć to szkolenie z terminarza?')){state.trainings.splice(i,1);persistTrainings();renderTrainings();if(state.trainings.length)editTraining(0);else els.trainingForm.reset();}}
  function slug(s){return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}

  function renderMedia(filter=''){ els.mediaGrid.innerHTML=''; [...state.files.keys()].filter(p=>imageExt.test(p)&&rootless(p).toLowerCase().includes(filter.toLowerCase())).slice(0,500).forEach(p=>{const rel=rootless(p),b=document.createElement('button');b.className='media-card';b.innerHTML=`<img loading="lazy" src="${assetUrl(rel)}" alt=""><span>${escapeHtml(rel)}</span>`;b.onclick=()=>{if(state.selected?.tag==='img'){pushHistory();post({cms:'image',path:relativeFromPage(state.pagePath,rel),url:assetUrl(rel)});els.media.close();toast('Zdjęcie zostało wybrane')}};els.mediaGrid.append(b)}); }
  async function addMedia(files){for(const f of files){const p=uniqueMediaPath(f.name);setFile(p,new Uint8Array(await f.arrayBuffer()))}renderMedia($('#mediaSearch').value);toast(`Dodano ${files.length} plików`)}

  async function exportZip(){ if(!state.zip)return; saveCurrentPage(); persistTrainings(); try{els.exportBtn.disabled=true;els.exportBtn.textContent='Przygotowuję paczkę…';const out=new JSZip();state.files.forEach((bytes,path)=>out.file(path,bytes));const blob=await out.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:6}},m=>{els.exportBtn.textContent=`Pakowanie ${Math.round(m.percent)}%`});const a=document.createElement('a');a.href=URL.createObjectURL(blob);const base=els.projectName.textContent.replace(/\.zip$/i,'').replace(/V\d+(?:\.\d+)?/i,'CMS');a.download=base+'-GITHUB.zip';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000);setDirty(false);toast('Paczka GitHub została pobrana')}catch(e){console.error(e);toast('Nie udało się przygotować paczki')}finally{els.exportBtn.disabled=false;els.exportBtn.textContent='Eksportuj paczkę GitHub'}}

  function bind(){
    [els.openZipBtn,els.chooseZipBtn,els.welcomeOpenBtn].forEach(b=>b.onclick=()=>els.zipInput.click());els.zipInput.onchange=e=>openZip(e.target.files[0]);
    [els.restoreDraftBtn,els.welcomeRestoreBtn].forEach(b=>b.onclick=restoreDraft);els.saveDraftBtn.onclick=saveDraft;
    ['dragenter','dragover'].forEach(n=>document.addEventListener(n,e=>{e.preventDefault();els.projectDrop.classList.add('is-over')}));['dragleave','drop'].forEach(n=>document.addEventListener(n,e=>{e.preventDefault();els.projectDrop.classList.remove('is-over')}));document.addEventListener('drop',e=>openZip([...e.dataTransfer.files].find(f=>/\.zip$/i.test(f.name))));
    $$('.viewport-switch button').forEach(b=>b.onclick=()=>{$$('.viewport-switch button').forEach(x=>x.classList.remove('is-active'));b.classList.add('is-active');state.viewport=b.dataset.viewport;els.device.className='device-frame '+state.viewport;updateViewportScope();postResponsiveViewport();setTimeout(postResponsiveViewport,300);if(state.fitPreview)requestAnimationFrame(fitViewport)});
    $$('.inspector-tabs button').forEach(b=>b.onclick=()=>{$$('.inspector-tabs button').forEach(x=>x.classList.remove('is-active'));b.classList.add('is-active');$$('.tab-panel').forEach(x=>x.classList.toggle('is-active',x.dataset.panel===b.dataset.tab))});
    addEventListener('message',e=>{const m=e.data;if(!m?.cms)return;if(m.cms==='selected'||m.cms==='changed'||m.cms==='dragging')showInspector(m.data);if(m.cms==='dragStart'||m.cms==='editTextStart')pushHistory();if(m.cms==='textEditing'){state.textEditingActive=!!m.active;if(!m.active)state.textSelectionActive=false;updateSelectionHint()}if(m.cms==='selection'){state.textSelectionActive=!!m.active;updateSelectionHint(m.formats)}if(m.cms==='changed'||m.cms==='dragging'||m.cms==='textInput')setDirty();if(m.cms==='structure'){setDirty();buildLayers()}if(m.cms==='navigate')navigateFromPreview(m.href);if(m.cms==='undoShortcut')undo();if(m.cms==='redoShortcut')redo()});
    els.exportBtn.onclick=exportZip;els.undo.onclick=undo;els.redo.onclick=redo;$('#refreshLayersBtn').onclick=buildLayers;
    els.previewModeBtn.onclick=togglePreviewMode;
    $('#newPageBtn').onclick=createPage;
    $('#zoomOut').onclick=()=>setZoom(state.zoom-.1,true);$('#zoomIn').onclick=()=>setZoom(state.zoom+.1,true);els.fitViewport.onclick=fitViewport;
    $('#calendarBtn').onclick=()=>{loadTrainings();els.calendar.showModal();if(state.trainings.length)editTraining(0)};$('#addTrainingBtn').onclick=e=>{e.preventDefault();newTraining()};els.trainingForm.onsubmit=saveTraining;$('#deleteTrainingBtn').onclick=deleteTraining;
    $('#mediaLibraryBtn').onclick=()=>{renderMedia();els.media.showModal()};$('#mediaSearch').oninput=e=>renderMedia(e.target.value);$('#uploadMediaBtn').onclick=()=>$('#mediaUploadInput').click();$('#mediaUploadInput').onchange=e=>addMedia([...e.target.files]);
    addEventListener('resize',()=>{if(state.fitPreview)fitViewport()});
    addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='s'){e.preventDefault();if(!els.saveDraftBtn.disabled)saveDraft();return}const form=/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)||e.target.isContentEditable;if(!form&&(e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?redo():undo()}});
    addEventListener('beforeunload',e=>{if(!state.dirty)return;e.preventDefault();e.returnValue=''});
    updateViewportScope();refreshDraftAvailability();bindInspector();
  }
  function viewportDimensions(){return els.device.classList.contains('mobile')?[390,844]:els.device.classList.contains('tablet')?[834,1112]:[1440,900]}
  function fitViewport(){if(!state.zip||els.device.hidden)return;state.fitPreview=true;els.fitViewport.classList.add('is-active');const [width,height]=viewportDimensions(),availableWidth=Math.max(320,els.canvasStage.clientWidth-48),availableHeight=Math.max(320,els.canvasStage.clientHeight-48);setZoom(Math.min(1,availableWidth/width,availableHeight/height),false)}
  function setZoom(z,manual=false){state.zoom=Math.max(.3,Math.min(1.4,z));if(manual){state.fitPreview=false;els.fitViewport.classList.remove('is-active')}els.device.style.zoom=String(state.zoom);els.device.style.transform='none';$('#zoomValue').value=Math.round(state.zoom*100)+'%'}
  bind();
})();
