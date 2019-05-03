<template>
  <div>
    <div class="myaction">
      <div class="first">
        <!--<div class="left">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="搜索购物车" class="myelform">
              <el-input v-model="searchContent" placeholder="请输入图书名称"></el-input>
            </el-form-item>
            <el-form-item  class="myelform">
              <el-button type="primary" @click="onSubmit" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>-->

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
      :height="tableHeight"
      max-height="449"
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
        prop="bookname"
        label="图书名称"
        width="150"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="book_num"
        label="数量"
        width="100"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格"
        width="100"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="add_time"
        label="加入时间"
        width="200"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
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
    <h3>总价￥：{{totalPrice}}.00 元</h3>
    <h4>请选择收货地址：</h4>
    <el-select v-model="key" placeholder="请选择">
      <el-option
        v-for="item in addressData"
        :key="item.id"
        :label="item.value"
        :value="item.id">
      </el-option>
    </el-select>
    <el-button type="primary" @click="buyThis" icon="el-icon-success">确认购买</el-button>
  </div>
</template>

<script>
  import bus from './BUS.vue'

  export default {
    data () {
      return {
        pageSize:5,
        tableHeight:200,
        key:'',
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
        buyData:[],
        addressData:{},
        totalPrice:0
      }
    },
    methods:{
    onSubmit(){  //提交搜索内容
        if ( this.searchContent == "") {
          this.$message.error('搜索内容不能为空！');
        }else{
          this.loading = true;
          this.isSerach = true;
          this.axios.get('http://localhost:8080/searchQuestions',{
            params: {
              page:this.currentPage,
              limit:this.currentLimit,
              data:this.searchContent
            }
          })
            .then( res => {
              this.loading = false;
              this.tableData = [];
              this.tableData = res.data.data;
              this.count = res.data.count;
              this.currentPage = 1;
            })
            .catch( res => {
              this.loading = false;
              console.log("error");
            })
        }
      },
      handleDel(id){   //删除一条记录
        this.$confirm('将该商品移除购物车？, 是否继续?', '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          var params = new URLSearchParams();
          params.append("id",id);
          this.axios.post('http://localhost:8200/shopcart/delShopcart',params)
            .then( res => {
              this.$message.success('移除成功！');
              //删除成功后重新请求当前页
              this.axios.get('http://localhost:8200/shopcart/getShopcart',{
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
            })
            .catch( res => {
              this.loading = false;
              this.$message.error('删除失败！');
            })
        }).catch(() => {
        });
      },
      handleSizeChange(val) {  //更改每页的数量,重新发起请求
        this.loading = true;
        this.currentLimit = val;
        this.pageSize = val;
        this.tableHeight = val * 40;
        if (this.isSerach) {    //如果是搜索页
          this.axios.get('http://172.20.10.14:8080/searchQuestions',{
            params: {
              page:this.currentPage,
              limit:this.currentLimit,
              data:this.searchContent
            }
          })
            .then( res => {
              this.loading = false;
              this.tableData = [];
              this.tableData = res.data.data;
              this.count = res.data.count;
              this.currentPage = 1;
            })
            .catch( res => {
              this.loading = false;
              console.log("error");
            })
        } else {   //平常页
          this.axios.get('http://localhost:8000/song/getSongs',{
            params: {
              page: this.currentPage,
              limit:val,
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
        }
      },
      handleCurrentChange(val) {  //更改当前页,重新发起请求
        this.loading = true;
        this.currentPage = val;
        if (this.isSerach) {   //如果是搜索内容页面切换
          this.axios.get('http://172.20.10.14:8080/searchQuestions',{
            params: {
              page:this.currentPage,
              limit:this.currentLimit,
              data:this.searchContent
            }
          })
            .then( res => {
              this.loading = false;
              this.tableData = [];
              this.tableData = res.data.data;
              this.count = res.data.count;
            })
            .catch( res => {
              this.loading = false;
              console.log("error");
            })
        } else {
          this.axios.get('http://localhost:8000/song/getSongs',{
            params: {
              page: val,
              limit:this.currentLimit,
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
        }
      },
      styleFunc(row,rowIndex){   //更改样式
        return {padding:'5px 0',hieght:'23px',lineHeight:'23px'}
      },
      handleSelectionChange(val) {   //处理多选框变化
        this.multipleSelection = val;
        this.totalPrice = 0;
        for(var i = 0; i < this.multipleSelection.length; i++){
          this.totalPrice += this.multipleSelection[i].price;
        }
      },
      /*computeTotal(){
      var totalItem = this.multipleSelection;
      var count = totalItem.length;
      this.totalPrice = 0;
      if (count == 0){
        this.$message.error('未选中商品！！！');
      }
      else {
        for(var i = 0; i < count; i++){
          this.totalPrice += totalItem[i].price;
        }
      }
      },*/
      buyThis() {  //批量删除
        var myDate = new Date();
        myDate.getYear();        //获取当前年份(2位)
        myDate.getFullYear();    //获取完整的年份(4位,1970-????)
        myDate.getMonth();       //获取当前月份(0-11,0代表1月)
        myDate.getDate();        //获取当前日(1-31)
        myDate.getDay();         //获取当前星期X(0-6,0代表星期天)
        myDate.getTime();        //获取当前时间(从1970.1.1开始的毫秒数)
        myDate.getHours();       //获取当前小时数(0-23)
        myDate.getMinutes();     //获取当前分钟数(0-59)
        myDate.getSeconds();     //获取当前秒数(0-59)
        var delTarget = this.multipleSelection;
        var count = delTarget.length;
        var str = "";
        if (count == 0) {
          this.$message.error("请至少选择一项购买");
          return false;
        } else {
          for (var i = 0; i < count; i++) {//将需要删除的id凭借为字符串发往服务器
            str += delTarget[i].id + ",";
          }
          if (this.key == '') {
            this.$message.error('请选择收货地址！！');
          }
          else {
            this.$confirm('确定提交订单？, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.loading = true;
              var params = new URLSearchParams();
              params.append("totalPrice", this.totalPrice);
              params.append("userId", this.userEntity.id);
              params.append("createTime", myDate);
              params.append("addressId", this.key);
              this.loading = true;
              this.axios.post('http://localhost:8200/order/addOrder', params)
                .then(res => {
                  this.$message.success('提交成功！');
                  var params = new URLSearchParams;
                  params.append("data", str);
                  this.axios.post('http://localhost:8200/shopcart/bachDelShopcart', params)
                    .then(res => {
                      //删除成功后其重新请求当前页
                      this.axios.get('http://localhost:8200/shopcart/getShopcart', {
                        params: {
                          userId: this.userEntity.id
                        }
                      })
                        .then(res => {
                          this.loading = false;
                          if (res.data.total != 0) {
                            this.tableData = res.data.data;
                            this.count = res.data.data.length;
                            this.currentPage = 1;
                          }

                        })
                        .catch(res => {
                          this.loading = false;
                          console.log("error");
                        })
                    })
                    .catch(res => {
                      this.loading = false;
                      console.log("error");
                    })

                })
                .catch(res => {
                  this.loading = false;
                  this.$message.error('删除失败！');
                })
            }).catch(() => {
            })
          }
        }
      }
    },
    mounted(){
      //加载页面时默认请求第一类型数据
      var userJsonStr = sessionStorage.getItem('userInfo');
      this.userEntity = JSON.parse(userJsonStr);
      console.log(this.userEntity.id);

      this.axios.get('http://localhost:8200/address/getSelectAddress',{
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

      this.axios.get('http://localhost:8200/shopcart/getShopcart',{
        params: {
          userId:this.userEntity.id
        }
      })
        .then( res => {
          this.loading = false;
          if (res.data.total != 0) {
            this.tableData = res.data.data;
            this.count = res.data.data.length;
            this.currentPage = 1;
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

