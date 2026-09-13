/* Rich text commands are scoped to a remembered selection inside this editor. */
window.mountSelectionEditor = function (editor, toolbar, onChange, notify) {
  let savedRange = null;
  const remember = () => {
    const selection = window.getSelection();
    if (selection.rangeCount && editor.contains(selection.anchorNode) && editor.contains(selection.focusNode)) {
      savedRange = selection.getRangeAt(0).cloneRange();
    }
  };
  editor.addEventListener('keyup', remember);
  editor.addEventListener('mouseup', remember);
  editor.addEventListener('input', remember);
  editor.addEventListener('blur', remember);
  const help = document.createElement('p');
  help.className = 'selection-help';
  help.textContent = 'Zaznacz słowa w polu poniżej, a następnie wybierz formatowanie. Ustawienia „Układ i typografia” dotyczą całego bloku.';
  toolbar.before(help);
  const extra = document.createElement('div');
  extra.className = 'selection-controls';
  extra.innerHTML = `<label>Czcionka zaznaczenia<select data-inline="fontName"><option value="">Wybierz krój</option><option>Arial</option><option>Verdana</option><option>Georgia</option><option>Times New Roman</option></select></label>
    <label>Wielkość zaznaczenia<select data-inline="fontSize"><option value="">Wybierz rozmiar</option><option value="2">Mały</option><option value="3">Normalny</option><option value="4">Średni</option><option value="5">Duży</option><option value="6">Bardzo duży</option></select></label>
    <label>Kolor tekstu<input type="color" data-inline="foreColor" value="#145d52"></label>
    <label>Podświetlenie<input type="color" data-inline="hiliteColor" value="#fff0a6"></label>
    <button type="button" data-command="strikeThrough">Przekreślenie</button>
    <button type="button" data-command="removeFormat">Usuń format zaznaczenia</button>`;
  toolbar.append(extra);
  const restore = () => {
    if (!savedRange || savedRange.collapsed || !editor.contains(savedRange.commonAncestorContainer)) {
      notify('Najpierw zaznacz słowa w polu edycji.', 'error'); return false;
    }
    editor.focus();
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(savedRange);
    return true;
  };
  const run = (command, value = null) => {
    if (!restore()) return;
    if (command === 'createLink') {
      value = prompt('Adres linku (https://, mailto:, tel: lub strona.html):', 'https://');
      if (!value) return;
      value = value.trim();
      if (/^[\s\S]*[\x00-\x20]/.test(value) || (/^[a-z][a-z\d+.-]*:/i.test(value) && !/^(https?:|mailto:|tel:)/i.test(value)) || value.startsWith('//')) {
        notify('Podaj poprawny, bezpieczny adres linku.', 'error'); return;
      }
      if (!restore()) return;
    }
    document.execCommand('styleWithCSS', false, true);
    document.execCommand(command, false, value);
    remember(); onChange();
  };
  toolbar.querySelectorAll('[data-command]').forEach(button => {
    button.addEventListener('mousedown', event => event.preventDefault());
    button.onclick = () => run(button.dataset.command);
  });
  toolbar.querySelectorAll('[data-inline]').forEach(control => {
    control.addEventListener('change', () => {
      if (control.value) run(control.dataset.inline, control.value);
      if (control.tagName === 'SELECT') control.value = '';
    });
  });
  editor.addEventListener('paste', event => {
    event.preventDefault();
    document.execCommand('insertText', false, event.clipboardData.getData('text/plain'));
    remember(); onChange();
  });
};
