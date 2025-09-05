(() => {
  const doc = new Y.Doc();
  const room = 'default';
  const provider = new WebsocketProvider(`ws://${window.location.host}?room=${room}`, room, doc);
  const ytext = doc.getText('content');
  const editor = document.getElementById('editor');

  function updateEditor() {
    const cursor = getCaretPosition(editor);
    editor.innerText = ytext.toString();
    setCaretPosition(editor, cursor);
  }

  ytext.observe(() => {
    updateEditor();
  });

  editor.addEventListener('input', () => {
    const text = editor.innerText;
    doc.transact(() => {
      ytext.delete(0, ytext.length);
      ytext.insert(0, text);
    });
  });

  function getCaretPosition(el) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return 0;
    const range = selection.getRangeAt(0);
    const preRange = range.cloneRange();
    preRange.selectNodeContents(el);
    preRange.setEnd(range.endContainer, range.endOffset);
    return preRange.toString().length;
  }

  function setCaretPosition(el, chars) {
    const selection = window.getSelection();
    const range = document.createRange();
    let node = el;
    let remaining = chars;
    function traverse(current) {
      if (remaining <= 0) return;
      if (current.nodeType === Node.TEXT_NODE) {
        const len = current.textContent.length;
        if (remaining <= len) {
          range.setEnd(current, remaining);
          range.setStart(current, remaining);
          remaining = 0;
        } else {
          remaining -= len;
        }
      } else {
        for (let i = 0; i < current.childNodes.length; i++) {
          traverse(current.childNodes[i]);
          if (remaining <= 0) break;
        }
      }
    }
    traverse(node);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  document.getElementById('summarize').addEventListener('click', async () => {
    const resp = await fetch(`/summary?room=${room}`);
    const data = await resp.json();
    document.getElementById('summary').innerText = data.summary;
  });
})();
