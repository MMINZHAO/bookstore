<template>
  <el-dialog title="添加图书" :visible.sync="dialogFormAddSubjectVisible"  :show-close="false">
    <el-form :model="form">
      <el-form-item label="图片路径（放在bookstore-front/static目录下）">
        <el-input v-model="form.img" placeholder="填写示例: book1.jpg"></el-input>
      </el-form-item>
      <el-form-item label="图书名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="form.author"></el-input>
      </el-form-item>
      <el-form-item label="出版社">
        <el-input v-model="form.press"></el-input>
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="form.introduction"></el-input>
      </el-form-item>
      <el-form-item label="单价">
        <el-input v-model="form.price"></el-input>
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
        isLast2:false
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
          text:'题目上传中...'
        });
        var params = new URLSearchParams();
        params.append('name',this.form.name);
        params.append('author',this.form.author);
        params.append('press',this.form.press);
        params.append('img','../static/'+ this.form.img);
        params.append('price',this.form.price);
        params.append('introduction',this.form.introduction);
        params.append('categoryId',this.categoryId);
        this.axios.post('http://localhost:8200/book/addBook',params)
          .then( res => {
            loadingInstance.close();
            this.$message.success('添加成功！');
            console.log(this.categoryId);
            bus.$emit("isLast2",{type:this.categoryId});
          })
          .catch( res => {
            loadingInstance.close();
            this.$message.error('添加失败！');
            console.log(this.categoryId);
          })
        this.handleClose();
      },
      handleClose () {
        this.dialogFormAddSubjectVisible = false
      }
    },
    mounted() {    //在组件的钩子函数中监听事件
      bus.$on('addBook', data => {   //获取值
        this.dialogFormAddSubjectVisible = data.flag;
        this.categoryId = data.type;
        this.isLast = data.isLast;
      })
    }
  }
</script>

<style scoped>

</style>

