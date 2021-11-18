<template>
  <el-row :gutter="20" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="goto('clusterList')">
        <div class="card-panel-description">
          <div class="card-panel-text">
            活跃集群
          </div>
          <count-to :start-val="0" :end-val="cluster" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="goto('instanceList')">
        <div class="card-panel-description">
          <div class="card-panel-text">
            运行机器
          </div>
          <count-to :start-val="0" :end-val="instance" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="goto('taskList')">
        <div class="card-panel-description">
          <div class="card-panel-text">
            任务数量
          </div>
          <count-to :start-val="0" :end-val="task" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="goto('billing')">
        <div class="card-panel-description">
          <div class="card-panel-text">
            集群运行总时长(小时)
          </div>
          <count-to :start-val="0" :end-val="instanceUsageHour" :duration="3200" class="card-panel-num" :decimals="2"/>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import moment from 'moment'
import { instanceNum, instanceUsageTotal } from '@/api/instance'
import { clusterNum } from '@/api/cluster'
import { taskNum } from '@/api/task'

export default {
  components: {
    CountTo
  },
  computed: {
    instanceUsageHour() {
      return +((this.instanceUsage / 3600).toFixed(2))
    }
  },
  data() {
    return {
      instance: 0,
      cluster: 0,
      task: 0,
      instanceUsage: 0
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.cluster = await clusterNum()
      this.instance = await instanceNum()
      this.task = await taskNum()
      this.instanceUsage = await instanceUsageTotal('', moment().format('YYYY-MM-DD'))
    },
    goto(name) {
      this.$router.push({ name })
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 10px;

  .card-panel-col {
    margin-bottom: 20px;
  }

  .card-panel {
    height: 108px;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 5px rgba(0, 0, 0, .08);
    border-color: rgba(0, 0, 0, .05);

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      font-weight: bold;
      margin: 16px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
      }

      .card-panel-num {
        display: inline-block;
        width: 100%;
        text-align: center;
        font-size: 50px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
