<template>
  <el-table ref="table" :height="height" :data="list" style="width: 100%" border>
    <el-table-column label="任务名" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.task_name }}
      </template>
    </el-table-column>
    <el-table-column label="对应集群">
      <template slot-scope="scope">
        {{ scope.row.cluster_name }}
      </template>
    </el-table-column>
    <el-table-column label="执行状态">
      <template slot-scope="scope">
        {{ scope.row.status | parseTaskStatus }}
      </template>
    </el-table-column>
    <el-table-column label="执行动作">
      <template slot-scope="scope">
        {{ scope.row.task_action | parseTaskAction }}
      </template>
    </el-table-column>
    <el-table-column label="开始执行时间">
      <template slot-scope="scope">
        {{ scope.row.create_at | formatMomentZone('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
    <el-table-column label="执行耗时">
      <template slot-scope="scope">
        {{ scope.row.execute_time | parseMin }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { taskList } from '@/api/task'

export default {
  data() {
    return {
      list: null,
      height: null
    }
  },
  mounted() {
    this.getHeight()
    window.onresize = () => {
      return (() => {
        this.getHeight()
      })()
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await taskList()
      this.list = res.task_list
    },
    getHeight() {
      this.height = this.$refs.table.$el.parentElement.parentElement.clientHeight > 200 ? this.$refs.table.$el.parentElement.parentElement.clientHeight - 50 : 50
    },
    detail() {
    }
  }
}
</script>
