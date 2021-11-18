<template>
  <div class="container">
    <div class="header">
      <div class="search">
        <div class="search-item">
          <span class="label">任务名</span>
          <el-input v-model="search.taskName" size="medium" placeholder="输入任务名搜索" clearable style="width: 200px" @change="fetchData" />
        </div>
        <div class="search-item">
          <span class="label">执行集群</span>
          <el-select v-model="search.cluster" v-el-select-load-more="loadMore" size="medium" @change="fetchData">
            <el-option v-for="item in clusterOptions" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </div>
        <div class="search-item">
          <span class="label">执行状态</span>
          <el-select v-model="search.status" size="medium" @change="fetchData">
            <el-option v-for="item in allTaskStatus" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-button size="medium" type="primary" @click="createTask">+新建</el-button>
      </div>
      <div class="table">
        <el-table
          v-loading="listLoading"
          :data="list"
          border
          highlight-current-row
          style="width: 100%;"
          size="medium"
          @selection-change="handleSelectionChange"
        >
          <el-table-column label="ID"><template slot-scope="scope">{{ scope.row.task_id }}</template></el-table-column>
          <el-table-column label="任务名">
            <template slot-scope="scope">
              <el-button type="text" @click="showDetail(scope.row)">{{ scope.row.task_name }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="执行状态">
            <template slot-scope="scope">
              {{ scope.row.task_status | parseTaskStatusRoughly }}
            </template>
          </el-table-column>
          <el-table-column label="执行集群">
            <template slot-scope="scope">
              {{ scope.row.cluster_name }}
            </template>
          </el-table-column>
          <el-table-column label="执行动作"><template slot-scope="{ row }">{{ row.task_action | parseTaskActionIcon }}</template></el-table-column>
          <el-table-column label="执行结果">
            <template slot-scope="{ row }">
              <span v-if="row.task_status === 'SUCCESS'" style="color: rgb(0,168,67)">成功</span>
              <span v-else-if="row.task_status === 'FAILED'" style="display: inline-block; background-color: #f4516c; color: white; padding: 2px 5px; border-radius: 10px">失败</span>
              <el-progress v-else :text-inside="true" :stroke-width="20" :percentage="getPercent(row.success_num, row.total_num)" />
            </template>
          </el-table-column>
          <el-table-column label="失败/成功/全量">
            <template slot-scope="{row}">
              <span style="color: #f4516c">{{ row.fail_num }}</span> /
              <span style="color:rgb(0,168,67)">{{ row.success_num }}</span> /
              <span style="color:black">{{ row.total_num }}</span>
            </template>
          </el-table-column>
          <el-table-column label="执行时间">
            <template slot-scope="scope">
              {{ scope.row.create_at | formatMomentZone('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="instancesDetail(scope.row)">执行明细</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_number" :limit.sync="listQuery.page_size" @pagination="fetchData" />
      </div>
    </div>
    <el-dialog :visible.sync="detailDialogVisible" title="任务详情">
      <div class="detail-container">
        <div class="title">
          {{ taskDetail.task_name }}
        </div>
        <div class="detail-content">
          <el-row>
            <el-col :span="4"><span class="detail-label">ID: </span></el-col>
            <el-col :span="8"><div class="detail-value">{{ taskDetail.task_id }}</div></el-col>
            <el-col :span="4"><span class="detail-label">执行集群: </span></el-col>
            <el-col :span="8"><div class="detail-value">{{ taskDetail.cluster_name }}</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="4"><span class="detail-label">变更动作: </span></el-col>
            <el-col :span="8"><div class="detail-value">{{ taskDetail.task_action | parseTaskAction }}</div></el-col>
            <el-col :span="4"><span class="detail-label">变更机器数: </span></el-col>
            <el-col :span="8"><div class="detail-value">{{ taskDetail.total_num }}</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="4"><span class="detail-label">执行时间: </span></el-col>
            <el-col :span="8"><div class="detail-value">{{ taskDetail.create_at | formatMomentZone('YYYY-MM-DD HH:mm:ss') }}</div></el-col>
            <el-col :span="4" />
            <el-col :span="8" />
          </el-row>
        </div>
        <div class="detail-button"><el-button type="primary" size="medium" @click="closeDetail">关闭</el-button></div>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="instancesDialogVisible" title="执行明细" width="80%">
      <div class="detail-container">
        <div class="title">
          {{ taskDetail.task_name }}
        </div>
        <div class="detail-content">
          <el-table v-loading="instanceLoading" :data="instances" size="mini" border>
            <el-table-column label="IP">
              <template slot-scope="{ row }">
                {{ row.ip_inner }}
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="{ row }">
                {{ row.status | formatInstanceStatuses }}
              </template>
            </el-table-column>
            <el-table-column label="开始时间">
              <template slot-scope="{ row }">
                {{ row.create_at | formatMomentZone('YYYY-MM-DD HH:mm:ss') }}
              </template>
            </el-table-column>
            <el-table-column label="耗时">
              <template slot-scope="{ row }">
                {{ row.startup_time | parseMin }}
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="instanceTotal>0" :total="instanceTotal" :page.sync="instancesQuery.page_number" :limit.sync="instancesQuery.page_size" @pagination="getInstances" />
        </div>
        <div class="detail-button" style="margin-top: 20px">
          <el-button type="primary" size="medium" @click="closeInstances">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { clusterDescribeAll } from '@/api/cluster'
import { taskDescribeAll, taskInstances } from '@/api/task'
import { taskStatus } from '@/config/cloud'
import Pagination from '@/components/Pagination'

export default {
  name: 'TaskList',
  components: { Pagination },
  filters: {
    percentFilter(num) {
      return Math.round(num * 100)
    }
  },
  data() {
    return {
      test: '',
      allTaskStatus: [
        {
          value: '',
          label: '全部'
        },
        ...taskStatus
      ],
      listLoading: false,
      list: [],
      detailDialogVisible: false,
      instancesDialogVisible: false,
      instanceLoading: false,
      taskDetail: {},
      task: {
        cluster_name: '',
        run_mode: '',
        type: '',
        count: 0
      },
      search: {
        taskName: '',
        cluster: '',
        status: ''
      },
      clusterOptions: [],
      listQuery: {
        page_number: 1,
        page_size: 10
      },
      clusterQuery: {
        page_number: 1,
        page_size: 50
      },
      total: 0,
      selectTasks: [],
      instances: [],
      instancesQuery: {
        page_number: 1,
        page_size: 10
      },
      instanceTotal: 0
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      const res = await taskDescribeAll(this.search.taskName, this.search.cluster, this.search.status, this.listQuery.page_number, this.listQuery.page_size)
      this.list = res.task_list
      this.total = res.pager.total
      const cRes = await clusterDescribeAll('', '', '', 1, this.clusterQuery.page_size)
      this.clusterOptions = [{
        value: '',
        label: '全部'
      }, ..._.get(cRes, 'cluster_list', []).map(i => ({
        value: i.cluster_name,
        label: i.cluster_name
      }))]
      this.listLoading = false
    },
    resetSearch() {
      this.search = {
        taskName: '',
        cluster: '',
        status: ''
      }
    },
    handleSelectionChange(val) {
      this.selectTasks = val
    },
    createTask() {
      this.$router.push({ name: 'createTask' })
    },
    showDetail(task) {
      this.detailDialogVisible = true
      this.taskDetail = task
    },
    closeDetail() {
      this.detailDialogVisible = false
    },
    closeInstances() {
      this.instancesDialogVisible = false
    },
    instancesDetail(task) {
      this.taskDetail = task
      this.instancesDialogVisible = true
      this.getInstances()
    },
    async getInstances() {
      this.instanceLoading = true
      const res = await taskInstances(this.taskDetail.task_id, '', this.instancesQuery.page_number, this.instancesQuery.page_size)
      this.instances = _.get(res, 'instance_list', [])
      this.instanceTotal = _.get(res, 'pager.total', 0)
      this.instanceLoading = false
    },
    async loadMore() {
      this.clusterQuery.page_number++
      const res = await clusterDescribeAll('', '', '', this.clusterQuery.page_number, this.clusterQuery.page_size)
      this.clusterOptions = _.concat(this.clusterOptions, _.get(res, 'cluster_list', []).map(i => ({
        value: i.cluster_name,
        label: i.cluster_name
      })))
    },
    getPercent(success, total) {
      if (total === 0) {
        return 0
      }
      const percent = Math.round(success / total) * 100
      return percent > 100 ? 100 : percent
    }
  }
}
</script>

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
  .detail-container {
    .title {
      font-weight: bolder;
      font-size: 20px;
      padding: 0 10px 30px 10px;
    }
    .detail-content {
      padding: 10px;
      .detail-label {
        color: rgb(181, 181, 184);
      }
      .detail-value {
        height: 46px;
      }
    }
    .detail-button {
      display: flex;
      justify-content: center;
    }
  }
</style>
