(() => {
  'use strict';

  const SHORT_POLISH_WORD = /(^|[\s([{„“"'])([aAiIoOuUwWzZ])[ \t]+(?=\S)/g;
  const EXCLUDED = 'script,style,noscript,textarea,pre,code,[contenteditable="true"],[data-no-polish-spacing]';
  const pendingRoots = new Set();
  let scheduled = false;

  function protectedText(value) {
    return String(value || '').replace(SHORT_POLISH_WORD, '$1$2\u00a0');
  }

  function canChange(node) {
    const parent = node.parentElement;
    return parent && !parent.closest(EXCLUDED);
  }

  function protectTextNode(node) {
    if (!canChange(node)) return;
    const nextValue = protectedText(node.nodeValue);
    if (nextValue !== node.nodeValue) node.nodeValue = nextValue;
  }

  function protectTree(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      protectTextNode(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
    if (root.nodeType === Node.ELEMENT_NODE && root.matches(EXCLUDED)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) protectTextNode(node);
  }

  function flush() {
    scheduled = false;
    const roots = [...pendingRoots];
    pendingRoots.clear();
    roots.forEach(protectTree);
  }

  function schedule(root) {
    pendingRoots.add(root || document.body);
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(flush);
  }

  function start() {
    protectTree(document.body);
    const observer = new MutationObserver(records => {
      records.forEach(record => {
        if (record.type === 'characterData') schedule(record.target);
        record.addedNodes?.forEach(node => schedule(node));
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    window.portalTypography = { refresh: () => protectTree(document.body), protectedText };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
