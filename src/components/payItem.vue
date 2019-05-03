<template>
  <el-dialog class="div1" title="订单支付" :visible.sync="dialogFormAddSubjectVisible"  :show-close="false">
    <h4>请选择支付方式：</h4>
    <el-select v-model="key" placeholder="请选择">
      <el-option
        v-for="item in paymentData"
        :key="item.id"
        :label="item.value"
        :value="item.id">
      </el-option>
    </el-select>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleAddClose">确认支付</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import bus from './BUS.vue'
  import { Loading } from 'element-ui';

  export default {
    data () {
      return {
        key:'',
        id:'',
        form:{
          name:'',
          author:'',
          press:'',
          img:'',
          introduction:'',
          price:''
        },
        categoryId:0,
        dialogFormAddSubjectVisible: false,
        isLast:false,
        isLast2:false,
        paymentData:[
          {
            id : 1,
            value : '支付宝'
          },
          {
            id : 2,
            value : '微信'
          },
          {
            id : 3,
            value : '银联快捷支付'
          },
          {
            id : 4,
            value : '云闪付'
          },
          {
            id : 5,
            value : '网银'
          }
        ]
      }
    },
    watch:{
      "this.form": function (newValue) {
        console.log(newValue);
      }
    },
    methods:{
      handleAddClose(){  //点击保存按钮后把添加的内容发送给服务器
        if(this.key == ''){
          this.$message.error('请选择付款方式！');
        }
        else{
        var payTime = new Date();
        console.log(payTime);
        var params = new URLSearchParams();
        params.append('orderNum',this.id);
        params.append('paymentId',this.key);
        params.append('payTime',payTime);
        this.axios.post('http://localhost:8200/order/payOrder',params)
          .then( res => {
            this.dialogFormAddSubjectVisible = false;
            this.$message.success('支付成功！');
            bus.$emit("isLast7",true);
          })
          .catch( res => {
            this.$message.error('支付失败！');
          })
      }
      },
      handleClose () {
        this.dialogFormAddSubjectVisible = false
      }
    },
    mounted() {    //在组件的钩子函数中监听事件
      bus.$on('payItem', data => {   //获取值
        this.dialogFormAddSubjectVisible = data.flag;
       this.id = data.value;
      })
    }
  }
</script>

<style scoped>
.div1{
  width: 50%;
  position:fixed;

  margin:auto;

  left:0;

  right: 0;

  top:0;

  bottom: 0;
}
</style>

