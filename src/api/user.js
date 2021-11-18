import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import _ from "lodash";

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/v1/user/info',
    method: 'get',
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export function refreshToken() {
  const token = getToken()
  return request({
    url: '/user/refresh_token',
    method: 'post',
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export async function userList(page_number, page_size) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/user/list',
    params: {
      page_number,
      page_size
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data')
}

export function createRamUser(username, password) {
  const token = getToken()
  return request({
    url: '/api/v1/user/create_ram_user',
    method: 'post',
    data: {
      username,
      password
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export function passwordModify(username, old_password, new_password) {
  const token = getToken()
  return request({
    url: '/api/v1/user/modify_password',
    method: 'post',
    data: {
      username,
      old_password,
      new_password
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export function ramUserEnable(usernames, action) {
  const token = getToken()
  return request({
    url: '/api/v1/user/enable_ram_user',
    method: 'post',
    data: {
      usernames,
      action
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}
