(()=>{
  'use strict';
  const ROOT_SELECTOR='body.course-page.course-portal-aligned';
  const SKIP='script,style,pre,code,textarea,select,option,[contenteditable="true"],[data-no-typography]';
  const oneLetter=/([\s([{„«—–-]|^)([AaIiOoUuWwZz]) (?=\S)/g;

  function hasFollowingInlineContent(node){
    let n=node.nextSibling;
    while(n){
      if(n.nodeType===Node.TEXT_NODE && n.nodeValue.trim()) return true;
      if(n.nodeType===Node.ELEMENT_NODE){
        if(n.matches('br')) return false;
        if(n.textContent && n.textContent.trim()) return true;
      }
      n=n.nextSibling;
    }
    return false;
  }

  function fixTextNode(node){
    const parent=node.parentElement;
    if(!parent || parent.closest(SKIP)) return;
    let text=node.nodeValue;
    if(!text || !/[AaIiOoUuWwZz] /.test(text)) return;
    let fixed=text;
    for(let pass=0;pass<4;pass++){
      const next=fixed.replace(oneLetter,'$1$2\u00A0');
      if(next===fixed) break;
      fixed=next;
    }
    if(/(^|[\s([{„«—–-])[AaIiOoUuWwZz] $/.test(fixed) && hasFollowingInlineContent(node)){
      fixed=fixed.replace(/ ([AaIiOoUuWwZz]) $/,' $1\u00A0').replace(/^([AaIiOoUuWwZz]) $/,'$1\u00A0');
    }
    if(fixed!==text){
      globalThis.__EBG_TYPOGRAPHY_NODES ||= new WeakSet();
      globalThis.__EBG_TYPOGRAPHY_NODES.add(node);
      node.nodeValue=fixed;
    }
  }

  function applyTypography(root=document){
    const scope=root.matches?.(ROOT_SELECTOR)?root:(root.querySelector?.(ROOT_SELECTOR)||document.querySelector(ROOT_SELECTOR));
    if(!scope) return;
    const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT,{
      acceptNode(node){
        if(!node.nodeValue || !node.nodeValue.includes(' ')) return NodeFilter.FILTER_REJECT;
        const p=node.parentElement;
        if(!p || p.closest(SKIP)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes=[];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(fixTextNode);
  }

  let queued=false;
  function queueApply(){
    if(queued) return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;applyTypography(document);});
  }

  document.addEventListener('DOMContentLoaded',()=>{
    applyTypography(document);
    const root=document.querySelector(ROOT_SELECTOR);
    if(!root) return;
    const observer=new MutationObserver(mutations=>{
      if(mutations.some(m=>m.type==='characterData'||m.addedNodes.length)) queueApply();
    });
    observer.observe(root,{subtree:true,childList:true,characterData:true});
  });
  document.addEventListener('ebg:language-changed',queueApply);
})();
