// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('ConfigAPI', {
  missBaseConfig: () => ipcRenderer.invoke('missBaseConfig'),
  getAccessToken: () => ipcRenderer.invoke('getAccessToken'),
  setAccessToken: (accessToken: string) =>
    ipcRenderer.invoke('setAccessToken', accessToken),
  getTimespan: () => ipcRenderer.invoke('getTimespan'),
  setTimespan: (timespan: number) =>
    ipcRenderer.invoke('setTimespan', timespan),
  save: () => ipcRenderer.invoke('save'),
})

contextBridge.exposeInMainWorld('SystemAPI', {
  restart: () => ipcRenderer.invoke('restart'),
  quit: () => ipcRenderer.invoke('quit'),
})

contextBridge.exposeInMainWorld('GithubAPI', {
  init: (accessToken: string) =>
    ipcRenderer.invoke('initGithubClient', accessToken),
  validate: () => ipcRenderer.invoke('validate'),
  getAuthenticatedUser: () => ipcRenderer.invoke('getAuthenticatedUser'),
  listRepositoriesForAuthenticatedUser: () =>
    ipcRenderer.invoke('listRepositoriesForAuthenticatedUser'),
  listCommitsForAuthenticatedUser: (timespan: number, username: string) =>
    ipcRenderer.invoke('listCommitsForAuthenticatedUser', timespan, username),
  listPRsForAuthenticatedUser: (timespan: number, username: string) =>
    ipcRenderer.invoke('listPRsForAuthenticatedUser', timespan, username),
  listIssuesForAuthenticatedUser: (timespan: number, username: string) =>
    ipcRenderer.invoke('listIssuesForAuthenticatedUser', timespan, username)
})
