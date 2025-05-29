<template>
  <el-form :model="form" :rules="rules" ref="form" label-width="100px">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" type="password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('form')">登录</el-button>
      <el-button @click="$router.push('/register')">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            await this.$store.dispatch('login', this.form);
            this.$message.success('登录成功');
            this.$router.push('/');
          } catch (error) {
            this.$message.error(error.message || '登录失败');
          }
        }
      });
    },
  },
};
</script>