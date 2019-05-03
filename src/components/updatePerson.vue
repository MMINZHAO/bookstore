<template>
  <el-dialog title="更新资料" :visible.sync="dialogFormEditVisible" :show-close="false">
    <el-form>
      <el-form-item>
        <h3>ID</h3>
        <el-input v-model="form.id" disabled></el-input>
      </el-form-item>
      <el-form-item>
        <h3>用户名</h3>
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item>
        <h3>密码</h3>
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <h3>昵称</h3>
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item>
        <h3>用户类型</h3>
        <el-input v-model="form.qq" disabled></el-input>
      </el-form-item>
      <el-form-item>
        <h3>手机</h3>
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="clearImgs">取 消</el-button>
      <el-button type="primary" @click="handleEditClose">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import bus from './BUS.vue'
  import { Loading } from 'element-ui'
  export default {
    data () {
      return {
        categoryId:0,
        userEntity:{},
        form:{},
        dialogFormEditVisible:false,

      }
    },
    methods:{
      clearImgs() {
        this.dialogFormEditVisible = false;
      },
      handleEditClose(){
        //点击保存按钮后把修改的内容发送给服务器
        this.dialogFormEditVisible = false;
        var params = new URLSearchParams();
        params.append('id',this.form.id);
        params.append('username',this.form.username);
        params.append('password',this.form.password);
        params.append('nickname',this.form.nickname);
        params.append('phone',this.form.phone);
        this.axios.post('http://localhost:8200/user/updateUser',params)
          .then( res => {

            this.$message.success('修改成功！');
          })
          .catch( res => {
            this.$message.error('修改失败！');
          })
      },
    },
    mounted() {    //在组件的钩子函数中监听事件
      var userJsonStr = sessionStorage.getItem('userInfo');
      this.userEntity = JSON.parse(userJsonStr);
      console.log(this.userEntity.id);

      bus.$on('updatePerson', data => {   //获取值
        this.dialogFormEditVisible = data.flag;
        data.value.questionImg = {};
        data.value.answerImg = {};
        this.form = data.value;
        this.type = data.region;
        this.categoryId = data.type;
        this.handleImgs();
      })
    }
  }
</script>

<style scoped>
  .showimg {
    width: 300px!important;
    margin: 0;
    float: left!important;
    margin-left: 15px;
  }

  .tip{
    color:grey;
    display: block;
    padding: 15px ;
    font-size: 16px;
  }

  .myimg{
    display: block;
    width:200px;
    height: 150px;
    margin-top: 15px;
  }
</style>










