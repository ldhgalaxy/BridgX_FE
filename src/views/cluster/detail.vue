<template>
  <div>
    <el-card>
      <el-tabs v-model="activeName">
        <div style="margin-bottom: 20px; float: right">
          <el-button size="medium" type="primary" :loading="downloading" @click="handleDownload">导出Excel</el-button>
        </div>
        <el-tab-pane label="机器列表" name="instance">
          <el-table :data="instanceList" border>
            <el-table-column align="center" prop="instance_id" label="机器名" />
            <el-table-column align="center" label="IP">
              <template slot-scope="{row}">
                <div v-if="row.ip_inner !== ''">
                  {{ row.ip_inner }}(内网)
                </div>
                <div v-if="row.ip_outer !== ''">
                  {{ row.ip_outer }}(公网)
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="机型">
              <template slot-scope="{row}">{{ row.instance_type }}</template>
            </el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="{row}">{{ row.status | formatInstanceStatuses }}</template>
            </el-table-column>
            <el-table-column align="center" label="登录名"></el-table-column>
            <el-table-column align="center" label="密码"></el-table-column>
          </el-table>
          <pagination v-show="instanceTotal>0" :total="instanceTotal" :page.sync="instanceListQuery.page_number" :limit.sync="instanceListQuery.page_size" @pagination="fetchData" />
        </el-tab-pane>
        <el-tab-pane label="系统镜像" name="image">系统镜像</el-tab-pane>
        <el-tab-pane label="扩缩容历史" name="el">扩缩容历史</el-tab-pane>
        <el-tab-pane label="基础信息" name="fourth">基础信息</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
import Pagination from '@/components/Pagination'
import { instanceDescribeAll } from '@/api/instance'

export default {
  name: 'Detail',
  components: { Pagination },
  data() {
    return {
      instanceList: [],
      activeName: 'instance',
      instanceListQuery: {
        page_size: 10,
        page_number: 1
      },
      instanceTotal: 0,
      downloading: false
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      if (this.$route.params.name !== '') {
        const res = await instanceDescribeAll('', '', '', '', this.$route.params.name, this.instanceListQuery.page_number, this.instanceListQuery.page_size)
        this.instanceList = _.get(res, 'instance_list', [])
        this.instanceTotal = _.get(res, 'pager.total', 0)
      }
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['机器名', '内网IP', '公网IP', '机型', '状态', '登录名', '密码']
        const filterVal = ['instance_id', 'ip_inner', 'ip_outer', 'instance_type', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'instance-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.instanceList.map(v => filterVal.map(j => _.get(v, j, '')))
    }
  }
}
</script>

<style lang="less" scoped>

</style>
