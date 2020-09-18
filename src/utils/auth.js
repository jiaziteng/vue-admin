import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  // 获取cookie
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  // cookie如果不设置过期时间,默认关闭浏览器消失
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  // 删除cookie
  return Cookies.remove(TokenKey)
}
