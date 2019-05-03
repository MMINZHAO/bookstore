<template>
  <div>
    <div class="table1" v-if="showCategory">
      <div class="myaction">
        <div class="first">
          <div class="left">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="搜索分类" class="myelform">
                <el-input v-model="searchCatename" placeholder="请输入类别名字"></el-input>
              </el-form-item>
              <el-form-item  class="myelform">
                <el-button type="primary" @click="searchCategory" icon="el-icon-search">查询</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="clearfix"></div>
        </div>
        <div class="clearfix"></div>

        <div class="bottom" v-if="showOption">
          <div class="left">
            <el-button icon="el-icon-plus" type="primary" @click="addCategory">添加分类</el-button>
          </div>

          <div class="clearfix"></div>
        </div>
        <div class="clearfix"></div>
      </div>



      <el-table
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        @selection-change="handleSelectionChange"
        border
        stripe
        style="width: 100%"
        :height="tableHeight"
        max-height="450"
        highlight-current-row
        :cell-style="styleFunc">
        <el-table-column
          prop="id"
          label="ID"
          width="80"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="catename"
          label="图书类别"
          width="150"
          align="center"
          show-overflow-tooltip>

        </el-table-column>
        <el-table-column
          prop="cateInfo"
          label="简介"
          width="300"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="查看该类别图书"
          width="150"
          align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" content="查看" placement="bottom-end">
              <el-button @click="getCategorySongs(scope.row.id)" type="success" size="mini"><i class="el-icon-circle-plus"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          v-if="showOption"
          label="操作"
          width="150"
          align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" content="编辑" placement="bottom-end">
              <el-button  size="mini" type="primary" @click="handleEdit(scope.row)"><i class="el-icon-edit"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="删除" placement="bottom-end">
              <el-button @click="deleteCategory(scope.row)" type="warning" size="mini"><i class="el-icon-delete"></i></el-button>
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
      <addCategory></addCategory>
    </div>
    <div>
    <div v-if="showSongs">
      <div class="myaction">
        <div class="first">
          <el-button type="primary" @click="backPage" icon="el-icon-back">返回分类</el-button>
          <div class="left">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="搜索图书" class="myelform">
                <el-input v-model="searchContent2" placeholder="请输入图书名称"></el-input>
              </el-form-item>
              <el-form-item  class="myelform">
                <el-button type="primary" @click="onSubmit2" icon="el-icon-search">查询</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="clearfix"></div>
        </div>
        <div class="clearfix"></div>

        <div class="bottom" v-if="showOption">
          <div class="left">
            <el-button icon="el-icon-plus" type="primary" @click="addBook">添加图书</el-button>
          </div>

          <div class="clearfix"></div>
        </div>
        <div class="clearfix"></div>
      </div>



      <el-table
        :data="bookData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        @selection-change="handleSelectionChange"
        border
        stripe
        style="width: 100%"
        :height="tableHeight"
        max-height="450"
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
          prop="img"
          label="图片"
          width="100"
          align="center"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-popover
              placement="right"
              title=""
              trigger="hover">
              <img :src="scope.row.img"/>
              <img slot="reference" :src="scope.row.img" :alt="scope.row.img" style="max-height: 50px;max-width: 130px">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="图书名字"
          width="150"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="category"
          label="图书类别"
          width="100"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="author"
          label="作者"
          width="100"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="press"
          label="出版社"
          width="150"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="introduction"
          label="简介"
          width="250"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="price"
          label="单价"
          width="100"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column v-if="showCart"
                         label="加入购物车"
                         width="182"
                         align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" content="加入购物车" placement="bottom-end">
              <el-button  size="mini" type="primary" @click="addShopcart(scope.row.id)"><i class="el-icon-circle-plus-outline"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="showOption"
                         label="管理"
                         width="182"
                         align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" content="编辑" placement="bottom-end">
              <el-button  size="mini" type="primary" @click="handleEdit2(scope.row)"><i class="el-icon-edit"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="删除" placement="bottom-end">
              <el-button  size="mini" type="danger" @click="handleDel2(scope.row.id)"><i class="el-icon-delete"></i></el-button>
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
      <el-menu
        :default-active="activeIndex2"
        class="el-menu-header"
        mode="horizontal"
        @select="handleSelect"
        background-color="darkolivegreen"
        text-color="#fff"
        active-text-color="#ffd04b">
      </el-menu>
    </div>
      <addBook></addBook>
      <updateCategory></updateCategory>
      <updateBook></updateBook>
    </div>
  </div>

</template>

<script>
  import bus from './BUS.vue'
  import addCategory from './addCategory.vue'
  import addBook from './addBook.vue'
  import updateCategory from './updateCategory'
  import updateBook from './updateBook'

  export default {
    data() {
      return {
        searchContent2:'',
        showCart:true,
        tableHeight:'250',
        cateID: 0,
        pageSize: '5',
        showFlag: true,
        showCategory: true,
        showSongs: false,
        pageSize: 5,
        showOption: false,
        currentPage: 1,
        count: 20,
        currentLimit: 100,
        searchCatename: '',
        searchContent: "",
        multipleSelection: [],
        form: "",
        tableData: [],
        bookData: [],
        isSerach: false,  //是否为提交搜索
        region: '0',
        isLast: false,
        loading: true,
        songData2: [],
        songList: {},
        cateID2: 0,
        addTime: new Date(),
      }
    },
    components: {
      addCategory,
      addBook,
      updateCategory,
      updateBook
    },
    methods: {
      deleteCategory(val){
        this.axios.get('http://localhost:8200/book/getCategoryBook', {
          params: {
            categoryId: val.id
          }
        })
          .then(res => {
            if (res.data.data.length != 0) {
              this.$message.error('该分类里有图书！不能删除！')
            }
            else {
              this.$confirm('确定删除该分类？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                var params = new URLSearchParams;
                params.append('id',val.id);
                  this.axios.post('http://localhost:8200/category/delCategory', params)
                    .then(res => {
                      this.$message.success('删除成功！');

                      this.axios.get('http://localhost:8200/category/getCategory', {
                        params: {}
                      })
                        .then(res => {
                          this.loading = false;
                          if (res.data.count != 0) {
                            this.tableData = res.data.data;
                            this.count = res.data.data.length;
                          }
                        })
                        .catch(res => {
                          this.loading = false;
                          console.log("error");
                        })

                    })
                    .catch(res => {
                      this.$message.error('删除失败！');
                    })
                }
              )
            }
          })
          .catch(res => {
            this.loading = false;
            console.log("error");
          })
      },
      backPage(){
        this.showSongs = false;
        this.showCategory = true;
        this.axios.get('http://localhost:8200/category/getCategory', {
          params: {}
        })
          .then(res => {
            this.loading = false;
            if (res.data.count != 0) {
              this.tableData = res.data.data;
              this.count = res.data.data.length;
              this.currentPage = 1;
            }
          })
          .catch(res => {
            this.loading = false;
            console.log("error");
          })
      },
      onSubmit2(){
        if (this.searchContent2 == "") {
          this.$message.error('搜索内容不能为空！');
        } else {
          this.loading = true;
          this.isSerach = true;
          this.axios.get('http://localhost:8200/book/searchBook', {
            params: {
              name: this.searchContent2,
              categoryId:this.cateID2
            }
          })
            .then(res => {
              this.loading = false;
              if (res.data.data.length != 0) {
                this.bookData = [];
                this.bookData = res.data.data;
                this.count = res.data.data.length;
                this.currentPage = 1;
              }
            })
            .catch(res => {
              this.loading = false;
              console.log("error");
            })
        }
      },
      searchCategory() {  //提交搜索内容
        if (this.searchCatename == "") {
          this.$message.error('搜索内容不能为空！');
        } else {
          this.loading = true;
          this.isSerach = true;
          this.axios.get('http://localhost:8200/category/searchCategory', {
            params: {
              catename: this.searchCatename
            }
          })
            .then(res => {
              this.loading = false;
              if (res.data.count != 0) {
                this.tableData = res.data.data;
                this.count = res.data.data.length;
                this.currentPage = 1;
              }
            })
            .catch(res => {
              this.loading = false;
              console.log("error");
            })
        }
      },
      getCategorySongs(id) {
        this.cateID = id;
        this.cateID2 = id;
        this.axios.get('http://localhost:8200/book/getCategoryBook', {
          params: {
            categoryId: id
          }
        })
          .then(res => {
            this.loading = false;
            if (res.data.data.length != 0) {
              this.bookData =[];
              this.bookData = res.data.data;
              console.log(this.bookData);
              this.count = res.data.data.length;
              this.showCategory = false;
              this.showSongs = true;
              this.currentPage = 1;
              bus.$emit("getCateId", {type: this.cateID});
            }
            else{
              this.bookData = [];
              this.showCategory = false;
              this.showSongs = true;
              this.$message.error('该类别下暂时没有图书!');
            }
          })
          .catch(res => {
            this.loading = false;
            console.log("error");
          })
      },
      handleEdit(param) {   //点击编辑时向editinfo发送消息
        bus.$emit("updateCategory", {flag: true, value: param, region: this.region});
      },
      handleEdit2(param) {
        bus.$emit("updateBook", {flag: true, value: param, region: this.region})
      },
      handleDel2(id) {
        this.$confirm('确定删除该书籍？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          var params = new URLSearchParams();
          params.append("id", id);
          this.axios.post('http://localhost:8200/book/delBook', params)
            .then(res => {
              this.$message.success('删除成功！');
              //删除成功后重新请求当前页
              this.axios.get('http://localhost:8200/book/getCategoryBook', {
                params: {
                  categoryId: this.cateID
                }
              })
                .then(res => {
                  this.loading = false;
                  if (res.data.count != 0) {
                    this.bookData = res.data.data;
                    console.log(this.bookData);
                    this.count = res.data.data.length;
                    this.showCategory = false;
                    this.showSongs = true;
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
              this.$message.error('删除失败！');
            })
        }).catch(() => {
        });
      },
      addCategory() {  //添加一条题目
        if (this.currentPage == Math.ceil(this.count / this.currentLimit)) //判断是否是最后一页
          this.isLast = true;
        bus.$emit("addCategory", {flag: true, type: this.region, isLast: this.isLast});
      },
      handleSizeChange(val) {  //更改每页的数量,重新发起请求
        this.loading = true;
        this.pageSize = val;
        this.tableHeight = val * 40;
      },
      handleCurrentChange(val) {  //更改当前页,重新发起请求
        this.loading = true;
        this.currentPage = val;

      },
      styleFunc(row, rowIndex) {   //更改样式
        return {padding: '5px 0', hieght: '23px', lineHeight: '23px'}
      },
      handleSelectionChange(val) {   //处理多选框变化
        this.multipleSelection = val;
      },
      addBook() {  //添加一条题目
        if (this.currentPage == Math.ceil(this.count / this.currentLimit)) //判断是否是最后一页
          this.isLast = true;
        bus.$emit("addBook", {flag: true, type: this.cateID2, isLast: true});
      },
      addShopcart(id) {
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
        myDate.toLocaleDateString();     //获取当前日期
        let params = new URLSearchParams;
        params.append("bookId",id);
        params.append("userId",this.userEntity.id);
        params.append("bookNum",1);
        params.append("addTime",myDate);
        this.axios.post('http://localhost:8200/shopcart/addShopcart',params)
          .then( res => {
            this.$message.success('添加成功！');
          })
          .catch( res => {
            loadingInstance.close();
            this.$message.error('添加失败！');
          })
      },
    },
      mounted() {

        //判断登录用户类型，管理员显示操作
        var userJsonStr = sessionStorage.getItem('userInfo');
        this.userEntity = JSON.parse(userJsonStr);
        console.log(this.userEntity.type);
        if (this.userEntity.qq == 2) {
          this.showOption = true;
          this.showCart = false;
        }
        //加载页面时默认请求第一类型数据
        this.axios.get('http://localhost:8200/category/getCategory', {
          params: {}
        })
          .then(res => {
            this.loading = false;
            if (res.data.count != 0) {
              this.tableData = res.data.data;
              this.count = res.data.data.length;
              this.currentPage = 1;
            }
          })
          .catch(res => {
            this.loading = false;
            console.log("error");
          })


        bus.$on('getCateId', data => {   //获取值
          this.cateID2 = data.type;
        })

        var target = this;
        var lastPage = 0;
        //监听增加分类发来的信息
        bus.$on('isLast', function (data) {
          this.axios.get('http://localhost:8200/category/getCategory', {
            params: {}
          })
            .then(res => {
              target.tableData = res.data.data;
              target.count = res.data.data.length;
              lastPage = Math.ceil(target.count / target.pageSize);
              target.currentPage = lastPage;
              console.log(target.count);
              console.log(target.pageSize);
              console.log(lastPage);
            })
            .catch(res => {
              console.log("error");
            })
        });
        var target2 = this;
        var lastPage = 0;

        //监听增加书籍发来的信息
        bus.$on('isLast2', function (data) {
          this.axios.get('http://localhost:8200/book/getCategoryBook', {
            params: {
              categoryId: data.type,
            }
          })
            .then(res => {
              target2.bookData = res.data.data;
              target2.count = res.data.data.length;
              lastPage = Math.ceil(target2.count / target2.pageSize);
              target2.currentPage = lastPage;
              console.log(target2.count);
              console.log(target2.pageSize);
              console.log(lastPage);
            })
            .catch(res => {
              console.log("error");
            })
        });
      },

  }
</script>

<style scoped>

  .table1 {
    height: 500px;
  }
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

  a:link {
    text-decoration: none;
  }
  a{
    font-size: 20px;
    color: black;
  }
  .el-menu-header{
    left: 0;
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 100;
  }
</style>

