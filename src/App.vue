<template>
  <div id="app">
    <!-- 头部容器 -->
    <div class="header">
      <!-- 导航菜单 -->
      <el-menu :default-active="$route.path" mode="horizontal" v-if="$store.state.user">
        <el-button type="text" @click="$router.push('/')" style="margin-top: 20px;">首页</el-button>
      </el-menu>
      <!-- 右上角按钮 -->
      <el-button
        v-if="$store.state.user"
        type="danger"
        size="small"
        class="logout-button"
        @click="logout"
      >
        重新登录
      </el-button>
    </div>
    <!-- 路由视图 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    logout() {
      try {
        // 清除 Vuex 状态
        this.$store.commit('setToken', null);
        this.$store.commit('setUser', null);
        localStorage.removeItem('token');
        // 跳转到登录页面
        this.$router.push('/login');
        this.$message.success('已退出登录');
      } catch (error) {
        console.error('Logout error:', error);
        this.$message.error('退出登录失败');
      }
    },
  },
};
</script>

<style scoped>
/* 头部样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
}

/* 导航菜单样式 */
.el-menu {
  flex-grow: 1;
}

/* 退出按钮样式 */
.logout-button {
  margin-left: auto;
}
</style>