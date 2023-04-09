<script>
import LeftbarList from '../apps/email/leftbar-list'
import Layout from '@layouts/main'
import { VueEditor } from 'vue2-editor'
import TimeLine from '@views/pages/secondary/starter.vue'
import ReadTopbar from './edit.vue'
import Footer from '@components/footer'
import VueDragResize from 'vue-drag-resize'
import axios from 'axios'
import Overview from '@components/overview'
import appConfig from '@src/app.config'
import StatChart from '@components/widget-stat-chart'
import { stackedAreaChart } from '../ui/chart/data-chart'
export default {
  page: {
    title: 'Read Document',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  props: {
    user: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  components: {
    LeftbarList,
    VueEditor,
    TimeLine,
    ReadTopbar,
    Footer,
    VueDragResize,
    StatChart,
    Overview
  },
  // watch: {
  //   // 监听 series 数组中元素数据变化，并更新视图
  //   'series.0.data': function (newData, oldData) {
  //     this.$refs.chart.updateSeries([{ data: newData }]);
  //   }
  // },
  data() {
    return {
      series: [
        { name: 'Number of Eyes', data: [] }
      ],
      stackedAreaChart: stackedAreaChart,
      tabContent: `Vakal text here dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.`,
      content: ` Donec pede justo, fringilla vel, aliquet nec, vulputate
                  eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,
                  justo. Nullam dictum felis eu pede mollis pretium. Integer
                  tincidunt.Cras dapibus. Vivamus elementum semper nisi. Aenean
                  vulputate eleifend tellus. Aenean leo ligula, porttitor eu,
                  consequat vitae, eleifend ac, enim.`,
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
      timerRunning: false,
      statChart: [
        {
          mainTitle: 'today revenue',
          value: 2100,
          subValue: '10.21%',
          chartColor: '#5369f8',
        }],
      errorModal: false,
      isVisible: true,
      fullscreen: false,
      videoWidth: 304,
      videoHeight: 171,
      imgSrc: '',
      thisCancas: null,
      images: [],
      thisContext: null,
      thisVideo: null,
      leftSide: true,
      show: true,
      // showSidebar: false,
      Sidebar: [0, 0, 0, 0],
      mainProps: {
        center: true,
        fluidGrow: true,
        blank: true,
        blankColor: '#bbb',
        width: 600,
        height: 400,
        class: 'my-5',
      },
      topleft: true,
      label: 1,
      content: '<h4>Html For Editor</h4>',
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
  mounted() {
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
    axios.get('/api/document/get_images', { params: { id: this.$route.query.document_id ? this.$route.query.document_id : 1 } }).then((response) => {
      // this.images = response.data.images // 从Flask后端获取图片数据，并将其添加到images列表中
      this.images = response.data.images.map(image => ({ url: image.data, path: image.path, comment: image.comment }));
      console.log(this.images)
    })
    // window.addEventListener("resize", () => {this.$refs.chart.resize()});
    this.uploadTimer = setInterval(this.uploadVideo, 100);


    this.startTimer()
  },

  methods: {

    startTimer() {
      this.timerRunning = true;
      const startTime = Date.now();
      this.timer = 0;
      this.interval = setInterval(() => {
        const now = Date.now();
        this.timer = Math.floor((now - startTime) / 1000);
      }, 1000);
    }, formatTime(seconds) {
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
    // updateData(num_eyes) {
    //   const now = new Date();
    //   // const timestamp = now.toLocaleTimeString().replace(/^\D*/, '')

    //   const newDataPoint = [now, num_eyes];

    //   const updatedSeriesData = [
    //     ...this.series[0].data.slice(-50),
    //     newDataPoint
    //   ];
    //   this.$set(this.series[0], 'data', updatedSeriesData); // 可以正常触发响应式更新

    // },
    updateData(num_eyes) {
      const now = new Date();
      // const timestamp = now.toLocaleTimeString().replace(/^\D*/, '')

      // this.$refs.chart.echartsInstance.setOption({
      //     series: [{ data: this.series[0].data }]
      //   })
      // 构造新节点num_eyes, time.
      let newDataPoint = [now, num_eyes];
      // this.$refs.chart.resize();

      this.$nextTick(() => {
        // this.$refs.chart.echartsInstance.setOption({
        //   series: this.series,
        // })

        // 获取当前节点数值序列.
        let seriesData = this.series[0].data;

        if (seriesData.length > 20) {
          seriesData.shift(); // 移除首项元素.
        }

        // 向数据源添加新节点.
        this.$set(this.series[0], 'data', [...seriesData, newDataPoint]);


        // 刷新首屏
        // chart.refresh();
        // 立即重绘，使得图表更稳定
        // chart.setOption({
        //   series: this.series,
        // });


        // this.$refs.chart.setOption({series: [{

        //       data:this.series[0]
        //     }]})
        // if(this.$refs.chart){
        //   this.$refs.chart.resize();
        // setTimeout(() => {
        //   this.$refs.chart.resize();
        // }, 1);
        // }
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
      this.leftSide = 0
      this.topleft = 0
      this.label = 0
      this.show = 0
      for (let i = 0; i < this.Sidebar.length; i++) {
        this.sidebarNotViewd(i)
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
    clearInterval(this.uploadTimer)
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
              <!-- <div class="bg-primary p-2">
                                                                                                                                                                                                            <div class="media">
                                                                                                                                                                                                                <img src="@assets/images/users/avatar-2.jpg" alt class="avatar-sm rounded ml-1 mr-2" />
                                                                                                                                                                                                                <div class="media-body">
                                                                                                                                                                                                                    <h5 class="font-size-13 text-white m-0">Johnny</h5>
                                                                                                                                                                                                                <small class="text-white-50">
                                                                                                                                                                                                <i class="uil uil-circle font-size-11 text-success mr-1"></i>Active Now
                                                                                                                                                                                                </small>
                                                                                                                                                                                                                </div>
                                                                                                                                                                                                            <div class="float-right font-size-18 mt-1">
                                                                                                                                                                                                                <a href="javascript: void(0);" class="text-white mr-2">
                                                                                                                                                                                                                        <i class="uil uil-comment-alt-notes font-size-16"></i>
                                                                                                                                                                                                                    </a>
                                                                                                                                                                                                                    <a class="chat-close text-white mr-2" href="javascript: void(0);" @click="remove">
                                                                                                                                                                                                                        <i class="uil uil-multiply font-size-14"></i>
                                                                                                                                                                                                                    </a>
                                                                                                                                                                                                            </div>
                                                                                                                                                                                                        </div>
                                                                                                                                                                                                        </div> -->

              <!-- <div class="chat-conversation p-2">
                                                                    <video id="videoCamera" :width="videoWidth" :height="videoHeight" autoplay></video>
                                                                    <canvas style="display: none" id="canvasCamera" :width="videoWidth" :height="videoHeight"></canvas>
                                                                    <div v-if="imgSrc" class="img_bg_camera">
                                                                      <img :src="imgSrc" alt="" class="tx_img" />
                                                                      </div>
                                                                      <button @click="getCompetence()">打开摄像头</button>
                                                                      <button @click="stopNavigator()">关闭摄像头</button>
                                                                    <button @click="setImage()">拍照</button>
                                                                  </div> -->
              <video ref="video" autoplay width="640" height="360" style="display: none;"></video>
              <canvas ref="canvas" width="640" height="360" style="display: none;z-index: 100;"></canvas>
              <canvas ref="canvas1" width="304" height="171"></canvas>
              <!-- <button @click="uploadVideo()">上传</button> -->

              <!-- <div v-for="stat of statChart" :key="stat.mainTitle" style="width: 100%;height:auto">
                          <StatChart :value="stat.value" :sub-value="stat.subValue" :chart-color="stat.chartColor" />

                        </div> -->
              <apexchart ref="chart" class="apex-charts" height="150" type="area" :series="this.series"
                :options="stackedAreaChart.chartOptions"></apexchart>

            </div>
          </VueDragResize>

          <div class="inbox-leftbar" :class="{ active: this.leftSide }">
            <header id="header">
              <div id="logo" data-content-field="site-title">
                <h1 class="logo image" data-shrink-original-size="26" style="letter-spacing: 0em">
                  <a href="/">
                    <img
                      src="//images.squarespace-cdn.com/content/v1/5c0a0a92b27e3986f51e5eb0/1611794977300-EITI1LJ5WJJJAUCKRQKP/pedro-04.jpg?format=750w"
                      alt="Pedrontheworld" />
                  </a>
                </h1>
              </div>

              <div id="topNav" data-content-field="navigation">
                <nav id="mainNavigation" class="main-nav dropdown-click desktop-nav">
                  <ul>
                    <li class="page-collection active-link">
                      <a @click="errorModal = true">暂停</a>
                      <b-modal v-model="errorModal" centered hide-footer title="Behavior Warning" title-class="font-18">
                        <div class="text-center">
                          <i class="uil-no-entry text-warning display-3"></i>
                          <h4 class="text-danger mt-4">Abnormal Behavior Warning </h4>
                          <p class="w-75 mx-auto text-muted">请注意，你的暂停行为将被记录在文件中，由此产生的任何泄密后果将由你承担</p>
                          <div class="mt-4">
                            <a class="btn btn-outline-primary btn-rounded width-md" href="javascript: void(0);"
                              @click="errorModal = false">
                              I know
                            </a>
                          </div>
                        </div>
                      </b-modal>
                    </li>

                    <li class="page-collection active-link">
                      <div>
                        <div>
                          <router-link to="/apps/email/inbox" class="" @click="errorModal = true">退出</router-link>

                          <!-- <a-button class="btn btn-danger btn-block mb-4" type="primary">全屏</a-button> -->
                        </div>
                      </div>
                    </li>

                    <li class="page-collection">
                      <a href="/lifestyle">LIfestyle</a>
                    </li>

                    <li class="page-collection">
                      <a href="/automotive-1">Automotive</a>
                    </li>

                    <li class="gallery-collection">
                      <a href="/motion">Motion</a>
                    </li>

                    <li class="page-collection">
                      <a href="/environmental-1">Environmental</a>
                    </li>


                  </ul>
                </nav>

                <nav id="secondaryNavigation" class="main-nav dropdown-click desktop-nav">
                  <ul>
                    <li class="page-collection">
                      <a href="/tearsheet-1">Tear</a>
                    </li>

                    <li class="page-collection">
                      <a href="/contact">Contact/About</a>
                    </li>
                  </ul>
                </nav>
              </div>

              <div class="sqs-layout sqs-grid-1 columns-1" data-layout-label="Header Content" data-type="block-field"
                data-updated-on="1544863640479" id="headerBlocks">
                <div class="row sqs-row">
                  <div class="col sqs-col-1 span-1">
                    <div class="sqs-block socialaccountlinks-v2-block sqs-block-socialaccountlinks-v2"
                      data-block-type="54" id="block-yui_3_17_2_1_1544863524434_5734">
                      <div class="sqs-block-content">
                        <div
                          class="sqs-svg-icon--outer social-icon-alignment-left social-icons-color-black social-icons-size-extra-small social-icons-style-regular">
                          <nav class="sqs-svg-icon--list">
                            <a href="http://linkedin.com/pedrontheworld" target="_blank"
                              class="sqs-svg-icon--wrapper linkedin-unauth" aria-label="LinkedIn">
                              <div>
                                <svg class="sqs-svg-icon--social" viewBox="0 0 64 64">
                                  <use class="sqs-use--icon" xlink:href="#linkedin-unauth-icon"></use>
                                  <use class="sqs-use--mask" xlink:href="#linkedin-unauth-mask"></use>
                                </svg>
                              </div>
                            </a><a href="http://instagram.com/pedrontheworld" target="_blank"
                              class="sqs-svg-icon--wrapper instagram-unauth" aria-label="Instagram">
                              <div>
                                <svg class="sqs-svg-icon--social" viewBox="0 0 64 64">
                                  <use class="sqs-use--icon" xlink:href="#instagram-unauth-icon"></use>
                                  <use class="sqs-use--mask" xlink:href="#instagram-unauth-mask"></use>
                                </svg>
                              </div>
                            </a><a href="https://www.behance.net/pedrontheworld" target="_blank"
                              class="sqs-svg-icon--wrapper behance" aria-label="Behance">
                              <div>
                                <svg class="sqs-svg-icon--social" viewBox="0 0 64 64">
                                  <use class="sqs-use--icon" xlink:href="#behance-icon"></use>
                                  <use class="sqs-use--mask" xlink:href="#behance-mask"></use>
                                </svg>
                              </div>
                            </a><a href="http://www.facebook.com/pedrontheworld" target="_blank"
                              class="sqs-svg-icon--wrapper facebook" aria-label="Pedro Oliveira">
                              <div>
                                <svg class="sqs-svg-icon--social" viewBox="0 0 64 64">
                                  <use class="sqs-use--icon" xlink:href="#facebook-icon"></use>
                                  <use class="sqs-use--mask" xlink:href="#facebook-mask"></use>
                                </svg>
                              </div>
                            </a>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div id="footerBlocks-2" class="social-links sqs-svg-icon--list" data-content-field="connected-accounts">
                <a href="http://linkedin.com/pedrontheworld" target="_blank"
                  class="sqs-svg-icon--wrapper linkedin-unauth">
                  <div>
                    <svg class="sqs-svg-icon--social" viewBox="0 0 64 64">
                      <use class="sqs-use--icon" xlink:href="#linkedin-unauth-icon"></use>
                      <use class="sqs-use--mask" xlink:href="#linkedin-unauth-mask"></use>
                    </svg>
                  </div>
                </a>

                <a href="http://instagram.com/pedrontheworld" target="_blank"
                  class="sqs-svg-icon--wrapper instagram-unauth">
                  <div>
                    <svg class="sqs-svg-icon--social" viewBox="0 0 64 64">
                      <use class="sqs-use--icon" xlink:href="#instagram-unauth-icon"></use>
                      <use class="sqs-use--mask" xlink:href="#instagram-unauth-mask"></use>
                    </svg>
                  </div>
                </a>

                <a href="https://www.behance.net/pedrontheworld" target="_blank" class="sqs-svg-icon--wrapper behance">
                  <div>
                    <svg class="sqs-svg-icon--social" viewBox="0 0 64 64">
                      <use class="sqs-use--icon" xlink:href="#behance-icon"></use>
                      <use class="sqs-use--mask" xlink:href="#behance-mask"></use>
                    </svg>
                  </div>
                </a>

                <a href="http://www.facebook.com/pedrontheworld" target="_blank" class="sqs-svg-icon--wrapper facebook">
                  <div>
                    <svg class="sqs-svg-icon--social" viewBox="0 0 64 64">
                      <use class="sqs-use--icon" xlink:href="#facebook-icon"></use>
                      <use class="sqs-use--mask" xlink:href="#facebook-mask"></use>
                    </svg>
                  </div>
                </a>
              </div>
            </header>
          </div>
          <div class="inbox-rightbar">
            <!-- 居中容器 -->
            <div class="top-container" :class="{ active: this.topleft }">
              <nav class="navbar navbar-expand-md bg-light navbar-light sticky-top" style="">
                <div class="header-crumb">
                  <a href="#" class="navbar-brand"> 💁🏻‍♀️ {{ user.username }} </a>
                  <div><b-button variant="outline-dark" size="sm" style="
                                                                                border-radius: 8px;
                                                                              border: 1px solid #bbb6b7;
                                                                              height: 32px;
                                                                                width: 56px;
                                                                              " @click="changeLeftSide"><i
                        class="uil font-size-15" :class="{
                          'uil-left-arrow-to-left': label,
                          'uil-arrow-to-right': !label,
                        }"></i></b-button>
                  </div>
                  <span>{{ formatTime(timer) }}</span>
                </div>
                <div class="head-center"></div>

                <div class="head-action">
                  <div class="header-action-item"><b-button variant="outline-dark" size="sm"
                      style="
                                                                        border-radius: 8px;
                                                                        border: none;
                                                                        height: 32px;
                                                                  width: 40px;    display: flex; justify-content: center;align-items: center; " @click="screen">
                      <feather type="music"></feather>
                    </b-button>
                  </div>
                  <div class="header-action-item"><b-button variant="outline-dark" size="sm" style="
                                                                              border-radius: 8px;
                                                                              border: none;
                                                                              height: 32px;
                                                                        width: 40px;    display: flex;
                                                  justify-content: center;
                                                        align-items: center;
                                                                            " @click="Immersion">
                      <feather type="airplay"></feather>
                    </b-button>
                  </div>

                  <div class="header-action-item"><b-button variant="outline-dark" size="sm" style="
                                                                        border-radius: 8px;
                                                                        border: none;
                                                                        height: 32px;
                                                                  width: 40px;    display: flex;
                                            justify-content: center;
                                              align-items: center;
                                                                  " @click="show = !show"><i
                        class="uil uil-chat-info font-size-18"></i></b-button>
                  </div>
                  <div class="header-action-item">

                    <b-button variant="outline-dark" style="
                                                                  border-radius: 8px;
                                                                  border: none;
                                                                  height: 32px;
                                                                  width: 40px;    display: flex;
                                            justify-content: center;
                                            align-items: center;
                                                                " @click="sidebarViewd(3)">
                      <i class="uil uil-facebook-messenger-alt font-size-18"></i> </b-button>
                  </div>
                  <div class="header-action-item"><b-button variant="outline-dark" style="
                                                                        border-radius: 8px;
                                                                        border: none;
                                                                        height: 32px;
                                                                        width: 40px;    display: flex;
                                                  justify-content: center;
                                                        align-items: center;

                                                                            " @click="sidebarViewd(2)">
                      <i class="uil uil-map-marker-info font-size-19"></i> </b-button>
                  </div>
                </div>
              </nav>
            </div>

            <div class="readBody">
              <div class="Lbody">
                <h5>Hi Bro, How are you?</h5>
                <hr />
                <div>
                  <!-- <b-img-lazy id="tooltip-button-1" v-bind="mainProps" :src="getImageUrl(1)" alt="Image 1"></b-img-lazy>
                                                                      <b-img-lazy id="tooltip-button-2" v-bind="mainProps" :src="getImageUrl(2)" alt="Image 2"></b-img-lazy>
                                                                      <b-img-lazy id="tooltip-button-3" v-bind="mainProps" :src="getImageUrl(3)" alt="Image 3"></b-img-lazy>
                                                                      <b-img-lazy id="tooltip-button-4" v-bind="mainProps" :src="getImageUrl(85)" alt="Image 4"></b-img-lazy> -->
                  <!-- <b-img-lazy v-bind="mainProps" :src="getImageUrl(2)" alt="Image 2"></b-img-lazy> -->
                  <div v-for="(image, index) in images"><b-img-lazy :id="image.path" :src="image.url" v-bind="mainProps"
                      alt="Image 2"></b-img-lazy>

                  </div>


                </div>


                <div class="col">
                  <div style="font-size: large; font-weight: 600">All commonts <strong>({{ images.length }})</strong>
                  </div>
                  <hr />
                  <div id="taskDesk" style="margin-top: 30px">
                    <div style="float: left; margin-top: 4px"><img class="d-flex mr-3 rounded-circle avatar-sm"
                        src="@assets/images/users/avatar-1.jpg" alt="Generic placeholder image" />
                    </div>
                    <div>
                      <vue-editor style="margin-left: 44px; margin-bottom: 20px" v-model="content"
                        :editor-toolbar="customToolbar" />
                      <div class="text-left">
                        <b-button variant="outline-dark" style="margin: 40px; margin-top: 10px">Send <i
                            class="uil uil-message ml-2"></i></b-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="Rbody " :class="{ active: this.show }">
                <div style="
                                                                            text-align: center;
                                                                            background-color: #fff;
                                                                            position: sticky;
                                                                            height: 50px;
                                                                            border-bottom: 2px solid #edeff4;
                                                                             padding: 10px;
                                                                          ">
                  <h5> comments <strong>({{ images.length }})</strong></h5>
                </div>

                <div v-for="(image, index) in images">
                  <b-tooltip triggers="click" :show.sync="show" :target="image.path" placement="left" confine="false"
                    variant="light">
                    <div class="tooltip_item"><strong>{{ image.comment }}</strong></div>
                  </b-tooltip>
                </div>
              </div>

              <div>
                <div class="sidebar" :class="{ active: this.Sidebar[0] }">
                  <button class="close" @click="sidebarNotViewd(0)">《《《×》》》</button>
                  <TimeLine />
                </div>
                <div class="sidebar" :class="{ active: this.Sidebar[1] }">
                  <button class="close" @click="sidebarNotViewd(1)">《《《×》》》</button>

                  <div class="media mb-0 mt-5">
                    <!-- <img class="d-flex mr-3 rounded-circle avatar-sm"
                                                                                                                                                                    src="@assets/images/users/avatar-7.jpg" alt="Generic placeholder image" /> -->
                    <div class="media-body">
                      <div class="mb-2">
                        <vue-editor></vue-editor>
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <button type="button" class="btn btn-primary btn-rounded width-sm mt-1">Send <i
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
                        <p class="mb-0">{{ content }}</p>
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
                  <!-- <div style="float: left;margin-top: 4px;"><img class="d-flex mr-3 rounded-circle avatar-sm"
                                                                                                        src="@assets/images/users/avatar-1.jpg" alt="Generic placeholder image" />
                                                                                            </div>  -->
                  <div>
                    <vue-editor style="margin-bottom: 20px" v-model="content" :editor-toolbar="customToolbar" />
                    <div class="text-left">
                      <b-button variant="outline-dark" style="margin-left: 20px; margin-top: 10px">Send <i
                          class="uil uil-message ml-2"></i></b-button>
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
    <Footer />
    <!-- end Col -->

    <!-- End row -->
  </Layout>
</template>



<style lang="scss" scoped>
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
  box-shadow: 0 1px 4px -2px rgb(0 0 0 / 13%), 0 2px 8px 0 rgb(0 0 0 / 8%),
    0 8px 16px 4px rgb(0 0 0 / 4%);
  background-color: #f9fafa;
  border-radius: 8px;
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
  font-size: 12px;
  display: block;
  padding: 0.2em;
}

.main-nav a,
.main-nav a:active,
.main-nav .folder li a:hover {
  color: #000;
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
</style>
