<template>
  <div>
    <div>
      <div class="myaction">
        <div class="first">
          <h2>我的资料：</h2>

          <div class="clearfix"></div>
        </div>
        <div class="clearfix"></div>

        <div class="clearfix"></div>
      </div>

      <el-table
        :data="tableData"
        @selection-change="handleSelectionChange"
        border
        stripe
        style="width: 100%"
        max-height="449"
        highlight-current-row
        :cell-style="styleFunc">
        <el-table-column
          prop="id"
          label="ID"
          width="100"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="140"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="password"
          label="密码"
          width="120"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="昵称"
          width="160"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="qq"
          label="用户类型"
          width="120"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          width="140"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="管理"
          width="200"
          align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" content="编辑" placement="bottom-end">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)"><i class="el-icon-edit"></i></el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
    </div>
    <updatePerson></updatePerson>
  </div>
</template>

<script>
  import bus from './BUS.vue'
  import updatePerson from './updatePerson'

  export default {
    data () {
      return {
        currentPage:1,
        count:10,
        currentLimit:20,
        searchContent:"",
        multipleSelection: [],
        form:"",
        tableData:[],
        isSerach:false,  //是否为提交搜索
        isLast:false,
        loading:true,
        userEntity:{},
        user_id:1,
      }
    },
    components:{
      updatePerson
    },
    methods:{
      handleEdit(param){
        bus.$emit("updatePerson", {flag:true,value:param,region:this.region});
      },
    },
    mounted(){ //加载页面时默认请求第一类型数据
      var userJsonStr = sessionStorage.getItem('userInfo');
      this.userEntity = JSON.parse(userJsonStr);
      console.log(this.userEntity.id);

      this.axios.get('http://localhost:8200/user/getPerson',{
        params: {
          userId:this.userEntity.id
        }
      })
        .then( res => {
          this.loading = false;
          if (res.data.total != 0) {
            this.tableData = res.data.data;
            this.count = res.data.data.length;
          }

        })
        .catch( res => {
          this.loading = false;
          console.log("error");
        })

      var target = this;
      //监听增加题目发来的信息
    },
  }
</script>

<style scoped>

  .myaction {
    margin-top: 15px;
  }

  .first {
    vertical-align: top;
  }

  .left {
    margin-left: 10px;
  }

  .left div {
    display: inline-block;
  }

  .left span,
  .left div,
  .left button {
    float: left;
    margin-left: 20px;
  }

  .left span {
    display: inline-block;
    height: 38px;
    line-height: 38px;
  }

  .right {
    float: right;
    margin-right: 25px;
  }

  .bottom {
    margin: 10px 20px;
  }

  .bottom button {
    margin-right: 10px;
  }
  .clearfix{
    clear:both;
  }

  .myelform{
    margin-bottom: 5px;
  }

  .block{
    margin:10px;
  }


</style>

