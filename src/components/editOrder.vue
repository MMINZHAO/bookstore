<template>
  <el-dialog title="修改订单" :visible.sync="dialogFormEditVisible" :show-close="false">
    <el-form>
      <el-form-item>
        <h3>订单号：</h3>
        <el-input v-model="form.order_num" disabled></el-input>
      </el-form-item>
      <el-form-item>
        <h3>用户名：</h3>
        <el-input v-model="form.username" disabled></el-input>
      </el-form-item>
      <el-form-item>
        <h3>订单金额：</h3>
        <el-input v-model="form.totalPrice"></el-input>
      </el-form-item>
      <el-form-item>
        <h3>收货地址：</h3>
        <el-input v-model="form.address" disabled></el-input>
      </el-form-item>
      <el-form-item>
        <h3>支付状态：</h3>
        <el-input v-model="form.state" disabled></el-input>
      </el-form-item>
      <el-form-item>
        <h3>创建时间：</h3>
        <el-input v-model="form.createTime" disabled></el-input>
      </el-form-item>
      <el-form-item>
        <h3>支付方式：</h3>
        <el-input v-model="form.payment" disabled></el-input>
      </el-form-item>
      <el-form-item>
        <h3>支付时间：</h3>
        <el-input v-model="form.payTime" disabled></el-input>
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
        console.log(this.form.category);
        console.log(this.form.name);
        this.dialogFormEditVisible = false;
        var params = new URLSearchParams();
        params.append('id',this.form.id);
        params.append('price',this.form.price);
        this.axios.post('http://localhost:8200/order/updateOrder',params)
          .then( res => {
            loadingInstance.close();
            this.$message.success('修改成功！');
            console.log(this.categoryId);
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

      bus.$on('editOrder', data => {   //获取值
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










