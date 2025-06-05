<template>
  <div style="padding: 20px;">
    <h2>代码分析 - {{ code.fileName || '加载中' }} (ID: {{ code.id || 'N/A' }})</h2>
    <el-row :gutter="20">
      <!-- 左侧：代码编辑 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <h3>代码内容</h3>
          <el-input
            type="textarea"
            :rows="20"
            v-model="editedContent"
            placeholder="请输入代码"
            style="font-family: Consolas, monospace;"
          ></el-input>
          <el-button type="primary" @click="updateCode" style="margin-top: 10px;">提交修改，使用utf-8编码</el-button>
        </el-card>
      </el-col>
      <!-- 右侧：代码质量分析 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <h3>代码质量分析</h3>
          <el-button type="primary" @click="analyzeCode" :loading="analyzing">分析代码</el-button>
          <div v-if="analysis" style="margin-top: 20px;">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="风格问题数量">{{ analysis.styleIssueCount }}</el-descriptions-item>
              <el-descriptions-item label="平均圈复杂度">{{ analysis.cyclomaticComplexity }}</el-descriptions-item>
              <el-descriptions-item label="注释比例">{{ (analysis.commentRatio * 100).toFixed(2) }}%</el-descriptions-item>
              <el-descriptions-item label="注释行数">{{ analysis.commentLineCount }}</el-descriptions-item>
              <el-descriptions-item label="非空行数">{{ analysis.nonEmptyLineCount }}</el-descriptions-item>
              <el-descriptions-item label="风格得分">{{ analysis.styleScore }}</el-descriptions-item>
              <el-descriptions-item label="复杂度得分">{{ analysis.complexityScore }}</el-descriptions-item>
              <el-descriptions-item label="注释得分">{{ analysis.commentScore }}</el-descriptions-item>
              <el-descriptions-item label="综合得分">{{ analysis.overallScore }}</el-descriptions-item>
              <el-descriptions-item label="分析时间">{{ analysis.analyzedAt }}</el-descriptions-item>
            </el-descriptions>
          </div>
          <p v-else style="margin-top: 20px; color: #606266;">点击“分析代码”查看质量分析结果</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'CodeDetail',
  data() {
    return {
      code: {},
      editedContent: '',
      analysis: null,
      analyzing: false,
    };
  },
  async created() {
    await this.fetchCode();
  },
  methods: {
    async fetchCode() {
      try {
        const codeId = this.$route.params.id;
        const response = await this.$http.get(`/api/code/${codeId}`);
        this.code = response.data;
        this.editedContent = response.data.content || '';
      } catch (error) {
        console.error('Fetch code error:', error.response?.data || error.message);
        this.$message.error('获取代码详情失败');
        this.$router.push('/');
      }
    },
    async updateCode() {
      try {
        const codeId = this.$route.params.id;
        await this.$http.put(`/api/code/${codeId}`, {
          fileName: this.code.fileName,
          content: this.editedContent,
        });
        this.$message.success('代码更新成功');
        await this.fetchCode();
      } catch (error) {
        console.error('Update code error:', error.response?.data || error.message);
        this.$message.error('代码更新失败');
      }
    },
    async analyzeCode() {
      this.analyzing = true;
      try {
        const codeId = this.$route.params.id;
        const response = await this.$http.post(`/api/analysis/${codeId}`);
        this.analysis = response.data;
        this.$message.success('代码分析完成');
      } catch (error) {
        console.error('Analyze code error:', error.response?.data || error.message);
        this.$message.error('代码分析失败');
      } finally {
        this.analyzing = false;
      }
    },
  },
};
</script>