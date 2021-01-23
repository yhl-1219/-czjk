<template>
  <div>
   <div class="content-header">
                <h1>系统管理<small>菜单管理</small></h1>
                <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                    <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="app-container">
                <div class="box">
                    <div class="filter-container">
                        <el-input placeholder="菜单名" v-model="pagination.queryString" style="width: 200px;" class="filter-item"></el-input>
                        &nbsp;&nbsp;
                        <el-button @click="findPageByCondition" class="dalfBut" icon="el-icon-search" round></el-button>
                        <el-button type="primary" class="butT" @click="handleCreate" icon="el-icon-circle-plus-outline" round></el-button>
                    </div>
                    <el-table size="small" current-row-key="id" :data="dataList" stripe highlight-current-row>
                        <el-table-column type="index" align="center" label="序号"></el-table-column>
                        <el-table-column prop="name" label="菜单名称" align="center"></el-table-column>
                        <el-table-column prop="path" label="菜单路径" align="center"></el-table-column>
                        <el-table-column prop="level" label="菜单等级" align="center"></el-table-column>
                        <el-table-column prop="linkUrl" label="链接路径" align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="primary" class="el-icon-edit" size="mini" @click="handleUpdate(scope.row)" round></el-button>
                                <el-button size="mini" type="danger" class="el-icon-delete" @click="handleDelete(scope.row)" round></el-button>
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
                        <el-dialog title="新增菜单" :visible.sync="dialogFormVisible">
                            <el-form ref="dataAddForm" :model="formData" :rules="rules" label-position="right" label-width="100px">
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="菜单名称" prop="name">
                                            <el-input v-model="formData.name"/>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="菜单链接" prop="linkUrl">
                                            <el-input v-model="formData.linkUrl" :disabled="disable"/>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="路径" prop="path">
                                            <el-input v-model="formData.path"/>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="优先级">
                                            <el-select v-model="formData.priority" prop="priprity">
                                                <el-option label="一级" value="1"></el-option>
                                                <el-option label="二级" value="2"></el-option>
                                                <el-option label="三级" value="3"></el-option>
                                                <el-option label="四级" value="4"></el-option>
                                                <el-option label="五级" value="5"></el-option>
                                                <el-option label="六级" value="6"></el-option>
                                                <el-option label="七级" value="7"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                     <el-col :span="12">
                                        <el-form-item label="图标" prop="icon">
                                            <el-input v-model="formData.icon"/>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="描述" prop="description">
                                            <el-input v-model="formData.description"/>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="父菜单" prop="parentMenuId">
                                            <el-input v-model="formData.parentMenuId" :disabled="disable"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12" label="等级">
                                        <el-form-item label="等级">
                                            <el-select v-model="formData.level" prop="level" @change="changeDisable">
                                                <el-option label="一级" value="1"></el-option>
                                                <el-option label="二级" value="2"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogFormVisible = false" icon="el-icon-error" round></el-button>
                                <el-button type="primary" @click="handleAdd" icon="el-icon-success" round></el-button>
                            </div>
                        </el-dialog>
                    </div>

                    <!-- 编辑标签弹层 -->
                    <div class="add-form">
                        <el-dialog title="编辑菜单" :visible.sync="dialogFormVisible4Edit">
                            <el-form ref="dataEditForm" :model="formData" :rules="rules" label-position="right" label-width="100px">
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="菜单名称" prop="name">
                                            <el-input v-model="formData.name"/>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="菜单链接" prop="linkUrl">
                                            <el-input v-model="formData.linkUrl" :disabled="disable"/>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="路径" prop="path">
                                            <el-input v-model="formData.path"/>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="优先级">
                                            <el-select v-model="formData.priority" prop="priprity">
                                                <el-option label="一级" value="1"></el-option>
                                                <el-option label="二级" value="2"></el-option>
                                                <el-option label="三级" value="3"></el-option>
                                                <el-option label="四级" value="4"></el-option>
                                                <el-option label="五级" value="5"></el-option>
                                                <el-option label="六级" value="6"></el-option>
                                                <el-option label="七级" value="7"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                     <el-col :span="12">
                                        <el-form-item label="图标" prop="icon">
                                            <el-input v-model="formData.icon"/>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="描述" prop="description">
                                            <el-input v-model="formData.description"/>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="父菜单" prop="parentMenuId">
                                            <el-input v-model="formData.parentMenuId" :disabled="disable"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12" label="等级">
                                        <el-form-item label="等级">
                                            <el-select v-model="formData.level" prop="level" @change="changeDisable">
                                                <el-option label="一级" value="1"></el-option>
                                                <el-option label="二级" value="2"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogFormVisible4Edit = false" icon="el-icon-error" round></el-button>
                                <el-button type="primary" @click="handleEdit" icon="el-icon-success" round></el-button>
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
       pagination: {//分页相关模型数据
					  currentPage: 1,//当前页码
					  pageSize:5,//每页显示的记录数
					  total:0,//总记录数
					  queryString:null//查询条件   双向绑定
				},
				dataList: [],//当前页要展示的分页列表数据
                formData: {},//表单数据  添加检查项  formData提交给后台
                dialogFormVisible: false,//增加表单是否可见
                dialogFormVisible4Edit:false,//编辑表单是否可见
                disable: false,
                rules: {//校验规则
                    name: [
                            { required: true, message: '菜单名称为必填项', trigger: 'blur' }
                        ],
                    priprity: [
                        { required: true, message: '优先级为必填项', trigger: 'blur' }
                    ],
                    level:  [
                        { required: true, message: '等级为必填项', trigger: 'blur' }
                    ]
                }
    };
  },
    //钩子函数，VUE对象初始化完成后自动执行
            created() {
                this.findPage();        
        
            },
            methods:{

                handleEdit() {
                    this.$refs['dataEditForm'].validate(valid => {
                        if(valid) {
                            this.$http.post("api/menu/add",this.formData).then(res => {
                                if(res.data.flag) {
                                    this.dialogFormVisible4Edit=false;
                                    this.findPage();
                                    this.$message.success(res.data.message);
                                }else {
                                    this.$message.error(res.data.message);
                                }
                            })
                        }else {
                            this.$message({
                                type: 'error',
                                message: '表单数据校验失败，请重新输入!'
                            })
                        }
                    })
                },

                handleUpdate(row) {
                    this.disable = false;
                    this.dialogFormVisible4Edit=true;
                    this.formData=row;
                },
                handleDelete(row) {
                    this.$confirm("您确定要删除吗？",'提示',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'Warning'
                    }).then(() => {
                        this.$http.delete("api/menu/deleteMenuById/"+row.id).then(res => {
                            if(res.data.flag) {
                                this.pagination.currentPage=1;
                                this.pagination.queryString=null;
                                this.findPage();
                            }else{
                                this.$message.error(res.data.message);
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        })
                    })
                },

                findPageByCondition() {
                    this.pagination.currentPage=1
                    this.findPage();
                },
                handleCurrentChange(currentPage) {
                    this.pagination.currentPage=currentPage
                    this.findPage()
                },

                findPage() {
                    this.$http.post("api/menu/findPage",this.pagination).then(res => {
                       if(res.data.flag){
                            this.dataList=res.data.data.rows
                            this.pagination.total=res.data.data.total
                        }else{
                            this.$message.error(res.data.message)
                        }
                })
                },
                handleCreate() {
                    this.disable=false;
                    this.resetForm()
                    this.dialogFormVisible=true              
                },
                resetForm() {
                    this.formData={}
                },
                handleAdd() {
                    this.$refs['dataAddForm'].validate(valid => {
                        if(valid){
                            this.$http.post("api/menu/add",this.formData).then(res => {
                                this.dialogFormVisible=false
                                if(res.data.flag){
                                    this.findPage();
                                }else{
                                    this.$message.error(res.data.message)
                                }
                            })
                        }else{
                            this.$message.error("表单数据校验失败");
                        }
                    })
                },
                changeDisable() {
                    if(this.formData.level == 1) {
                        this.disable = true;
                        this.formData.linkUrl="";
                        this.formData.parentMenuId="";
                    } else {
                        this.disable = false;
                    }

                }

            }
  
};
</script>