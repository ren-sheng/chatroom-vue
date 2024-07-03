<template>
    <div class="login">
        <div class="title">在线用户列表</div>
        <!-- 只需要用户ID和用户名 -->
        <el-table :data="list" style="width: 100%" class="box">
            <el-table-column prop="id" label="用户ID" width="180" style="color: black;"></el-table-column>
            <el-table-column prop="username" label="用户名" width="180"></el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button type="danger" @click="disableUser(scope.row.id)">禁用</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--在底部添加一个广播的输入框和广播按钮-->
        <div class="box">
            <el-input v-model="broadcast" placeholder="请输入广播内容" style="width: 70%"></el-input>
            <el-button type="primary" @click="broadcastMessage">广播</el-button>
        </div>
    </div>
</template>

<script>
import { interruptUser, broadcast } from "@/api/adminapi";
import { queryOnlineUser } from "@/api/loginapi";
export default {
    name: "App",
    data() {
        return {
            list: [], //在线用户列表
            broadcast: "", //广播内容
        };
    },
    mounted() {
        this.getOnlineUser();
    },
    methods: {
        //获取在线用户列表
        getOnlineUser() {
            queryOnlineUser().then((res) => {
                this.list = res.data;
                console.log(this.list);
            });
        },

        disableUser(userId) {
            let params = {
                userId: userId,
            };
            interruptUser(params).then((res) => {
                if (res.code === true) {
                    this.$message({
                        message: "禁用成功",
                        type: "success",
                    });
                    this.getOnlineUser(); // 刷新在线用户列表
                } else {
                    this.$message({
                        message: "禁用失败",
                        type: "error",
                    });
                }
            });
        },
        //广播消息
        broadcastMessage() {
            if (this.broadcast == "") {
                this.$message({
                    message: "广播内容不能为空",
                    type: "error",
                });
                return;
            }
            this.$message({
                message: "广播成功",
                type: "success",
            });
            let params = {
                meg: this.broadcast,
            };
            console.log(params);
            broadcast(params).then((res) => {
                console.log(res);
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.login {
    width: 60vw;
    height: 80vh;
    background-color: rgb(39, 42, 55);
    border-radius: 15px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.title {
    font-size: 30px;
    color: white;
    text-align: center;
    margin-top: 20px;
    margin-bottom: 20px;
}

::v-deep .el-form-item__content {
    font-size: 18px;
    display: flex;
    justify-content: space-between;
    color: white;
    margin-bottom: 20px;
}

::v-deep .el-input {
    width: 70%;
    margin-right: 60px;
}

.box {
    margin-top: 20px;
    color: black;
}
</style>
