<template>
  <div>
    <div class="myaction">
      <div class="first">
        <div class="left">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="我的地址：" class="myelform">
            </el-form-item>
            <el-button icon="el-icon-plus" type="primary" @click="addAddress">添加地址</el-button>
          </el-form>
        </div>

        <div class="clearfix"></div>
      </div>
      <div class="clearfix"></div>
      <div class="clearfix"></div>
    </div>

    <el-table
      :data="addressData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      @selection-change="handleSelectionChange"
      border
      stripe
      style="width: 100%"
      :height="tableHeight"
      max-height="450"
      highlight-current-row
      :cell-style="styleFunc">
      <el-table-column
        type="selection"
        width="60"
        align="center">
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID"
        width="70"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="province"
        label="省/自治区/直辖市"
        width="150"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="city"
        label="市"
        width="150"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="area"
        label="区/县"
        width="150"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="specific"
        label="具体"
        width="200"
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
    <addAddress></addAddress>
    <updateAddress></updateAddress>
  </div>
</template>

<script>
  import bus from './BUS.vue'
  import addAddress from './addAddress'
  import updateAddress from './updateAddress'

  export default {
    data () {
      return {
        tableHeight:'',
        currentPage:1,
        pageSize:5,
        count:20,
        currentLimit:100,
        searchContent:"",
        multipleSelection: [],
        form:"",
        addressData:[],
        isSerach:false,  //是否为提交搜索
        isLast:false,
        loading:true,
        userEntity:{},
      }
    },
    components:{
      addAddress,
      updateAddress
    },
    methods:{
      handleDel(id){   //删除一条记录
        this.$confirm('确定删除该地址？', '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          var params = new URLSearchParams();
          params.append("id",id);
          this.axios.post('http://localhost:8200/address/delAddress',params)
            .then( res => {
              this.$message.success('删除成功！');
              //删除成功后重新请求当前页
              this.axios.get('http://localhost:8200/address/getAddress',{
                params: {
                  userId:this.userEntity.id
                }
              })
                .then( res => {
                  this.loading = false;
                  if (res.data.total != 0) {
                    this.addressData = res.data.data;
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
      handleEdit(param){
        bus.$emit("updateAddress", {flag:true,value:param,region:this.region});
      },
      handleSizeChange(val) {  //更改每页的数量,重新发起请求
        this.loading = true;
        this.currentLimit = val;
        this.tableHeight = val * 40;
        //平常页
          this.axios.get('http://localhost:8000/song/getSongs',{
            params: {
              userId:this.userEntity.id
            }
          })
            .then( res => {
              this.loading = false;
              this.tableData = res.data;
              this.count = res.data.count;
            })
            .catch( res => {
              this.loading = false;
              console.log("error");
            })

      },
      handleCurrentChange(val) {  //更改当前页,重新发起请求
        this.loading = true;
        this.currentPage = val;

          this.axios.get('http://localhost:8000/addrSess/getAddress',{
            params: {
              userId:this.userEntity.id
            }
          })
            .then( res => {
              this.loading = false;
              this.tableData = res.data.data;
              this.count = res.data.count;
            })
            .catch( res => {
              this.loading = false;
              console.log("error");
            })

      },
      styleFunc(row,rowIndex){   //更改样式
        return {padding:'5px 0',hieght:'23px',lineHeight:'23px'}
      },
      handleSelectionChange(val) {   //处理多选框变化
        this.multipleSelection = val;
      },
      addAddress(){
        bus.$emit("addAddress", {flag:true});
      }
    },
    mounted(){ //加载页面时默认请求第一类型数据
      this.tableHeight = this.pageSize * 40;
      var userJsonStr = sessionStorage.getItem('userInfo');
      this.userEntity = JSON.parse(userJsonStr);
      console.log(this.userEntity.id);

      this.axios.get('http://localhost:8200/address/getAddress',{
        params: {
          userId:this.userEntity.id
        }
      })
        .then( res => {
          this.loading = false;
          if (res.data.total != 0) {
            this.addressData = res.data.data;
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

