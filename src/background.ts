import { app, BrowserWindow, Menu, ipcMain } from 'electron'

// 创建一个窗口
async function createWindow() {
    const win = await new BrowserWindow({
        width: 800,
        height: 600,
        frame: false, // 隐藏标题栏和窗口边框
        // 配置窗口的WebPreferences选项，用于控制渲染进程的行为
        webPreferences: {
            nodeIntegration: true, // 启用Node.js集成
            contextIsolation: false, // 禁用上下文隔离
            webSecurity: false, // 禁用web安全策略
        }
    });

    // 隐藏菜单栏
    Menu.setApplicationMenu(null);
    return win;
}

// 等待Electron应用就绪后创建BrowserWindow窗口
app.whenReady().then(async () => {
    const win = await createWindow();
    const argv = JSON.parse(process.argv[2])

    if (argv.debug === true) {
        // 打开开发工具
        win.webContents.openDevTools()
    }

    // 点击激活当前窗口为0时触发
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })

    // 收到渲染进程的窗口最小化操作的通知，并调用窗口最小化函数，执行该操作
    ipcMain.on('window-min', function () {
        win.minimize();
    })

    // 窗口 最大化、恢复
    ipcMain.on('window-max', function () {
        if (win.isMaximized()) { // 为true表示窗口已最大化
            win.restore();// 将窗口恢复为之前的状态.
        } else {
            win.maximize();
        }
    })

    // 关闭窗口
    ipcMain.on('window-close', function () {
        win.close();
    })

    // 根据命令行参数加载URL或本地文件
    if (argv) {
        win.loadURL(argv.domain)
    } else {
        win.loadFile('index.html')
    }
})