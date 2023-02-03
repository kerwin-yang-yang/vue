<template>
    <Layout>
        <!-- :title="title" :items="items"  -->
        <PageHeader />
        <!-- Right Sidebar -->
        <div class="row">
            <div class="col-lg-12">
                <div class="email-container">
                    <!-- Left sidebar -->
                    <div>
                        <a-button class="btn btn-danger btn-block mb-4" type="primary" @click="screen">全屏</a-button>
                    </div>
                    <div class="inbox-leftbar">
                        <router-link to="/apps/email/inbox" class="btn btn-danger btn-block mb-4">退出阅读</router-link>

                        <div v-if="isVisible" class="chatbox overflow-hidden">
                            <div class="bg-primary p-2">
                                <div class="media">
                                    <img src="@assets/images/users/avatar-2.jpg" alt
                                        class="avatar-sm rounded ml-1 mr-2" />
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
                                        <a class="chat-close text-white mr-2" href="javascript: void(0);"
                                            @click="remove">
                                            <i class="uil uil-multiply font-size-14"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div class="chat-conversation p-2" style="max-height: 400px;">
                                <video id="videoCamera" :width="videoWidth" :height="videoHeight" autoplay></video>
                                <canvas style="display: none" id="canvasCamera" :width="videoWidth"
                                    :height="videoHeight"></canvas>
                                <div v-if="imgSrc" class="img_bg_camera">
                                    <img :src="imgSrc" alt="" class="tx_img" />
                                </div>
                                <button @click="getCompetence()">打开摄像头</button>
                                <button @click="stopNavigator()">关闭摄像头</button>
                                <!-- <button @click="setImage()">拍照</button> -->
                            </div>

                        </div>
                        <LeftbarList />
                    </div>
                    <!-- End Left sidebar -->

                    <div class="inbox-rightbar p-4">
                        <Toolbar />
                        <div class="mt-2">
                            <h5>Hi Bro, How are you?</h5>

                            <hr />

                            <div class="media mb-4 mt-1">
                                <img class="d-flex mr-2 rounded-circle avatar-sm"
                                    src="@assets/images/users/avatar-2.jpg" alt="Generic placeholder image" />
                                <div class="media-body">
                                    <span class="float-right">07:23 AM</span>
                                    <h6 class="m-0 font-14">Jonathan Smith</h6>
                                    <small class="text-muted">From: jonathan@domain.com</small>
                                </div>
                            </div>

                            <p>
                                <b>Hi Bro...</b>
                            </p>
                            <div class="text-muted">
                                <p>
                                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                                    Aenean commodo ligula eget dolor. Aenean massa. Cum sociis
                                    natoque penatibus et magnis dis parturient montes, nascetur
                                    ridiculus mus. Donec quam felis, ultricies nec, pellentesque
                                    eu, pretium quis, sem.
                                </p>
                                <p>
                                    Nulla consequat massa quis enim. Donec pede justo, fringilla
                                    vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus
                                    ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis
                                    eu pede mollis pretium. Integer tincidunt. Cras dapibus.
                                    Vivamus elementum semper nisi.
                                </p>
                                <p>
                                    Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor
                                    eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante,
                                    dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra
                                    nulla ut metus varius laoreet. Quisque rutrum. Aenean
                                    imperdiet. Etiam ultricies nisi vel augue. Curabitur
                                    ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus.
                                    Maecenas tempus, tellus eget condimentum rhoncus, sem quam
                                    semper libero, sit amet adipiscing sem neque sed ipsum. Nam
                                    quam nunc, blandit vel, luctus pulvinar,
                                </p>
                            </div>

                            <hr />

                            <h6>
                                <i class="fa fa-paperclip mb-2"></i> Attachments
                                <span>(3)</span>
                            </h6>

                            <div class="row">
                                <div class="col-xl-2 col-sm-4">
                                    <a href="javascript: void(0);">
                                        <img src="@assets/images/attached-files/img-1.jpg" alt="attachment"
                                            class="img-thumbnail img-responsive" />
                                    </a>
                                </div>
                                <div class="col-xl-2 col-sm-4 mt-3 mt-sm-0">
                                    <a href="javascript: void(0);">
                                        <img src="@assets/images/attached-files/img-2.jpg" alt="attachment"
                                            class="img-thumbnail img-responsive" />
                                    </a>
                                </div>
                                <div class="col-xl-2 col-sm-4 mt-3 mt-sm-0">
                                    <a href="javascript: void(0);">
                                        <img src="@assets/images/attached-files/img-3.jpg" alt="attachment"
                                            class="img-thumbnail img-responsive" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <!-- card-box -->

                        <div class="media mb-0 mt-5">
                            <img class="d-flex mr-3 rounded-circle avatar-sm" src="@assets/images/users/avatar-7.jpg"
                                alt="Generic placeholder image" />
                            <div class="media-body">
                                <div class="mb-2">
                                    <vue-editor></vue-editor>
                                </div>
                            </div>
                        </div>
                        <div class="text-right">
                            <button type="button" class="btn btn-primary btn-rounded width-sm mt-1">Send</button>
                        </div>
                    </div>
                    <!-- end inbox-rightbar-->

                    <div class="clearfix"></div>
                </div>

                <!-- end card -->
            </div>
            <!-- end Col -->
        </div>
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

.chatbox {
    left: 10px;
    width: 230px;
    bottom: 80px;
    max-height: 300px;
}
</style>
<script>

export default {
    data() {
        return {

            isVisible: true,
            fullscreen: false,
            videoWidth: 210,
            videoHeight: 200,
            imgSrc: "",
            thisCancas: null,
            thisContext: null,
            thisVideo: null,
        }
    },
    mounted() {
        this.getCompetence();
    },
    methods: {
        remove() {
            this.isVisible = false
        },
        screen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        },
        // 调用权限（打开摄像头功能）
        getCompetence() {
            var _this = this;
            this.thisCancas = document.getElementById("canvasCamera");
            this.thisContext = this.thisCancas.getContext("2d");
            this.thisVideo = document.getElementById("videoCamera");
            // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
            if (navigator.mediaDevices === undefined) {
                navigator.mediaDevices = {};
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
                        navigator.getUserMedia;
                    // 有些浏览器不支持，会返回错误信息
                    // 保持接口一致
                    if (!getUserMedia) {
                        return Promise.reject(
                            new Error("getUserMedia is not implemented in this browser")
                        );
                    }
                    // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
                    return new Promise(function (resolve, reject) {
                        getUserMedia.call(navigator, constraints, resolve, reject);
                    });
                };
            }
            var constraints = {
                audio: false,
                video: {
                    width: this.videoWidth,
                    height: this.videoHeight,
                    transform: "scaleX(-1)",
                },
            };
            navigator.mediaDevices
                .getUserMedia(constraints)
                .then(function (stream) {
                    // 旧的浏览器可能没有srcObject
                    if ("srcObject" in _this.thisVideo) {
                        _this.thisVideo.srcObject = stream;
                    } else {
                        // 避免在新的浏览器中使用它，因为它正在被弃用。
                        _this.thisVideo.src = window.URL.createObjectURL(stream);
                    }
                    _this.thisVideo.onloadedmetadata = function (e) {
                        _this.thisVideo.play();
                    };
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        //  绘制图片（拍照功能）
        setImage() {
            var _this = this;
            // 点击，canvas画图
            _this.thisContext.drawImage(
                _this.thisVideo,
                0,
                0,
                _this.videoWidth,
                _this.videoHeight
            );
            // 获取图片base64链接
            var image = this.thisCancas.toDataURL("image/png");
            _this.imgSrc = image;
            this.$emit("refreshDataList", this.imgSrc);
        },
        // base64转文件
        dataURLtoFile(dataurl, filename) {
            var arr = dataurl.split(",");
            var mime = arr[0].match(/:(.*?);/)[1];
            var bstr = atob(arr[1]);
            var n = bstr.length;
            var u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        },
        // 关闭摄像头
        stopNavigator() {
            this.thisVideo.srcObject.getTracks()[0].stop();
        },
    },
}
</script>