<template>
  <div class="file-editor">
    <el-row>
      <el-col :span="22">
        <el-form-item>
          <el-input v-model="value.filename" :placeholder="$t('oper.fileTip')"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-upload
          ref="upload"
          :show-file-list="false"
          action="/api/v4/data/file"
          :auto-upload="false"
          :on-change="handleChange"
          :on-error="handleError"
        >
          <i class="el-icon-folder-opened file-icon"></i>
        </el-upload>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'FileEditor',

    model: {
      prop: 'value',
      event: 'update',
    },

    props: {
      value: {
        type: Object,
        required: true,
      },
    },

    methods: {
      handleChange(file) {
        const reader = new FileReader()
        reader.readAsText(file.raw)
        reader.onload = async (event) => {
          const content = event.currentTarget.result
          const uploadData = {
            file: content,
            filename: file.name,
          }
          this.$emit('update', uploadData)
        }
        reader.onerror = () => {
          this.$message.error(this.$t('oper.uploadFailed'))
        }
      },
      handleError(error) {
        this.$message.error(error.toString())
      },
    },
  }
</script>

<style lang="scss">
  .file-editor {
    .el-form-item {
      margin-bottom: 0px;
    }
    .el-upload {
      width: 100%;
      text-align: right;

      .file-icon {
        color: #34c388;
      }
    }
  }
</style>
