import request from '@/utils/request'
import http from '@/utils/http'
import _ from 'lodash'
import { getToken } from '@/utils/auth'

export async function clusterNum(account) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/cluster/num',
    method: 'get',
    params: {
      account
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data.cluster_num', 0)
}

export async function clusterDescribeAll(cluster_name, provider, account, page_number, page_size) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/cluster/describe_all',
    method: 'get',
    params: { cluster_name, provider, account, page_number, page_size },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data', [])
}

export async function clusterDescribe(cluster_name) {
  const token = getToken()
  const res = await request({
    url: `/api/v1/cluster/name/${cluster_name}`,
    method: 'get',
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data', {})
}

export async function clusterEdit(data) {
  const token = getToken()
  const res = await http({
    url: '/api/v1/cluster/edit',
    method: 'post',
    data,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return res
}

export async function clusterCreate(data) {
  const token = getToken()
  const res = await http({
    url: '/api/v1/cluster/create',
    method: 'post',
    data,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return res
}

export function clusterExpand(cluster_name, task_name, count) {
  const token = getToken()
  return request({
    url: '/api/v1/cluster/expand',
    method: 'post',
    data: {
      cluster_name,
      task_name,
      count
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export function clusterShrink(cluster_name, task_name, count) {
  const token = getToken()
  return request({
    url: '/api/v1/cluster/shrink',
    method: 'post',
    data: {
      cluster_name,
      task_name,
      count
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export function clusterDelete(ids) {
  const token = getToken()
  return request({
    url: `/api/v1/cluster/delete/${ids.join(',')}`,
    method: 'delete',
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}
