<template>
  <el-form :model="form" :rules="rules" ref="form" label-width="100px">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" type="password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('form')">注册</el-button>
      <el-button @click="$router.push('/login')">返回登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'AppRegister',
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '用户名长度为3-20字符', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入有效邮箱', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 40, message: '密码长度为6-40字符', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            await this.$store.dispatch('register', this.form);
            this.$message.success('注册成功，请登录');
            this.$router.push('/login');
          } catch (error) {
            this.$message.error(error.message || '注册失败');
          }
        }
      });
    },
  },
};
</script>