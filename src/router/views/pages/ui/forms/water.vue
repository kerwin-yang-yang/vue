<script>
import vue2Dropzone from 'vue2-dropzone'

import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import Demo from '@components/timer.vue'
import axios from 'axios'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import { authComputed, TaskComputed, TasksMethods } from '@/src/state/helpers'

export default {
    page: {
        title: '水印验证',
        meta: [{ name: 'description', content: appConfig.description }],
    },
    components: { Layout, PageHeader, vueDropzone: vue2Dropzone, Demo },
    data() {
        return {
            title: '水印验证',
            isopen: false,
            images: [],
            task:null,
            items: [
                {
                    text: 'Shreyu',
                    href: '/',
                },
                {
                    text: 'Management',
                    href: '/',
                },
                {
                    text: 'Watermark verification',
                    active: true,
                },
            ],
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
            dropzoneOptions: {
                url: 'http://127.0.0.1:5001/api/document/uploadDocument',
                thumbnailWidth: 150,
                maxFilesize: 30,
                headers: { content: 'header value' },
            },
            // 其中包含上传文件的相关配置，如上传地址、缩略图宽度、最大文件大小等
        }
    },
    methods: {
        ...TasksMethods,
        async handleFileUploadSuccess(response, file) {
            console.log(response)
            this.getDocument()
            await this.getTasksDetail({ id: 1 })
            this.task = this.DetailTask
            console.log(this.task,this.currentUser)
            this.isopen = true;

        },
        async getDocument() {
            await axios.get('/api/document/get_images', { params: { id: this.document_id ? this.document_id : 1 } }).then((response) => {
                // this.images = response.data.images // 从Flask后端获取图片数据，并将其添加到images列表中
                this.images = response.data.images.map(image => ({ url: image.data }));

            })
        }
    },
    computed: {
        ...authComputed,
        ...TaskComputed
    }


}
</script>

<template>
    <Layout>
        <PageHeader :title="title" :items="items" />
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h4 class="vue-editor mt-0 mb-1">上传泄密文档图片进行暗水印提取，获取泄密信息定位泄密人员</h4>
                        <p class="text-muted font-13 m-b-30">Upload leaked document images for dark watermark extraction,
                            obtain leaked information, locate leaked personnel</p>
                        <!-- file upload -->
                        <vue-dropzone id="dropzone" ref="myVueDropzone" :options="dropzoneOptions" :use-custom-slot="true"
                            @vdropzone-success="handleFileUploadSuccess" @vdropzone-success-multiple="false">
                            <div class="text-center">
                                <i class="h1 text-muted uil-cloud-upload"></i>
                                <h3>上传泄密文档图片</h3>
                                <span class="text-muted font-size-13">
                                    (提取文档图片信息)
                                </span>
                            </div>
                        </vue-dropzone>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" v-show="isopen">
            <div class="col-12">
                <div class="card">
                    <div class="row no-gutters align-items-center">
                        <div class="col-md-2">
                            <img src="@assets/images/small/头像6.jpeg" class="card-img"
                                style="width:150px;height:150px;margin-left:20px ;" alt="..." />
                        </div>
                        <div class="col-md-5">
                            <div class="card-body" style="border:1px solid;margin-right: 20px;">
                                <h3 class="card-title  header-title " style="margin-bottom: 20px;">水印信息</h3>
                                <h5 class="card-title font-size-16"> - 员工ID：214124124</h5>
                                <h5 class="card-title font-size-16"> - 泄密时间：2023.5.8 10:15</h5>
                                <h5 class="card-title font-size-16"> - IP地址：192.168.68.1</h5>
                                <!-- <p class="card-text">
                                    Last updated 3 mins ago
                                </p> -->
                            </div>
                        </div>
                        <div class="col-md-5">
                            <div class="card-body" style="border:1px solid;margin-right: 20px;">
                                <h3 class="card-title  header-title " style="margin-bottom: 20px;">对应文档信息</h3>
                                <h5 class="card-title font-size-16"> - 文档负责人：kerwin</h5>
                                <h5 class="card-title font-size-16"> - 目标文档：教育部关于同意四川大学章程部分条款修改的批复</h5>
                                <h5 class="card-title font-size-16"> - 文档泄密威胁：MEDIUM</h5>
                                <!-- <p class="card-text">
                                    Last updated 3 mins ago
                                </p> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="card">
                    <div class="row no-gutters align-items-center">
                        
                        <div class="col-xl-6 col-lg-3">
                                
                                <div class="card-body" style="border:1px dashed; margin-right: 20px;margin-left: 20px;height: 700px;overflow:scroll;">
                                    <div v-for="(image, index) in images"><b-img-lazy :id="'tooltip-button-' + (index + 1)"
                                            :src="image.url" v-bind="mainProps" alt="Image 2"></b-img-lazy>

                                    </div>
                                
                            </div>
                        </div>
                        <div class="col-xl-6 col-lg-3">
                            
                                <div class="card-body" style="border:1px dashed;margin-right: 20px;height: 700px;overflow:scroll;">
                                    <Demo :task="task" :createUser="this.currentUser" v-if="task" />
                                </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>
