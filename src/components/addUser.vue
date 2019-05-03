<template>
  <el-dialog title="添加用户" :visible.sync="dialogFormAddSubjectVisible"  :show-close="false">
    <el-form :model="form">
      <el-form-item label="用户名">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户类型">
        <el-input v-model="form.qq" type="number" placeholder="输入1或者2（1：用户；2：管理员）"></el-input>
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleAddClose">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import bus from './BUS.vue'
  import { Loading } from 'element-ui';

  export default {
    data () {
      return {
        form:{
          username:'',
          password:'',
          nickname:'',
          qq:'',
          phone:''
        },
        dialogFormAddSubjectVisible: false,
        isLast:false
      }
    },
    watch:{
      "this.form": function (newValue) {
        console.log(newValue);
      }
    },
    methods:{
      handleAddClose(){  //点击保存按钮后把添加的内容发送给服务器
        this.dialogFormAddSubjectVisible = false;
        var loadingInstance = Loading.service({   //读取文件时显示加载条
          target:'#container',
          text:'添加中...'
        });
        var params = new URLSearchParams();
        params.append('username',this.form.username);
        params.append('password',this.form.password);
        params.append('nickname',this.form.nickname);
        params.append('qq',this.form.qq);
        params.append('phone',this.form.phone);
        this.axios.post('http://localhost:8200/user/addUser',params)
          .then( res => {
            loadingInstance.close();
            this.$message.success('添加成功！');
            bus.$emit("isLast",true);
          })
          .catch( res => {
            loadingInstance.close();
            this.$message.error('添加失败！');
          })
        if (this.isLast) {
          bus.$emit("isLast",true);
        }
        this.handleClose();
      },
      handleClose () {
        this.form = {};
        this.dialogFormAddSubjectVisible = false
      }
    },
    mounted() {    //在组件的钩子函数中监听事件
      bus.$on('addUser', data => {   //获取值
        this.dialogFormAddSubjectVisible = data.flag;
        this.type = data.type;
        this.isLast = data.isLast;
      })
    }
  }
</script>

<style scoped>

</style>

