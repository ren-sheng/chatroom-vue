<template>
    <div class="login" v-if="!isRegister">
        <div class="title">登录</div>
        <el-form>
            <el-form-item>
                <div class="left">用户ID</div>
                <el-input placeholder="请输入用户ID" v-model="userId"></el-input>
            </el-form-item>
            <el-form-item>
                <div class="left">密码</div>
                <el-input placeholder="请输入密码" v-model="password" type="password"></el-input>
            </el-form-item>
            <el-form-item class="button1">
                <el-button type="primary" @click="login">登录</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="register_1">注册 </el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="login" v-else>
        <div class="title">注册</div>
        <el-form>
            <el-form-item>
                <div class="left">用户名</div>
                <el-input placeholder="请输入用户名" v-model="username"></el-input>
            </el-form-item>
            <el-form-item>
                <div class="left">密码</div>
                <el-input placeholder="请输入密码" v-model="password" type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <div class="left">确认密码</div>
                <el-input placeholder="请再次输入密码" v-model="password2" type="password"></el-input>
            </el-form-item>
            <el-form-item class="button1">
                <el-button type="primary" @click="register_2">注册</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="isRegister = false">返回登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { register, login, queryUsername } from '@/api/loginapi';
import { mapState, mapActions, mapMutations } from 'vuex';
import { getAvatar } from '@/api/friendapi';
import { adminLogin } from '@/api/adminapi';

export default {
    name: "App",
    components: {
    },
    data() {
        return {
            //用于标记当前是否在注册
            isRegister: false,
            userId: "",
            //用于存储用户名和密码
            username: "",
            password: "",
            //用于存储确认密码
            password2: "",
        };
    },
    methods: {
        ...mapMutations(["setUserId", "setJWT"]),
        //登录
        login() {
            console.log("登录");
            if (this.userId == "" || this.password == "") {
                this.$message.error("用户名或密码不能为空");
                return;
            }
            let params = {
                userID: this.userId,
                password: this.password
            };
            console.log(this.$store.state.userId)
            //将用户id存入全局变量
            this.$store.commit("setUserId", this.userId);
            console.log(params);
            //调用管理员登录接口
            adminLogin(params).then(res => {
                console.log(res);
                if (res.code == true) {
                    this.$router.push("/admin");
                } else {
                    console.log("普通用户登录");
                }
            });
            //调用登录接口
            login(params).then(res => {
                console.log(res);
                if (res.code == true) {
                    queryUsername({ userId: this.$store.state.userId }).then((event) => {
                        console.log(event);
                        this.$store.state.headImg = event.data.headimg;
                        this.$store.state.username = event.data.username;
                        this.$message.success("登录成功");
                        //将jwt存入全局变量
                        this.$store.commit("setJWT", res.data);
                        console.log(this.$store.state.JWT);
                        this.$router.push("/ChatHome");
                    });
                } else {
                    this.$message.error("登录失败");
                }
            });
        },
        //监听注册事件
        register_1() {
            this.isRegister = true;
        },
        //调用注册接口
        register_2() {
            console.log("注册");
            if (this.username == "" || this.password == "" || this.password2 == "") {
                this.$message.error("用户名或密码不能为空");
                return;
            }
            if (this.password != this.password2) {
                this.$message.error("两次密码不一致");
                return;
            }
            else {
                let params = {
                    username: this.username,
                    password: this.password,
                    headImg: ''
                };
                getAvatar().then((res) => {
                    params.headImg = res.imgurl;
                    console.log(params);
                    register(params).then(userId => {
                        console.log(userId);
                        if (userId.code == true) {
                            this.$message.success("注册成功");
                            //弹窗显示用户id
                            this.$alert("您的用户id为：" + userId.data, "用户id", {
                                confirmButtonText: "确定",
                                callback: action => {
                                    this.isRegister = false;
                                }
                            });
                        } else {
                            this.$message.error("注册失败");
                        }
                    });
                });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.login {
    width: 30vw;
    height: 60vh;
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
    margin-bottom: 100px;
}

//将表格中的每一项设置为左右排列
::v-deep .el-form-item__content {
    font-size: 18px;
    display: flex;
    justify-content: space-between;
    color: white;
    margin-bottom: 40px;
}

.left {
    width: 30%;
    text-align: center;
    line-height: 40px;
}

::v-deep .el-input {
    width: 70%;
    margin-right: 60px;
}

.button1 {
    margin-top: -15px;
    text-align: center;
}
</style>