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

console.log(data)

module.exports = [
  {
    url: '/api/v1/instance/num',
    type: 'get',
    response: config => {
      return {
        code: 200,
        data: {
          instance_num: 400
        }
      }
    }
  }
]
