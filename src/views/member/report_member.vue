<template>
<div class="hold-transition">
  <div class="content-header">
                <h1>统计分析<small>会员数量</small></h1>
                <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>统计分析</el-breadcrumb-item>
                    <el-breadcrumb-item>会员数量</el-breadcrumb-item>
                </el-breadcrumb>
                
                <div class="block">
                    <span class="demonstration">筛选范围</span>
                    <el-date-picker
                    v-model="value2"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    :default-time="[]"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="findCount"
                    align="right">
                    </el-date-picker>&nbsp;&nbsp;
                    <span class="demonstration">筛选条件</span>
                        <el-radio-group v-model="condition.type" @change="findCount">
                          <el-radio-button label="0">按年显示</el-radio-button>
                          <el-radio-button label="1">按月显示</el-radio-button>
                          <el-radio-button label="2">按周显示</el-radio-button>
                          <el-radio-button label="3">按日显示</el-radio-button>
                        </el-radio-group>
                </div>

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
        options: [{
          value: '0',
          label: '按年显示'
        }, {
          value: '1',
          label: '按月显示'
        }, {
          value: '2',
          label: '按周显示'
        }, {
          value: '3',
          label: '按日显示'
        }],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近半年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '2019年',
            onClick(picker) {
              picker.$emit('pick', ["2019-01-01", "2020-01-01"]);
            }
          }, {
            text: '2018年',
            onClick(picker) {
              picker.$emit('pick', ["2018-01-01", "2019-01-01"]);
            }
          }]
        },
        value2: ['2020-01-01','2021-01-01'],
        condition: {
            beginTime: "2020-01-01",
            endTime: "2020-12-12",
            type: "1"
        },
        dataList: {}
    };
  },
        mounted(){
                this.findCount();
            },
        methods: {
            findCount() {
                this.condition.beginTime = this.value2[0];
                this.condition.endTime = this.value2[1];
                var myChart = this.$echarts.init(document.getElementById("chart1"));
                this.$http.post("api/report/getMemberCount",this.condition).then(res=>{
                        if(res.data.flag){
                            this.dataList = res.data.data;
                        myChart.setOption({
                            title:{
                                text:'会员数量'
                            },
                            tooltip: {
                                trigger: 'axis',
                                formatter: this.dataList.member
                            },
                            xAxis: {
                                type: 'category',
                                data: this.dataList.name
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: [{
                                data: this.dataList.member,
                                name:'会员数量',
                                type: 'line',
                                lineStyle: {
                                    color: '#8A2BE2',
                                    width: 2
                                },
                                itemStyle: {
                                    borderWidth: 4,
                                    borderColor: '#8A2BE2',
                                    color: 'yellow'
                                }
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