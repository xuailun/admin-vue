export default {
  async created () {
    // 第一次进来请求分页数据：第1页，每页2条
    this.loadUsersByPage(1)
  },
  data () {
    return {
      searchText: '',
      tableData: [], // 表格列表数据
      totalSize: 0, // 总记录数据
      currentPage: 1, // 当前页码
      pageSize: 5, // 当前每页大小
      userForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editUserForm: {
        username: '',
        email: '',
        mobile: ''
      },
      dialogFormVisible: false, // 隐藏添加用户框
      dialogEditFormVisible: false, // 隐藏编辑用户狂
      // 1. 添加rules 验证规则
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 5 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 处理分页页码大小改变
    async handleSizeChange (pageSize) {
      console.log('每页大小: ', pageSize)
      this.pageSize = pageSize
      this.loadUsersByPage(1, pageSize)

      // 每页大小改变之后，数据回归到了第1页
      // 我们的页码的高亮状态也应用回归到第1页
      // 我们这里就可以使用 this.currentPage 来控制
      this.currentPage = 1
    },

    // 处理分页页码改变
    async handleCurrentChange (currentPage) {
      console.log('页码：', currentPage)

      // 将 currentPage 更新为最新点击的页码
      // Element 插件的页码发生改变的时候，不会修改我们的数据 currentPage
      // 我们这里让其每一次页码变化的时候，手动将 currentPage 赋值为当前最新页码
      // this.currentPage = currentPage

      // 页码改变，请求当前页码对应的数据
      // 注意：这里我们请求的每页大小先写死
      //       为什么呢？
      //       我们的每页大小是会变化的
      this.loadUsersByPage(currentPage)
    },

    // 处理用户搜索
    handleSearch () {
      this.loadUsersByPage(1)
    },

    // 根据页码加载用户列表数据
    async loadUsersByPage (page) {
      const res = await this.$http.get('/users', {
        params: { // 请求参数，对象会被转换为 k=v&k=v 的格式，然后拼接到请求路径 ? 后面发起请求
          pagenum: page,
          pagesize: this.pageSize,
          query: this.searchText // 根据搜索文本框的内容来搜索
        }
      })
      const { users, total } = res.data.data
      this.tableData = users
      // 请求数据成功，我们从服务器得到了总记录数据
      // 然后我们就可以把总记录数据交给分页插件来使用
      this.totalSize = total
    },

    // 处理用户状态的改变
    async handleStateChange (state, user) {
      const { id: userId } = user
      // 拿到用户 id
      // 拿到 switch 开关的选中状态 val
      // 发送请求改变状态
      const res = await this.$http.put(`/users/${userId}/state/${state}`)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: `用户状态${state ? '启用' : '禁用'}成功`
        })
      }
    },

    // 处理添加用户
    async handleAddUser () {
      // // 1. 获取表单数据
      // // 2. 表单验证
      // // 3. 发起请求添加用户
      // // 4. 根据响应做交互
      // //    添加用户成功，给出提示
      // //    关闭对话框
      // //    重新加载当前列表数据
      this.$refs['addUserForm'].validate(async (valid) => {
        if (!valid) {
          return false
        }
        const res = await this.$http.post('/users', this.userForm)
        // console.log(res)
        if (res.data.meta.status === 201) {
          this.$message({
            type: 'success',
            message: '添加用户成功'
          })
          // 关闭对话框
          this.dialogFormVisible = false

          // 重新加载用户列表数据
          this.loadUsersByPage(this.currentPage)

          // 清空表单内容
          for (let key in this.userForm) {
            this.userForm[key] = ''
          }
        }
      })
    },

    // 处理删除用户
    async handleDeleteUser (user) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => { // 点击确认执行该方法
        // 执行删除操作
        // const {id: userId} = user
        // const res = await this.$http.delete(`/users/${userId}`)
        const res = await this.$http.delete(`/users/${user.id}`)
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 重新加载用户列表数据
          this.loadUsersByPage(this.currentPage)
        }
      }).catch(() => { // 点击取消删除
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
     * 处理编辑用户
     */

    async handleEditUser () {
      const {id: userId} = this.editUserForm
      const res = await this.$http.put(`/users/${userId}`, this.editUserForm)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: '修改用户成功'
        })
      }
      // 关闭修改框
      this.dialogEditFormVisible = false
      // 重新加载用户列表数据
      this.loadUsersByPage(this.currentPage)
    },
    /**
     * 处理显示被编辑的用户表单信息
     */
    async handleShowEditForm (user) {
      this.dialogEditFormVisible = true
      const res = await this.$http.get(`/users/${user.id}`)
      this.editUserForm = res.data.data
    }
  }
}