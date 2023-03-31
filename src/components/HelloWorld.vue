<template>
  <div class="hello">
    <h1>💖 Hello World!</h1>
    <p>Welcome to your Electron application.</p>
    <!-- <div v-for="item in sysVersion" :key="item">
      <div>{{item}}<span :id="item + '-version'"></span></div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data: ()=>{
    return {
      sysVersion: ['chrome', 'node', 'electron']
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

/* 示例代码 https://blog.csdn.net/qq_46071321/article/details/108881012*/
/* .number {
  width: 100px;
  height: 200px;
  line-height: 200px;
  position: relative;
  border: 1px solid red;
  text-align: center;
  font-size: 60px;
}

.number:before, .number:after {
  content: '1';
  position: absolute;
  left: 0;
  right: 0;
  overflow: hidden;
}

.number:before {
  top: 0;
  bottom: 50%;
  box-sizing: border-box;
  border-bottom: solid 1px #666;
}

.number:after {
  top: 50%;
  bottom: 0;
  line-height: 0;
} */
</style>
