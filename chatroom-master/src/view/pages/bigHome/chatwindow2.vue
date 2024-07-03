<template>
    <div class="chat-window">
        <div class="top">
            <div class="head-pic">
                <HeadPortrait :imgUrl="friendInfo.headImg" :isOnline="true"></HeadPortrait>
            </div>
            <div class="info-detail">
                <div class="name">{{ friendInfo.name }}</div>
                <div class="detail">{{ friendInfo.detail }}</div>
            </div>
            <div class="other-fun">
                <!-- <span class="iconfont icon-shipin" @click="video"> </span>
        <span class="iconfont icon-gf-telephone" @click="telephone"></span>
        <label for="docFile">
          <span class="iconfont icon-wenjian"></span>
        </label> -->
                <label for="imgFile">
                    <span class="iconfont icon-tupian"></span>
                </label>
                <input type="file" name="" id="imgFile" @change="sendImg" accept="image/*" />
                <input type="file" name="" id="docFile" @change="sendFile" accept="application/*,text/*" />
                <!-- accept="application/*" -->
            </div>
        </div>
        <div class="botoom">
            <div class="chat-content" ref="chatContent">
                <div class="chat-wrapper" v-for="item in chatList" :key="item.id">
                    <div class="chat-friend" v-if="item.uid != userId">
                        <div class="chat-text" v-if="item.chatType == 0">
                            {{ item.msg }}
                        </div>
                        <div class="chat-img" v-if="item.chatType == 1">
                            <img :src="item.msg" alt="表情" v-if="item.extend.imgType == 1"
                                style="width: 100px; height: 100px" />
                            <el-image :src="item.msg" :preview-src-list="srcImgList" v-else>
                            </el-image>
                        </div>
                        <div class="chat-img" v-if="item.chatType == 2">
                            <div class="word-file">
                                <FileCard :fileType="item.extend.fileType" :file="item.msg"></FileCard>
                            </div>
                        </div>
                        <div class="info-time">
                            <img :src="item.headImg" alt="" />
                            <span>{{ item.name }}</span>
                            <span>{{ item.time }}</span>
                        </div>
                    </div>
                    <div class="chat-me" v-else>
                        <div class="chat-text" v-if="item.chatType == 0">
                            {{ item.msg }}
                        </div>
                        <div class="chat-img" v-if="item.chatType == 1">
                            <img :src="item.msg" alt="表情" v-if="item.extend.imgType == 1"
                                style="width: 100px; height: 100px" />
                            <el-image style="max-width: 300px; border-radius: 10px" :src="item.msg"
                                :preview-src-list="srcImgList" v-else>
                            </el-image>
                        </div>
                        <div class="chat-img" v-if="item.chatType == 2">
                            <div class="word-file">
                                <FileCard :fileType="item.extend.fileType" :file="item.msg"></FileCard>
                            </div>
                        </div>
                        <div class="info-time">
                            <span>{{ item.name }}</span>
                            <span>{{ item.time }}</span>
                            <img :src="item.headImg" alt="" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="chatInputs">
                <div class="emoji boxinput" @click="clickEmoji">
                    <img src="@/assets/img/emoji/smiling-face.png" alt="" />
                </div>
                <div class="emoji-content">
                    <Emoji v-show="showEmoji" @sendEmoji="sendEmoji" @closeEmoji="clickEmoji"></Emoji>
                </div>
                <input class="inputs" v-model="inputMsg" @keyup.enter="sendText" />
                <div class="send boxinput" @click="sendText">
                    <img src="@/assets/img/emoji/rocket.png" alt="" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { animation } from "@/util/util";
import { getChatMsg } from "@/api/friendapi";
import { getGroupMsg } from "@/api/groupapi";
import HeadPortrait from "@/components/HeadPortrait";
import Emoji from "@/components/Emoji";
import FileCard from "@/components/FileCard.vue";
export default {
    components: {
        HeadPortrait,
        Emoji,
        FileCard,
    },
    props: {
        friendInfo: Object,
        default() {
            return {};
        },
    },
    watch: {
        friendInfo() {
            this.getFriendChatMsg();
        },
    },
    data() {
        return {
            chatList: [],
            inputMsg: "",
            showEmoji: false,
            srcImgList: [],
            userId: this.$store.state.userId,
        };
    },
    //在页面渲染完成后滑动到底部
    mounted() {
        this.getFriendChatMsg();
        this.scrollBottom();
    },
    //增加一个监听事件，监听websocket的消息
    created() {
        //后端在转发时已经解包，收到的是content
        this.$root.ws.onmessage = (event) => {
            //json字符串转化为json对象
            let message = JSON.parse(event.data);
            console.log(event.data);
            console.log(message)
            let img = ''
            let nowname = ''
            let id = ''
            if (message.sender == this.$store.state.userId) {
                img = this.$store.state.headImg
                nowname = this.$store.state.username
                id = this.$store.state.userId
            } else {
                img = message.headimg
                nowname = message.username
                id = message.sender
            }
            let chatMsg = {
                headImg: img,
                name: nowname,
                time: message.date,
                msg: message.content,
                chatType: message.type, //信息类型，0文字，1图片, 2文件
                uid: id, //uid
            };
            if (message.type == 1) {
                //先尝试匹配是否为表情,只看开头是不是img/，如果是则是表情
                let reg = /^img\//;
                if (reg.test(message.content)) {
                    //去掉后端返回数据中的img/
                    let img = "@/assets/img/emoji/" + message.content.replace(/img\//g, '')
                    message.content = img
                    chatMsg.chatType = 1
                    //添加一个extend属性，用于判断是表情还是图片
                    chatMsg.extend = {
                        imgType: 1, //(1表情，2本地图片)
                    }
                }
                //否则是base64图片
                else {
                    chatMsg.chatType = 1
                    chatMsg.extend = {
                        imgType: 2, //(1表情，2本地图片)
                    }
                    this.srcImgList.push(chatMsg.msg);
                }
            }
            this.chatList.push(chatMsg);
            this.scrollBottom();
        };
    },
    methods: {
        //获取聊天记录
        getFriendChatMsg() {
            //清空聊天记录
            this.chatList = [];
            this.srcImgList = [];
            let params = {
                groupId: this.friendInfo.id,
            };
            // getChatMsg(params).then((res) => {
            //   this.chatList = res;
            //   this.chatList.forEach((item) => {
            //     if (item.chatType == 2 && item.extend.imgType == 2) {
            //       this.srcImgList.push(item.msg);
            //     }
            //   });
            // });
            console.log(params);
            getGroupMsg(params).then((res) => {
                for (let i = 0; i < res.data.length; i++) {
                    let img = ''
                    let nowname = ''
                    let id = ''
                    if (res.data[i].sender == this.$store.state.userId) {
                        img = this.$store.state.headImg
                        nowname = this.$store.state.username
                        id = this.$store.state.userId
                    } else {
                        img = res.data[i].headimg
                        nowname = res.data[i].username
                        id = res.data[i].sender
                    }
                    let chatMsg = {
                        headImg: img,
                        name: nowname,
                        //将date转化为"yyyy-MM-dd HH:mm:ss"格式
                        time: new Date(res.data[i].date).toLocaleString(),
                        msg: res.data[i].content,
                        chatType: 0, //信息类型，0文字，1图片, 2文件
                        uid: id, //uid
                    };
                    if (res.data[i].type == 1) {
                        //先尝试匹配是否为表情,只看开头是不是img/，如果是则是表情
                        let reg = /^img\//;
                        if (reg.test(res.data[i].content)) {
                            //去掉后端返回数据中的img/
                            let img = "@/assets/img/emoji/" + res.data[i].content.replace(/img\//g, '')
                            res.data[i].content = img
                            chatMsg.chatType = 1
                            //添加一个extend属性，用于判断是表情还是图片
                            chatMsg.extend = {
                                imgType: 1, //(1表情，2本地图片)
                            }
                        }
                        //否则是base64图片
                        else {
                            chatMsg.chatType = 1
                            chatMsg.extend = {
                                imgType: 2, //(1表情，2本地图片)
                            }
                            this.srcImgList.push(chatMsg.msg);
                        }
                    }
                    this.chatList.push(chatMsg);
                    this.scrollBottom();
                }
            });
        },
        //发送信息
        sendMsg(msgList) {
            this.chatList.push(msgList);
            this.scrollBottom();
        },
        //获取窗口高度并滚动至最底层
        scrollBottom() {
            this.$nextTick(() => {
                const scrollDom = this.$refs.chatContent;
                animation(scrollDom, scrollDom.scrollHeight - scrollDom.offsetHeight);
            });
        },
        //关闭标签框
        clickEmoji() {
            this.showEmoji = !this.showEmoji;
        },
        //发送文字信息
        sendText() {
            if (this.inputMsg) {
                let message = this.escapeSpecialChars(this.inputMsg)
                let nowtime = new Date().toLocaleString()
                console.log(message);
                let chatMsg = {
                    headImg: this.$store.state.headImg,
                    name: this.$store.state.username,
                    //获取现在时间
                    time: nowtime,
                    //将输入的信息经过加工，避免转义字符无法正常显示
                    msg: this.inputMsg,
                    chatType: 0, //信息类型，0文字，1图片
                    uid: this.$store.state.userId //uid
                };
                console.log(this.friendInfo.id)
                let params = {
                    sender: this.$store.state.userId,
                    groupid: this.friendInfo.id,
                    content: this.inputMsg,
                    date: nowtime,
                    type: 0,
                    headimg: this.$store.state.headImg,
                    username: this.$store.state.username
                }
                this.sendMsg(chatMsg);
                this.$root.ws.sendMessage(params);
                this.$emit('personCardSort', this.friendInfo.id)
                this.inputMsg = "";
            } else {
                this.$message({
                    message: "消息不能为空哦~",
                    type: "warning",
                });
            }
        },
        //发送表情
        sendEmoji(msg) {
            let chatMsg = {
                headImg: this.$store.state.headImg,
                name: this.$store.state.username,
                time: new Date().toLocaleString(),
                msg: msg,
                chatType: 1, //信息类型，0文字，1图片
                extend: {
                    imgType: 1, //(1表情，2本地图片)
                },
                uid: this.$store.state.userId,
            };
            let params = {
                sender: this.$store.state.userId,
                groupid: this.friendInfo.id,
                content: msg,
                date: new Date().toLocaleString(),
                type: 1,
                headimg: this.$store.state.headImg,
                username: this.$store.state.username
            }
            this.$root.ws.sendMessage(params);
            this.sendMsg(chatMsg);
            this.clickEmoji();
        },
        //发送本地图片
        sendImg(e) {
            let _this = this;
            console.log(e.target.files);
            let chatMsg = {
                headImg: this.$store.state.headImg,
                name: this.$store.state.username,
                time: new Date().toLocaleString(),
                msg: "",
                chatType: 1, //信息类型，0文字，1图片, 2文件
                extend: {
                    imgType: 2, //(1表情，2本地图片)
                },
                uid: this.$store.state.userId,
            };
            let files = e.target.files[0]; //图片文件名
            if (!e || !window.FileReader) return; // 看是否支持FileReader
            // 创建一个reader
            let reader = new FileReader();
            // 将图片将转成 base64 格式，可以直接将图片转成 base64 字符串
            reader.readAsDataURL(files); // 关键一步，在这里转换的
            // 将base64发送给后端
            let params = {
                sender: this.$store.state.userId,
                groupid: this.friendInfo.id,
                content: '',
                date: new Date().toLocaleString(),
                type: 1,
                headimg: this.$store.state.headImg,
                username: this.$store.state.username
            }
            // 读取成功后的回调
            reader.onloadend = function () {
                chatMsg.msg = this.result; //赋值
                //将图片地址发送给后端
                _this.srcImgList.push(chatMsg.msg);
                //把base64转换为包装成对象
                params.content = chatMsg.msg
                _this.$root.ws.sendMessage(params);
                _this.sendMsg(chatMsg);
            };
            e.target.files = null;
        },
        //发送文件
        sendFile(e) {
            let chatMsg = {
                headImg: require("@/assets/img/head_portrait.jpg"),
                name: "大毛是小白",
                time: "09：12 AM",
                msg: "",
                chatType: 2, //信息类型，0文字，1图片, 2文件
                extend: {
                    fileType: "", //(1word，2excel，3ppt，4pdf，5zpi, 6txt)
                },
                uid: "1001",
            };
            let files = e.target.files[0]; //图片文件名
            chatMsg.msg = files;
            console.log(files);
            if (files) {
                switch (files.type) {
                    case "application/msword":
                    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                        chatMsg.extend.fileType = 1;
                        break;
                    case "application/vnd.ms-excel":
                    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                        chatMsg.extend.fileType = 2;
                        break;
                    case "application/vnd.ms-powerpoint":
                    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                        chatMsg.extend.fileType = 3;
                        break;
                    case "application/pdf":
                        chatMsg.extend.fileType = 4;
                        break;
                    case "application/zip":
                    case "application/x-zip-compressed":
                        chatMsg.extend.fileType = 5;
                        break;
                    case "text/plain":
                        chatMsg.extend.fileType = 6;
                        break;
                    default:
                        chatMsg.extend.fileType = 0;
                }
                this.sendMsg(chatMsg);
                e.target.files = null;
            }
        },
        // 发送语音
        telephone() {
            this.$message("该功能还没有开发");
        },
        //发送视频
        video() {
            this.$message("该功能还没有开发");
        },

        escapeSpecialChars(input) {
            // 使用正则表达式替换可能引起问题的特殊字符
            // 如：将双引号替换为\"，反斜杠替换为\\等
            return input.replace(/[\b\t\n\f\r\"\\]/g, function (s) {
                switch (s) {
                    case "\b": return "\\b";
                    case "\t": return "\\t";
                    case "\n": return "\\n";
                    case "\f": return "\\f";
                    case "\r": return "\\r";
                    case "\"": return "\\\"";
                    case "\\": return "\\\\";
                    default: return s;
                }
            });
        }
    },

};
</script>

<style lang="scss" scoped>
.chat-window {
    width: 100%;
    height: 100%;
    margin-left: 20px;
    position: relative;

    .top {
        margin-bottom: 50px;

        &::after {
            content: "";
            display: block;
            clear: both;
        }

        .head-pic {
            float: left;
        }

        .info-detail {
            float: left;
            margin: 5px 20px 0;

            .name {
                font-size: 20px;
                font-weight: 600;
                color: #fff;
            }

            .detail {
                color: #9e9e9e;
                font-size: 12px;
                margin-top: 2px;
            }
        }

        .other-fun {
            float: right;
            margin-top: 20px;

            span {
                margin-left: 30px;
                cursor: pointer;
            }

            // .icon-tupian {

            // }
            input {
                display: none;
            }
        }
    }

    .botoom {
        width: 100%;
        height: 70vh;
        background-color: rgb(50, 54, 68);
        border-radius: 20px;
        padding: 20px;
        box-sizing: border-box;
        position: relative;

        .chat-content {
            width: 100%;
            height: 85%;
            overflow-y: scroll;
            padding: 20px;
            box-sizing: border-box;

            &::-webkit-scrollbar {
                width: 0;
                /* Safari,Chrome 隐藏滚动条 */
                height: 0;
                /* Safari,Chrome 隐藏滚动条 */
                display: none;
                /* 移动端、pad 上Safari，Chrome，隐藏滚动条 */
            }

            .chat-wrapper {
                position: relative;
                word-break: break-all;

                .chat-friend {
                    width: 100%;
                    float: left;
                    margin-bottom: 20px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: flex-start;

                    .chat-text {
                        max-width: 90%;
                        padding: 20px;
                        border-radius: 20px 20px 20px 5px;
                        background-color: rgb(56, 60, 75);
                        color: #fff;

                        &:hover {
                            background-color: rgb(39, 42, 55);
                        }
                    }

                    .chat-img {
                        img {
                            width: 100px;
                            height: 100px;
                        }
                    }

                    .info-time {
                        margin: 10px 0;
                        color: #fff;
                        font-size: 14px;

                        img {
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;
                            vertical-align: middle;
                            margin-right: 10px;
                        }

                        span:last-child {
                            color: rgb(101, 104, 115);
                            margin-left: 10px;
                            vertical-align: middle;
                        }
                    }
                }

                .chat-me {
                    width: 100%;
                    float: right;
                    margin-bottom: 20px;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    align-items: flex-end;

                    .chat-text {
                        float: right;
                        max-width: 90%;
                        padding: 20px;
                        border-radius: 20px 20px 5px 20px;
                        background-color: rgb(29, 144, 245);
                        color: #fff;

                        &:hover {
                            background-color: rgb(26, 129, 219);
                        }
                    }

                    .chat-img {
                        img {
                            max-width: 300px;
                            max-height: 200px;
                            border-radius: 10px;
                        }
                    }

                    .info-time {
                        margin: 10px 0;
                        color: #fff;
                        font-size: 14px;
                        display: flex;
                        justify-content: flex-end;

                        img {
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;
                            vertical-align: middle;
                            margin-left: 10px;
                        }

                        span {
                            line-height: 30px;
                        }

                        span:first-child {
                            color: rgb(101, 104, 115);
                            margin-right: 10px;
                            vertical-align: middle;
                        }
                    }
                }
            }
        }

        .chatInputs {
            width: 90%;
            position: absolute;
            bottom: 0;
            margin: 3%;
            display: flex;

            .boxinput {
                width: 50px;
                height: 50px;
                background-color: rgb(66, 70, 86);
                border-radius: 15px;
                border: 1px solid rgb(80, 85, 103);
                position: relative;
                cursor: pointer;

                img {
                    width: 30px;
                    height: 30px;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }
            }

            .emoji {
                transition: 0.3s;

                &:hover {
                    background-color: rgb(46, 49, 61);
                    border: 1px solid rgb(71, 73, 82);
                }
            }

            .inputs {
                width: 90%;
                height: 50px;
                background-color: rgb(66, 70, 86);
                border-radius: 15px;
                border: 2px solid rgb(34, 135, 225);
                padding: 10px;
                box-sizing: border-box;
                transition: 0.2s;
                font-size: 20px;
                color: #fff;
                font-weight: 100;
                margin: 0 20px;

                &:focus {
                    outline: none;
                }
            }

            .send {
                background-color: rgb(29, 144, 245);
                border: 0;
                transition: 0.3s;
                box-shadow: 0px 0px 5px 0px rgba(0, 136, 255);

                &:hover {
                    box-shadow: 0px 0px 10px 0px rgba(0, 136, 255);
                }
            }
        }
    }
}
</style>