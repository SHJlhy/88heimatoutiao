<template>
  <div class="publish">
    <el-card class="box-card">
      <div slot="header" class="clearfix" >
        <span>发布文章</span>
      </div>
      <el-form ref="form" :model="articleForm" label-width="80px">
        <el-form-item label="标题">
          <el-input
            v-model="articleForm.title"
            placeholder="文章标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="内容">
           <quill-editor v-model="articleForm.content"
             ref="myQuillEditor"
          >
        </quill-editor>
        </el-form-item>
         <el-form-item label="封面">
          <el-radio-group v-model="articleForm.cover">
            <el-radio label="单图"></el-radio>
            <el-radio label="三图"></el-radio>
            <el-radio label="无图"></el-radio>
            <el-radio label="自动"></el-radio>
          </el-radio-group>
        </el-form-item>
          <el-form-item label="频道">
          <el-select v-model="articleForm.channel_id" placeholder="请选择">
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for='channel in channels'
              :key=channel.id
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(false)">发表</el-button>
          <el-button @click="onSubmit(true)" >存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'publishArticle',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    quillEditor
  },
  data () {
    return {
      articleForm: {
        title: '',
        content: '',
        cover: {
          type: 0,
          images: []
        },
        channel_id: ''
      },
      channels: []
    }
  },
  created () {
    this.loadChannels()
  },
  methods: {
    onSubmit (draft) {
      // console.log('submit!')
      this.$axios({
        method: 'POST',
        url: '/articles',
        params: {
          draft
        },
        data: this.articleForm

      }).then(res => {
        console.log(res)
      })
    },
    loadChannels () {
      this.$axios({
        method: 'GET',
        url: '/channels'
      }).then(res => {
        // console.log(res)
        this.channels = res.data.data.channels
      })
    }

  }

}
</script>

<style>

</style>
