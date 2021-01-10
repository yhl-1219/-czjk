<template>
  <div>
    <div class="content-header">
                <h1>预约管理<small>套餐管理</small></h1>
                <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>预约管理</el-breadcrumb-item>
                    <el-breadcrumb-item>套餐管理</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="app-container">
                <div class="box">
                    <div class="filter-container">
                        <el-input placeholder="编码/名称/助记码" v-model="pagination.queryString" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"></el-input>
                        <el-button @click="findPageByCondition" class="dalfBut">查询</el-button>
                        <el-button type="primary" class="butT" @click="handleCreate">新建</el-button>
                    </div>
                    <el-table size="small" current-row-key="id" :data="dataList" stripe highlight-current-row>
                        <el-table-column type="index" align="center" label="序号"></el-table-column>
                        <el-table-column prop="code" label="套餐编码" align="center"></el-table-column>
                        <el-table-column prop="name" label="套餐名称" align="center"></el-table-column>
                        <el-table-column label="适用性别" align="center">
                            <template slot-scope="scope">
                                <span>{{ scope.row.sex == '0' ? '不限' : scope.row.sex == '1' ? '男' : '女'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="age" label="适用年龄" align="center"></el-table-column>
                        <el-table-column prop="helpCode" label="助记码" align="center"></el-table-column>
                        <el-table-column prop="remark" label="说明" align="center"></el-table-column>
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
                        <el-dialog title="新增套餐" :visible.sync="dialogFormVisible">
                            <template>
                                <el-tabs v-model="activeName" type="card">
                                    <el-tab-pane label="基本信息" name="first">
                                        <el-form label-position="right" label-width="100px" :model="formData" ref="addSetMealForm"  :rules="rules">
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="套餐编码" prop="code">
                                                        <el-input v-model="formData.code"/>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="套餐名称" prop="name">
                                                        <el-input v-model="formData.name"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="适用性别">
                                                        <el-select v-model="formData.sex">
                                                            <el-option label="不限" value="0"></el-option>
                                                            <el-option label="男" value="1"></el-option>
                                                            <el-option label="女" value="2"></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="助记码">
                                                        <el-input v-model="formData.helpCode"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="套餐价格">
                                                        <el-input v-model="formData.price"/>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="适用年龄" prop="age">
                                                        <el-input v-model.number="formData.age"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="24">
                                                    <el-form-item label="上传图片">
                                                        <el-upload
                                                                class="avatar-uploader"
                                                                action="api/setmeal/upload"
                                                                :auto-upload="autoUpload"
                                                                name="imgFile"
                                                                :show-file-list="false"
                                                                :on-success="handleAvatarSuccess"
                                                                :before-upload="beforeAvatarUpload">
                                                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                                        </el-upload>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="24">
                                                    <el-form-item label="说明">
                                                        <el-input v-model="formData.remark" type="textarea"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="24">
                                                    <el-form-item label="注意事项">
                                                        <el-input v-model="formData.attention" type="textarea"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-form>
                                    </el-tab-pane>
                                    <el-tab-pane label="检查组信息" name="second">
										<div class="checkScrol">
											<table class="datatable">
												<thead>
												<tr>
													<th>选择</th>
													<th>项目编码</th>
													<th>项目名称</th>
													<th>项目说明</th>
												</tr>
												</thead>
												<tbody>
												<tr v-for="c in tableData">
													<td>
														<input :id="c.id" v-model="checkgroupIds" type="checkbox" :value="c.id">
													</td>
													<td><label :for="c.id">{{c.code}}</label></td>
													<td><label :for="c.id">{{c.name}}</label></td>
													<td><label :for="c.id">{{c.remark}}</label></td>
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
                    <!-- 修改标签弹层 -->
                    <div class="add-form">
                        <el-dialog title="编辑套餐" :visible.sync="dialogFormVisible4Edit">
                            <template>
                                <el-tabs v-model="activeName" type="card">
                                    <el-tab-pane label="基本信息" name="first">
                                        <el-form label-position="right" label-width="100px" :model="formData" ref="editSetMealForm"  :rules="rules">
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="套餐编码" prop="code">
                                                        <el-input v-model="formData.code"/>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="套餐名称" prop="name">
                                                        <el-input v-model="formData.name"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="适用性别">
                                                        <el-select v-model="formData.sex">
                                                            <el-option label="不限" value="0"></el-option>
                                                            <el-option label="男" value="1"></el-option>
                                                            <el-option label="女" value="2"></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="助记码">
                                                        <el-input v-model="formData.helpCode"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="套餐价格">
                                                        <el-input v-model="formData.price"/>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="适用年龄" prop="age">
                                                        <el-input v-model.number="formData.age"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="24">
                                                    <el-form-item label="上传图片">
                                                        <el-upload
                                                                class="avatar-uploader"
                                                                action="api/setmeal/upload"
                                                                :auto-upload="autoUpload"
                                                                name="imgFile"
                                                                :show-file-list="false"
                                                                :on-success="handleAvatarSuccess"
                                                                :before-upload="beforeAvatarUpload">
                                                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                                        </el-upload>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="24">
                                                    <el-form-item label="说明">
                                                        <el-input v-model="formData.remark" type="textarea"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="24">
                                                    <el-form-item label="注意事项">
                                                        <el-input v-model="formData.attention" type="textarea"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-form>
                                    </el-tab-pane>
                                    <el-tab-pane label="检查组信息" name="second">
										<div class="checkScrol">
											<table class="datatable">
												<thead>
												<tr>
													<th>选择</th>
													<th>项目编码</th>
													<th>项目名称</th>
													<th>项目说明</th>
												</tr>
												</thead>
												<tbody>
												<tr v-for="c in tableData">
													<td>
														<input :id="c.id" v-model="checkgroupIds" type="checkbox" :value="c.id">
													</td>
													<td><label :for="c.id">{{c.code}}</label></td>
													<td><label :for="c.id">{{c.name}}</label></td>
													<td><label :for="c.id">{{c.remark}}</label></td>
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
    data(){
        return{
              autoUpload:true,//自动上传
                imageUrl:null,//模型数据，用于上传图片完成后图片预览
                activeName:'first',//添加/编辑窗口Tab标签名称
                pagination: {//分页相关属性
                    currentPage: 1,
                    pageSize:5,
                    total:0,
                    queryString:null,
                },
                dataList: [],//列表数据
                formData: {},//表单数据
                tableData:[],//添加表单窗口中检查组列表数据
                checkgroupIds:[],//添加表单窗口中检查组复选框对应id
                dialogFormVisible: false,//控制添加窗口显示/隐藏
                rules: {// 添加套餐的表格校验规则
                    code: [
                        { required: true, message: '套餐编码为必填项', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '套餐名称为必填项', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur' }
                    ],
                    age: [
                        { required: true, message: '年龄必填项', trigger: 'blur' },
                        { type: 'number', min:1,message: '年龄必须为数字值' }
                    ]
                }
        }
    },
      created() {
                    this.findPage();
                },
                methods: {
                    findPage(){
                        this.$http.post("api/setmeal/findPage",this.pagination).then(res=>{
                            if (res.data.flag) {
                                this.dataList = res.data.data.rows;
                                this.pagination.total = res.data.data.total;
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                    },
                    findPageByCondition() {
                        this.findPage();
                    },
                    handleCurrentChange(currentPage) {
                        this.pagination.currentPage=currentPage;
                        this.findPage();
                    },
                    handleCreate() {
                        this.formData = {};
                        this.checkgroupIds = [];
                        this.imageUrl = null;
                        this.$http.get("api/checkgroup/findAll").then(res=>{
                            if(res.data.flag){
                                this.tableData = res.data.data;
                            } else {
                                this.$message.error(res.data.message);
                            }
                        });
                        this.dialogFormVisible = true;
                        this.activeName = "first";
                    },
                    handleAdd(){
                        this.$refs['addSetMealForm'].validate(valid => {
                            if(valid) {
                                this.dialogFormVisible = false;
                                this.formData.checkgroupIds = this.checkgroupIds;
                                this.$http.post("api/setmeal/add",this.formData).then(res=>{
                                    if(res.data.flag) {
                                        this.findPage();
                                    } else {
                                        this.$message.error(res.data.message);
                                    }
                                })
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: '表单数据校验失败'
                                })
                            }
                        })
                    },
                    handleDelete(row) {
                        this.$http.delete("api/setmeal/deleteSetmealById/" + row.id).then(res=>{
                            if(res.data.flag) {
                                this.pagination.currentPage=1;
                                this.findPage();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        });
                    },
                    handleUpdate(row) {
                        this.formData = row;
                        this.imageUrl = "https://vectorwang.oss-cn-shanghai.aliyuncs.com/" + row.img;
                        this.$http.get("api/checkgroup/findAll").then(res=>{
                            if(res.data.flag){
                                this.tableData = res.data.data;
                            } else {
                                this.$message.error(res.data.message);
                            }
                        });
                        this.$http.post("api/setmeal/findGroupIdsBySetmealId/" + row.id).then(res =>{
                            this.checkgroupIds = res.data.data;
                        });
                        this.dialogFormVisible4Edit = true;
                        this.activeName = 'first';
                    },
                    handleEdit() {
                        this.dialogFormVisible4Edit = false;
                        this.formData.checkgroupIds = this.checkgroupIds;
                        this.$http.post("api/setmeal/add",this.formData).then(res=>{
                            if(res.data.flag) {
                                this.findPage();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                    },
                    handleAvatarSuccess(response,file) {
                        this.imageUrl = "https://vectorwang.oss-cn-shanghai.aliyuncs.com/" +  response.data;
                        this.$message({
                            message: response.flag ? '图片上传成功' : '图片上传失败',
                            type: response.flag ? 'success' : 'error'
                        });
                        this.formData.img = response.data;
                    }
    }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
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
