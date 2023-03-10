<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'

import Toolbar from './toolbar'
import LeftbarList from './leftbar-list'
import { emailData } from './dataInbox'

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
      emailData: emailData,
      title: 'Document Inbox',
      items: [
        {
          text: 'Shreyu',
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
          text: 'Inbox',
          active: true,
        },
      ],
      isVisible: false,
      unreadEmail: emailData.filter((t) => t.status === 'unread'),
      importantEmail: emailData.filter((t) => t.status === 'important'),
      elseEmail: emailData.filter((t) => t.status === 'else'),
    }
  },
  methods: {
    remove() {
      this.isVisible = false
    },
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-12">
        <div class="email-container bg-transparent">
          <!-- Left sidebar -->
          <div class="inbox-leftbar card">
            <router-link to="/email/compose" class="btn btn-danger btn-block mb-4">Compose</router-link>

            <LeftbarList />

            <div class="mt-4 border-bottom pb-2 mb-2">
              <div class="media">
                <div class="mr-2">
                  <div class="avatar-sm font-weight-bold d-inline-block m-1">
                    <span class="avatar-title rounded-circle bg-soft-primary text-primary">S</span>
                  </div>
                </div>
                <div class="media-body overflow-hidden">
                  <h5 class="font-size-14 mt-1 mb-0">Shreyu</h5>
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
                <!-- end dropdown -->
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
            </ul>

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
                <input type="button" title="???????????????" value="???????????????" onclick="getMedia()" />
                <video id="video" width="100px" height="100px" autoplay="autoplay"></video>
                <canvas id="canvas" width="100px" height="100px"></canvas>
                <!-- <button id="snap" onclick="takePhoto()">??????</button>
                <button id="close" onclick="closeMedia()">??????</button>
                <button id="upload" onclick="uploadImage()">??????</button> -->
              </div>
            </div>
            <!-- end chatbox -->
          </div>
          <!-- End Left sidebar -->

          <!-- start right sidebar -->
          <div class="inbox-rightbar">
            <Toolbar />

            <div class="mt-2">
              <h5 class="mt-3 mb-2 font-size-16">Unread</h5>
              <ul class="message-list">
                <li v-for="(email, index) in unreadEmail" :key="index" class="unread">
                  <div class="col-mail col-mail-1">
                    <div class="checkbox-wrapper-mail">
                      <input :id="`chk-unread-${index}`" type="checkbox" />
                      <label :for="`chk-unread-${index}`" class="toggle"></label>
                    </div>
                    <span class="star-toggle uil uil-star"
                      :class="{ 'text-warning': `${email.star}` === 'true' }"></span>
                    <a href="/read" class="title">{{ email.title }}</a>
                  </div>
                  <div class="col-mail col-mail-2">
                    <a href class="subject">{{ email.subject }}</a>
                    <div class="date">{{ email.date }}</div>
                  </div>
                </li>
              </ul>

              <h5 class="mt-4 mb-2 font-size-16">Important</h5>
              <ul class="message-list">
                <li v-for="(email, index) in importantEmail" :key="index">
                  <div class="col-mail col-mail-1">
                    <div class="checkbox-wrapper-mail">
                      <input :id="`chk-important-${index}`" type="checkbox" />
                      <label :for="`chk-important-${index}`" class="toggle"></label>
                    </div>
                    <span class="star-toggle uil uil-star"
                      :class="{ 'text-warning': `${email.star}` === 'true' }"></span>
                    <a href class="title">{{ email.title }}</a>
                  </div>
                  <div class="col-mail col-mail-2">
                    <a href class="subject">{{ email.subject }}</a>
                    <div class="date">{{ email.date }}</div>
                  </div>
                </li>
              </ul>

              <h5 class="mt-4 mb-2 font-size-16">Everything Else</h5>
              <ul class="message-list">
                <li v-for="(email, index) in elseEmail" :key="index">
                  <div class="col-mail col-mail-1">
                    <div class="checkbox-wrapper-mail">
                      <input :id="`chk-else-${index}`" type="checkbox" />
                      <label :for="`chk-else-${index}`" class="toggle"></label>
                    </div>
                    <span class="star-toggle uil uil-star"
                      :class="{ 'text-warning': `${email.star}` === 'true' }"></span>
                    <a href class="title">{{ email.title }}</a>
                  </div>
                  <div class="col-mail col-mail-2">
                    <a href class="subject">{{ email.subject }}</a>
                    <div class="date">{{ email.date }}</div>
                  </div>
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
    //??????video???????????????
    let video = document.getElementById("video");
    function getMedia() {
        let constraints = {
            video: {width: 100, height: 100},
            audio: true
        };
        /*
        ????????????????????????:H5??????????????? navigator.mediaDevices.getUserMedia()
        ???????????????????????????????????????????????????,(??????????????????????????????,??????????????????,??????????????????,?????????,A/D????????????)
        ??????????????????Promise?????????
        ??????????????????????????????,????????? MediaStream????????????resolve()???????????????then()
        ??????????????????????????????,????????????????????????????????????,????????? PermissionDeniedError??????reject()???????????????catch()
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
        //??????Canvas??????
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, 500, 500);
    }
    //????????????????????????
    //??????Canvas?????????
  
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    function uploadImage(){
        canvas.width = 100;
        canvas.height = 100;
        context.drawImage(video, 0, 0, 100, 100);
        var imgData = canvas.toDataURL("image/jpg");
        imgData = imgData.replace(/^data:image\/(png|jpg);base64,/,"")
        //??????????????????
        var uploadAjax = $.ajax({
            type: "post",
            //???????????????????????????
            url:"/receiveImage/",
            data: JSON.stringify({"imgData": imgData}),
            contentType:"json/application",
            //????????????
            timeout:10000,
            async: true,
            success: function (htmlVal) {
                //???????????????
            },
            error: function(data) {
            },
            //??????????????????????????????
            complete: function (XMLHttpRequest, textStatus) {
                if(textStatus == 'timeout'){
                    uploadAjax.abort(); //????????????
                    //???????????????????????????????????????
                    alert("????????????????????????")
                    //????????????????????????
                    closeCard();
                }
            }
        });
    }
</script> -->