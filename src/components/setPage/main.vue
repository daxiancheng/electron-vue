<template>
  <div class="mask-bg" v-show="maskShow">
    <div class="mask-content">
      <div class="mask-title">设置</div>
      <div class="item-line" v-if="maskType === 'clock'">
        <span>倒计时说明: </span
        ><input
          v-model="masktitle"
          type="text"
          placeholder="如：距离下班还有"
        />
      </div>
      <div class="item-line" v-if="maskType === 'clock'">
        <span>自定义时间: </span
        ><input
          type="text"
          placeholder="如：2023/10/01 00:00:00"
          v-model="maskdate"
        />
      </div>
      <div class="item-line" v-if="maskType === 'clock'">
        <span>节假日选择: </span>
        <select v-model="holidayDate">
          <option value="" disabled>可选择节日</option>
          <option
            v-for="(item, index) in holidayList"
            :key="index"
            :value="item.holiday_cn + '-' + item.date_cn"
          >
            {{ item.holiday_cn + `(${item.date_cn})` }}
          </option>
        </select>
      </div>
      <div class="item-line" v-if="['main'].includes(maskType)">
        <span>主题: </span
        ><input
          type="text"
          placeholder="如：今日事今日毕"
          v-model="masktitle"
        />
      </div>
      <div class="item-line" v-if="['todo'].includes(maskType)">
        <span>今日事: </span
        ><input
          type="text"
          placeholder="可添加多条，用英文分号分割"
          v-model="masktodo"
        />
      </div>
      <div class="item-line" v-if="maskType === 'main'">
        <span>背景: </span>
        <div :class="'set-' + maskType"></div>
      </div>
      <div class="bottom-btn">
        <div class="cancel-btn" @click="maskShow = false">取消</div>
        <div class="confirm-btn" @click="confirmBtn">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
// import ewColorPicker from "ew-color-picker";
// import "ew-color-picker/dist/ew-color-picker.min.css";
export default {
  name: "MainSet",
  props: {
    maskType: {
      type: String,
      default: "clock",
    },
    holidayList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      bgColor: "rgba(255, 255, 255, 0.3)",
      maskShow: false,
      masktitle: "",
      maskdate: "",
      masktodo: "",
      wsColor: null,
      holidayDate: "",
    };
  },
  watch: {
    holidayDate() {
      if (this.holidayDate) {
        const date = this.holidayDate.split("-");
        const reg = /[\u4e00-\u9fa5]/g;
        this.maskdate = date[1].replace(reg, "/").replace(/\/$/, "");
        this.masktitle = "距离" + date[0] + "还有";
      }
    },
  },
  async mounted() {
    console.log("holidayListholidayList", this.holidayList);
    if (this.maskType === "main") {
      const info =
        (await window.localforage.getItem(this.maskType + "-localInfo")) || {};
      this.bgColor = info.color || this.bgColor;
      // eslint-disable-next-line
      this.wsColor = new ewColorPicker({
        el: ".set-" + this.maskType,
        alpha: true, // 是否开启透明度
        hue: true, // 是否开启色调
        size: "mini",
        defaultColor: this.bgColor,
        sure: this.setColor,
        clear: this.initColor,
      });
    }
  },
  methods: {
    setColor(e) {
      console.log("设置color", e);
      this.bgColor = e;
    },

    initColor() {
      this.bgColor = "rgba(255, 255, 255, 0.3)";
    },
    openMask() {
      console.log("this.maskType", this.maskType);
      this.maskShow = true;
      this.$nextTick(async () => {
        const info =
          (await window.localforage.getItem(this.maskType + "-localInfo")) ||
          {};
        this.bgColor = info.color || this.bgColor;
        this.masktitle = info.title;
        this.maskdate = info.date;
        this.masktodo = "";
        console.log("bgColor", this.bgColor);
        this.wsColor && this.wsColor.updateColor(this.bgColor);
      });
    },
    confirmBtn() {
      let todo = [];
      if (this.masktodo) {
        const mask = this.masktodo.split(";");
        mask.forEach((item) => {
          todo.push({ isFinish: false, text: item });
        });
      }
      const setInfo = {
        title: this.masktitle,
        date: this.maskdate,
        color: this.bgColor,
        todo,
      };
      this.$emit(this.maskType + "set", setInfo);
      window.localforage.setItem(this.maskType + "-localInfo", setInfo);
      this.maskShow = false;
    },
  },
};
</script>

<style>
.mask-bg {
  background: rgba(00, 00, 00, 0.6);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ddd;
}

.mask-bg input {
  width: 180px;
}

.mask-bg select {
  width: 180px;
  outline: none;
  border: 1px solid #ddd;
  border-radius: 2px;
  background: none;
  color: #ddd;
}
select option {
  color: #333;
}
select::-webkit-scrollbar {
  display: none;
}
.mask-title {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  padding: 10px;
  /* border-bottom: 1px solid #666 ; */
  margin-bottom: 10px;
}
.mask-content {
  /* width: 320px; */
  /* border: 1px solid #999; */
  background: rgba(255, 255, 255, 0.3);
  padding: 20px;
  border-radius: 6px;
}
.item-line {
  display: flex;
  margin: 10px 0;
  font-size: 18px;
}
.item-line > span {
  margin-right: 5px;
}
input {
  caret-color: #ddd;
  color: #ddd;
}

.bottom-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.cancel-btn {
  color: #999;
  padding: 4px 15px;
  border: 1px solid #999;
  border-radius: 6px;
}
.confirm-btn {
  color: #fff;
  padding: 6px 15px;
  background: rgb(54, 171, 96);
  border-radius: 6px;
  margin-left: 16px;
}
</style>