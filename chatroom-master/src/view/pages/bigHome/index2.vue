<template>
    <div class="chatHome">
        <div class="chatLeft">
            <div class="title">
                <h1>聊天室</h1>
                <!--添加群组按钮-->
                <el-button type="primary" @click="addgroup" class="addgroup">+</el-button>
            </div>
            <div class="online-person">
                <span class="onlin-text">群聊列表</span>
                <div class="person-cards-wrapper">
                    <div class="personList" v-for="personInfo in personList" :key="personInfo.id"
                        @click="clickPerson(personInfo)">
                        <PersonCard :personInfo="personInfo" :pcCurrent="pcCurrent" :userIsOnline="true">
                        </PersonCard>
                    </div>
                </div>
            </div>
        </div>
        <div class="chatRight">
            <!-- <router-view></router-view> -->
            <div v-if="showChatWindow">
                <ChatWindow2 :friendInfo="chatWindowInfo" @personCardSort="personCardSort"></ChatWindow2>
            </div>
            <div class="showIcon" v-else>
                <span class="iconfont icon-snapchat"></span>
                <!-- <img src="@/assets/img/snapchat.png" alt="" /> -->
            </div>
        </div>
        <!-- <el-col :span="4"><div class="grid-content bg-purple"></div></el-col> -->
    </div>
</template>

<script>
import PersonCard from "@/components/PersonCard.vue";
import ChatWindow2 from "./chatwindow2.vue";
import { getGroup, addGroup } from "@/api/groupapi.js";

export default {
    name: "App",
    components: {
        PersonCard,
        ChatWindow2
    },
    data() {
        return {
            pcCurrent: "",
            personList: [],
            showChatWindow: false,
            chatWindowInfo: {},
        };
    },
    mounted() {
        // getFriend1().then((res) => {
        //   console.log(res);
        //   this.personList = res;
        // });
        let params = {
            userId: this.$store.state.userId,
        };
        async function getFriendList(vm) {
            //获取群聊列表
            let res = await getGroup(params);
            console.log(res);
            for (let i = 0; i < res.data.length; i++) {
                let param = {
                    img: '',
                    name: res.data[i].name,
                    detail: '',
                    id: res.data[i].id,
                    headImg: res.data[i].headimg
                };
                vm.personList.push(param);
            }
            console.log(vm.personList);
        }
        getFriendList(this);
    },
    methods: {
        clickPerson(info) {
            this.showChatWindow = true;
            this.chatWindowInfo = info;
            this.personInfo = info;
            this.pcCurrent = info.id;
        },
        personCardSort(id) {
            if (id !== this.personList[0].id) {
                console.log(id);
                let nowPersonInfo;
                for (let i = 0; i < this.personList.length; i++) {
                    if (this.personList[i].id == id) {
                        nowPersonInfo = this.personList[i];
                        this.personList.splice(i, 1);
                        break;
                    }
                }
                this.personList.unshift(nowPersonInfo);
            }
        },
        addgroup() {
            //与添加好友一致的流程,输入群聊号
            this.$prompt('请输入群聊号', '添加群聊', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[0-9]+$/,
                inputErrorMessage: "只能输入数字",
            }).then(({ value }) => {
                let params = {
                    groupId: value,
                    userId: this.$store.state.userId,
                    time: new Date().toLocaleString(),
                };
                addGroup(params).then((res) => {
                    if (res.code === true) {
                        this.$message({
                            message: "添加成功",
                            type: "success",
                        });
                        this.getFriendList();
                    } else {
                        this.$message({
                            message: res.message,
                            type: "error",
                        });
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        }
    },
};
</script>

<style lang="scss" scoped>
.chatHome {
    // margin-top: 20px;
    display: flex;

    .chatLeft {
        width: 280px;

        .title {
            display: flex;
            justify-content: space-between;
            color: #fff;
            padding-left: 10px;

            .addgroup {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: -5px;
                margin-left: -5px;
            }
        }

        .online-person {
            margin-top: 100px;

            .onlin-text {
                padding-left: 10px;
                color: rgb(176, 178, 189);
            }

            .person-cards-wrapper {
                padding-left: 10px;
                height: 65vh;
                margin-top: 20px;
                overflow: hidden;
                overflow-y: scroll;
                box-sizing: border-box;

                &::-webkit-scrollbar {
                    width: 0;
                    /* Safari,Chrome 隐藏滚动条 */
                    height: 0;
                    /* Safari,Chrome 隐藏滚动条 */
                    display: none;
                    /* 移动端、pad 上Safari，Chrome，隐藏滚动条 */
                }
            }
        }
    }

    .chatRight {
        flex: 1;
        padding-right: 30px;

        .showIcon {
            position: absolute;
            top: calc(50% - 150px);
            /*垂直居中 */
            left: calc(50% - 50px);

            /*水平居中 */
            .icon-snapchat {
                width: 300px;
                height: 300px;
                font-size: 300px;
                // color: rgb(28, 30, 44);
            }
        }
    }
}
</style>