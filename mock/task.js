const Mock = require('mockjs')

const data = Mock.mock({
  'items|5': [{
    task_name: '@sentence(1,2)',
    run_num: '@integer(300, 600)',
    suspend_num: '@integer(300, 600)',
    success_num: '@integer(300, 600)',
    fail_num: '@integer(300, 600)',
    success_rate: '@float(0.6, 0.9, 3, 6)',
    execute_time: '@integer(500, 2000)'
  }]
})

const taskDetail = Mock.mock({
  task_name: '@sentence(1,2)',
  found_time: '@datetime',
  run_num: '@integer(0, 50)',
  suspend_num: '@integer(0, 10)',
  success_num: '@integer(0, 60)',
  fail_num: '@integer(0, 10)',
  success_rate: '@float(0.6, 0.9, 3, 6)',
  execute_time: '@integer(500, 2000)'
})

module.exports = [
  {
    url: '/api/v1/task/describe_all',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 200,
        data: {
          total: items.length,
          task_list: items
        }
      }
    }
  },
  {
    url: '/api/v1/task/num',
    type: 'get',
    response: config => {
      return {
        code: 200,
        data: {
          task_num: 1250
        }
      }
    }
  },
  {
    url: '/api/v1/task/describe',
    type: 'get',
    response: config => {
      return {
        code: 200,
        data: {
          ...taskDetail
        }
      }
    }
  }
]
