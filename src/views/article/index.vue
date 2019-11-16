/* eslint-disable vue/no-unused-vars */
<template>
  <div class="article">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <div>
        <el-form>
          <el-form-item label="文章状态">
            <el-radio-group v-model="filterForm.status">
              <!-- :label='null'  默认选中全部的时候 显示全部内容 如果不加： 就是一个字符串，而不是变量 -->
              <el-radio :label="null">全部</el-radio>
              <el-radio label="0">草稿</el-radio>
              <el-radio label="1">待审核</el-radio>
              <el-radio label="2">审核通过</el-radio>
              <el-radio label="3">审核失败</el-radio>
              <el-radio label="4">已删除</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道列表">
            <el-select placeholder="请选择活动区域" v-model="filterForm.channel_id">
              <el-option label="全部频道" :value="null"></el-option>
              <el-option
                v-for="channel in channels"
                :key="channel.id"
                :label="channel.name"
                :value="channel.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间选择">
            <el-date-picker
              v-model="rangeDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="loadArticles(1)" type="primary">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>共找到{{total_count}}条符合条件的内容</span>
      </div>
      <div>
        <!-- el-table表格组件 data组件表格中的数据 要求是数组
          默认只能渲染普通文本，图片等非普通文本不可以的识别的需要自定表格数列
        状态我们需要的不是值 而是值对应的状态文本-->
        <!-- prop 对应的是数组中的字段 -->

        <el-table v-loading="loading" :data="articles" style="width: 100%">
          <el-table-column prop="cover" label="封面" width="180">
            <!-- 自定义表格列 在template中声明 slot-scope="scope"  就可以通过 scope.row获取遍历项
                scope相当于我们使用 v-for 中的item   只有需要在自定义表格列模板中访问遍历项的时候才这么做
            封面的图片可能有多张我们只显示第一张-->
            <template slot-scope="scope">
              <img width="50" :src="scope.row.cover.images[0]" alt />
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题" width="180"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <!-- 我们把状态值在data中以[{}]格式定义 -->
              <el-tag
                :type="articleStatus[scope.row.status].type"
                class="status"
              >{{ articleStatus[scope.row.status].s }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="pubdate" label="发布日期"></el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <el-button icon="el-icon-edit">编辑</el-button>
              <!-- 删除需要id 怎么获取数据的id 通过自定义列表slot-scope获取到id -->
              <!-- scope.row 获取到的是遍历当前项 相当于item -->
              <el-button icon="el-icon-delete" @click="onDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- 在加载期间不允许点击按钮 -->
    <el-pagination
      @current-change="onPageChange"
      background
      :disabled="loading"
      layout="prev, pager, next"
      :total="total_count"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'articleList',
  data () {
    return {
      filterForm: {
        status: null,
        channel_id: null
        // begin_pubdate: '',
        // end_pubdate: ''
      },
      // axios请求 传入的参数为null,undefined默认不发送请求，
      // ''也会发送请求，但是会报错，所以在data中初始化status为null--不发请求，默认显示全部
      // 初始化列表频道
      channels: [],
      total_count: 0,
      loading: true,
      // 表格组件要求数据是数组
      articles: [],
      page: 0,
      articleStatus: [
        {
          type: '',
          s: '草稿'
        },
        {
          type: 'warning',
          s: '待审核'
        },
        {
          type: 'success',
          s: '审核通过'
        },
        {
          type: 'danger',
          s: '审核失败'
        },
        {
          type: 'info',
          s: '已删除'
        }
      ],
      rangeDate: '',
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  },
  created () {
    // // 在开始加载的时候 loading效果开始 值为true
    // this.loading = true
    // 初始化的时候默认显示第一页，所以我们可以传入页码这个参数
    this.loadArticles()
    this.loadChannels()
  },
  methods: {
    // 除了登录页面之外，发送请求时都要携带token token放在哪里  放在请求头中
    // 初始化的时候 默认显示第一页 可以写page=1,也可以不传

    loadArticles (page = 1) {
      // // 请求开始的时候 loading效果开始 值为true
      this.loading = true
      // eslint-disable-next-line no-unused-vars
      // const token = localStorage.getItem('token')
      this.$axios({
        method: 'GET',
        url: '/articles',
        // headers: {
        //   // token是变量 模板字符串 Bearer 后面有一个空格 不可多也不可少
        //   Authorization: `Bearer ${token}`
        // },
        params: {
          // 传的参数也是叫page简写
          page,
          status: this.filterForm.status,
          channel_id: this.filterForm.channel_id,
          // 点击x日期清空  rangeDate=null 如果是null[0]就会报错
          // 所以 如果清空就为null 显示全部内容
          // 有日期就显示日期

          begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
          end_pubdate: this.rangeDate ? this.rangeDate[1] : null
        }
      })
        .then(res => {
          console.log(res)
          // 获取成功 把结果赋值给Vue实例 初始化data  渲染到页面
          this.articles = res.data.data.results
          this.total_count = res.data.data.total_count
          // eslint-disable-next-line handle-callback-err
        }).catch(err => {
          alert('获取失败')
        })
        .finally(() => {
          // 无论成功还是失败最终都会执行
          //  请求结束的时候 停止加载
          this.loading = false
        })
    },
    loadChannels () {
      this.$axios({
        method: 'GET',
        url: '/channels'
      }).then(res => {
        console.log(res)
        this.channels = res.data.data.channels
      })
    },
    onPageChange (page) {
      // 在分页组件中有个事件current-change
      // 可以获取当前的页数 我们设置参数接收，有点类似于事件对象
      // page设置的参数 是文档要求的需要设置参数接收当前点击的页码
      // 点击页码，获取当前页的数据，渲染数据,
      // 记录点击的当前页
      this.page = page
      this.loadArticles(page)
      // console.log(page)
    },
    onDelete (ArticalId) {
      this.$axios({
        method: 'DELETE',
        url: `/articles/${ArticalId}`
      })
        .then(res => {
          // console.log(res)
          // 删除成功更新数据  默认是第一页  但是我们删除的数据可能不是第一页 所以我们在点击页数的
          // 时候记录点击的页码 在data中初始化 一个数据用来记录 点击的当前页
          this.loadArticles(this.page)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.article {
  .status {
    display: flex;
    justify-content: space-around;
    width: 65px;
  }
  .box-card {
    margin-bottom: 30px;
  }
}
</style>
