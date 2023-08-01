import { app, BrowserWindow, Menu, ipcMain, Tray } from 'electron'
import path from 'path'

let tray = null  // 在外面创建tray变量，防止被自动删除，导致图标自动消失

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
        },
        icon: path.join(__dirname, '/', 'favicon.ico') // 设置窗口图标
    });

    // 创建任务栏图标
    tray = new Tray(path.join(__dirname, '/', 'favicon.ico'))
    // 自定义托盘图标的内容菜单
    const contextMenu = Menu.buildFromTemplate([
        {
            // 点击退出菜单退出程序
            label: '退出', click: function () {
                win.destroy()
                app.quit()

            }
        }
    ])

    tray.setToolTip('Herman AI')  // 设置鼠标指针在托盘图标上悬停时显示的文本
    tray.setContextMenu(contextMenu)  // 设置图标的内容菜单
    // 点击托盘图标，显示主窗口
    tray.on("click", () => {
        win.show();
    })

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
    ipcMain.on('window-close', function (e) {
        e.preventDefault();  // 阻止退出程序
        win.setSkipTaskbar(true)   // 取消任务栏显示
        win.hide();    // 隐藏主程序窗口
    })

    // 监听窗口最大化事件
    win.on('maximize', () => {
        win.webContents.send('window-maximized');
    });

    // 监听窗口取消最大化事件
    win.on('unmaximize', () => {
        win.webContents.send('window-unmaximized');
    });

    // 监听窗口最大化状态
    ipcMain.on('get-window-maximized', (event) => {
        if (win.isMaximized()) {
            event.sender.send('window-maximized');
        } else {
            event.sender.send('window-unmaximized');
        }
    });

    // 根据命令行参数加载URL或本地文件
    if (argv) {
        win.loadURL(argv.domain)
    } else {
        win.loadFile('index.html')
    }
})