<template>
  <el-dialog title="添加图书更新消息" :visible.sync="dialogFormAddSubjectVisible"  :show-close="false">
    <el-form :model="form">
      <el-form-item label="更新内容">
        <el-input v-model="form.content" type="textarea"></el-input>
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
          content:''
        },
        dialogFormAddSubjectVisible: false,
        isLast3:false
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
        params.append('updateContent',this.form.content);
        this.axios.post('http://localhost:8200/message/addMessage',params)
          .then( res => {
            loadingInstance.close();
            this.$message.success('添加成功！');
            bus.$emit("isLast3",true);
          })
          .catch( res => {
            loadingInstance.close();
            this.$message.error('添加失败！');
          })
        if (this.isLast) {
          bus.$emit("isLast3",true);
        }
        this.handleClose();
      },
      handleClose () {
        this.form = {};
        this.dialogFormAddSubjectVisible = false
      }
    },
    mounted() {    //在组件的钩子函数中监听事件
      bus.$on('addMessage', data => {   //获取值
        this.dialogFormAddSubjectVisible = data.flag;
      })
    }
  }
</script>

<style scoped>

</style>

