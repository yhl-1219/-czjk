
<template>
  <div class="hold-transition">
    <div class="content-header">
      <h1 style="padding-right:270px">
        统计分析
        <small>会员各性比占比</small>
      </h1>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>统计分析</el-breadcrumb-item>
        <el-breadcrumb-item>套餐占比</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="app-container">
      <div class="box">
        <div id="chart1" style="height:600px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      Member: '',
      data: []
    }
  },
  methods: {
    handleNum () {
 // js类型判断 typeof a === 'spring'
      if (typeof this.Member === 'number') {

        this.$http.get('api/createmember/autoGenerateMember/' + this.Member).then((res) => {
          if (res.data.flag) {
            this.$message.success('一键生成' + this.Member + '个虚拟用户成功')
            this.Member = ''
          } else {
            this.$message.error(res.data.message)
          }
        })
      } else {
        this.$message.error('输入的虚拟会员个数必须为数值类型')
      }
    }
  },
  mounted: function () {
    var myChart1 = this.$echarts.init(document.getElementById('chart1'))
    this.$http.get('api/createmember/findmemberbysex').then((res) => {
      if (res.data.flag) {
        this.data = res.data.data
        this.$message = res.data.message
        myChart1.setOption({
          title: {
            text: '会员各性比占比',
            subtext: '',
            x: 'center'
          },
          tooltip: {
            // 提示框组件
            trigger: 'item', // 触发类型，在饼形图中为item
            formatter: '{a} <br/>{b} : {c} ({d}%)' // 提示内容格式
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              name: '套餐预约占比',
              type: 'pie',
              radius: '55%',
              radius: [20, 200],
              center: ['50%', '60%'],
              roseType: 'radius',
              data: this.data,
            emphasis: {
                label: {
                    show: true
                }
            },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: 20
                }
              }
            }
          ]
        })
      } else {
        this.$message.error(res.data.message)
      }
    })
  }
}

</script>
