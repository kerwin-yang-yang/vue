<script>

import Layout from '@layouts/main'
import { VueEditor } from 'vue2-editor'
import Footer from '@components/footer'
import VueDragResize from 'vue-drag-resize'
import axios from 'axios'
import Overview from '@components/overview'
import appConfig from '@src/app.config'
import { stackedAreaChart } from '../ui/chart/data-chart'
import { authComputed } from '@state/helpers'

export default {
  page: {
    title: 'Read Document',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {

    VueEditor,


    Footer,
    VueDragResize,

    Overview,
  },
  // watch: {
  //   // 监听 series 数组中元素数据变化，并更新视图
  //   'series.0.data': function (newData, oldData) {
  //     this.$refs.chart.updateSeries([{ data: newData }]);
  //   }
  // },
  data() {
    return {
      startTime: '', // 计时器开始的时间
      hours: 0, // 小时数
      minutes: 0, // 分钟数
      seconds: 0, // 秒数
      showOverlay: false, // 添加这个新变量
      lastPauseTime: null, // 添加这个新变量
      stop_num: 0,
      series: [
        { name: '画面中眼睛的数目：', data: [] }
      ],
      stackedAreaChart: stackedAreaChart,
      tabContent: `Vakal text here dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.`,
      // content: ` Donec pede justo, fringilla vel, aliquet nec, vulputate
      //             eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,
      //             justo. Nullam dictum felis eu pede mollis pretium. Integer
      //             tincidunt.Cras dapibus. Vivamus elementum semper nisi. Aenean
      //             vulputate eleifend tellus. Aenean leo ligula, porttitor eu,
      //             consequat vitae, eleifend ac, enim.`,
      overviewData: [
        {
          class: 'py-3 border-bottom',
          icon: 'package',
          value: '2100',
          title: 'Total Tasks Completed',
        },
        {
          class: 'py-3 border-bottom',
          icon: 'clock',
          value: '21,000',
          title: 'Total Hours Worked',
        },
        {
          class: 'py-3 border-bottom',
          icon: 'briefcase',
          value: '1095',
          title: 'Total Issues Fixed',
        },
        {
          class: 'py-3',
          icon: 'tag',
          value: '51,200',
          title: 'Total Commits',
        },
      ],
      timer: 0,
      document_id: this.$route.query.document_id,
      timerRunning: false,

      exitModal: false,
      stopModal: false,
      isVisible: true,
      fullscreen: false,
      fullmodal: false,
      outfullscreen: 0,
      videoWidth: 304,
      videoHeight: 171,
      imgSrc: '',
      thisCancas: null,
      images: [],
      ideas: [],
      thisContext: null,
      thisVideo: null,
      leftSide: true,
      show: true,
      // showSidebar: false,
      Sidebar: [0, 0, 0, 0],
      mainProps: {
        center: true,
        fluidGrow: true,
        thumbnail: true,
        blank: true,
        blankColor: '#bbb',
        width: 600,
        height: 400,
        class: 'my-5',
      },
      Fullrend: false,
      topleft: true,
      label: 1,
      content: '请写出针对这个文档的你们的修改意见',
      customToolbar: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
      ],
      width: 0,
      height: 0,
      top: 0,
      left: 0,
    }
  },
  computed: {

    ...authComputed,

  },
  // 监听 chartData 属性变化并更新 ECharts 图表
  //  watch: {
  //    series(newValue) { 
  //     this.$refs.chart.setOption({
  //        series: [
  //          {
  //            type: 'line',
  //            name: 'test',
  //            data: newValue,
  //          },
  //        ],
  //      })
  //    },
  //  },
  async mounted() {
    document.addEventListener('fullscreenchange', this.handleScreenChange);
    document.addEventListener('webkitfullscreenchange', this.handleScreenChange);
    document.addEventListener('mozfullscreenchange', this.handleScreenChange);
    document.addEventListener('MSFullscreenChange', this.handleScreenChange);

    // this.getCompetence()
    this.screen()
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
    await axios.get('/api/document/get_images', { params: { id: this.document_id ? this.document_id : 1 } }).then((response) => {
      // this.images = response.data.images // 从Flask后端获取图片数据，并将其添加到images列表中
      this.images = response.data.images.map(image => ({ url: image.data }));
      this.ideas = response.data.ideas.map(ideas => ({ paper_id: 'tooltip-button-' + ideas.paper_id, description: ideas.description, user_name: ideas.user_name, icon: ideas.icon }))
    })
    // window.addEventListener("resize", () => {this.$refs.chart.resize()});
    this.uploadTimer = setInterval(this.uploadVideo, 100);


    this.startTimer()
    // this.makeToast('上传成功！')
    this.$bvToast.toast('1、阅览文档的过程中你的异常行为将会受到监控 2、阅读时也将会进行录音，请注意你的行为规范 3、阅读时必须处于全屏模式，退出会有异常提醒 ', {
      title: '阅读提醒',
      variant: 'danger',
      toaster: 'b-toaster-top-center',
      solid: true,
      noCloseButton: true, // 可选，根据需要设置是否显示关闭按钮
      // autoHideDelay: 330, // 可选，根据需要设置自动隐藏的延迟时间
      appendToast: true, // 可选，根据需要设置是否将toast追加到toaster容器中
      toastClass: 'my-toast-class' // 可选，根据需要设置自定义的toast样式类名
    });
  },

  methods: {
    handleScreenChange() {
      if (document.fullscreenElement || /* alternative standard method */
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement) { // check if in full screen mode
        this.fullmodal = false

      } else {
        this.fullmodal = true
        this.outfullscreen = this.outfullscreen + 1

      }
    },
    makeToast(variant = null) {
      this.$bvToast.toast('你的意见我们会在审核后选择性采纳', {
        title: ` ${variant || 'default'}`,
        variant: "success",
        toaster: 'b-toaster-top-center',
        solid: true
      })
    },
    Send_ideas() {
      const idea = { content: this.content, user_id: this.currentUser.id, document_id: this.document_id, }
      axios.post('/api/document/pullIdeas', { idea })
        .then(response => {
          console.log(response.data)
          this.makeToast('上传成功！')
          this.content = ''
        })
        .catch(error => {
          console.log(error)
        })
    },
    Timer() {
      this.upTime = setInterval(() => {
        this.updateTime()
      }, 1000)
    },
    // 格式化数字，保证数字一直占据两位数
    formatNumber(num) {
      return num.toString().padStart(2, '0')
    },
    // 更新计时器显示的时间
    updateTime() {
      const now = new Date() // 获取当前时间
      const diff = now.getTime() - this.startTime.getTime() // 计算时间差

      // 计算小时数、分钟数和秒数
      this.hours = Math.floor(diff / (1000 * 60 * 60))
      this.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      this.seconds = Math.floor((diff % (1000 * 60)) / 1000)
    },
    cover() {
      this.stop_num += 1
      this.stopModal = false
      this.showOverlay = true; // 打开遮罩层

      clearInterval(this.uploadTimer)
      this.startTime = new Date()

      this.Timer()
    },
    hideOverlay() {
      this.showOverlay = false; // 关闭遮罩层
      clearInterval(this.upTime)
      this.uploadTimer = setInterval(this.uploadVideo, 3000);
    },
    confirmJump() {
      // 在路由跳转前弹出提示框，询问用户是否确认跳转
      const id = 1
      // 用户点击了“确定”按钮，继续执行路由跳转

      this.$router.push({ name: '文档列表' });
      this.exitModal = false
    },
    startTimer() {
      this.timerRunning = true;
      const startTime = Date.now();
      this.timer = 0;
      this.interval = setInterval(() => {
        const now = Date.now();
        this.timer = Math.floor((now - startTime) / 1000);
      }, 1000);
    },
    pauseTimer() {
      clearInterval(this.interval);
      this.lastPauseTime = Date.now(); // 记录暂停的时间点
      this.timerRunning = false;
    },

    resumeTimer() {
      const startTime = Date.now();
      if (this.lastPauseTime) {
        startTime -= (this.lastPauseTime - this.startTime); // 基于最后一次暂停重新开始
      } else {
        startTime -= (this.timer * 1000); // 基于之前记录的总共间隔启动定时器（即从上次开关到现在）
      }

      this.interval = setInterval(() => {
        const now = Date.now();
        this.timer = Math.floor((now - startTime) / 1000);
      },
        1000);

      this.timerRunning = true;
    },
    formatTime(seconds) {
      const date = new Date(null)
      date.setSeconds(seconds)
      return date.toISOString().substr(11, 8)
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
          const eye_num = response.eyes_rects
          // 更新图表展示的数据
          this.updateData(eye_num);
          if (response.image && response.aspectRatio) {

            // 响应回传 JSON 数据必须包含待渲染图形字段、长宽比还有其他可能需要修改项内容.
            this.renderImageToScreen(response.image, response.aspectRatio)
          }
        }
      } catch (e) {
        console.error(e)
      }
    },

    updateData(num_eyes) {
      const now = new Date();

      let newDataPoint = [now, num_eyes];


      this.$nextTick(() => {

        let seriesData = this.series[0].data;

        if (seriesData.length > 20) {
          seriesData.shift(); // 移除首项元素.
        }

        // 向数据源添加新节点.
        this.$set(this.series[0], 'data', [...seriesData, newDataPoint]);

      })
    },




    renderImageToScreen(base64EncodedStr, ratio) {
      const cv = this.$refs.canvas1
      const ctx = cv.getContext('2d')
      // 清除画布并将处理后图像填充至整个画布区域
      // ctx.clearRect(0, 0, cv.width, cv.height)
      const img = new Image()
      img.onload = function () {
        cv.width = img.naturalWidth * ratio * 0.85
        cv.height = img.naturalHeight * ratio * 0.85
        ctx.clearRect(0, 0, 304, 171)
        ctx.drawImage(img, 0, 0, 304, 171)
      }
      img.src = 'data:image/jpeg;base64,' + base64EncodedStr
    },
    resize(newRect) {
      this.width = newRect.width
      this.height = newRect.height
      this.top = newRect.top
      this.left = newRect.left
      this.videoWidth = newRect.width
      this.videoHeight = newRect.height
    },

    remove() {
      this.isVisible = false
    },
    Immersion() {
      if (this.leftSide != 0 && this.topleft != 0 && this.label != 0 && this.show != 0) {
        this.leftSide = 0
        this.topleft = 0
        this.label = 0
        this.show = 0
        for (let i = 0; i < this.Sidebar.length; i++) {
          this.sidebarNotViewd(i)
        }
        this.Fullrend = true
      } else {
        this.leftSide = 1
        this.topleft = 1
        this.label = 1
        this.show = 1
        this.Fullrend = false
      }



    },
    screen() {
      let element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    },
    // 调用权限（打开摄像头功能）
    getCompetence() {
      var _this = this
      this.thisCancas = document.getElementById('canvasCamera')
      this.thisContext = this.thisCancas.getContext('2d')
      this.thisVideo = document.getElementById('videoCamera')
      // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {}
      }
      // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
      // 使用getUserMedia，因为它会覆盖现有的属性。
      // 这里，如果缺少getUserMedia属性，就添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          // 首先获取现存的getUserMedia(如果存在)
          var getUserMedia =
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.getUserMedia
          // 有些浏览器不支持，会返回错误信息
          // 保持接口一致
          if (!getUserMedia) {
            return Promise.reject(
              new Error('getUserMedia is not implemented in this browser')
            )
          }
          // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
          })
        }
      }
      var constraints = {
        audio: false,
        video: {
          width: this.videoWidth,
          height: this.videoHeight,
          transform: 'scaleX(-1)',
        },
      }
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
          // 旧的浏览器可能没有srcObject
          // 创建一个FormData对象

          if ('srcObject' in _this.thisVideo) {
            _this.thisVideo.srcObject = stream
          } else {
            // 避免在新的浏览器中使用它，因为它正在被弃用。
            _this.thisVideo.src = window.URL.createObjectURL(stream)
          }
          _this.thisVideo.onloadedmetadata = function (e) {
            _this.thisVideo.play()
          }
          // 创建VideoRecorder 对象并设置参数
          const options = { mimeType: 'video/webm; codecs=vp9' }
          let recorder = new MediaRecorder(stream, options)

          // 定义数组来保存分段录像blob
          let chunks = []

          recorder.ondataavailable = function (event) {
            if (event.data.size > 0) {
              // 推送当前块到chunks数组中去
              chunks.push(event.data)
            }
          }

          recorder.start(1000) //开始录制 （每秒钟10帧）

          setTimeout(() => {
            recorder.stop()

            const formData = new FormData()

            // 将所记录内容添加到FormData对象中，并设置content-type为multipart/form-data，
            // 进行POST请求发送

            let recordedBlob = new Blob(chunks, { type: 'video/webm' })

            formData.append('video', recordedBlob)

            fetch('/api/process_video', {
              method: 'POST',
              body: formData,
            }).then((response) => {
              console.log(response)
            })
          }).catch((err) => console.error(err))
        })
        .catch((err) => {
          console.log(err)
        })
    }, //  绘制图片（拍照功能）
    setImage() {
      var _this = this
      // 点击，canvas画图
      _this.thisContext.drawImage(
        _this.thisVideo,
        0,
        0,
        _this.videoWidth,
        _this.videoHeight
      )
      // 获取图片base64链接
      var image = this.thisCancas.toDataURL('image/png')
      _this.imgSrc = image
      this.$emit('refreshDataList', this.imgSrc)
    },
    // base64转文件
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    // 关闭摄像头
    stopNavigator() {
      this.thisVideo.srcObject.getTracks()[0].stop()
    },
    sidebarViewd(demo) {
      this.$set(this.Sidebar, demo, !this.Sidebar[demo])
      for (let i = 0; i < this.Sidebar.length; i++) {
        if (i != demo) {
          this.sidebarNotViewd(i)
        }
      }
    },
    sidebarNotViewd(demo) {
      this.$set(this.Sidebar, demo, 0)
    },
    getImageUrl(imageId) {
      const { width, height } = this.mainProps
      return `https://picsum.photos/${width}/${height}/?image=${imageId}`
    },
    changeLeftSide() {
      this.leftSide = !this.leftSide
      this.topleft = !this.topleft
      this.label = !this.label
    },
  },
  beforeDestroy() {

    clearInterval(this.interval);
    clearInterval(this.uploadTimer);
    clearInterval(this.upTime)
    // 提交数据到后端
    const record = { 'read_time': this.formatTime(this.timer), 'stop_num': this.stop_num, 'user_id': this.currentUser.id, 'document_id': this.document_id ? this.document_id : 1, 'create_time': new Date(), 'outfullscreen': this.outfullscreen }
    axios.post('/api/record/saveRecord', { record })
      .then(response => {
        console.log(response.data)
      })
      .catch(error => {
        console.log(error)
      })

    document.removeEventListener('fullscreenchange', this.handleScreenChange);
    document.removeEventListener('webkitfullscreenchange', this.handleScreenChange);
    document.removeEventListener('mozfullscreenchange', this.handleScreenChange);
    document.removeEventListener('MSFullscreenChange', this.handleScreenChange);

  },

}
</script>

<template>
  <Layout>
    <!-- :title="title" :items="items"  -->
    <PageHeader />


    <!-- Right Sidebar -->
    <div class="row">
      <div class="col-lg-12">
        <div class="email-container">

          <VueDragResize :isActive="true" :w="304" :h="171" :x="1" :y="550" v-on:resizing="resize" v-on:dragging="resize"
            :parent-limitation="true" style="z-index: 1000; position: fixed" :sticks="['tr']">
            <div v-if="isVisible" class="chatbox1 overflow-hidden">

              <video ref="video" autoplay width="640" height="360" style="display: none;"></video>
              <canvas ref="canvas" width="640" height="360" style="display: none;z-index: 100;"></canvas>
              <canvas ref="canvas1" width="304" height="171"></canvas>
              <apexchart ref="chart" class="apex-charts" height="150" type="area" :series="this.series"
                :options="stackedAreaChart.chartOptions"></apexchart>

            </div>

          </VueDragResize>

          <div class="inbox-leftbar" :class="{ active: this.leftSide }">

            <div id="logo" >
              <div class="mx-auto mb-5">
											
												<img src="@src/state/logo3.jpg" alt height="45" style="margin:20px  20px"/>
												<img src="@src/state/name.png" alt height="25" width="135"  />
												<!-- <h3 class="d-inline align-middle ml-1 text-logo">officeShield</h3> -->
										
										</div>
            </div>

            <div id="topNav" data-content-field="navigation">
              <nav id="mainNavigation" class="main-nav dropdown-click desktop-nav">
                <ul>
                  <li class="page-collection active-link">
                    <a @click="stopModal = true">

                      <span style="height:100%;    
  align-items: center;;display:flex">
                        <feather type="pause-circle" style="margin:0 20px;"></feather>暂停
                      </span>
                    </a>

                    <b-modal v-model="stopModal" modal-class="Mymodal" centered hide-footer title="暂停警告"
                      title-class="font-18" no-close-on-backdrop no-close-on-esc>
                      <div class="text-center">
                        <i class=" uil-stopwatch-slash text-danger display-3"></i>

                        <h4 class="text-danger mt-4">暂停警告 </h4>
                        <h6>请注意，你的暂停行为将被记录在文件中</h6>
                        <h6>由此产生的任何泄密后果将由你承担</h6>
                        <div class="mt-4">
                          <a class="btn btn-outline-dark btn-rounded width-md" href="javascript: void(0);" @click="cover">
                            暂停阅读
                          </a>
                        </div>
                      </div>
                    </b-modal>
                  </li>

                  <li class="page-collection active-link">
                    <div>
                      <div>
                        <a @click="exitModal = true">
                          <span style="height:100%;   
  align-items: center; ;display:flex">
                            <feather type="log-out" style="margin:0 20px;"></feather>退出
                          </span></a>
                        <!-- uil-webcam  uil-shield-slash  
                        uil-shield-exclamation
                        uil-focus-target -->
                        <b-modal v-model="exitModal" centered hide-footer title="退出警告" title-class="font-18"
                          no-close-on-backdrop no-close-on-esc>
                          <div class="text-center">
                            <i class="uil-shield-exclamation text-danger display-3"></i>
                            <h4 class="text-danger mt-4">退出警告</h4>
                            <h6>请注意，你的退出行为将被记录在文件中</h6>
                            <h6>由此产生的任何泄密后果将由你承担</h6>
                            <div class="mt-4">
                              <a class="btn btn-outline-dark btn-rounded width-md" href="javascript: void(0);"
                                @click="confirmJump">
                                退出阅读
                              </a>
                            </div>
                          </div>
                        </b-modal>
                      </div>
                    </div>
                  </li>
                  <!-- <li class="page-collection">
                    <a href="/tearsheet-1">Tear</a>
                  </li>

                  <li class="page-collection">
                    <a href="/contact">Contact/About</a>
                  </li> -->

                </ul>
              </nav>




            </div>

          </div>
          <div class="inbox-rightbar">
            <!-- 居中容器 -->
            <div class="top-container" :class="{ active: this.topleft }">
              <nav class="navbar navbar-expand-md bg-light navbar-light sticky-top" style="">
                <div class="header-crumb">
                  <a href="#" class="navbar-brand"> <img :src="currentUser.icon" alt=""
                      class="avatar-sm rounded-circle mr-2"> {{ currentUser.username }} </a>
                  <div><b-button variant="outline-dark" size="sm"
                      style="
                                                                                                                                                              border-radius: 8px;
                                                                                                                                                            border: 1px solid #bbb6b7;
                                                                                                                                                            height: 32px;
                                                                                                                                                              width: 56px;margin-right: 20px;
                                                                                                                                                            "
                      @click="changeLeftSide"><i class="uil font-size-15" :class="{
                        'uil-left-arrow-to-left': label,
                        'uil-arrow-to-right': !label,
                      }"></i></b-button>
                  </div>
                  <span>{{ formatTime(timer) }}</span>
                  <feather type="mic" class="icon-dual-danger" style="margin-left:10px"></feather>
                </div>
                <div class="head-center"></div>

                <div class="head-action">
                  <div class="header-action-item"><b-button variant="outline-dark" size="sm"
                      style="
                                                                                                                                                      border-radius: 8px;
                                                                                                                                                      border: none;
                                                                                                                                                      height: 32px;
                                                                                                                                                width: 40px;    display: flex; justify-content: center;align-items: center; "
                      @click="stopModal = true">
                      <feather type="pause-circle" height="20"></feather>
                    </b-button>
                  </div>
                  <b-modal v-model="fullmodal" centered hide-footer title="行为警告" title-class="font-18 "
                    no-close-on-backdrop hide-header-close no-close-on-esc>
                    <div class="text-center">
                      <i class="uil-focus-target text-danger display-3"></i>
                      <h4 class="text-danger mt-4 ">警告：你退出了全屏模式 </h4>
                      <h6>请注意，你的行为有严重后果</h6>
                      <h6>请进入全屏模式认真阅读，或者选择暂停</h6>
                      <div class="mt-4">
                        <a class="btn btn-outline-dark btn-rounded width-md" href="javascript: void(0);" @click="screen">
                          进入全屏
                        </a>
                      </div>
                    </div>
                  </b-modal>
                  <div class="header-action-item"><b-button variant="outline-dark" size="sm"
                      style="border-radius: 8px;border: none;height: 32px;width: 40px;    display: flex;justify-content: center; align-items: center;"
                      @click="Immersion">
                      <feather type="airplay"></feather>
                    </b-button>
                  </div>

                  <div class="header-action-item"><b-button variant="outline-dark" size="sm"
                      style="border-radius: 8px;
                                                                                                                                                      border: none;
                                                                                                                                                      height: 32px;
                                                                                                                                                width: 40px;    display: flex;
                                                                                                                          justify-content: center;
                                                                                                                            align-items: center;
                                                                                                                                                " @click="show = !show"><i
                        class="uil uil-chat-info font-size-18"></i></b-button>
                  </div>
                  <div class="header-action-item">

                    <b-button variant="outline-dark"
                      style="
                                                                                                                                                border-radius: 8px;
                                                                                                                                                border: none;
                                                                                                                                                height: 32px;
                                                                                                                                                width: 40px;    display: flex;
                                                                                                                          justify-content: center;
                                                                                                                          align-items: center;
                                                                                                                                              "
                      @click="sidebarViewd(3)">
                      <i class="uil uil-facebook-messenger-alt font-size-18"></i> </b-button>
                  </div>
                  <div class="header-action-item"><b-button variant="outline-dark"
                      style="border-radius: 8px;border: none;height: 32px;width: 40px;    display: flex;justify-content: center;align-items: center;"
                      @click="sidebarViewd(2)">
                      <i class="uil uil-map-marker-info font-size-19"></i> </b-button>
                  </div>
                </div>
              </nav>
            </div>

            <div class="readBody">
              <div class="Lbody" :class="{ active: Fullrend }">
                <!-- <h5>Hi Bro, How are you?</h5> -->
                <!-- <hr /> -->
                <div>
                  <!-- <b-img-lazy id="tooltip-button-1" v-bind="mainProps" :src="getImageUrl(1)" alt="Image 1"></b-img-lazy>
                                                                                                                                                    <b-img-lazy id="tooltip-button-2" v-bind="mainProps" :src="getImageUrl(2)" alt="Image 2"></b-img-lazy>
                                                                                                                                                    <b-img-lazy id="tooltip-button-3" v-bind="mainProps" :src="getImageUrl(3)" alt="Image 3"></b-img-lazy>
                                                                                                                                                    <b-img-lazy id="tooltip-button-4" v-bind="mainProps" :src="getImageUrl(85)" alt="Image 4"></b-img-lazy> -->
                  <!-- <b-img-lazy v-bind="mainProps" :src="getImageUrl(2)" alt="Image 2"></b-img-lazy> -->
                  <div v-for="(image, index) in images"><b-img-lazy :id="'tooltip-button-' + (index + 1)" :src="image.url"
                      v-bind="mainProps" alt="Image 2"></b-img-lazy>

                  </div>


                </div>


                <div class="col">
                  <div style="font-size: large; font-weight: 600">所有意见 <strong>({{ ideas.length }})</strong>
                  </div>
                  <hr />
                  <div id="taskDesk" style="margin-top: 30px">
                    <div style="float: left; margin-top: 4px"><img style="width:36px;height:36px"
                        class=" avatar-sm rounded-circle mr-2" :src="currentUser.icon" alt="Generic placeholder image" />
                    </div>
                    <div>
                      <vue-editor style="margin-left: 44px; margin-bottom: 20px" v-model="content"
                        :editor-toolbar="customToolbar" />
                      <div class="text-left">
                        <b-button variant="outline-dark" style="margin: 40px; margin-top: 10px" @click="Send_ideas">Send
                          <i class="uil uil-message ml-2"></i></b-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="Rbody " :class="{ active: this.show }">
                <div
                  style="
                                                                                                                                                          text-align: center;
                                                                                                                                                          background-color: #fff;
                                                                                                                                                          position: sticky;
                                                                                                                                                          height: 50px;
                                                                                                                                                          border-bottom: 2px solid #edeff4;
                                                                                                                                                           padding: 10px;
                                                                                                                                                        ">
                  <h5> 参考意见 <strong>({{ ideas.length }})</strong></h5>
                </div>

                <div v-for="(idea, index) in ideas">
                  <b-tooltip class="toopltip" triggers="click" :show.sync="show" :target="idea.paper_id" placement="left"
                    confine="false" variant="light">


                    <div class="tooltip_item">
                      <div style="margin-bottom: 10px;"><img :src="idea.icon" class="avatar-sm rounded-circle mr-2" />
                        <div><strong>{{ idea.user_name }}</strong> </div>
                      </div>

                      <div><strong>{{ idea.description }}</strong></div>

                    </div>
                  </b-tooltip>
                </div>
              </div>

              <div>
                <div class="sidebar" :class="{ active: this.Sidebar[0] }">
                  <button class="close" @click="sidebarNotViewd(0)">《《《×》》》</button>

                </div>
                <div class="sidebar" :class="{ active: this.Sidebar[1] }">
                  <button class="close" @click="sidebarNotViewd(1)">《《《×》》》</button>

                  <div class="media mb-0 mt-5">

                    <div class="media-body">
                      <div class="mb-2">
                        <vue-editor></vue-editor>

                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <button type="button" class="btn btn-primary btn-rounded width-sm mt-1" @click="Send_ideas">Send <i
                        class="uil uil-message ml-2"></i></button>
                  </div>
                </div>
              </div>
              <div class="sidebar" :class="{ active: this.Sidebar[2] }">
                <div class="card">
                  <div class="card-body">
                    <!-- <h5 class="header-title mb-3 mt-0" >Nav Tabs</h5> -->
                    <b-tabs>
                      <b-tab title="Home" active>
                        <p>{{ tabContent }}</p>
                        <!-- <p class="mb-0">{{ content }}</p> -->
                      </b-tab>
                      <b-tab title="Profile">
                        <!-- <p>{{ content }}</p>
  
                                                                                                                    <p class="mb-0">{{ tabContent }}</p> -->

                        <h4 class="header-title mt-0 mb-3">Stacked Area</h4>
                        <!-- <apexchart ref="chart" class="apex-charts" height="150" type="area" :series="this.series"
                                                                                                                :options="stackedAreaChart.chartOptions"></apexchart> -->

                      </b-tab>
                      <b-tab title="Me">
                        <Overview :items="overviewData" />
                      </b-tab>
                    </b-tabs>
                  </div>
                </div>
              </div>
              <div class="sidebar" :class="{ active: this.Sidebar[3] }">
                <b-button class="close" variant="outline-dark" style="right:20px" @click="sidebarNotViewd(3)"> [ X
                  ]</b-button>

                <div id="taskDesk" style="margin-top: 30px">
                  <div>
                    <vue-editor style="margin-bottom: 20px" v-model="content" :editor-toolbar="customToolbar" />
                    <div class="text-left">
                      <b-button variant="outline-dark" style="margin-left: 20px; margin-top: 10px"
                        @click="Send_ideas">Send <i class="uil uil-message ml-2"></i></b-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- end inbox-rightbar-->
        <!-- Left sidebar -->


        <div class="clearfix"></div>
      </div>

      <!-- end card -->
    </div>
    <div class="overlay" :style="{ display: (showOverlay ? 'block' : 'none') }">


      <div class="overlay_text">

        <div class="text-center">
          <h5 class="font-size-20 mb-1 ">暂时 离开</h5>
        </div>



        <div class="digital-clock">
          <div class="digital-clock__item">
            <div class="digital-clock__number">{{ formatNumber(hours) }}</div>
          </div>
          <div class="digital-clock__separator">:</div>
          <div class="digital-clock__item">
            <div class="digital-clock__number">{{ formatNumber(minutes) }}</div>
          </div>
          <div class="digital-clock__separator">:</div>
          <div class="digital-clock__item">
            <div class="digital-clock__number">{{ formatNumber(seconds) }}</div>
          </div>
        </div>


        <div style="  display: flex;
                                                                    justify-content: center; /* 水平居中 */
                                                                    align-items: center;padding-top: 20px; /* 垂直居中 */">
          <button style="background-color: #333333;
                                                        width: 180px;
                                                        height: 70px;  
                                                        border-radius: 10px;
                                                        color: #CCCCCC;
                                                        font-size: 30px;
                                                        text-align: center;" @click="hideOverlay">返回</button>
        </div>

      </div>
      <!-- 展示其他内容 -->

    </div>
    <Footer />

    <!-- end Col -->

    <!-- End row -->
  </Layout>
</template>



<style lang="scss" scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: o;
  background: url("https://static.pexels.com/photos/6663/desk-white-black-header.jpg") no-repeat center center fixed;
  background-size: cover;
  z-index: 10000;
  width: 100%;
  height: 100%;
}

.overlay_text {
  background-color: transparent;
  position: fixed;
  color: #3c3c3c;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px solid #FFF;
}

.overlay button {

  font-size: 2rem;
  background: none;
  border: none;
  color: #111010
}

.digital-clock {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
}

.digital-clock__item {
  margin: 0 10px;
}

.digital-clock__separator {
  margin: 0 5px;
}

.quillWrapper>>>.ql-snow.ql-toolbar {
  max-height: 50px;
}

.vdr-stick {
  background-color: #007bff;
}

.camera_outer {
  position: relative;
  overflow: hidden;
  background-size: 100%;

  video,
  canvas,
  .tx_img {
    -moz-transform: scaleX(-1);
    -webkit-transform: scaleX(-1);
    -o-transform: scaleX(-1);
    transform: scaleX(-1);
  }

  .btn_camera {
    position: absolute;
    bottom: 4px;
    left: 0;
    right: 0;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.3);
    line-height: 50px;
    text-align: center;
    color: #ffffff;
  }

  .bg_r_img {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
  }

  .img_bg_camera {
    position: absolute;
    right: 0;
    top: 0;

    img {
      width: 200px;
      height: 200px;
    }


    .img_btn_camera {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50px;
      line-height: 50px;
      text-align: center;
      background-color: rgba(0, 0, 0, 0.3);
      color: #ffffff;

      .loding_img {
        width: 50px;
        height: 50px;
      }
    }
  }
}

.inbox-leftbar {
  width: 300px;
  left: -300px;
  // height: 100%;
  position: fixed;
  transition: transform 0.3s ease-out, -webkit-transform 0.3s ease-out;
  border-right: 1px solid #edeff4;
}

.inbox-leftbar.active {
  transform: translateX(300px);
}

.email-container .inbox-rightbar {
  padding: 0 0;
  margin-left: 300px;
  border-left: 0px solid #edeff4;

  overflow: auto;
}

.top-container {
  position: fixed;
  z-index: 200;
  top: 0;
  left: 0px;
  right: 0;
  height: 52px;
  width: auto;
  border: none;
  border-bottom: 1px solid hsl(0deg 0% 96%);
  transform: translateY(0);
  transition: transform 0.3s ease 0.3s, left 0.3s cubic-bezier(0.1, 0, 0, 1) 0s;
  will-change: transform, left;
  font-size: 14px;
}

.top-container.active {
  left: 300px;
}

.readBody {
  z-index: 100;
  position: relative;
  padding-top: 42px;

  transition: padding 0.3s linear;
  background-color: var(--yq-bg-primary);
  min-height: 100vh;
  // border-left: 1px solid #878585;
  display: flex;
  justify-content: space-between;
}

.Lbody {
  position: relative;
  padding: 0 75px;
  width: 75%;
  float: left;
  height: 100%;
}

.Lbody.active {
  width: 100%
}

.Rbody {
  // border: 1px solid #edeff4;
  position: fixed;
  float: right;
  right: 0;
  height: 5000px;
  // z-index: 0;
  box-sizing: border-box;
  width: 300px;
  visibility: hidden;
  // background-color: #fff;
}

.Rbody.active {
  border-left: 1px solid #edeff4;
  visibility: visible;
}


.tooltip_item {
  width: 270px;
  height: 180px;
}

.b-tooltip {
  position: absolute;
  right: 0px;
  z-index: 1;
  width: 280px;
  height: 200px;
  margin-left: 110px;
  line-height: 30px;
  text-align: left;
  box-shadow: 10px 10px 10px -5px #888888;
  background-color: #f9fafa;
  border: 2px solid;
  border-radius: 15px;
}

.sidebar {
  position: fixed;
  top: 20px;
  right: -300px;
  /* 初始位置，隐藏 */
  width: 300px;
  top: 45px;
  height: 100%;
  background-color: #f7f7f7;
  transition: all 0.3s ease-in-out;
  z-index: 200;
  padding: 0;
  pointer-events: auto;
  visibility: visible;

  box-sizing: border-box;
  // box-shadow: 0 6px 12px 0 rgb(0 0 0 / 5%);
  transition: transform 0.3s ease-out, -webkit-transform 0.3s ease-out;
  background-color: #fff;
  border-left: 1px solid #edeff4;
  /* border-left-color: #f0f0f0; */
  border-radius: 8px;
  overflow: auto;
  font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica,
    Arial, sans-serif;
}

.sidebar.active {
  transform: translateX(-300px);
  /* 显示 */
}

.chatbox1 {
  // left: 1px;
  // width: 320px;
  // bottom: 10px;
  // height: 290px;
  // // max-height: px;
  box-shadow: 0 1px 4px -2px rgb(0 0 0 / 13%), 0 2px 8px 0 rgb(0 0 0 / 8%),
    0 8px 16px 4px rgb(0 0 0 / 4%);

  //   cursor: move;
}

.navbar {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 0 0;
  // border-bottom: 1px solid #878585;
}

.header-crumb {
  position: relative;

  display: flex;
  height: 100%;
  padding-left: 16px;
  align-items: center;
}

.head-action {
  float: right;
  padding-right: 16px;
  height: 100%;
  color: #040404;
  display: flex;
  align-items: center;
}





.header-action-item {
  padding: 14px 0;
  margin-left: 10px;
}


svg {
  width: 24px;
  height: 24px;
}

.floating-parent {
  width: 100px;
  position: fixed;
  right: 0;
  top: 0px;
  bottom: 44px;
  pointer-events: none;
  z-index: 200;
  border-radius: 8px;
  border-color: --blue;
}

.cuKFxh {
  position: relative;
  height: 12px;
  line-height: 12px;
  margin: 0px 0 10px 20px;
  font-size: 5px;
  height: 10px;
  color: #a5a5a5;
  text-align: center;
  justify-content: center;

  vertical-align: middle;
}

.floating-toolbar {
  background: linear-gradient(90deg, #f9f9f9, #fcfcfc);
  box-shadow: 9px 9px 4px rgb(0 0 0 / 14%), -9px -9px 4px transparent;
  width: 90px;
  height: 100%;
  position: relative;
  pointer-events: none;
  width: 42px;
  height: 174px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);

  pointer-events: auto;
  border-color: transparent;
  border-style: solid;
  border-width: 0 5px 4px;
  cursor: pointer;
}

.btn {
  font-weight: bold;
}

.toolbar_one {
  color: #ffffff;
  background: #e38a98;
  border-color: transparent;
}

.close {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 20px;
  padding: 5px;
  background-color: #f7f7f7;
  border: none;
  outline: none;
  cursor: pointer;
}

#logo .logo.image img {
  width: 250px;
  max-width: 180px;
  margin: 0 0;
}

#logo {
  margin-bottom: 30px;
  margin-left: 5px;
}

#logo .logo.image {
  line-height: 0;
  margin: 0;
  display: block;
  width: 250px;
  max-width: 180px;
}

#topNav {
  margin-bottom: 20px;
}

.main-nav a {
  font-family: 'Helvetica', arial, sans-serif;
  font-weight: bold;
  text-transform: none;
  letter-spacing: 0px;
  line-height: 1.5em;
  font-family: proxima-nova;
  font-weight: 400;
  font-style: normal;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  line-height: 2em;
  font-size: 18px;
  display: block;
  padding: 0.2em;

}

.main-nav li {
  margin-top: 10px;
  border: #040404 2px solid;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

}

.main-nav a:active,
.main-nav li a:hover {
  color: #fff;
  // background-color: #000;
  border-radius: 20px;
  background: linear-gradient(to bottom, #000 0%, #f2f2f2 100%);
  //  transform: perspective(800px) rotateX(30deg);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

nav ul,
nav ol {
  list-style: none;
  list-style-image: none;
  margin: 0;
  padding: 0;
}

.main-nav#secondaryNavigation a {
  font-family: 'Helvetica', arial, sans-serif;
  font-weight: normal;
  line-height: 1.8em;
  letter-spacing: 0px;
  font-family: proxima-nova;
  font-weight: 400;
  font-style: normal;
  line-height: 1.6em;
  text-transform: none;
  letter-spacing: 0.02em;
  font-size: 14px;
}

.main-nav a,
.main-nav a:active,
.main-nav .folder li a {
  color: #7e7c7c;
}

.main-nav#secondaryNavigation a,
.main-nav#secondaryNavigation .folder li a {
  color: #1f1f1f;
}

.main-nav+.main-nav {
  margin-top: 20px;
}

nav {
  padding-left: 20px;
}

.quillWrapper {
  width: 90%;
  margin-left: 20px;
}

.ql-editor {
  min-height: 100px;
}

.vdr.active:before {
  outline: none;
}

.p-2 {
  padding: 0rem !important;
}

.Mymodal {

  background-color: rgba(0, 0, 0, 1);
  /* 完全黑色，不透明 */
}

.my-toast-class .toast-body {
  white-space: pre-line;
}
</style>
