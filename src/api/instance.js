import request from '@/utils/request'
import _ from 'lodash'
import { getToken } from '@/utils/auth'

export async function instanceNum(account, cluster_name) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/instance/num',
    method: 'get',
    params: {
      account,
      cluster_name
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data.instance_num', 0)
}

// 获取机器列表
export async function instanceDescribeAll(account, instance_id, ip, provider, cluster_name, page_number, page_size) {
  const token = getToken()
  const req = await request({
    url: '/api/v1/instance/describe_all',
    method: 'get',
    params: { account, instance_id, ip, provider, cluster_name, page_number, page_size },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(req, 'data', {})
}

// 获取机器详情
export async function instanceDetail(instance_id) {
  const token = getToken()
  const req = await request({
    url: `/api/v1/instance/id/describe`,
    method: 'get',
    params: { instance_id },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(req, 'data', {})
}

export async function instanceUsageTotal(cluster_name, date) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/instance/usage_total',
    params: {
      cluster_name,
      date
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data.usage_total', 0)
}

export async function instanceUsageStatistics(cluster_name, date, page_number, page_size) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/instance/usage_statistics',
    params: {
      cluster_name,
      date,
      page_number,
      page_size
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data')
}
