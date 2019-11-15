/* eslint-disable vue/no-unused-vars */
<template>
  <div class="article">
    <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>全部图文</span>
        </div>
        <div>
          <el-form >
            <el-form-item label="文章状态" >
              <el-radio-group v-model="filterForm.status">>
              <el-radio label="全部"></el-radio>
              <el-radio label="草稿"></el-radio>
              <el-radio label="待审核"></el-radio>
              <el-radio label="审核通过"></el-radio>
              <el-radio label="审核失败"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="频道列表">
              <el-select  placeholder="请选择活动区域" v-model="filterForm.channel_id">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间选择">
              <el-date-picker
                v-model="rangeDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" >查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      <el-card>
        <div slot="header" class="clearfix">
          <span>共找到59806条符合条件的内容</span>
        </div>
        <div>
          <!-- el-table表格组件 data表格中的数据 要求是数组
          默认只能渲染普通文本，图片等非普通文本不可以的识别的需要自定表格数列
          状态我们需要的不是值 而是值对应的状态文本 -->
          <!-- prop 对应的是数组中的字段 -->

           <el-table
              :data="articles"
              style="width: 100%">
              <el-table-column
                prop="cover"
                label="封面"
                width="180">
                <!-- 自定义表格列 在template中声明 slot-scope="scope"  就可以通过 scope.row获取遍历项
                scope相当于我们使用 v-for 中的item   只有需要在自定义表格列模板中访问遍历项的时候才这么做
                封面的图片可能有多张我们只显示第一张-->
                <template slot-scope='scope'>
                  <img  width='50'   :src='scope.row.cover.images[0]' alt="">
                </template>
              </el-table-column>
              <el-table-column
                prop="title"
                label="标题"
                width="180">
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态">
                <template slot-scope="scope">
                  <!-- 我们把状态值在data中以[{}]格式定义 -->
                  <el-tag
                    :type= articleStatus[scope.row.status].type
                    class="status"

                  >{{ articleStatus[scope.row.status].s }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="pubdate"
                label="发布日期">
              </el-table-column>
              <el-table-column
                prop="address"
                label="操作">
              </el-table-column>
            </el-table>
        </div>
      </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      filterForm: {
        status: '',
        channel_id: '',
        begin_pubdate: '',
        end_pubdate: ''

      },
      // 表格组件要求数据是数组
      articles: [],
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
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]

    }
  },
  created () {
    this.loadArticles()
  },
  methods: {
    // 除了登录页面之外，发送请求时都要携带token token放在哪里  放在请求头中

    loadArticles () {
      // eslint-disable-next-line no-unused-vars
      const token = localStorage.getItem('token')
      this.$axios({
        method: 'GET',
        url: '/articles',
        headers: {
          // token是变量 模板字符串 Bearer 后面有一个空格 不可多也不可少
          Authorization: `Bearer ${token}`
        }
      }).then(res => {
        console.log(res)
        // 获取成功 把结果赋值给Vue实例 初始化data  渲染到页面
        this.articles = res.data.data.results
      }).catch(res => {
        alert('获取失败')
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
    width:65px

  }
}

</style>
