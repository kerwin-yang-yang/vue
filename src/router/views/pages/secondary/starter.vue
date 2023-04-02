<template>
  <div>
    <video ref="video" autoplay ></video>
    <button @click="uploadVideo()"> 上传</button>
  </div>
</template>
  <script>
export default {
  mounted() {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: 160,
          height: 90,
        },
        audio: false,
      })
      .then((stream) => {
        this.$refs.video.srcObject = stream
      })

    //   setInterval(this.uploadVideo, 100); // 每秒上传一次视频流数据
  },

  methods: {
    uploadVideo() {
      const canvas = document.createElement('canvas')
      canvas.width = 1280
      canvas.height = 720

      const ctx = canvas.getContext('2d')
      ctx.drawImage(this.$refs.video, 0, 0,1280,720)

      canvas.toBlob(
        (blob) => {
          const xhr = new XMLHttpRequest()
          xhr.open('POST', '/api/upload_video')
          xhr.send(blob)
        },
        'image/jpeg',
        0.5
      )
    },
  },
}
</script>
  
  <style scoped>
</style>
  
  