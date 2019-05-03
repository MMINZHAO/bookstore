<template>
  <div>
    <div class="myaction">

      <div class="clearfix"></div>
      <div class="bottom" v-if="showManage">
        <div class="left">
          <el-button icon="el-icon-plus" type="primary" @click="addMessage">添加消息</el-button>
        </div>

        <div class="clearfix"></div>
      </div>
      <div class="clearfix"></div>
    </div>
<h3>图书更新消息：</h3>
    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      border
      stripe
      style="width: 100%"
      :height="tableHeight"
      max-height="449"
      highlight-current-row
      :cell-style="styleFunc">
      <el-table-column
        prop="id"
        label="ID"
        width="70"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="updateContent"
        label="更新内容"
        width="300"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
        width="200"
        align="center"
        show-overflow-tooltip>
      </el-table-column>

      <el-table-column
        v-if="showManage"
        label="管理"
        width="200"
        align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" content="删除" placement="bottom-end">
            <el-button  size="mini" type="danger" @click="handleDel(scope.row.id)"><i class="el-icon-delete"></i></el-button>
          </el-tooltip>

        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
      </el-pagination>
    </div>
    <addMessage></addMessage>
  </div>
</template>

<script>
  import bus from './BUS.vue'
  import addMessage from './addMessage'

  export default {
    data () {
      return {
        tableHeight:200,
        pageSize:5,
        showManage:false,
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
        isLast3: false
      }
    },
    components:{
      addMessage
    },
    methods:{
      addMessage(){
        bus.$emit("addMessage",{flag:true})
      },
      handleDel(id){   //删除一条记录
        this.$confirm('删除该消息？, 是否继续?', '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          var params = new URLSearchParams();
          params.append("id",id);
          this.axios.post('http://localhost:8200/message/delMessage',params)
            .then( res => {
              this.$message.success('删除成功！');
              //删除成功后重新请求当前页
              this.axios.get('http://localhost:8200/message/getMessage',{
                params: {
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
            })
            .catch( res => {
              this.loading = false;
              this.$message.error('删除失败！');
            })
        }).catch(() => {
        });
      },
      handleSizeChange(val) {  //更改每页的数量,重新发起请求
       this.pageSize = val;
       this.tableHeight = val * 40;
      },
      handleCurrentChange(val) {  //更改当前页,重新发起请求
        this.loading = true;
        this.currentPage = val;
      },
      styleFunc(row,rowIndex){   //更改样式
        return {padding:'5px 0',hieght:'23px',lineHeight:'23px'}
      },
      handleSelectionChange(val) {   //处理多选框变化
        this.multipleSelection = val;
      },
    },
    mounted(){ //加载页面时默认请求第一类型数据
      var userJsonStr = sessionStorage.getItem('userInfo');
      this.userEntity = JSON.parse(userJsonStr);
      console.log(this.userEntity.id);
      if(this.userEntity.qq == 2){
        this.showManage = true;
      }

      this.axios.get('http://localhost:8200/message/getMessage',{
        params: {
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

      bus.$on('isLast3', data =>{
        this.axios.get('http://localhost:8200/message/getMessage',{
          params: {
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
      }
      )
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

