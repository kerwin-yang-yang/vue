<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'

import Toolbar from './toolbar'
import LeftbarList from './leftbar-list'
// import { emailData } from './dataInbox'

import { authComputed, userInfoComputed, userInfoMethods } from '@state/helpers'
/**
 * Email-inbox component
 */
export default {
  page: {
    title: 'Inbox',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { VuePerfectScrollbar, Layout, PageHeader, Toolbar, LeftbarList },
  data() {
    return {
      // emailData: emailData,
      title: '所有文档',
      items: [
        {
          text: 'officeShield',
          href: '/',
        },
        {
          text: 'Apps',
          href: '/',
        },
        {
          text: 'Email',
          href: '/',
        },
        {
          text: 'Document',
          active: true,
        },
      ],

      isVisible: false,
      errorModal: false,
      DocuId: 1,
      Email: null,
      unreadEmail: null,
      importantEmail: null,
      elseEmail: null,

      // unreadEmail: emailData.filter((t) => t.status === 'unread'),
      // importantEmail: emailData.filter((t) => t.status === 'important'),
      // elseEmail: emailData.filter((t) => t.status === 'else'),
    }
  },
  methods: {
    ...userInfoMethods,
    remove() {
      this.isVisible = false
    },
    confirmJump() {
      // 在路由跳转前弹出提示框，询问用户是否确认跳转

      // 用户点击了“确定”按钮，继续执行路由跳转

      this.$router.push({ name: '阅读', query: { document_id: this.DocuId } });
      this.errorModal = false
    },
    chooseDocu(id) {
      this.errorModal = true
      this.DocuId = id
    }
  },
  computed: {
    ...userInfoComputed,
    ...authComputed,

  },
  // created() {

  // },
  async mounted() {
    // if (this.Tasks != '') {
    // 	this.$set(this, 'projectData', this.Tasks)
    // }
    // else {
    // 	await this.getTasks({ username: this.currentUser.username })
    // 	this.$set(this, 'projectData', this.Tasks)
    // }

    if (this.Document == null) {
      await this.getDocuments({ username: this.currentUser.username })
    }

    this.unreadEmail = this.Document ? this.Document.filter((t) => t.status == 'unread') : []
    this.importantEmail = this.Document ? this.Document.filter((t) => t.status == 'important') : []
    //...
    this.elseEmail = this.Document ? this.Document.filter((t) => t.status == 'else') : []
  }
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row" v-if="elseEmail != null">
      <div class="col-12">
        <div class="email-container bg-transparent">
          <!-- Left sidebar -->
          <div class="inbox-leftbar card">
            <!-- <router-link :to="{ name: 'Compose Email' }" class="btn btn-danger btn-block mb-4">Compose</router-link> -->
            <h5 style="border-bottom: 1px dashed;"> 文档统计</h5>

            <LeftbarList :unread="unreadEmail.length" :else="elseEmail.length" :important="importantEmail.length" />

            <!-- <div class="mt-4 border-bottom pb-2 mb-2">
              <div class="media">
                <div class="mr-2">
                  <div class="avatar-sm font-weight-bold d-inline-block m-1">
                    <span class="avatar-title rounded-circle bg-soft-primary text-primary">S</span>
                  </div>
                </div>
                <div class="media-body overflow-hidden">
                  <h5 class="font-size-14 mt-1 mb-0">officeShield</h5>
                  <small class="text-muted">
                    <i class="uil uil-circle font-size-11 text-success"></i>
                    Active Now
                  </small>
                </div>
                <b-dropdown right class="float-right mt-2" variant="black" toggle-class="p-0">
                  <template v-slot:button-content>
                    <i class="uil uil-ellipsis-v text-muted font-size-12"></i>
                  </template>

                  <b-dropdown-item href="javascript: void(0)">Edit</b-dropdown-item>
                  <b-dropdown-item href="javascript: void(0)">Delete</b-dropdown-item>
                </b-dropdown>
                
              </div>
            </div>
            <ul class="list-unstyled">
              <li class="py-2">
                <a href="javascript: void(0)" class="chat">
                <div class="media">
                  <div class="text-center mr-3">
                      <img src="@assets/images/users/avatar-2.jpg" alt class="avatar-sm rounded-circle" />
                    </div>
                    <div class="media-body overflow-hidden">
                      <h5 class="font-size-15 mt-0 mb-1">Johnny</h5>
                      <p class="text-muted font-size-13 text-truncate mb-0">
                        Neque porro quisquam est
                      </p>
                    </div>
                  </div>
                </a>
              </li>
              <li class="py-2">
                <a href="javascript: void(0)" class="chat">
                  <div class="media">
                    <div class="mr-3">
                      <img src="@assets/images/users/avatar-3.jpg" alt class="avatar-sm rounded-circle" />
                    </div>
                    <div class="media-body overflow-hidden">
                      <h5 class="font-size-15 mt-0 mb-1">Bryan</h5>
                      <p class="text-muted font-size-13 text-truncate mb-0">
                        For science, music, sport, etc
                      </p>
                    </div>
                  </div>
                </a>
              </li>
              <li class="py-2">
                <a href="javascript: void(0)" class="chat">
                  <div class="media">
                    <div class="text-center mr-3">
                      <div class="avatar-sm font-weight-bold d-inline-block">
                        <span class="avatar-title rounded-circle bg-soft-danger text-danger">T</span>
                      </div>
                  </div>
                    <div class="media-body overflow-hidden">
                      <h5 class="font-size-15 mt-0 mb-1">Tracy</h5>
                      <p class="text-muted font-size-13 text-truncate mb-0">
                        To an English person, it will seem like simplified
                      </p>
                    </div>
                  </div>
                </a>
              </li>
              <li class="py-2">
                <a href="javascript: void(0)" class="chat">
                  <div class="media">
                    <div class="mr-3">
                      <img src="@assets/images/users/avatar-4.jpg" alt class="avatar-sm rounded-circle" />
                    </div>
                    <div class="media-body overflow-hidden">
                      <h5 class="font-size-15 mt-0 mb-1">Thomas</h5>
                      <p class="text-muted font-size-13 text-truncate mb-0">
                        To achieve this, it would be necessary
                      </p>
                    </div>
                </div>
                </a>
              </li>
              <li class="py-2">
                <a href="javascript: void(0)" class="chat">
                  <div class="media">
                    <div class="mr-3">
                      <div class="avatar-sm font-weight-bold d-inline-block">
                        <span class="avatar-title rounded-circle bg-soft-success text-success">D</span>
                      </div>
                    </div>
                    <div class="media-body overflow-hidden">
                      <h5 class="font-size-15 mt-0 mb-1">David</h5>
                      <p class="text-muted font-size-13 text-truncate mb-0">
                        If several languages coalesce
                      </p>
                    </div>
                  </div>
                </a>
              </li>
          </ul> -->

            <div v-if="isVisible" class="chatbox overflow-hidden">
              <div class="bg-primary p-2">
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
              </div>

              <div class="chat-conversation p-2" style="max-height: 220px;">
                <input type="button" title="开启摄像头" value="开启摄像头" onclick="getMedia()" />
                <video id="video" width="100px" height="100px" autoplay="autoplay"></video>
                <canvas id="canvas" width="100px" height="100px"></canvas>
                <!-- <button id="snap" onclick="takePhoto()">拍照</button>
                          <button id="close" onclick="closeMedia()">关闭</button>
                        <button id="upload" onclick="uploadImage()">上传</button> -->
              </div>
            </div>
            <!-- end chatbox -->
          </div>
          <!-- End Left sidebar -->
          <b-modal v-model="errorModal" centered hide-footer title="重要提醒" title-class="font-18">
            <div class="text-center">
              <i class="uil-no-entry text-warning display-3"></i>
              <h4 class="text-danger mt-4">阅读行为提醒</h4>
              <p class="w-75 mx-auto text-muted">请注意，你的所有阅读行为将会被记录</p>
              <p class="w-75 mx-auto text-muted">产生的任何泄密后果将由你承担</p>
              <p class="w-75 mx-auto text-muted">我们将对你的行为进行实时的监控，需要获取你的摄像头权限，同意则开始文档阅读</p>
              <div class="mt-4">
                <a class="btn btn-outline-primary btn-rounded width-md" href="javascript: void(0);" @click="confirmJump">
                  <i class="uil uil-arrow-right mr-1"></i> 同意
                </a>
              </div>
            </div>
          </b-modal>
          <!-- start right sidebar -->
          <div class="inbox-rightbar">
            <Toolbar />

            <div class="mt-2">
              <h5 class="mt-3 mb-2 font-size-16">未阅读</h5>
              <ul class="message-list">
                <li v-for="(email, index) in unreadEmail" :key="index" class="unread">
                  <a @click="chooseDocu(email.id)">
                    <div class="col-mail col-mail-1">
                      <div class="checkbox-wrapper-mail">
                        <input :id="`chk-unread-${index}`" type="checkbox" />
                        <label :for="`chk-unread-${index}`" class="toggle"></label>
                      </div>
                      <!-- <span class="star-toggle uil uil-star"
                                :class="{ 'text-warning': `${email.star}` === 'true' }"></span> -->
                      <span class="star-toggle uil uil-star"></span>

                      <a @click="chooseDocu(email.id)" class="title">{{ email.notes }}</a>

                    </div>
                    <div class="col-mail col-mail-2">
                      <div href class="subject">{{ email.title }}</div>
                      <div class="date">{{ email.update_time.substr(0, 11) }}</div>
                    </div>
                  </a>
                </li>
              </ul>

              <h5 class="mt-4 mb-2 font-size-16">重要</h5>
              <ul class="message-list">
                <li v-for="(email, index) in importantEmail" :key="index">
                  <a @click="chooseDocu(email.id)" class="title">
                    <div class="col-mail col-mail-1">
                      <div class="checkbox-wrapper-mail">
                        <input :id="`chk-important-${index}`" type="checkbox" />
                        <label :for="`chk-important-${index}`" class="toggle"></label>
                      </div>
                      <!-- <span class="star-toggle uil uil-star"
                                :class="{ 'text-warning': `${email.star}` === 'true' }"></span> -->
                      <span class="star-toggle uil uil-star"></span>
                      <a @click="chooseDocu(email.id)" class="title">{{ email.notes }}</a>
                    </div>
                    <div class="col-mail col-mail-2">
                      <div href class="subject">{{ email.title }}</div>
                      <div class="date ">{{ email.update_time.substr(0, 11) }}</div>
                    </div>
                  </a>
                </li>
              </ul>

              <h5 class="mt-4 mb-2 font-size-16">其他</h5>
              <ul class="message-list">
                <li v-for="(email, index) in elseEmail" :key="index">
                  <a @click="chooseDocu(email.id)" class="title">
                    <div class="col-mail col-mail-1">
                      <div class="checkbox-wrapper-mail">
                        <input :id="`chk-else-${index}`" type="checkbox" />
                        <label :for="`chk-else-${index}`" class="toggle"></label>
                      </div>
                      <!-- <span class="star-toggle uil uil-star"
                                :class="{ 'text-warning': `${email.star}` === 'true' }"></span> -->
                      <span class="star-toggle uil uil-star"></span>
                      <a @click="chooseDocu(email.id)" class="title">{{ email.notes }}</a>
                    </div>
                    <div class="col-mail col-mail-2">
                      <div href class="subject">{{ email.title }}</div>
                      <div class="date">{{ email.update_time.substr(0, 11) }}</div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
<style>
.chatbox {
  left: 100px;
  width: 225px;
}
</style>



<!-- <script>
  function closeMedia() {
            var video = document.getElementById('video');
            if (!video.srcObject) return
            let stream = video.srcObject
            let tracks = stream.getTracks();
            tracks.forEach(track => {
                track.stop()
            })
    }
    //获得video摄像头区域
    let video = document.getElementById("video");
    function getMedia() {
        let constraints = {
            video: {width: 100, height: 100},
            audio: true
        };
        /*
        这里介绍新的方法:H5新媒体接口 navigator.mediaDevices.getUserMedia()
        这个方法会提示用户是否允许媒体输入,(媒体输入主要包括相机,视频采集设备,屏幕共享服务,麦克风,A/D转换器等)
        返回的是一个Promise对象。
        如果用户同意使用权限,则会将 MediaStream对象作为resolve()的参数传给then()
        如果用户拒绝使用权限,或者请求的媒体资源不可用,则会将 PermissionDeniedError作为reject()的参数传给catch()
        */
        let promise = navigator.mediaDevices.getUserMedia(constraints);
        promise.then(function (MediaStream) {
            video.srcObject = MediaStream;
            video.play();
        }).catch(function (PermissionDeniedError) {
            console.log(PermissionDeniedError);
        })
    }
    function takePhoto() {
        //获得Canvas对象
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, 500, 500);
    }
    //图片上传到服务器
    //获取Canvas的编码
  
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    function uploadImage(){
        canvas.width = 100;
        canvas.height = 100;
        context.drawImage(video, 0, 0, 100, 100);
        var imgData = canvas.toDataURL("image/jpg");
        imgData = imgData.replace(/^data:image\/(png|jpg);base64,/,"")
        //上传到后台。
        var uploadAjax = $.ajax({
            type: "post",
            //后端需要调用的地址
            url:"/receiveImage/",
            data: JSON.stringify({"imgData": imgData}),
            contentType:"json/application",
            //设置超时
            timeout:10000,
            async: true,
            success: function (htmlVal) {
                //成功后回调
            },
            error: function(data) {
            },
            //调用执行后调用的函数
            complete: function (XMLHttpRequest, textStatus) {
                if(textStatus == 'timeout'){
                    uploadAjax.abort(); //取消请求
                    //超时提示：请求超时，请重试
                    alert("请求超时，请重试")
                    //请求超时返回首页
                    closeCard();
                }
            }
        });
    }
</script> -->