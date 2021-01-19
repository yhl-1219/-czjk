<template>
  <div>
        <div class="content-header">
                <h1>用户管理<small>角色管理</small></h1>
                <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                    <el-breadcrumb-item>角色管理</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="app-container">
                <div class="box">
                    <div class="filter-container">
                        <el-input placeholder="角色名/关键字" v-model="pagination.queryString" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"></el-input>
                        <el-button @click="findPageByCondition" class="dalfBut">查询</el-button>
                        <el-button type="primary" class="butT" @click="handleCreate()">新建</el-button>
                    </div>
                    <el-table size="small" current-row-key="id" :data="dataList" stripe highlight-current-row>
                        <el-table-column type="index" align="center" label="序号"></el-table-column>
                        <el-table-column prop="name" label="角色名称" align="center"></el-table-column>
                        <el-table-column prop="keyword" label="关键字" align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                                <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination-container">
                        <el-pagination
                            class="pagiantion"
                            @current-change="handleCurrentChange"
                            :current-page="pagination.currentPage"
                            :page-size="pagination.pageSize"
                            layout="total, prev, pager, next, jumper"
                            :total="pagination.total">
                        </el-pagination>
                    </div>
                    <!-- 新增标签弹层 -->
                    <div class="add-form">
                        <el-dialog title="新增角色" :visible.sync="dialogFormVisible">
                            <template>
                                <el-tabs v-model="activeName" type="card">
                                    <el-tab-pane label="基本信息" name="first">
                                        <el-form :model="formData" ref="dataAddForm" label-position="right" label-width="100px" :rules="rules" >
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="名称" prop="name">
                                                        <el-input v-model="formData.name"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="关键字" prop="keyword">
                                                        <el-input v-model="formData.keyword"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="说明">
                                                        <el-input v-model="formData.description" type="textarea"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-form>
                                    </el-tab-pane>
                                    <el-tab-pane label="检查项信息" name="second">
									<div class="checkScrol">
                                        <table class="datatable">
                                            <thead>
                                            <tr>
                                                <th>选择</th>
                                                <th>权限名称</th>
                                                <th>权限关键字</th>
                                                <th>权限说明</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="c in tableData" v-bind:key="c">
                                                <td>
                                                    <input :id="c.id" v-model="permissionIds" type="checkbox" :value="c.id">
                                                </td>
                                                <td><label :for="c.id">{{c.name}}</label></td>
                                                <td><label :for="c.id">{{c.keyword}}</label></td>
                                                <td><label :for="c.id">{{c.description}}</label></td>
                                            </tr>
                                            </tbody>
                                        </table>
									</div>
                                    </el-tab-pane>
                                </el-tabs>
                            </template>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogFormVisible = false">取消</el-button>
                                <el-button type="primary" @click="handleAdd()">确定</el-button>
                            </div>
                        </el-dialog>
                    </div>

                    <!-- 编辑标签弹层 -->
                    <div class="add-form">
                        <el-dialog title="编辑检查组" :visible.sync="dialogFormVisible4Edit">
                            <template>
                                <el-tabs v-model="activeName" type="card">
                                    <el-tab-pane label="基本信息" name="first">
                                        <el-form :model="formData" ref="dataEditForm" :rules="rules" label-position="right" label-width="100px">
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="名称" prop="name">
                                                        <el-input v-model="formData.name"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="关键字" prop="keyword">
                                                        <el-input v-model="formData.keyword"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="说明">
                                                        <el-input v-model="formData.description" type="textarea"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-form>
                                    </el-tab-pane>
                                    <el-tab-pane label="检查项信息" name="second">
										<div class="checkScrol">
											<table class="datatable">
												<thead>
													<tr>
                                                <th>选择</th>
                                                <th>权限名称</th>
                                                <th>权限关键字</th>
                                                <th>权限说明</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr v-for="c in tableData" v-bind:key="c">
                                                        <td>
                                                            <input :id="c.id" v-model="permissionIds" type="checkbox" :value="c.id">
                                                        </td>
                                                        <td><label :for="c.id">{{c.name}}</label></td>
                                                        <td><label :for="c.id">{{c.keyword}}</label></td>
                                                        <td><label :for="c.id">{{c.description}}</label></td>
                                                    </tr>
												</tbody>
											</table>
										</div>
                                    </el-tab-pane>
                                </el-tabs>
                            </template>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogFormVisible4Edit = false">取消</el-button>
                                <el-button type="primary" @click="handleEdit()">确定</el-button>
                            </div>
                        </el-dialog>
                    </div>
                </div>
            </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
                activeName:'first',//添加/编辑窗口Tab标签名称
                pagination: {//分页相关属性
                    currentPage: 1,
                    pageSize:5,
                    total:0,
                    queryString:null,
                },
                dataList: [],//列表数据
                formData: {},//表单数据
                tableData:[],//新增和编辑表单中对应的权限列表数据
                permissionIds:[],//新增和编辑表单中权限对应的复选框，基于双向绑定可以进行回显和数据提交
                dialogFormVisible: false,//控制添加窗口显示/隐藏
                dialogFormVisible4Edit:false,//控制编辑窗口显示/隐藏
                rules: {//校验规则
                    name: [
                        { required: true, message: '权限名称为必填项', trigger: 'blur' },
                    ],
                    keyword: [
                        { required: true, message: '权限关键字为必填项', trigger: 'blur' },
                    ]
                }
    };
  },

  created() {    
                this.findPage();
            },
            methods: {
                findPage() {
                    this.$http.post("api/role/findPage",this.pagination).then((res)=>{
                        if(res.data.flag){
                            this.dataList = res.data.data.rows;
                            this.pagination.total = res.data.data.total;
                        }
                    })
                },
                //弹出添加窗口
                handleCreate() {
                    this.permissionIds = [];
                    this.restform();
                    this.dialogFormVisible = true;
                    this.activeName='first';
                    this.$http.get("api/role/findAllPermission").then(res=>{
                        if(res.data.flag) {
                            this.tableData = res.data.data;
                        } else {
                            this.$message.error(res.data.message);
                        }
                    })
                },
                //重置表单
                restform() {
                    this.formData = {};
                },
                //添加
                handleAdd() {
                    this.$refs['dataAddForm'].validate((valid) => {
                        if (valid) {
                            this.formData.permissionIds = this.permissionIds;
                            this.$http.post("api/role/add",this.formData).then(res => {
                                this.dialogFormVisible = false;
                                if(res.data.flag) {
                                    this.dialogFormVisible = false;
                                    this.findPage();
                                } else {
                                    this.$message.error(res.data.message);
                                }
                            })
                        } else {
                            this.$message({
                                type: "error",
                                message: "表单数据校验失败"
                            })
                        }
                    });
                },
                //查询分页
                findPageByCondition() {
                    this.pagination.currentPage = 1;
                    this.findPage();
                },
                //切换页面
                handleCurrentChange(currentPage) {
                    this.pagination.currentPage=currentPage;
                    this.findPage();
                },
                //删除
                handleDelete(row) {
                    this.$confirm('您确定要删除吗？','提示',{
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.$http.delete("api/role/deleteRoleById/" + row.id).then((res)=>{
                                    if(res.data.flag) {
                                        this.pagination.currentPage=1;
                                        this.findPage();
                                    } else {
                                        this.$message.error(res.data.message);
                                    }
                                }).catch(()=>{
                                    this.message({
                                        type: 'info',
                                        message: '已取消删除'
                                    })
                                })
                            });
                },
                //编辑检查组
                handleUpdate(row){
                    var jsonStr = JSON.stringify(row);
                    this.formData = JSON.parse(jsonStr);
                    this.dialogFormVisible4Edit = true;
                    this.activeName = "first";
                    this.$http.get("api/role/findAllPermission").then(res=>{
                        if(res.data.flag) {
                            this.tableData = res.data.data;
                        } else {
                            this.$message.error(res.data.message);
                        }
                    });
                    this.$http.post("api/role/findPermissionInfoById/" + row.id).then(res=>{
                        if(res.data.flag){
                            this.permissionIds = res.data.data;
                        } else {
                            this.$message.error(res.data.message);
                        }
                    });
                },
                //修改提交
                handleEdit() {
                    this.$refs['dataEditForm'].validate((valid) => {
                        if (valid) {
                            this.dialogFormVisible4Edit = false;
                            this.formData.permissionIds = this.permissionIds;
                            this.$http.post("api/role/add",this.formData).then(res => {
                                if(res.data.flag) {
                                    this.findPage();
                                } else {
                                    this.$message.error(res.data.message);
                                }
                            })
                        } else {
                            this.$message({
                                type: "error",
                                message: "表单数据校验失败"
                            })
                        }
                    });
                }
            }
        

};
</script>

<style scoped>
.datatable {
  position: relative;
  box-sizing: border-box;
  -webkit-box-flex: 1;
  width: 100%;
  max-width: 100%;
  font-size: 14px;
  color: rgb(96, 98, 102);
  overflow: hidden;
  flex: 1 1 0%;
}
.datatable td,
.datatable th {
  padding: 12px 0;
  min-width: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
}
</style>