const { ipcRenderer } = require('electron');
window.addEventListener('DOMContentLoaded', () => {
    const err = document.getElementById('err');
    ipcRenderer.on('errURL', (event, messageText = '') => {
        if (messageText != null) err.innerText = messageText;
    });
});

