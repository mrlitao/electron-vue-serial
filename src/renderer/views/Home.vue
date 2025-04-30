<template>
  <div class="home">
    <el-form ref="formRef" :model="formObject" :rules="rules" label-width="140px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="选择串口" prop="portPath">
            <div style="width: 100%; display: flex;">
              <el-select v-model="formObject.portPath" placeholder="请选择串口" style="margin-right: 8px; min-width: 0;flex: 1;">
                <el-option v-for="port in list" :key="port.path" :label="port.path" :value="port.path" />
              </el-select>
              <el-button type="primary" @click="getAll">刷新</el-button>
            </div>
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
    <el-button type="primary" size="large" @click="send">测 试</el-button>
    <!-- <router-link to="/about" class="nav-link">About</router-link> -->
  </div>
</template>

<script setup>
const { ipcRenderer } = require('electron')
import { onMounted, reactive, shallowRef, toRaw } from "vue";
import { ElButton, ElRow, ElCol, ElForm, ElFormItem, ElSelect, ElOption, ElInput, ElInputNumber } from 'element-plus'
// import { ipcRenderer } from "electron"
const list = shallowRef([]);
const formRef = shallowRef(null);
const rules = {
  portPath: [
    { required: true, message: '请选择串口', trigger: 'blur' },
  ],
  device_name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  product_key: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
}
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
  portPath: "",
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

const send = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    console.log(formObject);
    const data = toRaw(formObject)
    ipcRenderer.invoke("send-serial-port-message", data).then((res) => {
      console.log({ res });
    });
  });

}
onMounted(() => {
  getAll();
})
</script>

<style scoped>
  .home {
    padding: 20px;
  }
</style>