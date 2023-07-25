import { get, post, put, deleted } from '../uitls/http'

// 获取滑块验证码
export const GetCaptcha = (data) => get('/captcha', data)
// 检查验证码正确性
export const CheckCaptcha = (data) => post('/captcha/check', data)