const { contextBridge, ipcRenderer } = require('electron')

console.log('preload.js called');

// This synchronous model, means that it'll block the renderer process until a reply is received.
const result = ipcRenderer.sendSync('synchronous-message', 'ping')
console.log(result) // prints "pong" in the DevTools console


// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }
  })

  // use this to expose node api to the rendered windows
  contextBridge.exposeInMainWorld('myAPI', {
    versions: process.versions,
    sayHello: () => {return "Hello There!"},
    setTitle: (title)=>ipcRenderer.send('set-title', title),
    openFile: () => ipcRenderer.invoke('dialog:openFile')
  })
