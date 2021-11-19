<template>
  <div style="padding: 10px">
    <el-card>
      <div class="form">
        <div class="container">
          <el-row>
            <el-col :span="5"><div class="center-text">任务名 </div></el-col>
            <el-col :span="19">
              <el-input
                v-model="task.name"
                size="medium"
                type="text"
                style="width: 400px"
                placeholder="请输入任务名"
                maxlength="40"
                show-word-limit
                @blur="checkTaskName"
              />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5"><div style="height: 16px" /></el-col>
            <el-col :span="19">
              <div v-if="taskNameIllegal" class="note" style="color: #f4516c">请输入任务名</div>
              <div v-else class="note">支持中文英文数字，限制40字符</div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="form">
        <div class="container">
          <el-row>
            <el-col :span="5"><div class="center-text">执行集群 </div></el-col>
            <el-col :span="15">
              <el-select v-model="task.cluster_name" placeholder="请选择" style="width: 400px" size="medium" @change="loadInstanceNum">
                <el-option v-for="item in clusters" :key="item" :value="item" :label="item" />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button size="medium" type="primary" @click="addCluster">添加集群</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5"><div style="height: 16px" /></el-col>
            <el-col :span="19"><div class="note">选择要执行扩缩容动作的集群</div></el-col>
          </el-row>
        </div>
      </div>
      <div class="form">
        <div class="container">
          <el-row>
            <el-col :span="5"><div class="center-text">集群当前机器数 </div></el-col>
            <el-col :span="5">
              <div v-loading="instanceNumLoading" class="info-text">
                <span style="color: #f4516c; font-weight: bolder">{{ instanceNum }}</span> 台
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="form">
        <div class="container">
          <el-row>
            <el-col :span="5"><div class="center-text">操作动作 </div></el-col>
            <el-col :span="19">
              <el-radio-group v-model="task.type" size="medium" @change="handleTypeChange">
                <el-radio-button label="expand">扩容</el-radio-button>
                <el-radio-button label="shrink" :disabled="instanceNum < 1">缩容</el-radio-button>
              </el-radio-group>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="form">
        <div class="container">
          <el-row>
            <el-col :span="5"><div class="center-text">变动机器台数 </div></el-col>
            <el-col v-if="task.type === 'expand'" :span="19">
              <el-radio-group v-model="task.num" size="medium">
                <el-radio-button
                  v-for="item in expandNumRadios"
                  :key="item.label"
                  :label="item.label"
                >{{ item.name }}</el-radio-button>
              </el-radio-group>
            </el-col>
            <el-col v-if="task.type === 'shrink'" :span="19">
              <el-radio-group v-model="task.num" size="medium">
                <el-radio-button
                  v-for="item in shrinkNumRadios"
                  :key="item.label"
                  :label="item.label"
                >{{ item.name }}</el-radio-button>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row>
            <el-row>
              <el-col :span="5"><div style="height: 16px" /></el-col>
              <el-col :span="19">
                <el-row style="margin-top: 5px">
                  <el-col :span="2"><div style="display: flex; align-items: center; height: 28px">其他: </div></el-col>
                  <el-col v-if="task.type === 'expand'" :span="22">
                    <el-input-number v-model="task.otherNum" controls-position="right" size="mini" style="width: 100px;" @change="handleChange" /> 台
                  </el-col>
                  <el-col v-if="task.type === 'shrink'" :span="22">
                    <el-input-number v-model="task.otherNum" controls-position="right" size="mini" style="width: 100px;" :max="instanceNum" @change="handleChange" /> 台
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-row>
        </div>
      </div>
      <div class="form">
        <div class="container">
          <el-row>
            <el-col :span="5"><div class="center-text">执行时间 </div></el-col>
            <el-col :span="19">
              <el-button size="medium">立即执行</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="form">
        <div class="container" style="display: flex; justify-content: center">
          <el-button size="medium" type="primary" style="margin-right: 20px" @click="submit">提交</el-button>
          <el-button size="medium" type="info" @click="gotoList">取消</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { clusterExpand, clusterShrink, clusterDescribeAll } from '@/api/cluster'
import { instanceNum } from '@/api/instance'
import _ from 'lodash'

export default {
  name: 'CreateTask',
  data() {
    return {
      instanceNumLoading: false,
      instanceNum: 0,
      expandNumRadios: [{
        label: 1,
        name: '+1'
      }, {
        label: 5,
        name: '+5'
      }, {
        label: 10,
        name: '+10'
      }, {
        label: 50,
        name: '+50'
      }, {
        label: 100,
        name: '+100'
      }, {
        label: 200,
        name: '+200'
      }],
      shrinkNums: [1, 5, 10, 50, 100, 200],
      task: {
        name: '',
        cluster_name: '',
        type: 'expand',
        num: 0,
        otherNum: null
      },
      clusters: [],
      taskNameIllegal: false
    }
  },
  computed: {
    shrinkNumRadios() {
      const nums = [...this.shrinkNums.filter(i => i < this.instanceNum), this.instanceNum]
      return nums.map(i => ({
        label: i,
        name: `-${i}`
      }))
    }
  },
  async mounted() {
    const res = await clusterDescribeAll()
    this.clusters = _.get(res, 'cluster_list', []).map(i => i.cluster_name)
  },
  methods: {
    async loadInstanceNum() {
      this.instanceNumLoading = true
      try {
        this.instanceNum = await instanceNum('', this.task.cluster_name)
      } catch (e) {
        // do nothing
      }
      this.instanceNumLoading = false
    },
    async submit() {
      if (this.task.num === 0 && this.task.otherNum === 0) {
        this.$message.info('执行机器数为0')
        return
      }
      if (this.task.name === '') {
        this.taskNameIllegal = true
        return
      }
      const count = this.task.num === 0 ? this.task.otherNum : this.task.num
      let res
      switch (this.task.type) {
        case 'expand':
          res = await clusterExpand(this.task.cluster_name, this.task.name, count)
          if (res.code === 200) {
            this.$message.success('提交成功')
            this.gotoList()
          }
          break
        case 'shrink':
          res = await clusterShrink(this.task.cluster_name, this.task.name, count)
          if (res.code === 200) {
            this.$message.success('提交成功')
            this.gotoList()
          }
          break
      }
    },
    gotoList() {
      this.$router.push({ name: 'taskList' })
    },
    handleChange() {
      this.task.num = 0
    },
    handleTypeChange() {
      this.task.num = 0
      this.task.otherNum = null
    },
    addCluster() {
      this.$router.push({ name: 'clusterCreate' })
    },
    checkTaskName() {
      this.taskNameIllegal = this.task.name === ''
    }
  }
}
</script>

<style lang="less" scoped>
  .form {
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
    .container {
      width: 700px;
    }
    .center-text {
      font-size: 16px;
      font-weight: bolder;
      height: 36px;
      display: flex;
      padding-right: 30px;
      flex-direction: row-reverse;
      align-items: center;
    }
    .info-text {
      font-size: 16px;
      font-weight: bolder;
      height: 36px;
      display: flex;
      align-items: center;
    }
    .note {
      padding-top: 5px;
      color: rgb(170, 170,170);
    }
  }
</style>
