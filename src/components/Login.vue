<template>
  <el-form :model="form" :rules="rules2" ref="form" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="form.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="form.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click="login" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>


<script>
//   import { requestLogin } from '../api/api';
  import NProgress from 'nprogress'
  export default {
    data() {
      return {
        userData:{},
        userInfo:{},
        logining: false,
        form: {
          username: 'qwer123',
          password: '123456'
        },
        rules2: {
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    watch:{
      "this.form": function (newValue) {
        console.log(newValue);
      }
    },
    methods: {
      login(){  //登录
        if ( this.form.username == "") {
          this.$message.error('用户名不能为空！');
        }else if(this.form.password == ""){
          this.$message.error('密码不能为空！');
        }else
        var params = new URLSearchParams();
        params.append('username',this.form.username);
        params.append('password',this.form.password);
          this.axios.post('http://localhost:8200/login/login',params)
            .then( res => {
              console.log(res.data);
              this.userData = res.data;
              this.logining = true;
              console.log(this.userData.id);
              this.$message.success('登录成功！');
              NProgress.start();
              setTimeout(() => {
                sessionStorage.clear()
                sessionStorage.setItem('userInfo', JSON.stringify(res.data));
                this.logining = false;
                NProgress.done();
                this.$router.push({ path: '/Home' });
              }, 1000);
              console.log(this.userInfo);
            })
            .catch( res => {
              this.logining = false;
              console.log("error");
            })
        },
      eeelogin(ev) {
        var _this = this;
        this.$refs.form.validate((valid) => {
          if (valid) {
            let loginParams = { username: this.form.username, password: this.form.password };
            this.logining = true;
            NProgress.start();
            setTimeout(() => {
                sessionStorage.clear()
                sessionStorage.setItem('userInfo', JSON.stringify(loginParams));
                _this.logining = false;
                NProgress.done();
                 _this.$router.push({ path: '/Home' });
            }, 1000);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
