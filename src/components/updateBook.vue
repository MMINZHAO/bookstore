<template>
  <el-dialog title="编辑图书" :visible.sync="dialogFormEditVisible" :show-close="false">
    <el-form>
      <el-form-item>
        <h3>ID</h3>
        <el-input v-model="form.id" disabled></el-input>
      </el-form-item>
      <el-form-item>
        <h3>图片</h3>
        <el-input v-model="form.img"></el-input>
      </el-form-item>
      <el-form-item>
        <h3>图书名字</h3>
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item>
        <h3>图书类别</h3>
        <el-input v-model="form.category" disabled></el-input>
      </el-form-item>
      <el-form-item>
        <h3>作者</h3>
        <el-input v-model="form.author"></el-input>
      </el-form-item>
      <el-form-item>
        <h3>出版社</h3>
        <el-input v-model="form.press"></el-input>
      </el-form-item>
      <el-form-item>
        <h3>简介</h3>
        <el-input v-model="form.introduction"></el-input>
      </el-form-item>
      <el-form-item>
        <h3>单价</h3>
        <el-input v-model="form.price"></el-input>
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
        params.append('name',this.form.name);
        params.append('author',this.form.author);
        params.append('press',this.form.press);
        params.append('img',this.form.img);
        params.append('price',this.form.price);
        params.append('introduction',this.form.introduction);
        params.append('catename',this.form.category)
        this.axios.post('http://localhost:8200/book/updateBook',params)
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

      bus.$on('updateBook', data => {   //获取值
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










