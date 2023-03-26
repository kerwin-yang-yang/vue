<script>
import LeftbarList from '../apps/email/leftbar-list'
import Layout from '@layouts/main'
import { VueEditor } from 'vue2-editor'
import TimeLine from '@views/pages/secondary/starter.vue'
import ReadTopbar from './edit.vue'
import Footer from '@components/footer'
import VueDragResize from 'vue-drag-resize'
export default {
  components: {
    LeftbarList,
    VueEditor,
    TimeLine,
    ReadTopbar,
    Footer,
    VueDragResize,
  },
  data() {
    return {
      isVisible: true,
      fullscreen: false,
      videoWidth: 160,
      videoHeight: 90,
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
  mounted() {
    this.getCompetence()
    
    axios.get('/api/document/get_images').then((response) => {
      this.images = response.data.images // 从Flask后端获取图片数据，并将其添加到images列表中
    })
  },
  methods: {
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
          
          <VueDragResize :isActive="true" :w="640" :h="320" :x="300" :y="300" v-on:resizing="resize" v-on:dragging="resize" :parent-limitation="true"
            style="z-index: 1000; position: fixed">
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

              <div class="chat-conversation p-2">
                <video id="videoCamera" :width="videoWidth" :height="videoHeight" autoplay></video>
                <canvas style="display: none" id="canvasCamera" :width="videoWidth" :height="videoHeight"></canvas>
                <div v-if="imgSrc" class="img_bg_camera">
                  <img :src="imgSrc" alt="" class="tx_img" />
                </div>
                <button @click="getCompetence()">打开摄像头</button>
                <button @click="stopNavigator()">关闭摄像头</button>
                <button @click="setImage()">拍照</button>
              </div>
            </div>
          </VueDragResize>

          <div class="inbox-leftbar" :class="{ active: this.leftSide }">
            <!-- <LeftbarList /> -->
            <header id="header">
              <!-- 
          <div id="topNavMobile">
            <nav id="mobileMenuLink" class="main-nav clear"><ul><li class="active-link"><a>Menu</a></li></ul></nav>
          </div> -->

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
                      <a href="/overview">Overview</a>
                    </li>

                    <li class="page-collection active-link">
                      <div>
                        <div>
                          <router-link to="/apps/email/inbox" class="">退出阅读</router-link>

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

                    <li class="page-collection">
                      <a href="/studio">Studio</a>
                    </li>

                    <li class="page-collection">
                      <a href="/cultures">Cultures</a>
                    </li>

                    <li class="page-collection">
                      <a href="/agriindustry">AGR(I)NDUSTRY</a>
                    </li>

                    <li class="page-collection">
                      <a href="/fitness">Fitness</a>
                    </li>

                    <li class="page-collection">
                      <a href="/clients">Clients</a>
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
                  <a href="#" class="navbar-brand"> 💁🏻‍♀️ 团队介绍 </a>
                  <div><b-button variant="outline-dark" size="sm" style="
                          border-radius: 8px;
                          border: 1px solid #bbb6b7;
                          height: 32px;
                          width: 56px;
                        " @click="changeLeftSide"><i class="uil font-size-15" :class="{
                          'uil-left-arrow-to-left': label,
                          'uil-arrow-to-right': !label,
                        }"></i></b-button>
                  </div>
                  <div class="sc-elJkPf cuKFxh"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"
                      class="sc-bYSBpT cZZyrb" width="10px" height="10px">
                      <path
                        d="M7 13c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm0-1c2.8 0 5-2.2 5-5S9.8 2 7 2 2 4.2 2 7s2.2 5 5 5zm2.2-8l.8.4L6.1 10 4 7l.7-.6L6.1 8l3.1-4z"
                        fill="#7a9880"></path>
                    </svg>2022年6月23日 更新</div>
                </div>

                <div class="head-action">
                  <div class="header-action-item"><b-button variant="outline-dark" size="sm" style="
                          border-radius: 8px;
                          border: 1px solid #bbb6b7;
                          height: 32px;
                          width: 56px;
                        " @click="screen">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="feather font-size-12">
                        <path
                          d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3">
                        </path>
                      </svg></b-button>
                  </div>

                  <div class="header-action-item"><b-button variant="outline-dark" size="sm" style="
                          border-radius: 8px;
                          border: 1px solid #bbb6b7;
                          height: 32px;
                          width: 56px;
                        " @click="show = !show"><i class="uil-comment-alt-message font-size-15"></i></b-button>
                  </div>
                  <span class="header-action-item" style="margin-left: 8px">
                    <div class="style-module_container_5pQ7D style-module_commentActive_dTftF">
                      <div class="style-module_switchActiveBg_3DMlv"></div>
                      <div class="style-module_switchContent_FKoVH">
                        <div class="style-module_iconWrapper_bAMkc">
                          <button type="button" class="btn btn-light" @click="sidebarViewd(3)">
                            <i class="uil uil-trees"></i> </button>
                        </div>
                        <div class="style-module_iconWrapper_bAMkc">
                          <button type="button" class="btn btn-light" @click="sidebarViewd(2)">
                            <i class="uil uil-trash-alt"></i> </button>
                        </div>
                      </div>
                    </div>
                  </span>
                </div>
              </nav>
            </div>

            <div class="readBody">
              <div class="Lbody">
                <h5>Hi Bro, How are you?</h5>
                <hr />
                <div>
                  <b-img-lazy id="tooltip-button-1" v-bind="mainProps" :src="getImageUrl(1)" alt="Image 1"></b-img-lazy>
                  <b-img-lazy id="tooltip-button-2" v-bind="mainProps" :src="getImageUrl(2)" alt="Image 2"></b-img-lazy>
                  <b-img-lazy id="tooltip-button-3" v-bind="mainProps" :src="getImageUrl(3)" alt="Image 3"></b-img-lazy>
                  <b-img-lazy id="tooltip-button-4" v-bind="mainProps" :src="getImageUrl(85)" alt="Image 4"></b-img-lazy>
                  <b-img-lazy v-bind="mainProps" :src="getImageUrl(88)" alt="Image 5"></b-img-lazy>
                  <b-img-lazy v-bind="mainProps" :src="getImageUrl(90)" alt="Image 6"></b-img-lazy>
                  <b-img-lazy v-bind="mainProps" :src="getImageUrl(92)" alt="Image 7"></b-img-lazy>
                  <b-img-lazy v-bind="mainProps" :src="getImageUrl(94)" alt="Image 8"></b-img-lazy>
                </div>

                <div class="col">
                  <div style="font-size: large; font-weight: 600">All commonts (2)</div>
                  <hr />
                  <div id="taskDesk" style="margin-top: 30px">
                    <div style="float: left; margin-top: 4px"><img class="d-flex mr-3 rounded-circle avatar-sm"
                        src="@assets/images/users/avatar-1.jpg" alt="Generic placeholder image" />
                    </div>
                    <div>
                      <vue-editor style="margin-left: 44px; margin-bottom: 20px" v-model="content"
                        :editor-toolbar="customToolbar" />
                      <div class="text-left">
                        <b-button variant="outline-dark" style="margin: 40px; margin-top: 10px">Send <i class="uil uil-message ml-2"></i></b-button>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
              <div class="Rbody" :class="{ active: this.show }">
                <div style="
                      text-align: center;
                      background-color: #fff;
                      position: sticky;
                      height: 50px;
                      border-bottom: 2px solid #edeff4;
                       padding: 10px;
                    ">
                  <h5> Markup comments</h5>
                </div>

                <div>
                  <b-tooltip triggers="click" :show.sync="show" target="tooltip-button-1" placement="left" confine="false"
                  variant="light">
                  <div>Hello <strong>World!</strong></div>
                </b-tooltip>
                <b-tooltip triggers="click" :show.sync="show" target="tooltip-button-2" placement="left" confine="false"
                  variant="light">
                  <div>Hello <strong>World!</strong></div>
                </b-tooltip>
                <b-tooltip triggers="click" :show.sync="show" target="tooltip-button-3" placement="left" confine="false"
                  variant="light">
                  <div id="taskDesk" boundary="scrollParent">
                    <img class="d-flex mr-3 rounded-circle avatar-sm" src="@assets/images/users/avatar-7.jpg"
                      alt="Generic placeholder image" />
                    <div>Hello <strong>World!</strong></div>
                  </div>
                </b-tooltip>
                <b-tooltip triggers="click" :show.sync="show" target="tooltip-button-4" placement="left" confine="false"
                  variant="light">
                  <div>Hello <strong>World!</strong></div>
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
                    <button type="button" class="btn btn-primary btn-rounded width-sm mt-1">Send <i class="uil uil-message ml-2"></i></button>
                  </div>
                </div>
              </div>
              <div class="sidebar" :class="{ active: this.Sidebar[2] }">
                <!-- <div><button class="close" @click="sidebarNotViewd(2)">《《《×》》》</button>
                                                                                                  <p>3333333</p>
                                                                                   11111           </div> -->

                <div>
                  <div>
                    <b-tabs align="center" fill="true">
                      <b-tab active>
                        <template #title>
                          <!-- <b-spinner type="grow" small></b-spinner> I'm <i>custom</i> -->
                          <i class="uil uil-apps"></i>
                        </template>
                        <p class="p-3">Tab contents 2</p>
                      </b-tab>

                      <b-tab>
                        <template #title>
                          <i class="uil uil-info-circle"></i>
                        </template>
                        <div style="padding: 12px 20px 0px 20px" class="docInfoTabContent-module_contentContainer_gsZxS">
                          <div style="padding: 0px 0px 20px 0px">
                            <div class="docInfoTabContent-module_infoItem_SOSOp">
                              <div class="docInfoTabContent-module_infoItemName_QyDuI"><svg width="1em" height="1em"
                                  viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"
                                  class="larkui-icon larkui-icon-saveastemplate2 docInfoTabContent-module_infoIcon_1fIbt">
                                  <g fill="currentColor" fill-rule="evenodd">
                                    <path
                                      d="M186 16H70c-16.569 0-30 13.431-30 30v164c0 16.569 13.431 30 30 30h116c16.569 0 30-13.431 30-30V46c0-16.569-13.431-30-30-30ZM70 36h116c5.523 0 10 4.477 10 10v164c0 5.523-4.477 10-10 10H70c-5.523 0-10-4.477-10-10V46c0-5.523 4.477-10 10-10Z"
                                      fill-rule="nonzero"></path>
                                    <rect x="80" y="60" width="96" height="20" rx="10"></rect>
                                    <rect x="80" y="108" width="96" height="20" rx="10"></rect>
                                    <rect x="80" y="156" width="55" height="20" rx="10"></rect>
                                  </g>
                                </svg>Words</div>
                              <div class="docInfoTabContent-module_infoValueWrapper_STlB+">
                                <div class="docInfoTabContent-module_infoItemValue_9QlLv">
                                  1633</div>
                                <div></div>
                              </div>
                            </div>
                            <div class="docInfoTabContent-module_infoItem_SOSOp">
                              <div class="docInfoTabContent-module_infoItemName_QyDuI"><svg width="1em" height="1em"
                                  viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"
                                  class="larkui-icon larkui-icon-action-version docInfoTabContent-module_infoIcon_1fIbt">
                                  <g fill="currentColor" fill-rule="nonzero">
                                    <path
                                      d="M128 25c56.885 0 103 46.115 103 103s-46.115 103-103 103S25 184.885 25 128c0-5.523 4.477-10 10-10s10 4.477 10 10c0 45.84 37.16 83 83 83s83-37.16 83-83-37.16-83-83-83c-25.335 0-48.78 11.41-64.455 30.702-3.482 4.286-9.78 4.938-14.067 1.455-4.286-3.483-4.937-9.78-1.455-14.067C67.457 39.172 96.577 25 128 25Z">
                                    </path>
                                    <path
                                      d="m123.04 116 42 .171c5.523.023 9.982 4.518 9.96 10.041-.023 5.43-4.367 9.83-9.761 9.956l-.28.003-42-.171c-5.523-.023-9.981-4.518-9.959-10.04.022-5.43 4.367-9.831 9.76-9.957l.28-.003Z">
                                    </path>
                                    <path
                                      d="M122.982 116c5.43-.01 9.856 4.309 10.014 9.702l.004.28.072 40c.01 5.523-4.46 10.008-9.982 10.018-5.43.01-9.856-4.31-10.014-9.702l-.004-.28-.072-40c-.01-5.523 4.46-10.008 9.982-10.018ZM107.693 81.272c-1.247 5.277-6.463 8.58-11.739 7.496l-.293-.065L48.522 77.56c-5.454-1.289-8.764-6.796-7.393-12.19l.08-.294 13.493-47.132c1.52-5.31 7.056-8.382 12.366-6.862 5.213 1.492 8.269 6.856 6.94 12.076l-.079.29-10.608 37.06 36.941 8.733c5.277 1.247 8.58 6.463 7.496 11.74l-.065.292Z">
                                    </path>
                                  </g>
                                </svg>History Versions</div>
                              <div class="docInfoTabContent-module_infoValueWrapper_STlB+">
                                <div class="docInfoTabContent-module_infoItemValue_9QlLv">
                                  <span class="docInfoTabContent-module_boldValue_EIaey">0</span>
                                </div>
                                <div></div>
                              </div>
                            </div>
                            <div class="docInfoTabContent-module_infoItem_SOSOp">
                              <div class="docInfoTabContent-module_infoItemName_QyDuI"><svg width="1em" height="1em"
                                  viewBox="0 0 256 257" xmlns="http://www.w3.org/2000/svg"
                                  class="larkui-icon larkui-icon-date docInfoTabContent-module_infoIcon_1fIbt">
                                  <g fill="currentColor" fill-rule="nonzero">
                                    <path
                                      d="M197 35c17.673 0 32 14.327 32 32v130c0 17.673-14.327 32-32 32H59c-17.673 0-32-14.327-32-32V67c0-17.673 14.327-32 32-32h138Zm0 20H59c-6.525 0-11.834 5.209-11.996 11.695L47 67v130c0 6.525 5.209 11.834 11.695 11.996L59 209h138c6.525 0 11.834-5.209 11.996-11.695L209 197V67c0-6.525-5.209-11.834-11.695-11.996L197 55Z">
                                    </path>
                                    <path d="M47 90h162v20H47z"></path>
                                    <rect x="77" y="17" width="20" height="56" rx="10"></rect>
                                    <rect x="160" y="17" width="20" height="56" rx="10"></rect>
                                  </g>
                                </svg>Last updated at</div>
                              <div class="docInfoTabContent-module_infoValueWrapper_STlB+">
                                <div class="docInfoTabContent-module_infoItemValue_9QlLv">
                                  03-11 17:02</div>
                                <div></div>
                              </div>
                            </div>
                            <div class="docInfoTabContent-module_infoItem_SOSOp">
                              <div class="docInfoTabContent-module_infoItemName_QyDuI"><svg width="1em" height="1em"
                                  viewBox="0 0 256 257" xmlns="http://www.w3.org/2000/svg"
                                  class="larkui-icon larkui-icon-assignee docInfoTabContent-module_infoIcon_1fIbt">
                                  <path
                                    d="M128.017 129c27.925.016 52.78 7.159 71.454 19.489 17.435 11.512 28.304 26.962 28.522 41.675l.007 1.548c0 4.346-.335 7.598-1.626 11.45l-.182.53-.173.475c-1.768 4.74-4.76 8.817-9.107 11.828l-.439.298-.13.084-.338.238c-1.953 1.354-4.223 2.54-6.822 3.579l-.656.256-.832.31c-.632.227-1.282.448-1.95.66l-.673.211-.918.273-.466.133-.472.131-.96.256-.488.124-.494.123-1.004.238c-.45.104-.908.206-1.372.305l-.7.148-1.07.214-.542.104-.549.102-1.113.2-1.136.19-1.158.184-1.18.176-1.203.17-1.225.161-1.248.155-1.271.148-1.294.142-1.316.134-1.34.129-1.362.122-1.386.115-2.121.163-1.444.1-1.467.095-2.245.132-1.526.081-1.55.076-1.573.07-1.598.066-1.621.06-2.477.082-2.515.072-2.477.06-1.805.035-2.295.037-3.85.043-3.11.02-6.433.014L128.1 227l-.137-.002-.136.002-11.598.014-6.434-.014-3.11-.02-3.85-.043-2.294-.037-1.806-.036-2.476-.06-2.515-.07-2.478-.082-1.62-.061-1.598-.065-1.574-.071-1.55-.076-1.526-.08-2.244-.133-1.467-.095-1.444-.1-2.122-.163-1.386-.115-1.362-.122-1.34-.129-1.316-.134-1.293-.142-1.271-.148-1.248-.155-1.226-.162-1.202-.169-1.18-.176-1.159-.184-1.135-.19-1.114-.2c-.367-.067-.731-.136-1.091-.206l-1.07-.214a89.329 89.329 0 0 1-2.072-.453l-1.004-.238c-.33-.081-.658-.164-.981-.247l-.96-.256c-.317-.086-.63-.175-.94-.264l-.916-.273a55.46 55.46 0 0 1-2.623-.872l-.832-.309c-2.875-1.098-5.363-2.368-7.478-3.835l-.338-.238-.13-.084c-4.586-3.038-7.72-7.229-9.547-12.126l-.172-.476c-1.443-4.088-1.809-7.435-1.809-11.98l.004-1.096c0-14.848 10.912-30.497 28.525-42.126 18.462-12.19 42.965-19.31 70.503-19.486l1.06-.003Zm-.054 19.999-.866.004c-23.747.149-44.463 6.166-59.622 16.176-12.362 8.162-19.354 18.06-19.54 25.146l-.008.911v.397l.005.747c.034 2.031.212 3.378.664 4.658.4 1.136.947 1.914 1.804 2.514l.203.135.294.186.28.207c.604.443 1.371.869 2.296 1.275l.475.201.501.198.527.195.274.096.565.19.743.233.781.227.654.178.678.175.703.171.726.168.751.164.775.16 1.207.235 1.26.226.869.147.891.142.915.14.937.134 1.447.196.993.126 1.015.122 1.563.176 1.61.167 1.101.107 1.69.153 1.153.096 1.173.093 1.798.132 1.842.122 1.888.113 1.93.104 1.312.064 1.33.06 2.031.082 2.073.073 1.886.057 2.338.061 3.948.08 1.803.027 3.794.04 3.624.02 5.876.008 11.08-.015 11 .015 5.877-.009 3.623-.02 3.794-.039 1.803-.027 3.948-.08 2.338-.061 1.887-.057 2.072-.073 2.03-.082 1.331-.06 1.312-.064 1.93-.104 1.888-.113 1.843-.122 1.797-.132 1.174-.093 1.152-.096 1.69-.153 1.1-.107 1.612-.167 1.562-.176 1.015-.122.993-.126 1.447-.196.938-.135.914-.139.892-.142.868-.147 1.26-.226 1.207-.234.775-.161.75-.164.728-.168.702-.171.678-.175.654-.178.933-.273.591-.187.703-.238.663-.243.501-.198.476-.201c.809-.356 1.497-.726 2.061-1.11l.234-.165.28-.207.294-.186.204-.135c.856-.6 1.403-1.378 1.804-2.514.421-1.194.605-2.447.654-4.261l.009-.397.006-.747-.008-1.308c-.187-7.086-7.178-16.984-19.54-25.146-15.16-10.01-35.876-16.027-59.622-16.176l-.867-.004ZM128 24c25.405 0 46 20.595 46 46s-20.595 46-46 46-46-20.595-46-46 20.595-46 46-46Zm0 20c-14.36 0-26 11.64-26 26s11.64 26 26 26 26-11.64 26-26-11.64-26-26-26Z"
                                    fill="currentColor" fill-rule="nonzero"></path>
                                </svg>Authors</div>
                              <div class="docInfoTabContent-module_infoValueWrapper_STlB+">
                                <div class="docInfoTabContent-module_infoItemValue_9QlLv">热寂
                                </div>
                                <div></div>
                              </div>
                            </div>
                            <hr />
                            <div class="docInfoTabContent-module_infoItem_SOSOp">
                              <div class="docInfoTabContent-module_infoItemName_QyDuI"><svg width="1em" height="1em"
                                  viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"
                                  class="larkui-icon larkui-icon-nav-book1 docInfoTabContent-module_infoIcon_1fIbt">
                                  <path
                                    d="M22 55.923c0-20.374 12.5-34.899 34.209-33.872l7.16.35c21.097 1.105 33.884 3.047 45.317 8.203 7.507 3.385 13.36 7.001 18.113 11.262 2.59-2.381 5.672-4.447 9.245-6.305.39-.202.777-.4 1.164-.592l.581-.286c3.791-1.844 7.755-3.345 14.813-5.762l2.27-.772c13.594-4.554 24.405-6.007 43.589-6.104l1.795-.006C223.044 22.023 234 35.21 234 55.923V183.3c0 18.725-15.066 33.883-33.736 33.883h-39.062c-3.543 0-8.873 1.224-13.46 3.215-4.311 1.872-7.11 4.07-7.58 5.172-1.905 4.485-5.647 8.022-10.87 8.4-1.65.12-3.262-.125-4.745-.685-1.727-.437-3.326-1.274-4.706-2.415-1.771-1.464-3.093-3.331-4.095-5.511-.187-.406-.807-1.134-1.89-1.994-1.366-1.086-3.208-2.167-5.351-3.123-4.274-1.905-9.196-3.058-12.579-3.058h-40.19C37.066 217.184 22 202.024 22 183.3ZM200.27 42.04h-.826c-18.05.05-26.96 1.246-38.765 5.258l-.528.18c-13.463 4.596-18.806 7.229-21.213 10.666l-.017 144.233c6.944-3.227 14.845-5.112 21.832-5.19l.45-.002h39.06c7.598 0 13.737-6.177 13.737-13.884l-.001-127.72c-.064-10.134-3.02-13.548-13.728-13.54Zm-145.358-.024C45.845 41.705 42 46.295 42 55.923V183.3c0 7.707 6.139 13.883 13.736 13.883h40.19c6.781 0 14.423 1.81 21.168 4.949l-.015-141.459c-3.533-4.588-8.243-8.004-16.066-11.588l-.548-.25c-8.458-3.813-19.447-5.482-38.13-6.46l-1.774-.092Z"
                                    fill="currentColor" fill-rule="nonzero"></path>
                                </svg>Reads</div>
                              <div class="docInfoTabContent-module_infoValueWrapper_STlB+">
                                <div class="docInfoTabContent-module_infoItemValue_9QlLv">
                                  <span class="docInfoTabContent-module_boldValue_EIaey">0</span>
                                </div>
                                <div></div>
                              </div>
                            </div>
                            <div class="docInfoTabContent-module_infoItem_SOSOp">
                              <div class="docInfoTabContent-module_infoItemName_QyDuI"><svg width="1em" height="1em"
                                  viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"
                                  class="larkui-icon larkui-icon-comment-reply docInfoTabContent-module_infoIcon_1fIbt">
                                  <path
                                    d="M8 1.063a6.937 6.937 0 1 1 0 13.874H1.937a.625.625 0 0 1-.526-.961l1.105-1.727-.017-.02a6.91 6.91 0 0 1-1.436-4.177V8A6.938 6.938 0 0 1 8 1.062Zm0 1.25a5.688 5.688 0 0 0-4.245 9.472c.187.21.211.517.06.753l-.735 1.15H8a5.688 5.688 0 0 0 5.687-5.594V8A5.688 5.688 0 0 0 8 2.312Zm.938 6.562a.625.625 0 1 1 0 1.25h-3.75a.625.625 0 1 1 0-1.25h3.75Zm1.874-3a.625.625 0 1 1 0 1.25H5.189a.625.625 0 1 1 0-1.25h5.625Z"
                                    fill="currentColor" fill-rule="nonzero"></path>
                                </svg>Comments</div>
                              <div class="docInfoTabContent-module_infoValueWrapper_STlB+">
                                <div class="docInfoTabContent-module_infoItemValue_9QlLv">
                                  <span class="docInfoTabContent-module_boldValue_EIaey">2</span>
                                </div>
                                <div></div>
                              </div>
                            </div>
                            <div class="docInfoTabContent-module_infoItem_SOSOp">
                              <div class="docInfoTabContent-module_infoItemName_QyDuI"><svg width="1em" height="1em"
                                  viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"
                                  class="larkui-icon larkui-icon-like docInfoTabContent-module_infoIcon_1fIbt">
                                  <path
                                    d="M147.827 20.644c10.18 1.9 18.546 7.8 22.546 17.499 3.302 8.003 3.163 18.086.7 30.171-1.146 5.621-2.777 11.51-4.783 17.579-.19.572-.38 1.14-.573 1.707l-.18.523h41.237c16.403 0 29.732 13.163 29.998 29.503l.004.496c0 2.868-.411 5.722-1.221 8.473l-21.484 72.987c-6.011 20.423-24.757 34.447-46.046 34.447H73c-.256 0-.51-.01-.761-.029H54c-16.569 0-30-13.431-30-30v-87c0-16.569 13.431-30 30-30l28.087-.001c16.584-35.788 30.038-56.442 42.27-63.188 6.293-3.47 15.282-4.694 23.47-3.167Zm-13.812 20.68c-7.531 4.154-20.26 24.271-36.014 58.954L98 214.028h70.025a28 28 0 0 0 26.86-20.093l21.484-72.987a10 10 0 0 0 .407-2.825c0-5.523-4.478-10-10.001-10h-55.706c-6.994 0-11.8-6.98-9.374-13.483l1.016-2.53a248.67 248.67 0 0 0 1.308-3.33 204.313 204.313 0 0 0 3.281-9.163c1.776-5.373 3.203-10.524 4.176-15.296 1.736-8.52 1.827-15.114.409-18.552-1.201-2.91-3.776-4.727-7.726-5.464-3.789-.707-8.07-.124-10.144 1.02ZM78 107H54c-5.43 0-9.848 4.327-9.996 9.72L44 117v87c0 5.523 4.477 10 10 10h24V107Z"
                                    fill="currentColor" fill-rule="nonzero"></path>
                                </svg>Likes</div>
                              <div class="docInfoTabContent-module_infoValueWrapper_STlB+">
                                <div class="docInfoTabContent-module_infoItemValue_9QlLv">
                                  <span class="docInfoTabContent-module_boldValue_EIaey">0</span>
                                </div>
                                <div></div>
                              </div>
                            </div>
                          </div>
                          <div class="docInfoTabContent-module_operation_7Z9sK">
                            <div class="docInfoTabContent-module_docStatisticDetail_nJKCP">
                              <div class="docInfoTabContent-module_detailLeft_f8zrS"><svg width="1em" height="1em"
                                  viewBox="0 0 24 23" xmlns="http://www.w3.org/2000/svg"
                                  class="larkui-icon larkui-icon-statistics docInfoTabContent-module_statisticIcon_qcX19">
                                  <g fill-rule="nonzero" fill="none">
                                    <path
                                      d="M12.732 15.07c.996 0 1.813.763 1.9 1.735l.008.173v4.197c0 .382-4.39.691-4.771.691a.692.692 0 0 1-.683-.58l-.009-.111v-4.197c0-.995.762-1.812 1.734-1.9l.174-.007h1.647ZM5.052 11.413c.996 0 1.813.762 1.9 1.734l.008.174v7.854c0 .382-.31.691-.691.691-.344 0-4.71-.25-4.763-.58l-.009-.111V13.32c0-.995.762-1.813 1.734-1.9l.174-.008h1.647ZM20.412 6.388c.996 0 1.813.762 1.9 1.734l.008.174v12.879c0 .382-.31.691-.691.691h-4.08a.692.692 0 0 1-.683-.58l-.009-.111V8.296c0-.995.762-1.812 1.734-1.9l.174-.008h1.647Z"
                                      fill="#FFF"></path>
                                    <path
                                      d="M12.732 15.07c.996 0 1.813.763 1.9 1.735l.008.173v4.197a.692.692 0 0 1-1.374.112l-.009-.112v-4.197a.525.525 0 0 0-.43-.516l-.095-.008h-1.647a.525.525 0 0 0-.516.43l-.009.094v4.197a.692.692 0 0 1-1.374.112l-.009-.112v-4.197c0-.995.762-1.812 1.734-1.9l.174-.007h1.647ZM5.052 11.413c.996 0 1.813.762 1.9 1.734l.008.174v7.854a.692.692 0 0 1-1.374.112l-.009-.112V13.32a.525.525 0 0 0-.43-.516l-.095-.009H3.405a.525.525 0 0 0-.516.43l-.009.095v7.854a.692.692 0 0 1-1.374.112l-.009-.112V13.32c0-.995.762-1.813 1.734-1.9l.174-.008h1.647ZM20.412 6.388c.996 0 1.813.762 1.9 1.734l.008.174v12.879a.692.692 0 0 1-1.374.112l-.009-.112V8.296a.525.525 0 0 0-.43-.516l-.095-.008h-1.647a.525.525 0 0 0-.516.43l-.009.094v12.879a.692.692 0 0 1-1.374.112l-.009-.112V8.296c0-.995.762-1.812 1.734-1.9l.174-.008h1.647Z"
                                      fill="currentColor"></path>
                                    <path
                                      d="M18.48 1.198a.6.6 0 0 1 .934.745l-.068.085-6.088 6.365a3.032 3.032 0 0 1-3.346.708L9.7 9.004 5.985 7.127a1.832 1.832 0 0 0-1.953.19l-.134.116-2.393 2.269a.6.6 0 0 1-.897-.79l.071-.08 2.393-2.27a3.032 3.032 0 0 1 3.25-.6l.204.094 3.715 1.877c.664.336 1.46.234 2.016-.242l.134-.127 6.088-6.366Z"
                                      fill="#00B96B"></path>
                                    <path
                                      d="m17.22.463 2.592.004c.366 0 .669.267.726.617l.01.119.005 2.533a.737.737 0 0 1-1.465.122l-.01-.12-.004-1.798-1.857-.003a.738.738 0 0 1-.727-.619l-.01-.12c.001-.366.27-.67.62-.726l.12-.01Z"
                                      fill="#00B96B"></path>
                                    <path
                                      d="m1.016 20.774 22.221.02a.692.692 0 0 1 .11 1.375l-.111.009-22.22-.021a.692.692 0 0 1-.112-1.374l.112-.01Z"
                                      fill="currentColor"></path>
                                  </g>
                                </svg></div>
                              <div class="docInfoTabContent-module_detailText_g+hds">
                                <div class="docInfoTabContent-module_rightTitle_R8UaG">
                                  Statistics details</div>
                                <div class="docInfoTabContent-module_rightDesc_TeznL">
                                  Visitors and more analysis</div>
                              </div><svg width="1em" height="1em" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"
                                class="larkui-icon larkui-icon-arrow-right docInfoTabContent-module_detailArrowIcon_CVQ12">
                                <path
                                  d="M101.005 198.563c-3.834-3.834-3.904-10.008-.21-13.927l.21-.215 48.99-48.99c3.834-3.834 3.904-10.008.21-13.927l-.21-.215-48.99-48.99c-3.905-3.905-3.905-10.237 0-14.142 3.834-3.834 10.008-3.904 13.927-.21l.215.21 48.99 48.99c11.599 11.598 11.715 30.331.348 42.072l-.348.354-48.99 48.99c-3.905 3.905-10.237 3.905-14.142 0Z"
                                  fill="currentColor" fill-rule="nonzero"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </b-tab>
                    </b-tabs>
                  </div>
                </div>
              </div>
              <div class="sidebar" :class="{ active: this.Sidebar[3] }">
                <button class="close" @click="sidebarNotViewd(3)">《《《×》》》</button>
                <p>3333333</p>
                <div id="taskDesk" style="margin-top: 30px">
                  <!-- <div style="float: left;margin-top: 4px;"><img class="d-flex mr-3 rounded-circle avatar-sm"
                                                  src="@assets/images/users/avatar-1.jpg" alt="Generic placeholder image" />
                                      </div>  -->
                  <div>
                    <vue-editor style="margin-bottom: 20px" v-model="content" :editor-toolbar="customToolbar" />
                    <div class="text-left">
                      <b-button variant="outline-dark" style="margin-left: 20px; margin-top: 10px">Send <i class="uil uil-message ml-2"></i></b-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- end inbox-rightbar-->
        <!-- Left sidebar -->
        <!-- <div class="floating-parent">
                      <div class="floating-toolbar">

                          <button id="archive-tooltip" type="button" class="btn btn-light" @click="sidebarViewd(0)">
                               <b-tooltip target="archive-tooltip" placement="left">Archive</b-tooltip> 
                              <i class="uil uil-archive-alt"></i>
                          </button>

                          <button id="spam-tooltip" type="button" class="btn btn-light" @click="sidebarViewd(1)">
                              <b-tooltip target="spam-tooltip" placement="left">Mark as spam</b-tooltip>
                              <i class="uil uil-exclamation-octagon"></i>
                          </button>
                          <button id="delete-tooltip" type="button" class="btn btn-light" @click="sidebarViewd(2)">
                              <b-tooltip target="delete-tooltip" placement="left">Delete</b-tooltip>
                              <i class="uil uil-trash-alt"></i>
                          </button>

                          <button id="elete-tooltip" type="button" class="btn btn-light" @click="sidebarViewd(3)">
                              <b-tooltip target="elete-tooltip" placement="left">Labels</b-tooltip>
                              <i class="uil uil-trees"></i>
                          </button>
                      </div>

                  </div> -->

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
  background-color: #ffffff;
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

.style-module_container_5pQ7D {
  position: relative;
  width: 64px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #bbb6b7;
}

.style-module_container_5pQ7D .style-module_switchContent_FKoVH {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px;
}

.style-module_container_5pQ7D .style-module_switchContent_FKoVH .style-module_iconWrapper_bAMkc {
  width: 26px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  cursor: pointer;
}

.header-action-item {
  padding: 14px 0;
  margin-left: 16px;
}

.docInfoTabContent-module_infoItem_SOSOp {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 20px;
  font-size: 14px;
  margin-top: 16px;
}

.docInfoTabContent-module_infoItem_SOSOp .docInfoTabContent-module_infoItemName_QyDuI {
  display: flex;
  align-items: center;
  color: var(--yq-yuque-grey-9);
}

.docInfoTabContent-module_infoItem_SOSOp .docInfoTabContent-module_infoItemName_QyDuI .docInfoTabContent-module_infoIcon_1fIbt {
  margin-right: 12px;
  width: 16px;
  height: 16px;
}

.docInfoTabContent-module_operation_7Z9sK .docInfoTabContent-module_docStatisticDetail_nJKCP {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 12px 12px 12px;
  border-radius: 8px;
  cursor: pointer;
  background-color: #fafafa;
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
  font-size: 10px;
  color: #a5a5a5;
  text-align: center;
  display: inline-block;
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
.vue-drag-resize-box > .vue-drag-handle {
  display: none !important;
}

.vdr.active:before {
  outline: none;
} 
.p-2 {
    padding: 0rem !important; 
}
</style>
