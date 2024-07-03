<template>
  <div class="home">
    <el-container height="100%">
      <el-aside width="100px">
        <Nav></Nav>
      </el-aside>
      <el-main>
        <index v-if="!isGroup"></index>
        <index2 v-else></index2>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Nav from "../components/Nav.vue";
import index from "./pages/chatHome/index.vue";
import index2 from "./pages/bigHome/index2.vue";
export default {
  name: "App",
  components: {
    Nav,
    index,
    index2
  },
  data() {
    return {
      ws: "ws://100.67.32.81:8080/ws/message",
      token: this.$store.state.JWT,
    };
  },
  computed: {
    isGroup() {
      return this.$store.state.isGroup;
    }
  },
  created() {
    console.log(this.$store.state.JWT);
    console.log(this.$store.state.userId);
    this.connectWebSocket();
    this.isGroup = this.$store.state.isGroup;
    console.log(this.isGroup);
  },
  methods: {
    connectWebSocket() {
      const wsUrl = `ws://100.67.32.81:8080/ws/message?token=${encodeURIComponent(this.token)}`;
      console.log('Connecting to WebSocket:', wsUrl);
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connection opened');
      };

      // 接收消息
      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
        console.log(message.warning);
        //广播消息的格式是message = "{\"warning\":\"系统消息\",\"content\":\"" + message + "\"}";，先判断是不是广播消息
        if (message.warning) {
          //浏览器弹窗提示
          this.$alert(message.content, message.warning, {
            confirmButtonText: 'OK',
            callback: action => {
              //关闭页面
              window.close();
            }
          });
        }
      };

      // 发送消息
      this.ws.sendMessage = (params) => {
        this.ws.send(JSON.stringify(params));
      };


      // 关闭连接
      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        this.$alert('网络异常', 'Error', {
          confirmButtonText: 'OK',
          callback: action => {
            //关闭页面
            window.close();
          }
        });
        this.$router.push("/");
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        //弹窗提示
        this.$alert('网络异常', 'Error', {
          confirmButtonText: 'OK',
          callback: action => {
            //关闭页面
            window.close();
          }
        });
        //返回登录页面
        this.$router.push("/");
      };

      // 将 WebSocket 实例添加到 Vue 实例上，以便子组件访问
      this.$root.ws = this.ws;
    }
  },
  beforeDestroy() {
    if (this.ws) {
      this.ws.close();
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  width: 90vw;
  height: 90vh;
  background-color: rgb(39, 42, 55);
  border-radius: 15px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>