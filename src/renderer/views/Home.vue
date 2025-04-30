<template>
  <div class="home">
    <button @click="getAll">获取所有串口列表</button>
    <el-form :model="formObject" label-width="140px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="选择串口">
            <el-select v-model="formObject.selectedPort" placeholder="请选择串口">
              <el-option v-for="port in list" :key="port" :label="port" :value="port" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="9路电流转换系数">
            <el-input v-for="count in 9" :key="count" v-model="formObject[`ki${count}`]" :min="0" :max="100"
              :step="0.01" :placeholder="`ki${count}`" style="margin: 0 8px 4px 0;display: inline-block;width: 80px;" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="9路电压转换系数">
            <el-input v-for="count in 9" :key="count" v-model="formObject[`kv${count}`]" :min="0" :max="100"
              :step="0.01" :placeholder="`kv${count}`" style="margin: 0 8px 4px 0;display: inline-block;width: 80px;" />
          </el-form-item>
        </el-col>
        <el-col v-for="column in columns" :key="column.prop" :span="column.span || 12">
          <el-form-item :label="column.label" :prop="column.prop">
            <el-input v-model="formObject[column.prop]" :type="column.type" :placeholder="`请输入${column.label}`"
              clearable />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <el-button type="primary" size="large">测 试</el-button>
    <!-- <router-link to="/about" class="nav-link">About</router-link> -->
  </div>
</template>

<script setup>
const { ipcRenderer } = require('electron')
import { onMounted, reactive, shallowRef } from "vue";
import { ElButton, ElRow, ElCol, ElForm, ElFormItem, ElSelect, ElOption, ElInput, ElInputNumber } from 'element-plus'
// import { ipcRenderer } from "electron"
const list = shallowRef([]);

const columns = [
  { label: "用户名", prop: "device_name", type: "string", span: 12 },
  { label: "密码", prop: "product_key", type: "passward", span: 12 },
  { label: "属性主题", prop: "topic_property", type: "string", span: 12 },
  { label: "报警主题", prop: "topic_alarm", type: "string", span: 12 },
  { label: "参数配置服务主题", prop: "topic_param", type: "string", span: 12 },
  { label: "总召数据服务主题", prop: "topic_zzsj", type: "string", span: 12 },
  { label: "上位机IP", prop: "iot_ip", type: "string", span: 12 },
  { label: "上位机端口", prop: "iot_port", type: "string", span: 12 },
  { label: "设备序列号(SN_ID)", prop: "sn_id", type: "string", span: 12 },
  { label: "开发板网口IP", prop: "net_ip", type: "string", span: 12 },
  { label: "开发板网口掩码", prop: "net_mask", type: "string", span: 12 },
  { label: "开发板网口网关", prop: "gate_way", type: "string", span: 12 },
  { label: "电压阈值", prop: "alarm_voltage", type: "number", span: 12 },
  { label: "电流阈值", prop: "alarm_current", type: "number", span: 12 },
  { label: "上报时间", prop: "up_time", type: "dateTime", span: 12 },
]

// ki{1-9} kv{1-9}
const formObject = reactive({
  device_name: "", // 用户名(string) 示例：chenyuxi
  product_key: "", // 密码(string) 示例：801b71551ca34fdea59022016088fa01
  topic_property: "", // 属性主题(string) 示例：/sys/A9ZP1x4n/chenyuxi/thing/event/property/post
  topic_alarm: "", // 报警主题(string) 示例：/sys/A9ZP1x4n/chenyuxi/thing/event/property/post
  topic_param: "", // 参数配置服务主题(string) 示例: /sys/A9ZP1x4n/chenyuxi/thing/service/cspz
  topic_zzsj: "", // 总召数据服务主题(string) 示例: /sys/A9ZP1x4n/chenyuxi/thing/service/zzsj
  iot_ip: "", // 上位机IP(MQTT)(string) 示例: 192.168.11.18
  iot_port: "", // 上位机端口(string) 示例: 1883
  sn_id: "", // 设备序列号(string) 示例: sn-1744849752705
  net_ip: "", // 开发板网口IP(string) 示例: : 192.168.11.108
  net_mask: "", // 开发板网口掩码(string) 示例:255.255.248.0
  gate_way: "", // 开发板网口网关(string) 示例:192.168.11.0
  alarm_voltage: undefined, // 电压阈值(int) 示例: 110
  alarm_current: undefined, // 电流阈值(int) 示例: 10
  up_time: undefined, // 上报时间(int)
  selectedPort: null,
});
const getAll = async () => {
  try {
    const ports = await ipcRenderer.invoke("load-device-serial-ports");
    console.log({ ports });

    list.value = ports;
  } catch (error) {
    console.error('获取串口列表失败:', error);
  }
}

onMounted(() => {
  getAll();
})
</script>

<style scoped>
.home {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.features {
  margin-top: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.nav-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.nav-link:hover {
  background-color: #3aa876;
}
</style>