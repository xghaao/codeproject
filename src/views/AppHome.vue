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
      action="#"
      :http-request="customUpload"
      accept=".java"
      v-if="$store.state.token"
      :show-file-list="false" 
    >
      <el-button type="primary">上传代码 (UTF-8编码)</el-button>
    </el-upload>

    <!-- 搜索框 -->
    <el-input
      v-model="searchQuery"
      placeholder="按文件名搜索"
      clearable
      style="width: 300px; margin: 20px 0;"
      @input="handleSearch"
    ></el-input>

    <!-- 代码列表 -->
    <el-table
      :data="paginatedCodeList"
      style="width: 100%; margin-top: 20px;"
      v-if="filteredCodeList.length"
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
    <p v-else>暂无代码，点击上方按钮上传您的第一个代码文件。</p>

    <!-- 分页 -->
    <el-pagination
      v-if="filteredCodeList.length > pageSize"
      @current-change="handlePageChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="filteredCodeList.length"
      layout="prev, pager, next"
      style="margin-top: 20px; text-align: center;"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'AppHome',
  data() {
    return {
      codeList: [],
      filteredCodeList: [],
      user: null,
      searchQuery: '',
      currentPage: 1,
      pageSize: 8,
      isUploading: false,
    };
  },
  computed: {
    paginatedCodeList() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return Array.isArray(this.filteredCodeList) ? this.filteredCodeList.slice(start, end) : [];
    },
    totalPages() {
      return Math.ceil((Array.isArray(this.filteredCodeList) ? this.filteredCodeList.length : 0) / this.pageSize);
    },
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
  beforeDestroy() {
    this.isUploading = false;
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
        const data = response.data || [];
        this.codeList = Array.isArray(data) ? data : [];
        this.handleSearch(); 
        
        if (this.filteredCodeList.length === 0) {
          this.currentPage = 1;
        } else if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }
      } catch (error) {
        console.error('Fetch code list error:', error.response?.data || error.message);
        this.$message.error('获取代码列表失败');
        this.codeList = [];
        this.filteredCodeList = [];
        this.currentPage = 1;
      }
    },
    async customUpload(options) {
      if (this.isUploading) {
        this.$message.warning('正在上传中，请稍候...');
        return;
      }

      const token = this.$store.state.token;
      if (!token) {
        this.$message.error('登录状态失效，请重新登录');
        this.$router.push('/login');
        return;
      }

      const fileName = options.file.name;
      if (this.codeList.some(item => item.fileName.toLowerCase() === fileName.toLowerCase())) {
        this.$message.warning(`文件 "${fileName}" 已存在，请勿重复上传`);
        return;
      }

      this.isUploading = true;
      try {
        const formData = new FormData();
        formData.append('file', options.file);
        
        const response = await this.$http.post('/api/code/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });

        // --- 核心修复 ---
        // 根据API文档，成功时会返回一个包含 'id' 的 Code 对象。
        // 我们就用这个作为成功的判断依据。
        if (response.data && response.data.id) {
          this.$message.success('上传成功');
          await this.fetchCodeList(); // 刷新列表
          options.onSuccess(response.data); // 通知 el-upload UI 更新
        } else {
          // 这种情况理论上不应该发生，除非后端返回了2xx状态但响应体为空或格式不符
          const errorMessage = '上传失败：服务器返回了无效的响应数据';
          this.$message.error(errorMessage);
          options.onError(new Error(errorMessage));
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || '上传失败，请检查网络或服务器状态';
        this.$message.error(`上传失败: ${errorMessage}`);
        console.error('Upload error details:', error);
        options.onError(error);
      } finally {
        this.isUploading = false;
      }
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
    handleSearch() {
      this.currentPage = 1;
      if (!Array.isArray(this.codeList)) {
        this.codeList = [];
      }
      if (this.searchQuery.trim() === '') {
        this.filteredCodeList = this.codeList;
      } else {
        this.filteredCodeList = this.codeList.filter(item =>
          item.fileName.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
  },
};
</script>