// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('ConfigAPI', {
  init: () => ipcRenderer.invoke('init'),
  missBaseConfig: () => ipcRenderer.invoke('missBaseConfig'),
  getAccessToken: () => ipcRenderer.invoke('getAccessToken'),
  getUsername: () => ipcRenderer.invoke('getUsername'),
  setAccessToken: (accessToken: string) =>
    ipcRenderer.invoke('setAccessToken', accessToken),
  setUsername: (username: string) =>
    ipcRenderer.invoke('setUsername', username),
  save: () => ipcRenderer.invoke('save'),
})

contextBridge.exposeInMainWorld('SystemAPI', {
  restart: () => ipcRenderer.invoke('restart'),
  quit: () => ipcRenderer.invoke('quit'),
})
