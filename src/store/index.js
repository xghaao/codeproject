import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    token: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
      console.log('Token stored in localStorage:', token); // 调试
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      console.log('Auth cleared'); // 调试
    },
  },
  actions: {
    // 用户登录: POST /api/auth/login
    async login({ commit }, { username, password }) {
      try {
        const response = await Vue.prototype.$http.post('/api/auth/login', {
          username,
          password,
        });
        console.log('Login API response:', response.data); // 调试
        if (response.data.accessToken) {
          commit('setToken', response.data.accessToken);
          return response.data;
        } else {
          throw new Error('No access token received');
        }
      } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error.response?.data || error;
      }
    },
    // 用户注册: POST /api/auth/register
    async register(context, { username, email, password }) {
      try {
        const response = await Vue.prototype.$http.post('/api/auth/register', {
          username,
          email,
          password,
        });
        console.log('Register API response:', response.data); // 调试
        return response.data;
      } catch (error) {
        console.error('Register error:', error.response?.data || error.message);
        throw error.response?.data || error;
      }
    },
    // 获取用户信息: GET /api/user/me
    async fetchUser({ commit }) {
      try {
        const response = await Vue.prototype.$http.get('/api/user/me');
        console.log('Fetch user API response:', response.data); // 调试
        commit('setUser', response.data);
      } catch (error) {
        console.error('Fetch user error:', error.response?.data || error.message);
        commit('clearAuth');
        throw error;
      }
    },
    logout({ commit }) {
      commit('clearAuth');
    },
  },
});