import { app, BrowserWindow, Menu } from 'electron'

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

    // 根据命令行参数加载URL或本地文件
    if (argv) {
        win.loadURL(argv.domain)
    } else {
        win.loadFile('index.html')
    }
})