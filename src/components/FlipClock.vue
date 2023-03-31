<template>
  <div class="FlipClock">
    <Flipper ref="flipperDay1" />
    <Flipper ref="flipperDay2" />
    <Flipper ref="flipperDay3" />
    天
    <Flipper ref="flipperHour1" />
    <Flipper ref="flipperHour2" />
    时
    <Flipper ref="flipperMinute1" />
    <Flipper ref="flipperMinute2" />
    分
  </div>
</template>

<script>
import Flipper from "./Flipper";

export default {
  name: "FlipClock",
  props: {
    targetTime: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      timer: null,
      ipoEndTime: 0,
      //   targetTime: '2023/03/28 14:30:00',
      flipObjs: [],
    };
  },
  watch: {
    targetTime() {
      if (!this.targetTime) {
        for (let i = 0; i < this.flipObjs.length; i++) {
          this.flipObjs[i].clear();
        }
        this.timer && clearInterval(this.timer);
      } else {
        this.init();
      }
    },
  },
  components: {
    Flipper,
  },
  methods: {
    // 初始化数字
    init() {
      let nowMin = new Date().getTime() / (1000 * 60);
      let endMin = Date.parse(this.targetTime) / (1000 * 60);
      if (!isNaN(endMin) && endMin > nowMin) {
        this.ipoEndTime = endMin - nowMin;
        const day = this.ipoEndAfterDay();
        if (!day) {
          for (let i = 0; i < this.flipObjs.length; i++) {
            this.flipObjs[i].clear();
          }
          this.timer && clearInterval(this.timer);
          return;
        }
        const hours = this.ipoEndAfterHour(day);
        const min = this.ipoEndAfterMin(day, hours);
        this.nowTimeStr = day + hours + min;
        for (let i = 0; i < this.flipObjs.length; i++) {
          this.flipObjs[i].setFront(this.nowTimeStr[i]);
        }
        console.log("timeStr", this.nowTimeStr);
        this.run();
      } else {
        for (let i = 0; i < this.flipObjs.length; i++) {
          this.flipObjs[i].clear();
        }
        this.timer && clearInterval(this.timer);
      }
    },
    // 开始计时
    run() {
      this.timer && clearInterval(this.timer);
      this.timer = setInterval(() => {
        if (this.ipoEndTime === 0) {
          clearInterval(this.timer);
          return;
        }
        this.ipoEndTime--;
        const day = this.ipoEndAfterDay();
        const hours = this.ipoEndAfterHour(day);
        const min = this.ipoEndAfterMin(day, hours);
        this.nextTimeStr = day + hours + min;
        for (let i = 0; i < this.flipObjs.length; i++) {
          if (this.nowTimeStr[i] === this.nextTimeStr[i]) {
            continue;
          }
          this.flipObjs[i].flipDown(this.nowTimeStr[i], this.nextTimeStr[i]);
        }
        this.nowTimeStr = this.nextTimeStr;
      }, 1000 * 60);
    },
    ipoEndAfterDay() {
      const temp = Math.floor(this.ipoEndTime / 60 / 24);
      if (temp > 999) {
        return "";
      }
      return String(temp).padStart(3, "0");
    },

    ipoEndAfterHour(day) {
      const temp = Math.floor((this.ipoEndTime - day * 60 * 24) / 60);
      return String(temp).padStart(2, "0");
    },

    ipoEndAfterMin(day, hour) {
      const temp = Math.floor(this.ipoEndTime - day * 60 * 24 - hour * 60);
      return String(temp).padStart(2, "0");
    },

    //   ipoEndAfterSec() {
    //     const temp = Math.floor(
    //       this.ipoEndTime - this.ipoEndAfterDay * 3600 * 24 - this.ipoEndAfterHour * 3600 - this.ipoEndAfterMin * 60
    //     );
    //     return String(temp).padStart(2, '0');
    //   },
  },
  mounted() {
    this.flipObjs = [
      this.$refs.flipperDay1,
      this.$refs.flipperDay2,
      this.$refs.flipperDay3,
      this.$refs.flipperHour1,
      this.$refs.flipperHour2,
      this.$refs.flipperMinute1,
      this.$refs.flipperMinute2,
    ];
  },
};
</script>

<style>
.FlipClock {
  text-align: center;
}
.FlipClock .M-Flipper {
  margin: 0 3px;
}
.FlipClock em {
  display: inline-block;
  line-height: 102px;
  font-size: 66px;
  font-style: normal;
  vertical-align: top;
}
</style>
