import * as electron from 'electron';
import { session } from 'electron'
import { writeFileSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'

let win: electron.BrowserWindow;

const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36';
const cookiePath = join(__dirname, 'cookie.json')
const iconPath = join(__dirname, 'whatsapp--v4.png')
const whatsappURL = 'https://web.whatsapp.com/'

async function createWindow() {
	win = new electron.BrowserWindow({
        width: 800,
        height: 1200,
        icon: iconPath
    });
    win.on('closed', function () {
        console.log('window closed')
    });
    win.setTitle('WhatsDesktop')

    if(existsSync(cookiePath)) {
        let cookies = JSON.parse(readFileSync(cookiePath).toString())
        console.log(cookies)
        cookies.forEach( (oldCookie: any) => {
            if(oldCookie.domain !== '.google.com' ) {
                const cookie = {
                    ...oldCookie,
                    url: whatsappURL
                }
                session.defaultSession.cookies.set(cookie)
            }
        })
    }

    await win.loadURL(whatsappURL, { userAgent })
    win.webContents.reloadIgnoringCache()
    setTimeout(async () => {
        let cookies = await session.defaultSession.cookies.get({})
        if(cookies) writeFileSync(cookiePath, JSON.stringify(cookies))
    }, 60000);
}

electron.app.on('ready', createWindow);

electron.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron.app.quit();
});
electron.app.on('activate', function () {
    if (win === null) createWindow();
});
