<template>
<div class="hold-transition">
  <div class="content-header">
                <h1>统计分析<small>会员数量</small></h1>
                <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>统计分析</el-breadcrumb-item>
                    <el-breadcrumb-item>会员数量</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="app-container">
                <div class="box">
                    <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
                    <div id="chart1" style="height:600px;"></div>
                </div>
            </div>
</div>
</template>

<script>
export default {
  data() {
    return {};
  },
   mounted:function(){
                  var myChart = this.$echarts.init(document.getElementById("chart1"));

                         myChart.setOption({
                             title:{
                                 text:'会员数量'
                             },
                             tooltip: {
                                 trigger: 'axis',
                                 formatter: [820, 932, 901, 934, 1290, 1330, 1320]
                             },
                             xAxis: {
                                 type: 'category',
                                 data: ['2020-6', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                               
                             },
                             yAxis: {
                                 type: 'value'
                             },
                             series: [{
                                 data: [820, 932, 901, 934, 1290, 1330, 1320],
                                 name:'会员数量',
                                 type: 'line'
                             }]
                         });

                     }
  
};
</script>