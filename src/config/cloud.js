const cloudProviders = [{
  value: 'aliyun',
  label: '阿里云'
}]

const aliyunDiskTypes = [{
  value: 'cloud_efficiency',
  label: '高效云盘'
}, {
  value: 'cloud_ssd',
  label: 'SSD云盘'
}, {
  value: 'cloud_essd',
  label: 'ESSD云盘'
}]

const ramUrl = {
  aliyun: 'https://ram.console.aliyun.com/manage/ak'
}

const systemDiskSizes = [{
  value: '50',
  label: '50G'
}, {
  value: '100',
  label: '100G'
}, {
  value: '200',
  label: '200G'
}]

const dataDiskSizes = [{
  value: '50',
  label: '50G'
}, {
  value: '500',
  label: '500G'
}, {
  value: '1000',
  label: '1T'
}, {
  value: '2000',
  label: '2T'
}]

const aksk = {
  aliyun: {
    key: 'AccessKey',
    secret: 'AccessKey Secret'
  }
}

const taskStatus = [{
  label: '待执行',
  value: 'INIT'
}, {
  label: '执行成功',
  value: 'SUCCESS'
}, {
  label: '执行中',
  value: 'RUNNING'
}, {
  label: '执行失败',
  value: 'FAILED'
}]

export {
  cloudProviders,
  aliyunDiskTypes,
  aksk,
  taskStatus,
  systemDiskSizes,
  dataDiskSizes,
  ramUrl
}
