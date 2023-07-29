import { get, post, put, deleted } from '../uitls/http'

// 获取滑块验证码
export const GetCaptcha = (data: object) => get({ url: '/captcha', data: data })
// 检查验证码正确性
export const CheckCaptcha = (data: object) => post({ url: '/captcha/check', data: data })
// 发送验证码
export const SendCode = (data: object) => post({ url: '/pc/send/code', data: data })
// 登录
export const Login = (data: object) => post({ url: '/pc/login', data: data })
// 获取用户信息
export const UserInfo = () => get({ url: '/pc/users' })
// 上传文件
export const UploadFile = (data: FormData, headers: object) => post({ url: '/pc/files/uploads' })
// 下载文件
export const DownloadFile = (id: number) => get({ url: '/pc/files/download/' + id })
// 图片预览
export const Preview = (id: number) => get({ url: '/pc/files/preview/' + id, responseType: 'blob' })
// 修改用户信息
export const ModifyUser = (data: object) => put({ url: '/pc/users', data: data })