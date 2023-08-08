<!-- 
<template>
  <div>
    <div>鼠标左键按下: {{ leftMouseDown }}</div>
    <div>鼠标右键按下: {{ rightMouseDown }}</div>
    <div>键盘按键记录:</div>
    <ul>
      <li v-for="(key, index) in keyboardInputs" :key="index">{{ key }}</li>
    </ul>
  </div>

</template>

<script>
export default {
  data() {
    return {
      leftMouseDown: false,
      rightMouseDown: false,
      keyboardInputs: [],
    };
  },
  mounted() {
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('keydown', this.handleKeyDown);
  },
  beforeDestroy() {
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('keydown', this.handleKeyDown);
  },
  methods: {
    handleMouseDown(event) {
      if (event.button === 0) {
        this.leftMouseDown = true;
      } else if (event.button === 2) {
        this.rightMouseDown = true;
      }
    },
    handleMouseUp(event) {
      if (event.button === 0) {
        this.leftMouseDown = false;
      } else if (event.button === 2) {
        this.rightMouseDown = false;
      }
    },
    handleKeyDown(event) {
      const key = event.key;
      this.keyboardInputs.push(key);
    },
  },
};
</script> -->
<!-- 
<template>
  <div>
    <button @click="checkScreenRecording">Check Screen Recording</button>
    <p v-if="isScreenRecording">Screen recording is in progress.</p>
    <p v-else>Screen recording is not in progress.</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isScreenRecording: false
    };
  },
  methods: {
    checkScreenRecording() {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia({ video: true })
          .then(stream => {
            // 如果成功获取到屏幕流，则说明正在进行录屏
            this.isScreenRecording = true;
            stream.getTracks().forEach(track => track.stop()); // 停止屏幕流
          })
          .catch(error => {
            // 如果捕获到错误，则说明没有进行录屏或不支持录屏功能
            this.isScreenRecording = false;
          });
      } else {
        // 浏览器不支持获取屏幕流，无法进行录屏
        this.isScreenRecording = false;
      }
    }
  }
};
</script> -->


<!-- <template>
  <div>
    <h1>检测用户是否正在录屏</h1>
    <button @click="checkScreenRecording">检测</button>
    <p v-if="isScreenRecording">用户正在录屏</p>
    <p v-else>用户未录屏</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isScreenRecording: false,
    };
  },
  methods: {
    checkScreenRecording() {
      navigator.mediaDevices
        .getDisplayMedia({ video: true }) // 获取屏幕共享流
        .then(() => {
          // 获取屏幕共享流成功，表示用户正在录屏
          this.isScreenRecording = true;
        })
        .catch(() => {
          // 获取屏幕共享流失败，表示用户不在录屏或浏览器不支持
          this.isScreenRecording = false;
        });
    },
  },
};
</script> -->


<!-- <template>
  <div>
    <h1>检测用户截屏操作</h1>
    <p v-if="isScreenshotDetected">检测到用户截屏操作</p>
    <p v-else>未检测到用户截屏操作</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isScreenshotDetected: false,
    };
  },
  mounted() {
    window.addEventListener('resize', this.checkScreenshot);
    window.addEventListener('beforeunload', this.checkScreenshot);
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
    document.oncontextmenu = new Function("event.returnValue=false");
    document.onselectstart = new Function("event.returnValue=false");
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkScreenshot);
    window.removeEventListener('beforeunload', this.checkScreenshot);
  },
  methods: {
    checkScreenshot() {
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const pageWidth = window.innerWidth;
      const pageHeight = window.innerHeight;

      if (pageWidth !== screenWidth || pageHeight !== screenHeight) {
        this.isScreenshotDetected = true;
      }
    },
  },
};
</script>
<style>
@media print {
  BODY {
    display: none
  }
}
</style> -->
