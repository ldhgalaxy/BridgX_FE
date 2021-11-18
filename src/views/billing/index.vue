<template>
  <div class="billing-container">
    <div class="billing-filter">
      <div class="cluster-filter">
        <span style="margin-right: 20px">集群选择</span>
        <el-select v-model="query.cluster_name" v-el-select-load-more="loadMore" size="medium" @change="fetchData">
          <el-option v-for="item in clusters" :key="item.value" :value="item.value" :label="item.label" />
        </el-select>
      </div>
      <div class="date-filter">
        <span style="margin: 0 20px">日期选择</span>
        <el-select v-model="type" size="medium" style="width: 100px">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-date-picker
          v-model="date"
          size="medium"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
          @change="pickDate"
        />
      </div>
    </div>
    <div class="billing-content">
      <div class="billing-summary">
        <span style="font-size: 20px">{{ date | formatMoment('YYYY-MM-DD') }} 使用时长</span>
        <div class="billing-index">
          <span class="cost">{{ instanceUsageHour }}</span>
          <span class="unit">小时</span>
        </div>
      </div>
      <div class="billing-table">
        <div style="font-size: 20px; padding: 10px">{{ date | formatMoment('YYYY-MM-DD') }} 机器使用时长</div>
        <div style="padding: 10px">
          <el-table v-loading="loading" :data="list" size="medium" border>
            <el-table-column label="序号" prop="id" />
            <el-table-column label="机器名称" prop="instance_id">
              <template slot-scope="{ row }">
                <el-button size="medium" type="text" @click="showDetail(row.instance_id)">{{ row.instance_id }}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="开机时间">
              <template slot-scope="{ row }">
                {{ row.startup_at | formatMomentZone('YYYY-MM-DD HH:mm:ss') }}
              </template>
            </el-table-column>
            <el-table-column label="关机时间">
              <template slot-scope="{ row }">
                {{ row.shutdown_at | formatMomentZone('YYYY-MM-DD  HH:mm:ss') }}
              </template>
            </el-table-column>
            <el-table-column label="服务时长(秒)" prop="startup_time" />
            <el-table-column label="机器类型" prop="instance_type" />
          </el-table>
          <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_number" :limit.sync="listQuery.page_size" @pagination="fetchData" />
        </div>
      </div>
    </div>
    <el-dialog title="机器详情" :visible.sync="dialogVisible">
      <el-row :gutter="20">
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
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import { clusterDescribeAll } from '@/api/cluster'
import { instanceUsageTotal, instanceUsageStatistics, instanceDetail } from '@/api/instance'
import Pagination from '@/components/Pagination'

export default {
  name: 'Index',
  components: { Pagination },
  data() {
    return {
      loading: false,
      clusters: [],
      clusterQuery: {
        page_number: 1,
        page_size: 50
      },
      query: {
        cluster_name: ''
      },
      type: 'byDay',
      typeOptions: [{
        label: '日视图',
        value: 'byDay'
      }],
      defaultDate: '',
      date: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      list: [],
      listQuery: {
        page_number: 1,
        page_size: 10
      },
      total: 0,
      instanceUsage: 0,
      dialogVisible: false,
      detail: {
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
  },
  computed: {
    instanceUsageHour() {
      return (this.instanceUsage / 3600).toFixed(2)
    }
  },
  mounted() {
    this.date = moment()
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      const res = await clusterDescribeAll('', '', '', 1, this.clusterQuery.page_size)
      this.clusters = [{
        value: '',
        label: '全部'
      }, ..._.get(res, 'cluster_list', []).map(i => ({
        value: i.cluster_name,
        label: i.cluster_name
      }))]
      this.instanceUsage = await instanceUsageTotal(this.query.cluster_name, moment(this.date).format('YYYY-MM-DD'))
      const iRes = await instanceUsageStatistics(this.query.cluster_name, moment(this.date).format('YYYY-MM-DD'), this.listQuery.page_number, this.listQuery.page_size)
      this.list = _.get(iRes, 'instance_list', [])
      this.total = _.get(iRes, 'pager.total', 0)
      this.loading = false
    },
    pickDate() {
      this.fetchData()
    },
    async showDetail(id) {
      this.detail = await instanceDetail(id)
      this.dialogVisible = true
    },
    async loadMore() {
      this.clusterQuery.page_number++
      const res = await clusterDescribeAll('', '', '', this.clusterQuery.page_number, this.clusterQuery.page_size)
      this.clusters = _.concat(this.clusters, _.get(res, 'cluster_list', []).map(i => ({
        value: i.cluster_name,
        label: i.cluster_name
      })))
    }
  }
}
</script>

<style lang="less" scoped>
  .billing-container {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 10px 10px 0 10px;
    background-color: rgb(240, 242, 245);
    .billing-filter {
      background-color: #ffffff;
      padding: 20px;
      box-shadow: 4px 4px 5px rgba(0, 0, 0, .08);
      display: flex;
      flex-direction: row;
      .cluster-filter {
      }
      .date-filter {
        align-items: center;
        display: flex;
        flex-direction: row;
      }
    }
    .billing-content {
      display: flex;
      flex-direction: row;
      height: 100%;
      .billing-summary {
        background-color: #ffffff;
        margin: 10px 10px 10px 0;
        padding: 10px;
        box-shadow: 4px 4px 5px rgba(0, 0, 0, .08);
        width: 300px;
        height: 300px;
        .billing-index {
          display: flex;
          height: 100%;
          justify-content: center;
          align-items: center;
          .cost {
            color: mediumpurple;
            font-weight: bolder;
            font-size: 40px;
          }
          .unit {
            margin-left: 5px;
            font-size: 15px;
          }
        }
      }
      .billing-table {
        width: calc(~"100% - 300px");
        height: 100%;
        background-color: #ffffff;
        margin: 10px 0 10px 10px;
        box-shadow: 4px 4px 5px rgba(0, 0, 0, .08);
      }
    }
  }
</style>
