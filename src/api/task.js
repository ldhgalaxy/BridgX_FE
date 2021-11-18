import request from '@/utils/request'
import { getToken } from '@/utils/auth' // get token from cookie
import _ from 'lodash'

export async function taskDescribeAll(task_name, cluster_name, task_status, page_number, page_size) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/task/describe_all',
    method: 'get',
    params: {
      task_name,
      cluster_name,
      task_status,
      page_number,
      page_size
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data', {})
}

export async function taskNum(account) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/task/num',
    method: 'get',
    params: {
      account
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data.task_num', 0)
}

export async function taskDescribe(task_id) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/task/describe',
    method: 'get',
    params: { task_id },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data', {})
}

export async function taskList(account, page_number, page_size) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/task/list',
    params: {
      account,
      page_number,
      page_size
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data', {})
}

export async function taskInstances(task_id, instance_status, page_number, page_size) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/task/instances',
    params: {
      task_id,
      instance_status,
      page_number,
      page_size
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data', {})
}
