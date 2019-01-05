<template>

  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <el-row class="searchArea">
      <el-col :span="24">
           <el-input class="searchInput" v-model="query" clearable @clear="getAllUsers()" placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
           </el-input>
        <el-button type="success" plain @click="addUserDialogFormVisible = true">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      height="300px"
      style="width: 100%">
      <!-- 序号 -->
      <el-table-column
        type="index"
        width="50"
        prop="id">
      </el-table-column>

      <el-table-column
        prop="username"
        label="姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="150">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="180">
      </el-table-column>
       <el-table-column
        label="创建时间"
        width="180">
        <template slot-scope="scope">
          {{scope.row.create_time | fmdate}}
        </template>
      </el-table-column>
      <el-table-column
        label="用户状态"
        width="100">
         <template slot-scope="scope">
            <!-- scope.row就是当前绑定的数据对象 -->
            <el-switch
                @change="changeState(scope.row)"
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
          </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
          <template slot-scope="scope">
            <el-button plain size="mini" type="primary" icon="el-icon-edit" circle @click="showEdit(scope.row)"></el-button>
            <el-button plain size="mini" type="danger" icon="el-icon-delete" circle @click="deleUser(scope.row)"></el-button>
            <el-button plain size="mini" type="success" icon="el-icon-check" circle @click="showRole(scope.row)"></el-button>
          </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page= pagenum
      :page-sizes="[1, 2, 3, 4]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total= total>
    </el-pagination>

    <el-dialog title="添加用户" :visible.sync="addUserDialogFormVisible">
      <el-form
      label-width="100px"
      :model="formData">
        <el-form-item label="用户名">
          <el-input v-model="formData.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
         <el-input v-model="formData.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
         <el-input v-model="formData.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
         <el-input v-model="formData.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑用户" :visible.sync="editUserDialogFormVisible">
      <el-form
      label-width="100px"
      :model="formData">
        <el-form-item label="用户名">
          <el-input disabled v-model="formData.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
         <el-input v-model="formData.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
         <el-input v-model="formData.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          {{currUserName}}
        </el-form-item>
        <el-form-item label="角色名" :label-width="formLabelWidth">
          <el-select v-model="currentRoleId">
            <el-option disabled label="请选择" :value="-1"></el-option>
              <el-option v-for="(v, i) in roleData" :key="i" :label="v.roleName" :value="v.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="editRole(roleUid)">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      tableData: [],
      pagenum: 1,
      pagesize: 2,
      total: -1,
      addUserDialogFormVisible: false,
      editUserDialogFormVisible: false,
      formData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      formLabelWidth: '180px',
      currentRoleId: -1,
      dialogFormVisibleRole: false,
      roleData: [],
      currUserName: '',
      roleUid: -1
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    async getTableData () {
      const token = localStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = token
      const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      const {
        meta: {status, msg},
        data: {total, users}
      } = res.data
      if (status === 200) {
        this.tableData = users
        this.total = total
        this.$message.success(msg)
      } else this.$message.warning(msg)
    },
    // 分页
    handleSizeChange (val) {
      this.pagenum = 1
      this.pagesize = val
      this.getTableData()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getTableData()
    },
    searchUser () {
      this.getTableData()
    },
    getAllUsers () {
      this.pagenum = 1
      this.getTableData()
    },
    async addUser () {
      const res = await this.$http.post('users', this.formData)
      const {meta: {msg, status}} = res.data
      if (status === 201) {
        this.addUserDialogFormVisible = false
        this.pagenum = Math.ceil(this.total / this.pagesize)
        this.getTableData()
      } else {
        this.$message.warning(msg)
      }
    },
    deleUser (user) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`users/${user.id}`)
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.$message.success('删除成功!')
          this.pagenum = 1
          this.getTableData()
        } else {
          this.$message.warning(msg)
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    async showEdit (user) {
      this.editUserDialogFormVisible = true
      const res = await this.$http.get(`users/${user.id}`)
      const {
        data, meta: {msg, status}
      } = res.data
      if (status === 200) {
        this.formData = data
        this.roleUid = user.id
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },
    async editUser () {
      const res = await this.$http.put(`users/${this.formData.id}`, this.formData)
      console.log(res)
      const {
        meta: {msg, status}
      } = res.data
      if (status === 200) this.$message.success(msg)
      else this.$message.warning(msg)
      this.editUserDialogFormVisible = false
      this.pagenum = 1
      this.getTableData()
    },

    async changeState (user) {
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      console.log(res)
      const {meta: {msg, status}} = res.data
      if (status === 200) this.$message.success(msg)
      else this.$message.warning(msg)
    },
    async showRole (user) {
      this.dialogFormVisibleRole = true
      const res = await this.$http.get(`roles`)
      const {data, meta: {msg, status}} = res.data
      this.roleData = data
      this.currUserName = user.username
      const res2 = await this.$http.get(`users/${user.id}`)
      this.currentRoleId = res2.data.data.rid
      this.roleUid = user.id
    },
    async editRole (uid) {
      this.dialogFormVisibleRole = false
      const res = await this.$http.put(`users/${uid}/role`, {rid: this.currentRoleId})
      const {meta: {msg, status}} = res.data
      if (status === 200) this.$message.success(msg)
      else this.$message.warning(msg)
    }
  }
}
</script>

<style>
.box-card{
  height: 100%;
}
.searchArea{
  margin-top: 10px;
  margin-bottom: 10px;
}
.searchArea .searchInput{
  width: 350px;
}
</style>
