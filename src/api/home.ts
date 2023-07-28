import { get, post, put, deleted } from '../uitls/http'

// 获取滑块验证码
export const GetCaptcha = (data: object) => get('/captcha', data)
// 检查验证码正确性
export const CheckCaptcha = (data: object) => post('/captcha/check', data)
// 发送验证码
export const SendCode = (data: object) => post('/pc/send/code', data)
// 登录
export const Login = (data: object) => post('/pc/login', data)
// 获取用户信息
export const UserInfo = () => get('/pc/users')