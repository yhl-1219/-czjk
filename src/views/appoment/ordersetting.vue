<template>
  <div>
    <div class="content-header">
      <h1>
        预约管理
        <small>预约设置</small>
      </h1>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>预约管理</el-breadcrumb-item>
        <el-breadcrumb-item>预约设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="app-container">
      <div class="box">
        <div class="ordersetting">
          <el-card class="box-card">
            <div class="boxMain">
              <el-button
                style="margin-bottom: 20px; margin-right: 20px"
                type="primary"
                icon="el-icon-download"
                @click="downloadTemplate"
                round
                >模板下载</el-button
              >
              <el-upload
                action="api/ordersetting/importOrderSettings"
                name="excelFile"
                :before-upload="beforeAvatarUpload"
                :on-success="handleSuccess"
                :show-file-list="false"
              >
                <el-button type="primary" icon="el-icon-upload2" round>上传文件</el-button>
              </el-upload>
            </div>
            <div>
              操作说明：请点击"模板下载"按钮获取模板文件，在模板文件中录入预约设置数据
              <span style="color: red">(日期格式为：yyyy/MM/dd)</span
              >后点击"上传文件"按钮上传模板文件。
            </div>
          </el-card>
          <el-calendar v-model="curday">
              <template
              slot="dateCell"
              slot-scope="{date, data}">
              <div v-if="settingData[data.day]">
                <div v-if="settingData[data.day].number == settingData[data.day].reservations" 
                  style="background-color:rgb(252,147,151);height:60px;padding:10px 0 0 0;">
                 <div style="padding:6px 5px;"><font color='blue'>{{data.day}}</font></div>
                  <div>{{settingData[data.day].reservations}}/{{settingData[data.day].number}}</div>
                  <!-- <div>已满</div> -->
                  <div><el-button type="primary" size="mini" style="padding:3px 5px;margin : 8px 2px 5px 110px;"
                   @click="goSetting(data.day)">
                   <!-- <i class="el-icon-setting" ></i> -->
                   设置</el-button></div>
                </div>
                <div v-else style="background-color:rgb(43,219,254);height:80px;padding:0px 0 0 0;">
                  <div style="padding:6px 5px;"><font color='blue'>{{data.day}}</font></div>
                  <div>{{settingData[data.day].reservations}}/{{settingData[data.day].number}}</div>
                  <div><el-button type="primary" size="mini" style="padding:3px 5px;margin : 0px 2px 5px 110px;"
                   @click="goSetting(data.day)">
                   <!-- <i class="el-icon-setting" ></i> -->
                   设置</el-button></div>
                </div>
              </div>
              <div v-else>
                <div v-if="data.type == 'current-month'" style="padding-top:25px;background-color:rgb(245,245,245);padding:10px 0;height:60px;">
                    <font color='blue'>{{data.day}}</font><br>
                    <el-button type="primary" @click="goSetting(data.day)"  size="mini" 
                    style="padding:3px 10px;margin : 25px 2px 5px 100px;">
                      <!-- <i class="el-icon-edit" ></i> -->
                      设置
                      </el-button>
                </div>
                <!-- rgb(192,196,204) -->
                <!-- <div v-else style="background-color:white;height:60px;width100%;"> -->
                <!-- </div> -->
              </div>
            </template>
          </el-calendar>
        </div>
      </div>
    </div>
    <el-dialog
      title="预约设置"
      :visible.sync="settingDialog"
      width="30%"
      top="15%"
    >
      <div>日期:{{ settingDay }}</div>
      <el-input v-model="number" placeholder="输入预约总人数"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="settingDialog = false">取消</el-button>
        <el-button type="primary" @click="handleUpdate">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      curday: new Date(),
      settingData: {},
      settingDay: "",
      settingDialog: false,
      number: "",
    };
  },
  created() {
    this.findSettingData(this.curday.getFullYear(), this.curday.getMonth() + 1);
  },
  watch: {
    curday: function (oldDate, newDate) {
      if (oldDate.getMonth() != newDate.getMonth()) {
        this.loadData();
      }
    },
  },
  methods: {
    beforeAvatarUpload(file) {
      const isXlsx =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (!isXlsx) {
        this.$message.error("必须上传xlsx文件");
      }
      return isXlsx; //   返回值决定 文件是否上传 action 如果 true  自动向action发送文件上传请求
    },
    //上传成功提示
    handleSuccess(response, file) {
      if (response.flag) {
        this.$message({
          message: "上传成功!",
          type: "success",
        });
      } else {
        this.$message.error(response.message);
      }
    },
    goSetting(day) {
      this.settingDay = day;
      this.settingDialog = true;
    },
    loadData() {
      //后台数据加载
      //   this.curday  双向绑定  当前最新的日期
      console.log("最新日期", this.curday);
      this.findSettingData(
        this.curday.getFullYear(),
        this.curday.getMonth() + 1
      );
    },
    downloadTemplate() {
      //window.open(url,target)
      //target:_blank新窗口,_parent本窗口,_self替换当前页面
      window.open("api/template/ordersetting_template.xlsx", "_parent");
    },
    findSettingData(year, month) {
      this.$http
        .get("api/ordersetting/findSettingData/" + year + "/" + month)
        .then((res) => {
          if (res.data.flag) {
            this.settingData = res.data.data;
            this.$message.success(res.data.message);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    findSettingData(year, month) {
      this.$http
        .get("api/ordersetting/findSettingData/" + year + "/" + month)
        .then((res) => {
          if (res.data.flag) {
            this.settingData = res.data.data;
            this.$message.success(res.data.message);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    handleUpdate() {
      let reg = /^[0-9]*[1-9][0-9]*$/;
      let flag = reg.test(this.number);
      if (flag) {
        if (this.number < this.settingData[this.settingDay].reservations) {
          this.$message.warning("输入数据必须>已经预约数据！");
          return;
        }
        this.settingDialog = false;
        this.$http
          .put(
            "api/ordersetting/updateNumberByOrderdate/" +
              this.number +
              "/" +
              this.settingDay
          )
          .then((res) => {
            if (res.data.flag) {
              // 修改成功之后，不用再查询数据库  使用前端js更新  settingData对象中指定数据即可
              this.settingData[this.settingDay].number = this.number;
            } else {
              this.$message.error(res.data.message);
            }
          });
      } else {
        this.$message.warning("数据非法!");
      }
    },
  },
};
</script>

<style scoped>
.el-calendar-table .el-calendar-day {
  padding: 0;
}
</style>
