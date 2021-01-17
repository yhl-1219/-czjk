<template>
<div class="hold-transition">
  <div class="content-header">
                <h1>统计分析<small>会员数量</small></h1>
                <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>统计分析</el-breadcrumb-item>
                    <el-breadcrumb-item>会员数量</el-breadcrumb-item>
                </el-breadcrumb>
                <el-form ref="form" :model="form">
                        <el-form-item label="年份">
                            <el-input v-model="year" style="width: 200px;"></el-input>
                        </el-form-item>
                        <el-form-item label="月份">
                            <el-input v-model="t_month" style="width: 200px;"></el-input>
                        </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="findCount">查询</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
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
    return {
        year: 2020,
        t_month: 1,
        month: {
            th1month: {
                name: "2020-1",
                member: 820
            },
            th2month: {
                name: "2020-2",
                member: 1320
            },
            th3month: {
                name: "2020-3",
                member: 932
            },
            th4month: {
                name: "2020-4",
                member: 901
            },
            th5month: {
                name: "2020-5",
                member: 1022
            },
            th6month: {
                name: "2020-6",
                member: 1111
            },
            th7month: {
                name: "2020-7",
                member: 1025
            },
            th8month: {
                name: "2020-8",
                member: 1078
            },
            th9month: {
                name: "2020-9",
                member: 1124
            },
            th10month: {
                name: "2020-10",
                member: 1209
            },
            th11month: {
                name: "2020-11",
                member: 1124
            },
            th12month: {
                name: "2020-12",
                member: 1502
            },
        }
    };
  },
        mounted(){
                this.findCount();
            },
        methods: {
            findCount() {
                var myChart = this.$echarts.init(document.getElementById("chart1"));
                this.$http.post("api/report/getMemberCount/" + this.year + "/" + this.t_month).then(res=>{
                        if(res.data.flag){
                            this.month = res.data.data;
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
                                data: [this.month.th1month.name
                                ,this.month.th2month.name
                                ,this.month.th3month.name
                                ,this.month.th4month.name
                                ,this.month.th5month.name
                                ,this.month.th6month.name
                                ,this.month.th7month.name
                                ,this.month.th8month.name
                                ,this.month.th9month.name
                                ,this.month.th10month.name
                                ,this.month.th11month.name
                                ,this.month.th12month.name]
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: [{
                                data: [this.month.th1month.member
                                ,this.month.th2month.member
                                ,this.month.th3month.member
                                ,this.month.th4month.member
                                ,this.month.th5month.member
                                ,this.month.th6month.member
                                ,this.month.th7month.member
                                ,this.month.th8month.member
                                ,this.month.th9month.member
                                ,this.month.th10month.member
                                ,this.month.th11month.member
                                ,this.month.th12month.member],
                                name:'会员数量',
                                type: 'line'
                            }]
                        });
                        } else {
                            this.$message.error(res.data.message);
                        }
                    });
            }
        }
};
</script>