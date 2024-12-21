import { app, BrowserWindow, Tray, screen, Display, ipcMain } from 'electron'
import path from 'path'
import { Config } from './api/config'
import { GithubClient } from './api/github-client'

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

const MAIN_WINDOW_WIDTH = 400
const MAIN_WINDOW_HEIGHT = 300

if (require('electron-squirrel-startup')) {
  app.quit()
}

const getMainWindowLocation = (): number[] => {
  const mainScreen: Display = screen.getPrimaryDisplay()
  if (process.platform === 'win32') {
    // right-bottom
    return [
      mainScreen.size.width - 30 - MAIN_WINDOW_WIDTH,
      mainScreen.size.height - 50 - MAIN_WINDOW_HEIGHT,
    ]
  } else {
    // right-top
    return [mainScreen.size.width - 30 - MAIN_WINDOW_WIDTH, 50]
  }
}

let mainWindow: BrowserWindow | null = null

const showWindow = (): void => {
  if (mainWindow === null) {
    const size = getMainWindowLocation()
    mainWindow = new BrowserWindow({
      height: MAIN_WINDOW_HEIGHT,
      width: MAIN_WINDOW_WIDTH,
      alwaysOnTop: true,
      resizable: false,
      transparent: true,
      x: size[0],
      y: size[1],
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
      titleBarStyle: 'hidden',
    })
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  }
  mainWindow?.show()
  // mainWindow.webContents.openDevTools()
}

const hideWindow = (): void => {
  mainWindow.hide()
}

const toggleWindowState = (): void => {
  if (mainWindow?.isVisible()) {
    hideWindow()
  } else {
    showWindow()
  }
}

let tray: Tray
const config: Config = new Config({})
const githubClient = new GithubClient()

const initConfigIPC = () => {
  ipcMain.handle('missBaseConfig', () => config.missBaseConfig())
  ipcMain.handle('getAccessToken', () => config.getAccessToken())
  ipcMain.handle('setAccessToken', (event, accessToken: string) =>
    config.setAccessToken(accessToken),
  )
  ipcMain.handle('getTimespan', () => config.getTimespan())
  ipcMain.handle('setTimespan', (event, timespan: number) =>
    config.setTimespan(timespan),
  )
  ipcMain.handle('save', () => config.save())
}

const initGithubIPC = () => {
  ipcMain.handle('initGithubClient', (event, accessToken: string) =>
    githubClient.init({ accessToken }),
  )
  ipcMain.handle('validate', () => githubClient.validate())
  ipcMain.handle('getAuthenticatedUser', () =>
    githubClient.getAuthenticatedUser(),
  )
  ipcMain.handle('listRepositoriesForAuthenticatedUser', () =>
    githubClient.listRepositoriesForAuthenticatedUser(),
  )
  ipcMain.handle(
    'listCommitsForAuthenticatedUser',
    (event, timespan: number, username: string) =>
      githubClient.listCommitsForAuthenticatedUser(timespan, username),
  )
  ipcMain.handle(
    'listPRsForAuthenticatedUser',
    (event, timespan: number, username: string) =>
      githubClient.listPRsForAuthenticatedUser(timespan, username),
  )
  ipcMain.handle(
    'listIssuesForAuthenticatedUser',
    (event, timespan: number, username: string) =>
      githubClient.listIssuesForAuthenticatedUser(timespan, username),
  )
}

app.on('ready', () => {
  // Icon Init
  const iconPath: string =
    process.platform === 'win32'
      ? 'assets/github-brands-white.png'
      : 'assets/github-brands-solid.png'
  tray = new Tray(path.join(__dirname, iconPath))

  // IPC Init
  initConfigIPC()
  initGithubIPC()
  ipcMain.handle('restart', () => {
    app.relaunch()
    app.quit()
  })
  ipcMain.handle('quit', () => app.quit())

  // App Start
  toggleWindowState()
  tray.on('click', () => toggleWindowState())
})
