const { ipcRenderer } = require('electron');
const version = require('../../package.json').version;
const randoinfo = [
    "Have a good gameplay!",
    "Thanks to OnFire29 for developing the client",
    "Make sure to join the discord!",
    "Let's get them!"
];

window.addEventListener('DOMContentLoaded', () => {

    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
        return element;
    };
    const stuffs = randoinfo[Math.floor(Math.random() * randoinfo.length)];
    replaceText('randoinfo', `${stuffs}`);
    replaceText('version', `v${version}`);

});

