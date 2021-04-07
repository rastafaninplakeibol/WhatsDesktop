import * as electron from 'electron';
import { session } from 'electron'
import { writeFileSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'

let win: electron.BrowserWindow;

const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36';
const cookiePath = join(__dirname, 'cookie.json')
const iconPath = join(__dirname, 'whatsapp.png')
const whatsappURL = 'https://web.whatsapp.com/'

async function saveCookies() {
    let counter = 0;
    let cookies = await session.defaultSession.cookies.get({})
    cookies.forEach(cookie => {
        if(cookie.domain === '.web.whatsapp.com') counter++;
    })

    if (counter === 2) {
        console.log('salvati i cookies')
        console.log(cookies)
        writeFileSync(cookiePath, JSON.stringify(cookies, null, '\t'))
    }
    else setTimeout(async () => {
       await saveCookies() 
    }, 5000);
}

async function createWindow() {
	win = new electron.BrowserWindow({
        width: 800,
        height: 1200,
        icon: iconPath
    });
    win.setMenu(null)
    win.on('closed', function () {
        console.log('window closed')
    });
    win.setTitle('WhatsDesktop')

    if(existsSync(cookiePath)) {
        console.log(`exists ${cookiePath}`)
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
    await saveCookies()
}

electron.app.on('ready', createWindow);

electron.app.on('window-all-closed', function () {
    saveCookies();
    if (process.platform !== 'darwin')
        electron.app.quit();
});
electron.app.on('activate', function () {
    if (win === null) createWindow();
});
