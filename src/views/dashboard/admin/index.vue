<template>
  <div class="dashboard-editor-container">
    <div class="container">
      <div class="top">
        <div class="info">
          <panel-group />
          <div class="table-card">
            <el-row ref="elLow" style="height: 100%">
              <span style="font-size: 16px; color: darkgrey; font-weight: bolder">
                任务信息
              </span>
              <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 24}" :xl="{span: 12}" style="margin-top: 20px">
                <transaction-table />
              </el-col>
            </el-row>
          </div>
        </div>
<!--        <div class="message">-->
<!--          <div class="title">-->
<!--            异常告警-->
<!--          </div>-->
<!--        </div>-->
      </div>
      <div class="bottom">
        <div class="crafting-table">
          工作台
        </div>
        <div class="divider" />
        <div class="crafting-item" @click="goto('createTask')">
          <svg class="crafting-svg">
            <use xlink:href="#icon-expand" />
          </svg>
          <span>扩容</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import expand from '../../../icons/svg/expand.svg'
import PanelGroup from './components/PanelGroup'
import TransactionTable from './components/TransactionTable'
export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    TransactionTable
  },
  data() {
    return {
      expand
    }
  },
  methods: {
    goto(name) {
      this.$router.push({ name })
    }
  }
}
</script>

<style lang="less" scoped>
.dashboard-editor-container {
  padding: 10px 10px 0 10px;
  background-color: rgb(240, 242, 245);
  position: relative;
  height: 100%;
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    .top {
      height: 100%;
      display: flex;
      flex-direction: row;
      flex-basis: 100%;
      .info {
        width: 100%;
        //flex-basis: 100%;
        .table-card {
          background-color: #ffffff;
          padding: 10px;
          box-shadow: 4px 4px 5px rgba(0, 0, 0, .08);
          height: calc(~"100% - 148px");
        }
      }
      //.message {
      //  flex-basis: 200px;
      //  color: #666;
      //  background: #fff;
      //  box-shadow: 4px 4px 5px rgba(0, 0, 0, .08);
      //  margin: 10px 0 10px 10px;
      //  .title {
      //    padding: 5px;
      //    font-weight: bold;
      //  }
      //}
    }
    .bottom {
      display: flex;
      background-color: #2c3e50;
      height: 100px;
      flex-direction: row;
      .crafting-table {
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        height: 100%;
        width: 100px;
        font-size: 20px;
        font-weight: bolder;
      }
      .crafting-item {
        display: flex;
        cursor: pointer;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100px;
        height: 100%;
        .crafting-svg {
          height: 65%;
          width: 65%;
        }
        span {
          color: white;
        }
      }
      .divider {
        display: inline-block;
        width: 2px;
        height: 80px;
        margin: 10px 8px;
        vertical-align: middle;
        position: relative;
        background-color: #DCDFE6;
      }
    }
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
