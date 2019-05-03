<template>
    <div>
        <div class="myaction">
            <div class="first">
                <div class="left">
                <el-form :inline="true" class="demo-form-inline">
                        <el-form-item label="搜索用户" class="myelform">
                            <el-input v-model="searchContent" placeholder="请输入用户账号"></el-input>
                        </el-form-item>
                        <el-form-item  class="myelform">
                            <el-button type="primary" @click="onSubmit" icon="el-icon-search">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <div class="clearfix"></div>
            </div>
            <div class="clearfix"></div>

            <div class="bottom">
                <div class="left">
                    <el-button icon="el-icon-plus" type="primary" @click="addUser">添加用户</el-button>
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
        max-height="449"
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
            prop="username"
            label="账号"
            width="150"
            align="center"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="password"
            label="密码"
            width="150"
            align="center"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="nickname"
            label="昵称"
            width="150"
            align="center"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="qq"
            label="用户类型"
            width="150"
            align="center"
            show-overflow-tooltip>
            </el-table-column>
          <el-table-column
            prop="phone"
            label="手机"
            width="150"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
            <el-table-column
            label="管理"
            width="182"
            align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="light" content="编辑" placement="bottom-end">
                        <el-button  size="mini" type="primary" @click="handleEdit(scope.row)"><i class="el-icon-edit"></i></el-button>
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
</template>

<script>
    import bus from './BUS.vue'
    import Aplayer from 'vue-aplayer'
    export default {
        data () {
            return {
              pageSize:5,
              flag:true,
                userEntity:{},
                showOption:false,
                currentPage:1,
                count:10,
                currentLimit:20,
                searchContent:"",
                multipleSelection: [],
                form:"",
                tableData:[],
                isSerach:false,  //是否为提交搜索
                region:'0',
                isLast:false,
                loading:true,
              songList:{},
              songData:[]
            }
        },
      components:{
          Aplayer
      },
        methods:{
          addToMysheet(id){
            var params = new URLSearchParams();
            params.append('song_id',id);
            params.append('user_id',this.userEntity.id),
            this.axios.post('http://localhost:8000/song/addMySongs',params)
              .then( res => {
                this.$message.success('已收藏！');
              })
              .catch( res => {
                loadingInstance.close();
                this.$message.error('添加失败！');
              })
          },
            onSubmit(){  //提交搜索内容
                if ( this.searchContent == "") {
                    this.$message.error('搜索内容不能为空！');
                }else{
                    this.loading = true;
                    this.isSerach = true;
                    this.axios.get('http://localhost:8200/user/searchUser',{
                        params: {
                            data:this.searchContent
                        }
                    })
                    .then( res => {
                        this.loading = false;
                        this.tableData = [];
                        this.tableData = res.data.data;
                        this.count = res.data.data.length;
                        this.currentPage = 1;
                    })
                    .catch( res => {
                        this.loading = false;
                        console.log("error");
                    })
                }
            },
          audioPlay(id){
            this.axios.get('http://localhost:8000/song/getMusic', {
              params: {
                id:id
              }
            }).then(res => {
              console.log("llll");
                this.flag = true;
                this.songList = res.data.data[0];
                this.songData = res.data.data;
                console.log(this.songData[1].title);
                console.log(this.songData[0].src);
                console.log(this.songData[0].lrc);


            })
              .catch(res => {
                console.log("error");
              })
          },
            handleEdit(param){   //点击编辑时向editinfo发送消息
                bus.$emit("updatePerson", {flag:true,value:param,region:this.region});
            },
            handleDel(id){   //删除一条记录
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loading = true;
                    var params = new URLSearchParams();
                        params.append("id",id);
                        this.axios.post('http://localhost:8200/user/delUser',params)
                        .then( res => {
                            this.$message.success('删除成功！');
                            //删除成功后重新请求当前页
                          this.axios.get('http://localhost:8200/user/getUsers',{
                            params: {
                              page: this.currentPage,
                              limit:this.currentLimit,
                            }
                          })
                            .then( res => {
                              this.loading = false;
                              if (res.data.count != 0) {
                                this.tableData = res.data.data;
                                this.count = res.data.data.length;
                                if(this.count < this.pageSize){
                                  this.tableHeight = this.count * 70;
                                }
                                else{
                                  this.tableHeight = this.pageSize * 40;
                                }
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
            addUser() {  //添加一条题目
                if ( this.currentPage == Math.ceil( this.count / this.currentLimit) ) //判断是否是最后一页
                    this.isLast = true;
                bus.$emit("addUser", {flag:true,type:this.region,isLast:this.isLast});
            },
            handleSizeChange(val) {  //更改每页的数量,重新发起请求
                this.pageSize = val;
            },
            handleCurrentChange(val) {  //更改当前页,重新发起请求
                this.currentPage = val;

            },
            styleFunc(row,rowIndex){   //更改样式
                return {padding:'5px 0',hieght:'23px',lineHeight:'23px'}
            },
            handleSelectionChange(val) {   //处理多选框变化
                this.multipleSelection = val;
            }
        },
        mounted(){ //加载页面时默认请求第一类型数据
          var userJsonStr = sessionStorage.getItem('userInfo');
          this.userEntity = JSON.parse(userJsonStr);
          console.log(this.userEntity.type);
          if(this.userEntity.type ==2){
            this.showOption = true;
          }
            this.axios.get('http://localhost:8200/user/getUsers',{
                params: {
                    page: this.currentPage,
                    limit:this.currentLimit,
                }
            })
            .then( res => {
                this.loading = false;
                if (res.data.count != 0) {
                    this.tableData = res.data.data;
                    this.count = res.data.data.length;
                  if(this.count < this.pageSize){
                    this.tableHeight = this.count * 70;
                  }
                  else{
                    this.tableHeight = this.pageSize * 40;
                  }
                }
            })
            .catch( res => {
                this.loading = false;
                console.log("error");
            })
          let aplayer = this.$refs.player.control;
          aplayer.play();
            var target = this;
            //监听增加题目发来的信息
            bus.$on('isLast', data => {
              this.axios.get('http://localhost:8200/user/getUsers',{
                params: {
                }
              })
                .then( res => {
                  this.loading = false;
                  if (res.data.count != 0) {
                    this.tableData = res.data.data;
                    this.count = res.data.data.length;
                    if(this.count < this.pageSize){
                      this.tableHeight = this.count * 70;
                    }
                    else{
                      this.tableHeight = this.pageSize * 40;
                    }
                  }
                })
                .catch( res => {
                  this.loading = false;
                  console.log("error");
                })
            });
        }
    }
</script>

<style scoped>
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

