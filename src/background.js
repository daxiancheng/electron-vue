'use strict'

import { app, protocol, BrowserWindow, Tray, Menu, nativeImage, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const path = require('path')
// import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

// 禁止多开
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
}

let win

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 600,
    height: 700,
    frame: false, // 是否显示边缘框
    // fullscreen: false, // 是否全屏显示
    transparent: true, // 是否透明
    resizable: false, // 是否可以改变窗口大小
    type: 'toolbar', // 设置窗口类型为工具窗口，则不会在任务栏出现缩略图
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      devTools: true,
      //设置能在渲染进程使用nodejs的API
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      // 启用上下文隔离
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, "/preload.js")
    }
  })
  win.removeMenu()

  // win.setIgnoreMouseEvents(true)
  InitTray()
  ipcMainEvent()

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}



function InitTray() {
  const icon = nativeImage.createFromPath(
    path.join(__static, './alarm-clock.png')
  )
  // 实例化一个 托盘对象，传入的是托盘的图标
  let tray = new Tray(icon)
  // 移动到托盘上的提示
  tray.setToolTip('chengzi desktop')
  // 还可以设置 titlle
  // tray.setTitle('electron demo')

  // 监听托盘右键事件
  tray.on('right-click', () => {
    // 右键菜单模板
    const tempate = [
      {
        label: '退出',
        click: () => app.quit(),
      },
    ]
    //通过 Menu 创建菜单
    const menuConfig = Menu.buildFromTemplate(tempate)
    // 让我们的写的托盘右键的菜单替代原来的
    tray.popUpContextMenu(menuConfig)
  })
  //监听点击托盘的事件
  tray.on('click', () => {
    // 这里来控制窗口的显示和隐藏
    if (win.isVisible()) {
      win.hide()
    } else {
      win.show()
    }
  })
}

function ipcMainEvent() {
  // win.once('ready-to-show', () => {
  //   win.show()
  // })
  ipcMain.on("window-hiden", ()=>{
    win.hide()
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // if (isDevelopment && !process.env.IS_TEST) {
  //   // Install Vue Devtools
  //   try {
  //     await installExtension(VUEJS3_DEVTOOLS)
  //   } catch (e) {
  //     console.error('Vue Devtools failed to install:', e.toString())
  //   }
  // }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
