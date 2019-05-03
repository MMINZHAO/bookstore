<template>
  <el-dialog title="添加地址" :visible.sync="dialogFormAddSubjectVisible"  :show-close="false">
    <el-form :model="form">
      <el-form-item label="省/自治区/直辖市">
        <el-input v-model="form.province"></el-input>
      </el-form-item>
      <el-form-item label="市">
        <el-input v-model="form.city"></el-input>
      </el-form-item>
      <el-form-item label="区/县">
        <el-input v-model="form.area"></el-input>
      </el-form-item>
      <el-form-item label="具体地址">
        <el-input v-model="form.specific"></el-input>
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
        userEntity:{},
        form:{
          province:'',
          city:'',
          area:'',
          specific:''
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
        var params = new URLSearchParams();
        params.append('province',this.form.province);
        params.append('city',this.form.city);
        params.append('county',this.form.area);
        params.append('specific',this.form.specific);
        params.append('userId',this.userEntity.id);
        this.axios.post('http://localhost:8200/address/addAddress',params)
          .then( res => {
            this.$message.success('添加成功！');
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
        this.dialogFormAddSubjectVisible = false
      }
    },
    mounted() {    //在组件的钩子函数中监听事件
      var userJsonStr = sessionStorage.getItem('userInfo');
      this.userEntity = JSON.parse(userJsonStr);
      console.log(this.userEntity.id);

      bus.$on('addAddress', data => {   //获取值
        this.dialogFormAddSubjectVisible = data.flag;
      })
    }
  }
</script>

<style scoped>

</style>

