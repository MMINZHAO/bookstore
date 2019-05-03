<template>
  <el-dialog title="编辑地址" :visible.sync="dialogFormEditVisible" :show-close="false">
    <el-form>
      <el-form-item>
        <h3>ID</h3>
        <el-input v-model="form.id" disabled></el-input>
      </el-form-item>
      <el-form-item>
        <h3>省/自治区/直辖市</h3>
        <el-input v-model="form.province"></el-input>
      </el-form-item>
      <el-form-item>
        <h3>市</h3>
        <el-input v-model="form.city"></el-input>
      </el-form-item>
      <el-form-item>
        <h3>区/县</h3>
        <el-input v-model="form.area"></el-input>
      </el-form-item>
      <el-form-item>
        <h3>具体地址</h3>
        <el-input v-model="form.specific"></el-input>
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
        userEntity:{},
        form:{},
        dialogFormEditVisible:false,

      }
    },
    methods:{
      clearImgs() {
        this.dialogFormEditVisible = false;
      },
      handleEditClose(){  //点击保存按钮后把修改的内容发送给服务器
        this.dialogFormEditVisible = false;
        var params = new URLSearchParams();
        params.append('id',this.form.id);
        params.append('province',this.form.province);
        params.append('city',this.form.city);
        params.append('county',this.form.area);
        params.append('specific',this.form.specific);
        params.append('userId',this.userEntity.id);
        this.axios.post('http://localhost:8200/address/updateAddress',params)
          .then( res => {
            loadingInstance.close();
            this.$message.success('修改成功！');
          })
          .catch( res => {
            loadingInstance.close();
            this.$message.error('修改失败！');
          })
        this.clearImgs();
      },
    },
    mounted() {    //在组件的钩子函数中监听事件
      var userJsonStr = sessionStorage.getItem('userInfo');
      this.userEntity = JSON.parse(userJsonStr);
      console.log(this.userEntity.id);

      bus.$on('updateAddress', data => {   //获取值
        this.dialogFormEditVisible = data.flag;
        data.value.questionImg = {};
        data.value.answerImg = {};
        this.form = data.value;
        this.type = data.region;
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










