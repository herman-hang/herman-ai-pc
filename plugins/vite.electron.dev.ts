// 导入需要使用的类型和库
import type { Plugin } from 'vite'
import { loadEnv } from 'vite'
import type { AddressInfo } from 'net'
import type { ChildProcessWithoutNullStreams } from 'child_process'
import { spawn } from 'child_process'
import fs from 'fs'

// 导出Vite插件函数
export const viteElectronDev = (): Plugin => {
    // let electronProcess: ChildProcessWithoutNullStreams
    let electronProcess: any = null;
    const env = loadEnv('development', './')
    // 定义初始化Electron的函数
    const initElectron = () => {
        // 使用esbuild编译TypeScript代码为JavaScript
        require('esbuild').buildSync({
            entryPoints: ['src/background.ts'],
            bundle: true,
            outfile: 'dist/background.js',
            platform: 'node',
            target: 'node12',
            external: ['electron']
        })
    }
    return {
        name: 'vite-electron-dev',
        // 在configureServer中实现插件的逻辑
        configureServer(server) {

            // 调用初始化Electron函数
            initElectron()

            // 监听Vite的HTTP服务器的listening事件
            server?.httpServer?.once('listening', () => {
                // 获取HTTP服务器的监听地址和端口号
                const addressInfo = server?.httpServer?.address() as AddressInfo
                const argv = JSON.stringify({
                    domain: `http://localhost:${addressInfo.port}`,
                    port: addressInfo.port,
                    debug: env.VITE_APP_DEBUG === 'false' ? false : true
                })
                if (!electronProcess) {
                    // 启动Electron进程
                    electronProcess = spawn(require('electron'), ['dist/background.js', argv])

                    // 监听Electron进程的stdout输出
                    electronProcess.stdout?.on('data', (data: ChildProcessWithoutNullStreams) => {
                        console.log(`electronProcessLog: ${data}`);
                    });
                }

                // 监听主进程代码的更改
                fs.watchFile('src/background.ts', () => {
                    // 杀死当前的Electron进程
                    electronProcess.kill()
                    // 重新编译主进程代码并重新启动Electron进程
                    initElectron()
                    electronProcess = spawn(require('electron'), ['dist/background.js', argv])
                })
            })
        }
    }
}
