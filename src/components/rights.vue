<template>
  <el-card class="card">
    <my-bread level1="权限管理" level2="权限列表"></my-bread>
    <el-table
      :data="roles"
      class="table"
      stripe
      height="480"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="140">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="180">
      </el-table-column>
      <el-table-column
        prop="level"
        label="层级"
        width="180">
        <!-- 如果组件的内容是开始标签和关闭标签的里面，需要在组件外套上容器template，如果组件的数据来源是父组件，则需要加slot-scope -->
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-if="scope.row.level === '1'">二级</span>
          <span v-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  created () {
    this.getRights()
  },
  data () {
    return {
      roles: []
    }
  },
  methods: {
    async getRights () {
      const res = await this.$http.get('rights/list')
      this.roles = res.data.data
      console.log(this.roles)
    }
  }
}
</script>

<style>
  .card{
    height: 100%;
  }
  .table{
    margin-top: 20px;
  }
</style>
