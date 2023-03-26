<script async src="https://docs.opencv.org/master/opencv.js" onload="onOpenCvReady();" type="text/javascript"></script>

<template>
  <div>
    <video ref="video" autoplay width="640" height="360"></video>
    <canvas ref="canvas" width="640" height="360" style="visibility: hidden;z-index: 100;"></canvas>
    <canvas ref="canvas1" width="640" height="360"></canvas>
    <button @click="uploadVideo()">上传</button>
  </div>
</template>


<script>
import axios from 'axios'

export default {
  mounted() {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 360 },
        },
        audio: false,
      })
      .then((stream) => {
        this.$refs.video.srcObject = stream
      })

     this.uploadTimer=setInterval(this.uploadVideo,100);
  },

  methods: {
    destroyed() {
      clearInterval(this.uploadTimer)
    },
    async uploadVideo() {
      const canvas = this.$refs.canvas
      const video = this.$refs.video

      try {
        // 判断当前视屏是否被暂停、结束或者音频播放状态等.
        if (video.paused || video.ended) return false

        // 如果之前没有添加过该 Node 则将它添加至 DOM 节点树种。
        if (!document.getElementById('canvas')) {
          this.$el.appendChild(canvas)
        }

        var context = canvas.getContext('2d')
        context.drawImage(video, 0, 0)
      } catch (err) {
        console.error(err)
      }

      let dataURL = canvas.toDataURL()

      try {
        let response = (
          await axios.post('/api/process_image', {
            image: dataURL,
            filename: 'process.jpeg',
            mimetype: 'image/jpeg',
          })
        ).data

        if (response) {
          console.log(response)

          // 响应回传 JSON 数据必须包含待渲染图形字段、长宽比还有其他可能需要修改项内容.
          if (response.image && response.aspectRatio) {

            this.renderImageToScreen(response.image, response.aspectRatio)
          }
        }
      } catch (e) {
        console.error(e)
      }
    },

    renderImageToScreen(base64EncodedStr, ratio) {
      const cv = this.$refs.canvas1
      const ctx = cv.getContext('2d')
      // 清除画布并将处理后图像填充至整个画布区域
      // ctx.clearRect(0, 0, cv.width, cv.height)
      const img = new Image()
      img.onload = function () {
        cv.width = img.naturalWidth * ratio * 1.75
        cv.height = img.naturalHeight * ratio * 1.75
        ctx.clearRect(0, 0, cv.width, cv.height)
        ctx.drawImage(img, 0,0,cv.width,cv.height)
      }
      img.src = 'data:image/jpeg;base64,' + base64EncodedStr
    },
  },
}
</script>

<style scoped>
</style>

