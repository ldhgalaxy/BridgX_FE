import axios from 'axios'

const http = (config) => axios(config).catch((e) => {
  console.log(e)
  return Promise.reject(e.message)
})

// http.interceptors.request.use(
//   config => {
//     config.data = qs.stringify(config.data)
//     config.headers = {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     }
//     return config
//   },
//   err => {
//     return Promise.reject(err)
//   }
// )

export default http
