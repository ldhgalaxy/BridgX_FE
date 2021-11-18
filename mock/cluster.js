const Mock = require('mockjs')

const data = Mock.mock({
  'items|5': [{
    task_name: '@sentence(5,10)',
    run_num: '@integer(300, 600)',
    suspend_num: '@integer(300, 600)',
    success_num: '@integer(300, 600)',
    fail_num: '@integer(300, 600)',
    success_rate: '@float(0.6, 0.9, 3, 6)',
    execute_time: '@integer(500, 2000)'
  }]
})

const clusters = Mock.mock({
  'cluster_list|25': [{
    provider: 'aliyun',
    account: '@sentence(1)',
    total_remainder: '8/200',
    cluster_name: '@sentence(1)',
    create_at: '@datetime'
  }]
})

const clusterDesc = Mock.mock({
  cluster_name: '@sentence(1)',
  cluster_info: '@sentence(1)',
  region_id: 'cn-beijing-h',
  create_at: '@datetime',
  image_id: '@sentence(1)',
  instance_type: 'ecs.c6.4xlarge',
  provider: 'aliyun',
  storage_config: {
    system_disk_type: 'cloud_efficiency',
    system_disk_size: 40,
    data_disk_type: 'cloud_efficiency',
    data_disk_size: 40,
    data_disk_num: 4
  },
  network_config: {
    vpc_name: '@sentence(1)',
    subnet_id_name: '@sentence(1)',
    security_group_name: '@sentence(1)'
  }
})

module.exports = [
  {
    url: '/api/v1/cluster/num',
    type: 'get',
    response: config => {
      return {
        code: 200,
        data: {
          cluster_num: 20
        }
      }
    }
  },
  // {
  //   url: '/api/v1/cluster/describe_all',
  //   type: 'get',
  //   response: config => {
  //     return {
  //       code: 200,
  //       data: {
  //         cluster_list: clusters.cluster_list
  //       }
  //     }
  //   }
  // },
  {
    url: '/api/v1/cluster/name/describe',
    type: 'get',
    response: config => {
      return {
        code: 200,
        data: {
          ...clusterDesc
        }
      }
    }
  },
  {
    url: '/api/v1/cluster/expand',
    type: 'post',
    response: config => {
      return {
        code: 200,
        msg: 'success',
        data: 3699560845204735
      }
    }
  },
  {
    url: '/api/v1/cluster/shrink',
    type: 'post',
    response: config => {
      return {
        code: 200,
        msg: 'success',
        data: 3699560845204735
      }
    }
  }
]
