<template>
  <div class="content">
    <div class="top-close drag" :style="bgStyle">
      <img
        src="./assets/set.png"
        class="close-img no-drag"
        @click="MaskOpen('Main')"
      />
      <img
        @click="windowHiden"
        src="./assets/close.png"
        alt=""
        srcset=""
        class="close-img no-drag"
      />
    </div>
    <div class="space-line" :style="{ borderColor: bgStyle.background }"></div>
    <div class="clock-bg" :style="bgStyle">
      <div class="clock-img">
        <img
          src="./assets/down-up.png"
          class="close-img"
          @click="setDownOrUp"
          :class="downOrup"
        />
        <img
          src="./assets/set.png"
          class="close-img"
          @click="MaskOpen('Clock')"
        />
      </div>
      <div
        class="clock-text"
        v-if="clockText"
        v-show="downOrup === 'down-icon'"
      >
        {{ clockText }}：
      </div>
      <FlipClock
        v-show="downOrup === 'down-icon'"
        class="flip-clock"
        :targetTime="clockDate"
      />
    </div>
    <div class="space-line" :style="{ borderColor: bgStyle.background }"></div>
    <div class="todo-bg" :style="bgStyle">
      <div class="todo-img">
        <img
          src="./assets/down-up.png"
          class="close-img"
          @click="setTodoDownOrUp"
          :class="todoDownOrup"
        />
        <img
          src="./assets/alarm-add.png"
          class="close-img"
          @click="MaskOpen('Todo')"
        />
      </div>
      <TodoList
        v-show="todoDownOrup === 'down-icon'"
        @changeList="changeList"
        :todoList="todoListData"
      />
    </div>
    <!-- <div @click="windowHiden" class="no-drag">关闭</div> -->
    <MainSet ref="maskMain" maskType="main" @mainset="mainset" />
    <MainSet
      ref="maskClock"
      maskType="clock"
      @clockset="clockset"
      :holidayList="holidayList"
    />
    <MainSet ref="maskTodo" maskType="todo" @todoset="todoset" />
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import FlipClock from "./components/FlipClock.vue";
import MainSet from "./components/setPage/main.vue";
import TodoList from "./components/todoList.vue";
import { getHoliday } from "./server/request.js";

export default {
  name: "App",
  data() {
    return {
      downOrup: "down-icon",
      todoDownOrup: "down-icon",
      clockText: "",
      // todoText: "",
      clockDate: "",
      todoListData: [],
      holidayList: [],
      bgStyle: {
        background: "rgba(255, 255, 255, 0.3)",
      },
    };
  },
  components: {
    FlipClock,
    MainSet,
    TodoList,
  },
  created() {
    this.getHoliday();
  },
  async mounted() {
    const mainInfo = (await window.localforage.getItem("main-localInfo")) || {};
    mainInfo.color && (this.bgStyle.background = mainInfo.color);
    const info = (await window.localforage.getItem("clock-localInfo")) || {};
    this.clockText = info.title;
    this.clockDate = info.date;
    const todoInfo = (await window.localforage.getItem("todo-localInfo")) || {};
    this.todoListData = todoInfo.todo || [];
  },
  methods: {
    windowHiden() {
      window.electronAPI && window.electronAPI.windowHiden();
    },
    setDownOrUp() {
      this.downOrup = this.downOrup === "up-icon" ? "down-icon" : "up-icon";
    },
    setTodoDownOrUp() {
      this.todoDownOrup =
        this.todoDownOrup === "up-icon" ? "down-icon" : "up-icon";
    },
    MaskOpen(type) {
      this.$refs["mask" + type].openMask();
    },
    clockset(info) {
      console.log("确定", info);
      this.clockText = info.title;
      this.clockDate = info.date;
    },
    todoset(info) {
      console.log("todo确定", info);
      if (info.todo.length) {
        this.todoListData = [...this.todoListData, ...info.todo];
      }
    },
    changeList(list) {
      this.todoListData = [...list];
    },
    mainset(info) {
      this.bgStyle.background = info.color;
    },
    async getHoliday() {
      const year = new Date().getFullYear();
      const list = await window.localforage.getItem(year + "-holiday");
      if (list) {
        console.log("holidayList", list);
        this.holidayList = list;
      } else {
        // 删除去年数据
        window.localforage.removeItem(year - 1 + "-holiday");
        getHoliday(
          `https://api.apihubs.cn/holiday/get?year=${year}&cn=1&holiday=99&holiday_today=1`
        )
          .then((data) => {
            const res = data.data;
            if (res.code === 0) {
              this.holidayList = res.data.list;
              window.localforage.setItem(year + "-holiday", res.data.list);
            } else {
              console.log("获取节假日失败");
            }
          })
          .catch(() => {
            console.log("获取节假日失败");
          });
      }
    },
  },
};
</script>

<style>
#app {
  /* text-align: center; */
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
  color: #fff;
  /* background: rgba(00, 00, 00, 0.1); */
  /* background: #333; */
  border-radius: 10px;
  /* background-image: url('./assets/4781442-d6a8c2e5714b4c44.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover; */
}

.clock-text {
  font-size: 20px;
  font-weight: bold;
  padding-left: 10px;
  margin-bottom: 10px;
}

.content {
  width: 100%;
  height: 100%;
}

.drag {
  -webkit-app-region: drag;
}
.no-drag {
  -webkit-app-region: no-drag;
}
.clock-bg {
  /* background: rgba(255, 255, 255, 0.3); */
  /* margin-top: 60px; */
  padding-bottom: 20px;
  /* margin-top: 10px; */

  /* width: 540px; */
}

.space-line {
  height: 10px;
  border-left: 1px solid;
  border-right: 1px solid;
}

.todo-bg {
  padding-bottom: 20px;
  /* margin-top: 10px; */
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 6px;
}

.clock-img {
  width: 100%;
  height: 36px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 10px;
}

.todo-img {
  width: 100%;
  height: 36px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 10px;
  padding-left: 20px;
}

.down-icon {
  transform: rotate(180deg);
}

.up-icon {
  transform: rotate(0deg);
}

/* .flip-clock {
  margin-bottom: 20px;
} */

.top-close {
  /* position: absolute;
  right: 20px;
  top: 20px; */
  width: 100%;
  height: 30px;
  /* background: rgba(255, 255, 255, 0.3); */
  display: flex;
  justify-content: flex-end;
  align-items: center;
  /* padding-right: 10px; */
}

.close-img {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
</style>
