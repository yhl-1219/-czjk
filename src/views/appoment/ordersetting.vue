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
              <el-button style="margin-bottom: 20px;margin-right: 20px" type="primary" @click="downloadTemplate">模板下载</el-button>
              <el-upload
                action="api/ordersetting/importOrderSettings"
                name="excelFile"
                :before-upload="beforeAvatarUpload"
                :on-success="handleSuccess"
                :show-file-list="false"
              >
                <el-button type="primary">上传文件</el-button>
              </el-upload>
            </div>
            <div>
              操作说明：请点击"模板下载"按钮获取模板文件，在模板文件中录入预约设置数据
              <span style="color: red">(日期格式为：yyyy/MM/dd)</span>后点击"上传文件"按钮上传模板文件。
            </div>
          </el-card>
          <el-calendar v-model="curday">
            <template
              slot="dateCell"
              slot-scope="{date, data}">
              <div v-if="settingData[data.day]">
                <div v-if="settingData[data.day].number == settingData[data.day].reservations" 
                  style="background-color:red;height:85px;">
                 <div><font color='blue'>{{data.day}}</font></div>
                  <div>{{settingData[data.day].reservations}}/{{settingData[data.day].number}}</div>
                  <div>已满</div>
                </div>
                <div v-else style="background-color:lightblue;height:85px;">
                  <div><font color='blue'>{{data.day}}</font></div>
                  <div>{{settingData[data.day].reservations}}/{{settingData[data.day].number}}</div>
                  <div><button
                   @click="goSetting(data.day)"><i class="el-icon-setting"></i>设置</button></div>
                </div>
              </div>
              <div v-else>
                <div v-if="data.type == 'current-month'" style="padding-top:25px;">
                    <font color='blue'>{{data.day}}</font>
                    <button @click="goSetting(data.day)"><i class="el-icon-setting"></i>设置</button>
                </div>
                <div v-else style="background-color:rgb(192,196,204);height:85px;width100%;">
                </div>
              </div>
            </template>
          </el-calendar>
        </div>
      </div>
    </div>
     <el-dialog title="预约设置" :visible.sync="settingDialog" width="30%" top="15%">
       <div>日期:{{settingDay}}</div>
       <el-input v-model="number" placeholder="输入预约总人数"></el-input>
       <div slot="footer" class="dialog-footer">
        <el-button @click="settingDialog = false">取消</el-button>
        <el-button type="primary" @click="settingDialog = false">确定</el-button>
      </div>
     </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      curday: new Date(),
      settingData:{},
      settingDay:'',
      settingDialog:false,
      number:'',
    };
  },
  methods:{	
     beforeAvatarUpload(file) {
                    const isXlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                    if (!isXlsx) {
                        this.$message.error('必须上传xlsx文件');
                    }
                    return isXlsx ; //   返回值决定 文件是否上传 action 如果 true  自动向action发送文件上传请求
                },
    //上传成功提示
                handleSuccess(response, file) {
                    if(response.flag){
                        this.$message({
                            message: response.message,
                            type: 'success'
                        });
                    }else{
                        this.$message.error(response.message);
                    }
                   
                },
    goSetting:function(day){
        this.settingDay = day;
        this.settingDialog = true;
    },
    loadData:function(){//后台数据加载
    //   this.curday  双向绑定  当前最新的日期
      console.log('最新日期',this.curday);
      this.findSettingData(this.curday.getFullYear(),this.curday.getMonth()+1)
    },
    downloadTemplate:function(){
      //window.open(url,target) 
      //target:_blank新窗口,_parent本窗口,_self替换当前页面
      window.open('api/template/ordersetting_template.xlsx','_parent');
    },
    findSettingData(year,month){
        this.$http.get("api/ordersetting/findSettingData/"+year+"/"+month).then((res)=>{
        if(res.data.flag){
          this.settingData = res.data.data
          this.$message.success(res.data.message)
        }else{
          this.$message.error(res.data.message)
        }
    })
    }
    
  },
  watch:{
    //  监听 当前 日期的变化  curday 
    curday:function(oldDate,newDate){
      //判断如果日期变化后，不是相同月份就触发后台数据加载
      if(oldDate.getMonth() != newDate.getMonth()){
        this.loadData();
      }
    }
  },
  created(){
    // this.settingData = {
    //   "2020-09-01":{number:200,reservations:200},
    //   "2020-09-02":{number:200,reservations:200},
    //   "2020-09-05":{number:200,reservations:100},
    //   "2020-09-15":{number:200,reservations:50},
    //   "2020-09-28":{number:100,reservations:90}
    // }

     this.findSettingData(this.curday.getFullYear(),this.curday.getMonth()+1)

  }
};
</script>

<style scoped>
.el-calendar-table .el-calendar-day{
  padding: 0;
}
</style>
