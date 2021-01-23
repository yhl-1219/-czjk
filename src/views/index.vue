<template>
  <div class="hold-transition skin-purple sidebar-mini">
    <el-container>
      <el-header class="main-header" style="height:70px;">
        <nav class="navbar navbar-static-top">
          <!-- Logo -->
          <a href="#" class="logo" style="text-align:center">
            <span class="logo-lg">
              <img src="../assets/img/logo.png" />
            </span>
          </a>
          <div class="right-menu">
            <span class="help">
              <i class="fa fa-exclamation-circle" aria-hidden="true"></i>帮助
            </span>
            {{username}}
            <el-dropdown class="avatar-container right-menu-item" trigger="click">
              <div class="avatar-wrapper">
                <img src="../assets/img/user2-160x160.jpg" class="user-avatar" />
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item divided>
                  <span style="display:block;">
                    <a @click="editPassword">修改密码</a>
                  </span>
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <span style="display:block;">
                    <a @click="logout">退出</a>
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </nav>
      </el-header>
      <el-aside width="200px">
        <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
          <el-radio-button :label="true"><<-</el-radio-button>
          <el-radio-button :label="false">->></el-radio-button>
        </el-radio-group>
        <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
          <el-submenu v-for="menu in menuList" :index="menu.path" :key="menu.path">
            <template slot="title">
              {{menu.name}}&nbsp;
              <i class="fa" :class="menu.icon"></i>
            </template>
            <template v-for="child in menu.children">
              <el-menu-item :index="child.path" :key="child.path">
                <a @click="goMenu(child.linkUrl)" href="javascript:void(0);">{{child.name}}</a>
              </el-menu-item>
              </el-menu-item>
            </template>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
            <div class="add-form">
              <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
                <el-form ref="dataEdit" :model="password" :rules="rules" label-position="right" label-width="100px">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="旧密码" prop="old">
                          <el-input v-model="password.old" type="password"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                          <el-form-item label="新密码" prop="newPass">
                            <el-input v-model="password.newPass" type="password"/>
                          </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                          <el-form-item label="确认密码" prop="newConfirm">
                            <el-input v-model="password.newConfirm" type="password"/>
                          </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="passwordConfirm">确定</el-button>
                </div>
              </el-dialog>
            </div>
    </el-container>
  </div>
</template>
<script>
export default {
    data(){
        var validateOldPass = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        }
        callback();
      };
      var validateNewPass = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else if (value === this.password.old) {
            callback(new Error("旧密码和新密码不能一致！"));
        } else {
          callback();
        }
      };
      var validateNewPass2 = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.password.newPass) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
        return{
            isCollapse: true,
            menuList:[],
            password:{
                username: '',
                old: '',
                newPass: '',
                newConfirm: ''
            },
            username:'',
            dialogFormVisible: false,
            rules: {
              old: [{ validator: validateOldPass, trigger: "blur" }],
              newPass: [{ validator: validateNewPass, trigger: "blur" }],
              newConfirm: [{ validator: validateNewPass2, trigger: "blur" }],
            }
        }
    },
    methods:{
         //  用户退出功能
        logout(){
         window.sessionStorage.removeItem("username")
         window.sessionStorage.removeItem("token")
         this.$router.replace({ name: "/" });
        },

        goMenu:function(_name){
          if(_name != this.$router.currentRoute.name)
            this.$router.replace({ name: _name });
          else if(!_name)
            this.$message.warning("暂未开通该功能");
        },
        handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
         //查询菜单
    findAllMenu() {
      this.$http
        .post("api/menu/findAllMenuByUsername/" + this.username)
        .then((resp) => {
          if (resp.data.flag) {
            console.info(resp.data.data);
            this.menuList = resp.data.data.menu;
          }
        });
    },
    editPassword() {
      this.password={old: '',
                new: '',
                newConfirm: ''};
      this.dialogFormVisible = true;
    },
    passwordConfirm() {
      this.$refs['dataEdit'].validate(valid => {
          if(valid) {
              this.password.username = this.username;
              this.$http.post("api/user/changePassword",this.password).then(res=>{
                if(res.data.flag) {
                  this.dialogFormVisible = false;
                  this.logout();
                } else {
                  this.$message.error(res.data.message);
                } 
              });
            } else {
                this.$message.error("格式有误，请重新填写！");
            }
          });
    }
    },
   created(){
        //  当用户认证成功 直接从  sessionStorege对象中获取用户数据
        this.username = window.sessionStorage.getItem("username");
        this.findAllMenu();
    }
}
</script>
<style lang="scss">
@import "../assets/css/style.css";
</style>
<style type="text/css" scoped>
.el-main {
  position: absolute;
  top: 70px;
  bottom: 0px;
  left: 200px;
  right: 10px;
  padding: 0;
}
</style>