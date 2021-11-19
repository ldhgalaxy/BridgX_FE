<template>
  <div>
    <el-row :gutter="20" class="instance-detail-row">
      <el-col :span="4"><b>实例ID</b></el-col>
      <el-col :span="8"><div style="height: 16px">{{ detail.instance_id }}</div></el-col>
      <el-col :span="4"><b>创建时间</b></el-col>
      <el-col :span="8"><div style="height: 16px">{{ detail.create_at | formatMomentZone('YYYY-MM-DD HH:mm:ss') }}</div></el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 10px">
      <el-col :span="4"><b>云厂商</b></el-col>
      <el-col :span="8"><div style="height: 16px">{{ detail.provider }}</div></el-col>
      <el-col :span="4"><b>镜像ID</b></el-col>
      <el-col :span="8"><div style="height: 16px">{{ detail.image_id }}</div></el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 10px">
      <el-col :span="4"><b>示例规格</b></el-col>
      <el-col :span="8"><div style="height: 16px">{{ detail.instance_type }}</div></el-col>
      <el-col :span="4"><b>数据盘个数</b></el-col>
      <el-col :span="8"><div style="height: 16px">{{ detail.storage_config.data_disk_num }}</div></el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 10px">
      <el-col :span="4"><b>系统盘类型</b></el-col>
      <el-col :span="8"><div style="height: 16px">{{ detail.storage_config.system_disk_type }}</div></el-col>
      <el-col :span="4"><b>系统盘大小</b></el-col>
      <el-col :span="8"><div style="height: 16px">{{ detail.storage_config.system_disk_size }}</div></el-col>
    </el-row>
    <el-row v-for="(i, idx) in detail.storage_config.data_disks" :key="idx" :gutter="20" style="margin-top: 10px">
      <el-col :span="4"><b>数据盘类型</b></el-col>
      <el-col :span="8"><div style="height: 16px">{{ i.data_disk_type }}</div></el-col>
      <el-col :span="4"><b>数据盘大小</b></el-col>
      <el-col :span="8"><div style="height: 16px">{{ i.data_disk_size }}</div></el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 10px">
      <el-col :span="4"><b>VPC名称</b></el-col>
      <el-col :span="8"><div style="height: 16px">{{ detail.network_config.vpc_name }}</div></el-col>
      <el-col :span="4"><b>子网名称</b></el-col>
      <el-col :span="8"><div style="height: 16px">{{ detail.network_config.subnet_id_name }}</div></el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 10px">
      <el-col :span="4"><b>内网IP</b></el-col>
      <el-col :span="8"><div style="height: 16px">{{ detail.ip_inner }}</div></el-col>
      <el-col :span="4"><b>安全组名称</b></el-col>
      <el-col :span="8"><div style="height: 16px">{{ detail.network_config.security_group_name }}</div></el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 10px">
      <el-col :span="4"><b>公网IP</b></el-col>
      <el-col :span="8"><div style="height: 16px">{{ detail.ip_outer }}</div></el-col>
      <el-col :span="4"><div style="height: 16px" /></el-col>
      <el-col :span="8"><div style="height: 16px" /></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Detail',
  props: {
    detail: {
      type: Object,
      default() {
        return {
          create_at: null,
          instance_id: '',
          provider: '',
          region_id: '',
          image_id: '',
          instance_type: '',
          storage_config: {
            system_disk_type: '',
            system_disk_size: 0,
            data_disk_type: '',
            data_disk_size: 0,
            data_disk_num: 0
          },
          network_config: {
            vpc_name: '',
            subnet_id_name: '',
            security_group_name: ''
          },
          ip_outer: '',
          ip_inner: ''
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .instance-detail-row {
  }
  .instance-detail-title {

  }
</style>
