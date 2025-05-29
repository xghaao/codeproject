<template>
  <div>
    <!-- 用户信息 -->
    <el-card style="width: 300px; margin-bottom: 20px;" v-if="user">
      <h3>用户信息</h3>
      <p>用户名: {{ user.username }}</p>
      <p>邮箱: {{ user.email }}</p>
      <p>角色: {{ user.roles ? user.roles.join(', ') : '无' }}</p>
    </el-card>
    <el-card style="width: 300px; margin-bottom: 20px;" v-else>
      <p>正在加载用户信息...</p>
    </el-card>

    <!-- 代码上传 -->
    <el-upload
      :http-request="customUpload"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      accept=".java"
      v-if="$store.state.token"
    >
      <el-button type="primary">上传代码</el-button>
    </el-upload>

    <!-- 代码列表 -->
    <el-table
      :data="codeList"
      style="width: 100%; margin-top: 20px;"
      v-if="codeList.length"
      @row-click="handleRowClick"
    >
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="fileName" label="文件名">
        <template slot-scope="scope">
          <span style="color: #409EFF; cursor: pointer; text-decoration: underline;">{{ scope.row.fileName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="classCount" label="类数量"></el-table-column>
      <el-table-column prop="methodCount" label="方法数量"></el-table-column>
      <el-table-column prop="lineCount" label="行数"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click.stop="deleteCode(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <p v-else>暂无代码</p>
  </div>
</template>

<script>
export default {
  name: 'AppHome',
  data() {
    return {
      codeList: [],
      user: null,
    };
  },
  async created() {
    const token = this.$store.state.token || localStorage.getItem('token');
    if (token && !this.$store.state.token) {
      this.$store.commit('setToken', token);
    }
    if (token) {
      await this.fetchUser();
      await this.fetchCodeList();
    } else {
      this.$message.error('请先登录');
      this.$router.push('/login');
    }
  },
  methods: {
    async fetchUser() {
      try {
        await this.$store.dispatch('fetchUser');
        this.user = this.$store.state.user;
      } catch (error) {
        console.error('Fetch user error:', error.response?.data || error.message);
        this.$message.error('获取用户信息失败，请重新登录');
        this.$router.push('/login');
      }
    },
    async fetchCodeList() {
      try {
        const response = await this.$http.get('/api/code/mycode');
        this.codeList = response.data;
      } catch (error) {
        console.error('Fetch code list error:', error.response?.data || error.message);
        this.$message.error('获取代码列表失败');
      }
    },
    async customUpload(options) {
      try {
        const formData = new FormData();
        formData.append('file', options.file);
        const response = await this.$http.post('/api/code/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        options.onSuccess(response.data);
      } catch (error) {
        console.error('Upload error:', error.response?.data || error.message);
        options.onError(error);
      }
    },
    async handleUploadSuccess() {
      this.$message.success('上传成功');
      await this.fetchCodeList();
    },
    handleUploadError() {
      this.$message.error('上传失败');
    },
    async deleteCode(codeId) {
      try {
        await this.$http.delete(`/api/code/${codeId}`);
        this.$message.success('删除成功');
        await this.fetchCodeList();
      } catch (error) {
        console.error('Delete code error:', error.response?.data || error.message);
        this.$message.error('删除失败');
      }
    },
    handleRowClick(row) {
      this.$router.push(`/code/${row.id}`);
    },
  },
};
</script>