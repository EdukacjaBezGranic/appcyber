(()=>{
  'use strict';

  const desktop = window.matchMedia('(min-width: 1201px)');
  const GAP = 10;
  const EDGE = 12;
  const MAX_WIDTH = 300;

  function mainLeftBoundary(){
    const main = document.querySelector('.course-main');
    if(!main) return EDGE;
    const rect = main.getBoundingClientRect();
    return Math.max(EDGE, rect.left + 8);
  }

  function topBoundary(){
    const bar = document.querySelector('.course-topbar--portal, .course-topbar');
    if(!bar) return EDGE;
    return Math.max(EDGE, bar.getBoundingClientRect().bottom + 8);
  }

  function clearPosition(button){
    button.classList.remove('is-tooltip-below');
    const bubble = button.querySelector('.course-term-tooltip__bubble');
    if(!bubble) return;
    bubble.style.removeProperty('--v174-tooltip-left');
    bubble.style.removeProperty('--v174-tooltip-top');
    bubble.style.removeProperty('--v174-tooltip-arrow-left');
  }

  function positionTooltip(button){
    if(!desktop.matches){ clearPosition(button); return; }
    const bubble = button.querySelector('.course-term-tooltip__bubble');
    if(!bubble) return;

    const termRect = button.getBoundingClientRect();
    const bubbleRect = bubble.getBoundingClientRect();
    const width = Math.min(MAX_WIDTH, bubbleRect.width || MAX_WIDTH, window.innerWidth - EDGE * 2);
    const height = bubbleRect.height || 80;
    const minLeft = mainLeftBoundary();
    const maxLeft = Math.max(minLeft, window.innerWidth - width - EDGE);

    let left = termRect.left + (termRect.width / 2) - (width / 2);
    left = Math.min(maxLeft, Math.max(minLeft, left));

    const minTop = topBoundary();
    const aboveTop = termRect.top - height - GAP;
    const belowTop = termRect.bottom + GAP;
    let top = aboveTop;
    let below = false;

    if(aboveTop < minTop){
      top = belowTop;
      below = true;
    }
    if(top + height > window.innerHeight - EDGE && aboveTop >= minTop){
      top = aboveTop;
      below = false;
    }
    top = Math.max(minTop, Math.min(top, window.innerHeight - height - EDGE));

    const termCenter = termRect.left + termRect.width / 2;
    const arrowLeft = Math.max(14, Math.min(width - 26, termCenter - left - 6));

    button.classList.toggle('is-tooltip-below', below);
    bubble.style.setProperty('--v174-tooltip-left', `${Math.round(left)}px`);
    bubble.style.setProperty('--v174-tooltip-top', `${Math.round(top)}px`);
    bubble.style.setProperty('--v174-tooltip-arrow-left', `${Math.round(arrowLeft)}px`);
  }

  function activeTooltip(){
    const focused = document.activeElement?.closest?.('.course-term-tooltip');
    if(focused) return focused;
    return document.querySelector('.course-term-tooltip:hover');
  }

  function refreshActive(){
    const button = activeTooltip();
    if(button) positionTooltip(button);
  }

  function bind(){
    document.querySelectorAll('.course-term-tooltip').forEach(button=>{
      button.addEventListener('pointerenter', ()=>positionTooltip(button), {passive:true});
      button.addEventListener('focus', ()=>positionTooltip(button));
      button.addEventListener('click', ()=>positionTooltip(button));
    });
    window.addEventListener('resize', refreshActive, {passive:true});
    window.addEventListener('scroll', refreshActive, {passive:true, capture:true});
    desktop.addEventListener?.('change', ()=>{
      document.querySelectorAll('.course-term-tooltip').forEach(button=>{
        if(desktop.matches) positionTooltip(button); else clearPosition(button);
      });
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, {once:true});
  else bind();
})();
