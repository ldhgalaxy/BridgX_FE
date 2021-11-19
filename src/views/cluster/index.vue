<template>
  <div class="container">
    <div class="header">
      <div class="search">
        <div class="search-item">
          <span class="label">集群名</span>
          <el-input v-model="search.cluster_name" size="medium" placeholder="输入集群名称搜索" clearable style="width: 200px" @change="fetchData" />
        </div>
        <div class="search-item">
          <span class="label">云厂商</span>
          <el-select v-model="search.provider" size="medium" @change="fetchData">
            <el-option v-for="p in providers" :key="p.value" :label="p.label" :value="p.value" />
          </el-select>
        </div>
        <div class="search-item">
          <span class="label">Access Key</span>
          <el-select v-model="search.ak" v-el-select-load-more="loadMore" size="medium" @change="fetchData">
            <el-option v-for="p in accounts" :key="p.account" :label="p.account_name" :value="p.account" />
          </el-select>
        </div>
      </div>
      <div class="buttons">
        <el-button size="medium" type="primary" @click="fetchData">查询</el-button>
        <el-button size="medium" @click="resetSearch">重置</el-button>
      </div>
    </div>
    <div class="content">
      <div class="buttons">
        <el-button size="medium" type="primary" @click="handleCreate">+创建集群</el-button>
        <el-button size="medium" :disabled="selectClusters.length !== 1" @click="edit">编辑</el-button>
        <el-button size="medium" :disabled="selectClusters.length < 1" @click="handleDelete">删除</el-button>
      </div>
      <div class="table">
        <el-table
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          size="medium"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="序号" prop="cluster_id" align="center" />
          <el-table-column label="集群名称" min-width="100px" align="center">
            <template slot-scope="{row}">
              <el-button size="medium" @click="gotoInfo(row.cluster_name)" type="text">{{ row.cluster_name }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="在线机器数" prop="instance_count" align="center" />
          <el-table-column label="云厂商" width="150px" align="center">
            <template slot-scope="{row}">
              {{ row.provider | filterCloudProvider }}
            </template>
          </el-table-column>
          <el-table-column label="云账号Key" min-width="100px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.account }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建人" prop="create_by" align="center" />
          <el-table-column label="创建时间" class-name="status-col" width="160" align="center">
            <template slot-scope="{row}">
              <span>
                {{ row.create_at | formatMomentZone('YYYY-MM-DD HH:mm:ss') }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="集群描述" align="center" />
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_number" :limit.sync="listQuery.page_size" @pagination="fetchData" />
      </div>
    </div>
    <el-dialog :visible.sync="detailDialogVisible" title="集群详情">
      <div>
        <el-divider />
        <el-row :gutter="20">
          <el-col :span="4"><b>名称</b></el-col>
          <el-col :span="8"><div style="height: 16px">{{ clusterDetail.name }}</div></el-col>
          <el-col :span="4"><b>云厂商</b></el-col>
          <el-col :span="8"><div style="height: 16px">{{ clusterDetail.provider }}</div></el-col>
          <el-col :span="4"><b>描述</b></el-col>
          <el-col :span="8"><div style="height: 16px">{{ clusterDetail.desc }}</div></el-col>
          <el-col :span="4"><b>创建时间</b></el-col>
          <el-col :span="8"><div style="height: 16px">{{ clusterDetail.create_at }}</div></el-col>
          <el-col :span="4"><b>机型</b></el-col>
          <el-col :span="8"><div style="height: 16px">{{ clusterDetail.instance_type }}</div></el-col>
          <el-col :span="4"><b>镜像</b></el-col>
          <el-col :span="8"><div style="height: 16px">{{ clusterDetail.image }}</div></el-col>
          <el-col :span="4"><b>系统盘类型</b></el-col>
          <el-col :span="8"><div style="height: 16px">{{ clusterDetail.storage_config.disks.system_disk.category }}</div></el-col>
          <el-col :span="4"><b>系统盘大小</b></el-col>
          <el-col :span="8"><div style="height: 16px">{{ clusterDetail.storage_config.disks.system_disk.size }}</div></el-col>
          <el-col v-if="clusterDetail.storage_config.disks.data_disk.length > 0" :span="4"><b>数据盘类型</b></el-col>
          <el-col v-if="clusterDetail.storage_config.disks.data_disk.length > 0" :span="8">
            <div style="height: 16px">
              {{ clusterDetail.storage_config.disks.data_disk[0].category }}
            </div>
          </el-col>
          <el-col v-if="clusterDetail.storage_config.disks.data_disk.length > 0" :span="4"><b>数据盘大小</b></el-col>
          <el-col v-if="clusterDetail.storage_config.disks.data_disk.length > 0" :span="8">
            <div style="height: 16px">{{ clusterDetail.storage_config.disks.data_disk[0].size }}</div>
          </el-col>
          <el-col v-if="clusterDetail.storage_config.disks.data_disk.length > 0" :span="4"><b>数据盘数量</b></el-col>
          <el-col v-if="clusterDetail.storage_config.disks.data_disk.length > 0" :span="8"><div style="height: 16px">{{ clusterDetail.storage_config.disks.data_disk.length }}</div></el-col>
        </el-row>
        <el-divider />
        <el-row :gutter="20">
          <el-col :span="24"><span style="font-size: larger; font-weight: bolder; color: #2c3e50">网络选项</span></el-col>
          <el-col :span="4"><b>专有网络</b></el-col>
          <el-col :span="8">{{ clusterDetail.network_config.vpc }}</el-col>
          <el-col :span="4"><b>子网</b></el-col>
          <el-col :span="8">{{ clusterDetail.network_config.subnet_id }}</el-col>
          <el-col :span="4"><b>安全组</b></el-col>
          <el-col :span="8">{{ clusterDetail.network_config.security_group }}</el-col>
        </el-row>
        <el-divider />
        <el-row :gutter="20">
          <el-col :span="24"><span style="font-size: larger; font-weight: bolder; color: #2c3e50">地域选项</span></el-col>
          <el-col :span="4"><b>地域</b></el-col>
          <el-col :span="8">{{ clusterDetail.region_id }}</el-col>
          <el-col :span="4"><b>可用区</b></el-col>
          <el-col :span="8">{{ clusterDetail.zone_id }}</el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
  .container {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 10px 10px 0 10px;
    background-color: rgb(240, 242, 245);
    .header {
      background-color: #ffffff;
      padding: 20px;
      box-shadow: 4px 4px 5px rgba(0, 0, 0, .08);
      display: flex;
      flex-direction: row;
      .search {
        display: flex;
        flex-basis: 100%;
        .search-item {
          display: flex;
          margin-right: 40px;
          .label {
            display: flex;
            align-items: center;
            padding: 0 20px;
          }
        }
      }
      .buttons {
        display: flex;
        width: 200px;
      }
    }
    .content {
      margin-top: 20px;
      background-color: #ffffff;
      padding: 20px;
      box-shadow: 4px 4px 5px rgba(0, 0, 0, .08);
      .buttons {
        button {
          margin-right: 40px;
        }
      }
      .table {
        margin-top: 10px;
      }
    }
  }
</style>

<script>
import { clusterDescribeAll, clusterDelete } from '@/api/cluster'
import { cloudAccountList } from '@/api/cloud'
import { cloudProviders, aliyunDiskTypes } from '@/config/cloud'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import _ from 'lodash'

export default {
  name: 'Cluster',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      cloudProviders,
      aliyunDiskTypes,
      providers: [{
        value: '',
        label: '全部'
      }, ...cloudProviders],
      accounts: [],
      list: null,
      total: 0,
      listLoading: true,
      search: {
        cluster_name: '',
        provider: '',
        ak: ''
      },
      listQuery: {
        page_number: 1,
        page_size: 10
      },
      selectClusters: [],
      dialogFormVisible: false,
      createDialogVisible: false,
      detailDialogVisible: false,
      step: 0,
      clusterDetail: {
        storage_config: {
          disks: {
            system_disk: {
              category: '',
              size: 0
            },
            data_disk: [{
              category: '',
              size: 0
            }]
          }
        },
        network_config: {}
      },
      accountQuery: {
        page_number: 1,
        page_size: 50
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      const cRes = await cloudAccountList('', '', '', this.accountQuery.page_number, this.accountQuery.page_size)
      this.accounts = [{
        account: '',
        account_name: '全部'
      }, ..._.get(cRes, 'account_list', [])]
      const res = await clusterDescribeAll(this.search.cluster_name, this.search.provider, this.search.ak, this.listQuery.page_number, this.listQuery.page_size)
      this.list = _.get(res, 'cluster_list', [])
      this.total = res.pager.total
      this.listLoading = false
    },
    resetSearch() {
      this.search = {
        clusterName: '',
        ak: '',
        provider: ''
      }
    },
    handleSelectionChange(val) {
      this.selectClusters = val
    },
    async showDetail(row) {
    },
    edit() {
      this.$router.push({ path: `/cluster/edit/${this.selectClusters[0].cluster_name}` })
    },
    handleFilter() {
      this.listQuery.page_number = 1
      this.fetchData()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    handleCreate() {
      this.$router.push({ name: 'clusterCreate' })
    },
    gotoInfo(name) {
      this.$router.push({ name: 'clusterInfo', params: { name }})
    },
    async handleDelete() {
      const res = await clusterDelete(this.selectClusters.map(i => i.cluster_id))
      if (res.code === 200) {
        this.$message.success('删除成功')
      }
      await this.fetchData()
    },
    async loadMore() {
      this.accountQuery.page_number++
      const res = await cloudAccountList('', '', this.accountQuery.page_number, this.accountQuery.page_size)
      this.accounts = _.concat(this.accounts, ..._.get(res, 'account_list', []))
    }
  }
}
</script>
