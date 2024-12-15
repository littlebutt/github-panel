// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('ConfigAPI', {
    init: () => ipcRenderer.invoke('init'),
    missBaseConfig: () => ipcRenderer.invoke('missBaseConfig'),
    getAccessToken: () => ipcRenderer.invoke('getAccessToken'),
    getUsername: () => ipcRenderer.invoke('getUsername')
})