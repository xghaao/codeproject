后端代码：https://github.com/liujinyao1/coderater

11111
代码分析平台（前端）
基于 Vue.js 的 Web 应用，用于上传、编辑和分析 Java 代码，集成 Spring Boot 后端。
功能

JWT 用户认证
上传、列出、编辑、删除 .java 文件
分析代码质量（风格问题、圈复杂度、注释比例）
导航包含“返回首页”链接和“重新登录”按钮

开发环境
前置条件

Node.js (v14 或更高)
npm (v6 或更高)
后端 API 运行在 http://localhost:8080 (Spring Boot, MySQL 使用 utf8mb4 编码)
MySQL 数据库
vscode
搭建步骤

克隆仓库：
git clone <仓库地址>
cd code-analysis-platform


安装依赖：
npm install


可选：安装 CodeMirror（用于代码编辑高亮）：
npm install vue-codemirror@4 codemirror@5


配置 API：

确保后端运行在 http://localhost:8080。
如需修改，编辑 src/main.js：Axios.defaults.baseURL = 'http://localhost:8080';




运行应用：
npm run serve


访问 http://localhost:8081。



使用方法

登录：

打开 http://localhost:8081/login。
输入用户名和密码，通过 /api/auth/login 认证。
成功后跳转至首页 (/)。


首页：

查看用户信息（用户名、邮箱、角色）。
使用上传按钮上传 .java 文件。
查看代码列表（ID、文件名、类数量、方法数量、行数）。
点击文件名跳转到编辑/分析页面。
点击删除按钮移除代码。


代码详情页：

显示文件名和 ID。
左侧：编辑代码（支持中文，建议使用 CodeMirror）。
右侧：查看代码质量分析（风格问题、圈复杂度、注释比例等）。
点击“提交修改”更新代码（PUT /api/code/{codeId}）。
点击“分析代码”获取分析结果（POST /api/analysis/{codeId}）。


导航：

点击头部左侧“返回首页”跳转至 /。
点击右上角“重新登录”退出并跳转至 /login。



注意事项

中文乱码：确保上传的java文件为utf-8编码。



