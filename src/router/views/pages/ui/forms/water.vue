<script>
import vue2Dropzone from 'vue2-dropzone'

import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import Demo from '@components/timer.vue'
import axios from 'axios'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import { authComputed, TaskComputed, TasksMethods } from '@/src/state/helpers'
import invoice from '@src/router/views/pages/secondary/invoice.vue'

export default {
    page: {
        title: '水印溯源',
        meta: [{ name: 'description', content: appConfig.description }],
    },
    components: { Layout, PageHeader, vueDropzone: vue2Dropzone, Demo, invoice },
    data() {
        return {
            title: '水印溯源',
            isopen: false,
            images: [],
            task: null,
            items: [
                {
                    text: 'officeShield',
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
            console.log(this.task, this.currentUser)
            this.isopen = true;

        },
        async getDocument() {
            await axios.get('/api/document/get_images', { params: { id: this.document_id ? this.document_id : 6 } }).then((response) => {
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
                                style="width:150px;height:150px;margin-left:20px  " alt="..." />
                        </div>
                        <div class="col-md-5">
                            <div class="card-body" style="border:1px solid;margin-right: 20px;height:200px;margin-left: 20px">
                                <h3 class="card-title  header-title " style="margin-bottom: 20px;">水印信息</h3>
                                <h5 class="card-title font-size-16"> - 用户ID：214124124</h5>
                                <h5 class="card-title font-size-16"> - 用户姓名：bob</h5>
                                <h5 class="card-title font-size-16"> - 泄密时间：2023.4.23 10:15</h5>
                                <!-- <h5 class="card-title font-size-16"> - IP地址：192.168.68.1</h5> -->
                                <!-- <p class="card-text">
                                    Last updated 3 mins ago
                                </p> -->
                            </div>
                        </div>
                        <div class="col-md-5">
                            <div class="card-body" style="border:1px solid;margin-right: 20px; height:200px">
                                <h3 class="card-title  header-title " style="margin-bottom: 20px;">对应文档信息</h3>
                                <h5 class="card-title font-size-16"> - 文档负责人：kerwin</h5>
                                <h5 class="card-title font-size-16"> - 目标文档：农业农村部关于《“十四五”全国农产品质量安全提升规划》的通知</h5>
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

                            <div class="card-body">
                                <h3 class="card-title  header-title ">具体泄密文档</h3>
                                <div
                                    style="border:1px dashed; margin-right: 20px;margin-left: 20px;height: 700px;overflow:scroll;">
                                    <div v-for="(image, index) in images"><b-img-lazy :id="'tooltip-button-' + (index + 1)"
                                            :src="image.url" v-bind="mainProps" alt="Image 2"></b-img-lazy>

                                    </div>
                                </div>


                            </div>
                        </div>
                        <div class="col-xl-6 col-lg-3">

                            <div class="card-body">
                                <h3 class="card-title  header-title ">人员知识图谱</h3>
                                <Demo style="border:1px dashed;margin-right: 20px;height: 700px;overflow:scroll;"
                                    :task="task" :createUser="this.currentUser" v-if="task" />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" v-show="isopen">
            <div class="col-12">
                <div class="card">
                    <div class="row no-gutters align-items-center">
                        <div class="col-xl-6 col-lg-3">
                            <div class="card-body">

                                <h3 class="card-title  header-title ">知识图谱分析报告</h3>
                                <div class="row">
                                    <div class="col-12 card">

                                        <div class="row no-gutters align-items-center">
                                            <div class="col-xl-6 col-lg-3">
                                                <div class="card-body" style="border:1px solid;margin-right: 20px;">
                                                    <h5 class="card-title font-size-16"> - 最近联系人员：3人
                                                    </h5>
                                                    <h5 class="card-title font-size-16"> alice、 2023 joker、kerwin
                                                    </h5>
                                                    <h5 class="card-title font-size-16"> - 存在泄密等级HIGH的人：2人
                                                    </h5>
                                                    <h5 class="card-title font-size-16"> 2023 joker、kerwin
                                                    </h5>

                                                </div>

                                            </div>
                                            <div class="col-xl-6 col-lg-3">
                                                <div class="card-body" style="border:1px solid;margin-right: 20px;">
                                                    <h5 class="card-title font-size-16"> - 发生泄密的可能相关记录：4条</h5>
                                                    <h5 class="card-title font-size-16"> - 泄密等级HIGH数目：0条</h5>
                                                    <h5 class="card-title font-size-16"> - 泄密等级MEDIUM数目：3条</h5>
                                                    <h5 class="card-title font-size-16"> - 泄密等级LOW数目：1条</h5>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <h3 class="card-title  header-title ">有关威胁记录</h3>
                                <div class="card-body" style="border:1px solid;margin-right: 20px;">
                                    <div class="table-responsive mt-4 mb-0" style="height:270px; overflow-y: scroll">
                                        <b-table-simple class="table table-hover table-nowrap mb-0">
                                            <b-thead class="thead-white">
                                                <b-tr>
                                                    <b-th>编号</b-th>
                                                    <b-th>详情</b-th>
                                                    <b-th>时间</b-th>
                                                    
                                                    
                                                    <b-th>泄密等级</b-th>
                                                </b-tr>
                                            </b-thead>
                                            <b-tbody>
                                                <b-tr>
                                                    <b-td>123</b-td>
                                                    <b-td> 时长:00:00:13 共暂停: 0 次 退出全屏模式: 1 次</b-td>
                                                    <b-td class="ellipsis">2023-04-17 19:24:48</b-td>
                                                    
                                                    <b-td>
                                                        <span class="badge badge-soft-warning">MEDIUM</span>
                                                    </b-td>
                                                </b-tr>
                                                <b-tr>
                                                    <b-td>134</b-td>
                                                    <b-td class="ellipsis"> 时长:00:02:03 共暂停: 0 次 退出全屏模式: 2 次</b-td>
                                                  
                                                    <b-td>2023-04-23 17:03:36</b-td>
                                                    <b-td>
                                                        <span class="badge badge-soft-warning">MEDIUM</span>
                                                    </b-td>
                                                </b-tr>
                                                <b-tr>
                                                    <b-td>136</b-td>
                                                    <b-td class="ellipsis">时长:00:00:39 共暂停: 0 次 退出全屏模式: 1 次</b-td>
                                                    
                                                    <b-td>2023-04-23 17:05:27</b-td>
                                                    <b-td>
                                                        <span class="badge badge-soft-warning">MEDIUM</span>
                                                    </b-td>
                                                </b-tr>
                                                <b-tr>
                                                    <b-td>138</b-td>
                                                    <b-td class="ellipsis">时长:00:00:56 共暂停: 1 次 退出全屏模式: 0 次</b-td>
                                                    
                                                    <b-td>2023-04-21 09:20:50</b-td>
                                                    <b-td>
                                                        <span class="badge badge-soft-success" >LOW</span>
                                                    </b-td>
                                                </b-tr>
                                            </b-tbody>

                                            <!-- :class="{
                                                            'badge-soft-warning': `${order.status}` === 'Pending',
                                                            'badge-soft-success':
                                                                `${order.status}` === 'Completed',
                                                            'badge-soft-danger': `${order.status}` === 'Declined',
                                                        }" -->
                                        </b-table-simple>
                                    </div>

                                </div>
                            </div>

                        </div>
                        <div class="col-xl-6 col-lg-3">
                            <h3 class="card-title  header-title ">泄密事件报告</h3>
                            <div class="card-body" style="border:1px solid;margin-right: 20px;height:555px;overflow-y: scroll">
                                
                                <invoice />
                               
                                <!-- <p class="card-text">
                                    Last updated 3 mins ago
                                </p>
                                <b-button variant="outline-dark" style="margin-left: 20px; margin-top: 10px"
                                    @click="Send_ideas">Send <i class="uil uil-message ml-2"></i></b-button> -->
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>
