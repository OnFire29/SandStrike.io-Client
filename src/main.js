const { app, BrowserWindow, screen, clipboard, dialog } = require('electron');
const path = require('path');
const sandstrike = 'https://sandstrike.io/';
const Store = require('electron-store');
const store = new Store();
const shortcuts = require('electron-localshortcut');

//app.commandLine.appendSwitch('disable-frame-rate-limit');
//app.commandLine.appendSwitch('disable-gpu-vsync');
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.allowRendererProcessReuse = true;

if (!app.requestSingleInstanceLock()) app.quit();

let game = null;
let splash = null;
let social = null;
let internetConnection = true;
let errText;


function createSplashWindow() {
    splash = new BrowserWindow({
        width: 600,
        height: 300,
        center: true,
        resizable: false,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        webPreferences: {
            preload: `${__dirname}/preload/splash.js`,
        }
    });
    console.log(`${__dirname}/preload/splash.js`);
    splash.loadFile('src/html/splash.html');
    return splash;
}



function createGameWindow(url, webContents) {
    const { width, height } = screen.getPrimaryDisplay().workArea;
    game = new BrowserWindow({
        width: 1900,
        height: 1000,
        fullscreen: true,
        center: true,
        show: false,
        icon: `${__dirname}/icon/icon.ico`,
        title: `SandStrike.io Client`,
        autoHideMenuBar: true,
        webPreferences: {
            preload: `${__dirname}/preload/preload.js`,
            contextIsolation: false,
            nativeWindowOpen: true,
            webSecurity: false,
            enableRemoteModule: false,
            nodeIntegration: false,
        }
    });
    
    
    const contents = game.webContents;
    shortcuts.register(game, 'Escape', () => contents.executeJavaScript('document.exitPointerLock()', true));
    shortcuts.register(game, 'F5', () => contents.reload()); 
    shortcuts.register(game, 'Shift+F5', () => contents.reloadIgnoringCache());
    shortcuts.register(game, 'F11', () => console.log(!game.isFullScreen())); 
    shortcuts.register(game, 'F12', () => console.log("OK"));
    shortcuts.register(game, "Control+Shift+I", () => console.log("OK"));
    
    
    if (!webContents) {
        game.loadURL(sandstrike).catch((err) => {
            internetConnection = false;
            errText = `${err}`;
        });
    }
    return game;
}

function createWindow(url, webContents) {
    const { width, height } = screen.getPrimaryDisplay().workArea;
    social = new BrowserWindow({
        width: width,
        height: height,
        center: true,
        show: false,
        icon: `${__dirname}/icon/icon.ico`,
        title: `SandStrike.io Client`,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: false,
            nativeWindowOpen: true,
            webSecurity: false,
            enableRemoteModule: false,
            nodeIntegration: false,
        }
    });
    if (!webContents) social.loadURL(url);
    return social;
}


function initClient() { 
    createSplashWindow();
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
        createGameWindow(bloxd);
        wait(5000).then(() => {
            if (internetConnection == false) {
                splash.destroy();
                dialog.showErrorBox('Failed to load SandStrike.io', errText);
                app.quit();
                return;
            }
            splash.destroy();
            game.show();
        });
}

app.whenReady().then(() => initClient());

app.on('quit', () => app.quit());

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') app.quit();
});

