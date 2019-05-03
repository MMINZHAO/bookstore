<template>
  <el-dialog title="添加图书类别" :visible.sync="dialogFormAddSubjectVisible"  :show-close="false">
    <el-form :model="form">
      <el-form-item label="类别名称">
        <el-input v-model="form.catename"></el-input>
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="form.cateInfo"></el-input>
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
          catename:'',
          cateInfo:'',
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
        params.append('catename',this.form.catename);
        params.append('cateInfo',this.form.cateInfo);
        this.axios.post('http://localhost:8200/category/addCategory',params)
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
      bus.$on('addCategory', data => {   //获取值
        this.dialogFormAddSubjectVisible = data.flag;
        this.type = data.type;
        this.isLast = data.isLast;
      })
    }
  }
</script>

<style scoped>

</style>

