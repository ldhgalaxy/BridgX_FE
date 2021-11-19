<template>
  <div class="cluster-container">
    <div class="step-container">
      <el-steps :active="step" finish-status="success">
        <el-step title="云厂商" />
        <el-step title="网络配置" />
        <el-step title="机器规格" />
        <el-step title="磁盘" />
      </el-steps>
      <div style="padding-top: 10px">
        <div v-if="step === 0" class="form">
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">集群名称 </div></el-col>
              <el-col :span="19">
                <el-input v-model="cluster.name" size="medium" placeholder="请输入集群名称" maxlength="20" show-word-limit />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5"><div style="height: 16px" /></el-col>
              <el-col :span="19"><div class="note">支持中文、英文、数字，限制20字符</div></el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">集群描述 </div></el-col>
              <el-col :span="19">
                <el-input v-model="cluster.desc" size="medium" placeholder="请输入集群描述信息" maxlength="50" show-word-limit />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5"><div style="height: 16px" /></el-col>
              <el-col :span="19"><div class="note">支持中文、英文、数字，限制50字符</div></el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">云厂商 </div></el-col>
              <el-col :span="19">
                <el-select v-model="cluster.provider" size="medium" placeholder="请选择" @change="loadRegion">
                  <el-option
                    v-for="item in cloudProviders"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">云账号 </div></el-col>
              <el-col :span="19">
                <el-select v-model="cluster.account_key" size="medium"  v-el-select-load-more="loadMore">
                  <el-option v-for="p in accounts" :key="p.account" :label="p.account_name" :value="p.account">
                    <span>{{ p.account_name }}({{ p.account }})</span>
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-if="step === 1" class="form">
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">网络类型 </div></el-col>
              <el-col :span="19">
                <div style="height:36px; display: flex; align-items: center">
                  VPC
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">可用地域 </div></el-col>
              <el-col :span="19">
                <el-select v-model="cluster.region_id" size="medium" placeholder="请选择" style="width: 400px" :disabled="cluster.provider === ''" @change="afterRegionSelected">
                  <el-option
                    v-for="item in regions"
                    :key="item.RegionId"
                    :label="item.LocalName"
                    :value="item.RegionId"
                  />
                </el-select>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">可用区 </div></el-col>
              <el-col :span="19">
                <el-select v-model="cluster.zone_id" :disabled="cluster.region_id === ''" size="medium" style="width: 400px" placeholder="请选择" @change="loadInstanceTypes">
                  <el-option
                    v-for="item in zones"
                    :key="item.ZoneId"
                    :label="item.LocalName"
                    :value="item.ZoneId"
                  />
                </el-select>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">专有网络-VPC </div></el-col>
              <el-col :span="19">
                <el-select v-model="network_config.vpc" :disabled="cluster.region_id === ''" size="medium" style="width: 400px" @change="loadCloud">
                  <el-option
                    v-for="item in vpcs"
                    :key="item.VpcId"
                    :value="item.VpcId"
                    :label="item.VpcName"
                  />
                </el-select>
                <el-button size="medium" type="primary" style="margin-left: 10px; width: 126px" :disabled="cluster.region_id === '' || cluster.account_key === ''" @click="addVpc">添加VPC</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">专有网络-子网 </div></el-col>
              <el-col :span="19">
                <el-select v-model="network_config.subnet_id" size="medium" :disabled="network_config.vpc === ''" style="width: 400px">
                  <el-option
                    v-for="item in subnets"
                    :key="item.SwitchId"
                    :value="item.SwitchId"
                    :label="item.SwitchName"
                  />
                </el-select>
                <el-button size="medium" type="primary" style="margin-left: 10px;" @click="addSubnet">添加网络子网</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">安全组 </div></el-col>
              <el-col :span="19">
                <el-select v-model="network_config.security_group" size="medium" :disabled="network_config.vpc === ''" style="width: 400px">
                  <el-option
                    v-for="item in securityGroups"
                    :key="item.SecurityGroupId"
                    :value="item.SecurityGroupId"
                    :label="item.SecurityGroupName"
                  />
                </el-select>
                <el-button size="medium" type="primary" style="margin-left: 10px;width: 126px" @click="addSecurityGroup">添加安全组</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">公网带宽 </div></el-col>
              <el-col :span="19">
                <div style="height: 36px; display: flex; align-items: center">
                  <el-switch v-model="networkSwitch" active-color="#13ce66" inactive-color="#ff4949" />
                  {{ networkSwitch ? '开启' : '关闭' }}
                  <el-radio-group v-if="networkSwitch" v-model="network_config.internet_charge_type" size="mini" style="margin-left: 20px">
                    <el-radio-button label="PayByBandwidth">固定带宽</el-radio-button>
                    <el-radio-button label="PayByTraffic">按量付费</el-radio-button>
                  </el-radio-group>
                  <span v-if="networkSwitch" style="display: inline-block; margin-left: 20px">带宽</span>
                  <el-input-number v-if="networkSwitch" v-model="network_config.internet_max_bandwidth_out" style="margin-left: 10px" size="mini" :min="10" />
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-if="step === 2" class="form">
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">机型 </div></el-col>
              <el-col :span="19">
                <el-select v-model="cluster.instance_type" size="medium" :disabled="cluster.region_id === '' || cluster.zone_id === ''" style="width: 50%" filterable>
                  <el-option
                    v-for="item in instanceTypes"
                    :key="item.instance_type"
                    :value="item.instance_type"
                    :label="item.instance_type + '(' + item.core + '核' + item.memory + 'G)'"
                  />
                </el-select>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">镜像 </div></el-col>
              <el-col :span="19">
                <!--                <el-radio-group v-model="imageType" size="medium">-->
                <!--                  <el-radio-button label="public">云厂商镜像</el-radio-button>-->
                <!--                  <el-radio-button label="private">自定义镜像</el-radio-button>-->
                <!--                </el-radio-group>-->
                <el-select v-model="cluster.image" size="medium" style="width: 50%">
                  <el-option v-for="i in images" :key="i.ImageId" :value="i.ImageId" :label="i.OsName" />
                </el-select>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">初始密码 </div></el-col>
              <el-col :span="19">
                <el-input v-model="cluster.password" size="medium" style="width: 50%"/>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-if="step === 3" class="form">
          <div class="form-container" style="margin-bottom: 50px">
            <el-row>
              <el-col :span="3"><div class="center-text">系统盘类型 </div></el-col>
              <el-col :span="8">
                <el-select v-model="system_disk.category">
                  <el-option
                    v-for="item in aliyunDiskTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
              <el-col :span="3"><div class="center-text">系统盘容量 </div></el-col>
              <el-col :span="8">
                <el-select v-model="system_disk.size">
                  <el-option
                    v-for="item in systemDiskSizes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
            </el-row>
          </div>
          <div v-for="(item, index) in data_disks" :key="index" class="form-container">
            <el-row>
              <el-col :span="3"><div class="center-text">数据盘类型 </div></el-col>
              <el-col :span="8">
                <el-select v-model="item.category">
                  <el-option
                    v-for="t in aliyunDiskTypes"
                    :key="t.value"
                    :label="t.label"
                    :value="t.value"
                  />
                </el-select>
              </el-col>
              <el-col :span="3"><div class="center-text">数据盘容量 </div></el-col>
              <el-col :span="8">
                <el-select v-model="item.size">
                  <el-option
                    v-for="d in dataDiskSizes"
                    :key="d.value"
                    :label="d.label"
                    :value="d.value"
                  />
                </el-select>
                <el-button v-if="data_disks.length > 1" size="medium" type="text" style="margin-left: 10px" @click="deleteItem(index)">
                  <span style="color: #f4516c">删除</span>
                </el-button>
                <el-button v-if="index === (data_disks.length - 1)" size="medium" type="text" style="margin-left: 10px" @click="addItem">
                  <span>添加</span>
                </el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="buttons">
        <el-button v-if="step !== 0" type="primary" style="margin-top: 12px;" size="medium" @click="previous">上一步</el-button>
        <el-button v-if="step !== 3" type="primary" style="margin-top: 12px;" size="medium" @click="next">下一步</el-button>
        <el-button v-else style="margin-top: 12px;" size="medium" @click="submit">提交</el-button>
        <el-button style="margin-top: 12px;" size="medium" type="info" @click="cancel">取消</el-button>
      </div>
    </div>
    <el-dialog :visible.sync="vpcAddVisible" title="添加VPC">
      <el-form v-model="vpc" label-width="80px">
        <el-form-item label="VPC名称 ">
          <el-input v-model="vpc.vpc_name" size="medium" />
        </el-form-item>
        <el-form-item label="VPC网段 ">
          <el-select v-model="vpc.cidr_block" size="medium">
            <el-option v-for="item in vpcCidrOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <div style="display: flex; justify-content: center">
          <el-button type="primary" size="medium" @click="submitVpc">保存</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="subnetAddVisible" title="添加子网">
      <el-form v-model="subnet" label-width="100px">
        <el-form-item label="交换机名称">
          <el-input v-model="subnet.switch_name" size="medium" />
        </el-form-item>
        <el-form-item label="所属VPC ">
          <el-select v-model="subnet.vpc_id" size="medium">
            <el-option v-for="item in vpcs" :key="item.VpcId" :value="item.VpcId" :label="item.VpcName" />
          </el-select>
        </el-form-item>
        <el-form-item label="交换机网段">
          <el-input v-model="subnet.cidr_block" size="medium" placeholder="172.16.0.0/24" />
        </el-form-item>
        <div style="display: flex; justify-content: center">
          <el-button type="primary" size="medium" @click="submitSubnet">保存</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="securityGroupsAddVisible" title="添加安全组">
      <el-form v-model="securityGroup" label-width="100px">
        <el-form-item label="安全组名称">
          <el-input v-model="securityGroup.security_group_name" size="medium" />
        </el-form-item>
        <div v-for="(item, idx) in rules" :key="idx" style="margin-bottom: 10px">
          <span style="margin-left: 13px">
            传输层协议
          </span>
          <el-select v-model="item.protocol" size="mini" style="width: 100px">
            <el-option v-for="item in protocols" :key="item" :value="item" :label="item" />
          </el-select>
          <span style="margin-left: 20px">端口范围</span>
          <el-input v-model="item.port_from" size="mini" style="width: 50px" /> / <el-input v-model="item.port_to" size="mini" style="width: 50px" />
          <span style="margin-left: 20px">规则方向</span>
          <el-radio-group v-model="item.direction" size="mini">
            <el-radio-button label="ingress" />
            <el-radio-button label="egress" />
          </el-radio-group>
          <el-button v-if="idx === (rules.length - 1)" size="medium" type="text" style="margin-left: 20px" @click="addSecurityRule">增加一条</el-button>
          <el-button v-if="rules.length > 1" size="medium" type="text" style="color: #f4516c; margin-left: 20px" @click="delSecurityRule(idx)">删除</el-button>
        </div>
        <div style="display: flex; justify-content: center">
          <el-button type="primary" size="medium" @click="submitSecurityGroup">保存</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { cloudProviders, aliyunDiskTypes, systemDiskSizes, dataDiskSizes } from '@/config/cloud'
import {
  securityGroupDescribe,
  subnetDescribe,
  vpcDescribe,
  regionList,
  zoneList,
  instanceTypeList,
  vpcCreate,
  subnetCreate,
  securityGroupCreateWithRule,
  imageList,
  cloudAccountList
} from '@/api/cloud'
import { clusterCreate } from '@/api/cluster'
const data_disk_item = {
  category: '',
  size: 50,
  performance_level: ''
}

const rule = {
  protocol: '',
  port_from: '',
  port_to: '',
  direction: 'ingress'
}
export default {
  name: 'Create',
  data() {
    return {
      vpcCidrOptions: ['172.16.0.0/12', '10.0.0.0/8', '192.168.0.0/16'],
      protocols: ['tcp', 'udp', 'icmp', 'gre', 'all'],
      vpcAddVisible: false,
      subnetAddVisible: false,
      securityGroupsAddVisible: false,
      vpc: {
        vpc_name: '',
        cidr_block: ''
      },
      subnet: {
        switch_name: '',
        vpc_id: '',
        cidr_block: ''
      },
      securityGroup: {
        security_group_name: ''
      },
      rules: [{
        ...rule
      }],
      step: 0,
      cloudProviders,
      aliyunDiskTypes,
      systemDiskSizes,
      dataDiskSizes,
      providers: [{
        value: '',
        label: '全部'
      }, ...cloudProviders],
      regions: [],
      zones: [],
      cluster: {
        name: '',
        provider: 'aliyun',
        account_key: '',
        charge_type: 'PostPaid',
        region_id: '',
        zone_id: '',
        instance_type: '',
        image: '',
        password: ''
      },
      network_config: {
        vpc: '',
        subnet_id: '',
        security_group: '',
        internet_charge_type: 'PayByTraffic',
        internet_max_bandwidth_out: 0
      },
      networkSwitch: false,
      system_disk: {
        category: '',
        size: 50,
        performance_level: ''
      },
      data_disks: [{ ...data_disk_item }],
      data_disk_item: {
        category: '',
        size: 0,
        performance_level: ''
      },
      vpcs: [],
      subnets: [],
      securityGroups: [],
      instanceTypes: [],
      images: [],
      accounts: [],
      accountQuery: {
        page_number: 1,
        page_size: 50
      }
    }
  },
  mounted() {
    this.loadRegion()
    this.loadAccounts()
  },
  methods: {
    previous() {
      if (this.step-- < 0) this.step = 0
    },
    next() {
      if (this.step++ > 3) this.step = 0
    },
    async loadRegion() {
      this.regions = await regionList(this.cluster.provider)
    },
    async loadAccounts() {
      const res = await cloudAccountList('', '', '', this.accountQuery.page_number, this.accountQuery.page_size)
      this.accounts = _.get(res, 'account_list', [])
    },
    async loadMore() {
      this.accountQuery.page_number++
      const res = await cloudAccountList('', '', this.accountQuery.page_number, this.accountQuery.page_size)
      this.accounts = _.concat(this.accounts, ..._.get(res, 'account_list', []))
    },
    async afterRegionSelected() {
      await this.loadZoneAndVpc()
      this.cluster.zone_id = ''
    },
    async loadZoneAndVpc() {
      this.zones = await zoneList(this.cluster.provider, this.cluster.region_id)
      this.vpcs = await vpcDescribe(this.cluster.region_id)
      this.images = await imageList(this.cluster.provider, this.cluster.region_id)
    },
    async loadCloud() {
      this.securityGroups = await securityGroupDescribe(this.network_config.vpc)
      this.subnets = await subnetDescribe(this.network_config.vpc)
    },
    async loadInstanceTypes() {
      if (this.cluster.region_id !== '' && this.cluster.zone_id !== '') {
        const data = await instanceTypeList(this.cluster.provider, this.cluster.region_id, this.cluster.zone_id)
        this.instanceTypes = _.orderBy(data, 'core')
      }
    },
    async submit() {
      let network_config
      if (this.networkSwitch) {
        network_config = {
          ...this.network_config
        }
      } else {
        network_config = {
          vpc: this.network_config.vpc,
          subnet_id: this.network_config.subnet_id,
          security_group: this.network_config.security_group
        }
      }
      const data = {
        ...this.cluster,
        network_config,
        storage_config: {
          disks: {
            system_disk: { ...this.system_disk },
            data_disk: this.data_disks
          }
        }
      }
      const res = await clusterCreate(data)
      if (res.data.code === 200) {
        this.$message.success('创建成功')
        this.createDialogVisible = false
        this.$router.push({ name: 'clusterList' })
      }
      this.$router.push({ path: '/cluster/list' })
    },
    cancel() {
      this.$router.push({ name: 'clusterList' })
    },
    deleteItem(idx) {
      this.data_disks = this.data_disks.filter((v, i) => i !== idx)
    },
    addItem() {
      this.data_disks.push({ ...data_disk_item })
    },
    addVpc() {
      this.vpcAddVisible = true
    },
    addSubnet() {
      this.subnetAddVisible = true
    },
    addSecurityGroup() {
      this.securityGroupsAddVisible = true
    },
    async submitVpc() {
      const res = await vpcCreate(this.cluster.provider, this.cluster.region_id, this.vpc.cidr_block, this.vpc.vpc_name, this.cluster.account_key)
      if (res.code === 200) {
        this.$message.success('创建成功!')
      }
      await this.loadZoneAndVpc()
      this.vpcAddVisible = false
    },
    async submitSubnet() {
      const res = await subnetCreate(this.cluster.provider, this.cluster.zone_id, this.subnet.cidr_block, this.subnet.vpc_id, this.subnet.switch_name)
      if (res.code === 200) {
        this.$message.success('创建成功!')
      }
      await this.loadCloud()
      this.subnetAddVisible = false
    },
    addSecurityRule() {
      this.rules.push({ ... rule })
    },
    delSecurityRule(idx) {
      this.rules = this.rules.filter((v, i) => i !== idx)
    },
    async submitSecurityGroup() {
      const res = await securityGroupCreateWithRule(this.cluster.region_id, this.network_config.vpc, this.securityGroup.security_group_name, this.rules)
      if (res.code === 200) {
        this.$message.success('创建成功!')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .cluster-container {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 10px 10px 0 10px;
    background-color: rgb(240, 242, 245);
    .step-container {
      box-shadow: 4px 4px 5px rgba(0, 0, 0, .08);
      background-color: #ffffff;
      padding: 20px;
    }
    .buttons {
      display: flex;
      flex-direction: row;
      justify-content:flex-end;
    }
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .form-container {
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      width: 80%;
    }
    .center-text {
      font-size: 16px;
      font-weight: bolder;
      height: 36px;
      display: flex;
      padding-right: 30px;
      justify-content: flex-end;
      align-items: center;
    }
    .note {
      padding-top: 5px;
      color: rgb(170, 170,170);
    }
    .buttons {
      display: flex;
      flex-direction: row;
      justify-content:flex-end;
    }
  }
</style>
