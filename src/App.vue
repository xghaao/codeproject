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
    <div class="content">
      <router-view />
    </div>
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
/* 根容器样式 */
#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #0f2027 100%);
  position: relative;
  overflow: hidden;
}

/* 粒子效果 */
#app::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2" fill="rgba(255,255,255,0.2)"><circle cx="1" cy="1" r="1"/></svg>') repeat;
  animation: float 20s linear infinite;
  z-index: 1;
}

/* 头部样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid #dcdfe6;
  position: relative;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 导航菜单样式 */
.el-menu {
  flex-grow: 1;
  background: transparent;
}

/* 退出按钮样式 */
.logout-button {
  margin-left: auto;
}

/* 内容区域样式 */
.content {
  position: relative;
  z-index: 2;
  margin: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 粒子漂浮动画 */
@keyframes float {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-100vh) translateX(10px);
    opacity: 0.3;
  }
}
</style>