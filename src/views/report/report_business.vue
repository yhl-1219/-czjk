<template>
  <div class="hold-transition">
    <div class="content-header">
                <h1>统计分析<small>运营数据</small></h1>
                <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>统计分析</el-breadcrumb-item>
                    <el-breadcrumb-item>运营数据</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="app-container">
                <div class="box" style="height: 900px">
                    <div class="excelTitle" >
                        <el-button @click="exportExcel">导出Excel</el-button>运营数据统计
                    </div>
                    <div class="excelTime">日期：{{reportData.reportDate}}</div>
                    <table class="exceTable" cellspacing="0" cellpadding="0">
                        <tr>
                            <td colspan="4" class="headBody">会员数据统计</td>
                        </tr>
                        <tr>
                            <td width='20%' class="tabletrBg">今日新增会员数</td>
                            <td width='30%'>{{reportData.todayNewMember}}</td>
                            <td width='20%' class="tabletrBg">总会员数</td>
                            <td width='30%'>{{reportData.totalMember}}</td>
                        </tr>
                        <tr>
                            <td class="tabletrBg">本周新增会员数</td>
                            <td>{{reportData.thisWeekNewMember}}</td>
                            <td class="tabletrBg">本月新增会员数</td>
                            <td>{{reportData.thisMonthNewMember}}</td>
                        </tr>
                        <tr>
                            <td colspan="4" class="headBody">预约到诊数据统计</td>
                        </tr>
                        <tr>
                            <td class="tabletrBg">今日预约数</td>
                            <td>{{reportData.todayOrderNumber}}</td>
                            <td class="tabletrBg">今日到诊数</td>
                            <td>{{reportData.todayVisitsNumber}}</td>
                        </tr>
                        <tr>
                            <td class="tabletrBg">本周预约数</td>
                            <td>{{reportData.thisWeekOrderNumber}}</td>
                            <td class="tabletrBg">本周到诊数</td>
                            <td>{{reportData.thisWeekVisitsNumber}}</td>
                        </tr>
                        <tr>
                            <td class="tabletrBg">本月预约数</td>
                            <td>{{reportData.thisMonthOrderNumber}}</td>
                            <td class="tabletrBg">本月到诊数</td>
                            <td>{{reportData.thisMonthVisitsNumber}}</td>
                        </tr>
                        <tr>
                            <td colspan="4" class="headBody">热门套餐</td>
                        </tr>
                        <tr class="tabletrBg textCenter">
                            <td>套餐名称</td>
                            <td>预约数量</td>
                            <td>占比</td>
                            <td>备注</td>
                        </tr>
                        <tr v-for="(s,index) in reportData.hotSetmeal">
                            <td>{{s.name}}</td>
                            <td>{{s.setmeal_count}}</td>
                            <td>
                               <el-progress :percentage="checkoutIndex(index)" :text-inside="false" :stroke-width="15" :color="customColors"></el-progress>
                            </td>
                            <td>{{s.remark}}</td>
                            <td></td>
                        </tr>
                    </table>
                </div>
        </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
        customColor: '#409eff',
        customColors: [
          {color: '#f56c6c', percentage: 20},
          {color: '#e6a23c', percentage: 40},
          {color: '#5cb87a', percentage: 60},
          {color: '#1989fa', percentage: 80},
          {color: '#6f7ad3', percentage: 100}
        ],
        reportData:{
                    reportDate:null,//报告日期
                    todayNewMember :0,//今日新增会员数
                    totalMember :0,//总会员数
                    thisWeekNewMember :0,//本周新增会员数
                    thisMonthNewMember :0,//本月新增会员数
                    todayOrderNumber :0,//今日预约数
                    todayVisitsNumber :0,//今日到诊数
                    thisWeekOrderNumber :0,//本周预约数
                    thisWeekVisitsNumber :0,//本周到诊数
                    thisMonthOrderNumber :0,//本月预约数
                    thisMonthVisitsNumber :0,//本月到诊数
                    hotSetmeal :[]
                }
                 
    }
  },
    created() {
            this.findDataNumber();
            },
     methods:{
            findDataNumber () {
            //   运营数据统计报表
                this.$http.post("api/reportBusiness/findReportBusinessData").then((res)=>{
                if(res.data.flag){
                    this.reportData = res.data.data
                }else{
                    this.$message.error(res.data.message)
                }
            })},
            customColorMethod(percentage) {
                if (percentage < 30) {
                return '#909399';
                } else if (percentage < 70) {
                return '#e6a23c';
                } else {
                return '#67c23a';
                }
            },
            exportExcel(){
            window.location.href = 'api/reportBusiness/exportBusinessReport';    
            },
             //生成Excel报表并导出
             checkoutIndex(index) {
                let var1 = this.reportData.hotSetmeal[index].proportion;
                let var2 = var1.split("%")[0];
                return Number(var2);
             }
    }
};
</script>