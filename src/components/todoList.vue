<template>
  <div>
    <div class="todo-content">
      <div class="todo-item" v-for="(item, index) in listData" :key="index">
        <input
          type="checkbox"
          class="check-input"
          :checked="item.isFinish"
          :id="'text-' + index"
          @input="selectFinish(item)"
        />
        <label :for="'text-' + index"
          ><span :class="{ 'input-text': item.isFinish }">{{
            item.text
          }}</span></label
        >
      </div>
    </div>
    <div class="edit-todo" v-if="listData.length">
      <div class="all-select" @click="allSelect">
        {{ allFinish ? "取消" : "全选" }}
      </div>
      <div class="del" @click="delectTodo">删除</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    todoList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      listData: [],
    };
  },
  watch: {
    todoList: {
      handler() {
        this.listData = this.todoList;
      },
      deep: true,
      immediate: true
    },
  },
  computed: {
    allFinish() {
      const finish = this.listData.every((item) => {
        return item.isFinish;
      });
      return finish;
    },
  },
  methods: {
    selectFinish(item) {
      item.isFinish = !item.isFinish;
      const unFinishTodo = JSON.parse(JSON.stringify(this.listData))
      window.localforage.setItem("todo-localInfo", { todo: unFinishTodo })
    },
    delectTodo() {
      const unFinishTodo = [];
      this.listData.forEach((item) => {
        if (!item.isFinish) {
          unFinishTodo.push(item);
        }
      });
      this.$emit("changeList", unFinishTodo);
      window.localforage.setItem("todo-localInfo", { todo: unFinishTodo })
    },
    allSelect() {
      if (this.allFinish) {
        this.listData.forEach((item) => {
          item.isFinish = false;
        });
      } else {
        this.listData.forEach((item) => {
          item.isFinish = true;
        });
      }
      const unFinishTodo = JSON.parse(JSON.stringify(this.listData))
      window.localforage.setItem("todo-localInfo", { todo: unFinishTodo })
    },
  },
};
</script>

<style>
.todo-content {
  padding: 0 20px 10px;
  max-height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
}
.todo-content::-webkit-scrollbar {
  display: none;
}
.todo-item {
  display: flex;
  margin: 6px 0;
}
.check-input {
  align-self: flex-start;
  height: 15px;
  margin-right: 5px;
}
.input-text {
  text-decoration: line-through rgb(216, 30, 6);
}
.edit-todo {
  display: flex;
  justify-content: center;
  align-items: center;
}

.all-select {
  color: rgb(54, 171, 96);
  padding: 6px 15px;
  background: #fff;
  /* border: 1px solid rgb(54, 171, 96); */
  border-radius: 6px;
}
.del {
  color: #fff;
  padding: 6px 15px;
  background: rgb(216, 30, 6);
  border-radius: 6px;
  margin-left: 16px;
}
</style>