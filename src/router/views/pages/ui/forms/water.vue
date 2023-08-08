<script>
import vue2Dropzone from 'vue2-dropzone'
import { FormWizard, TabContent } from 'vue-form-wizard'
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
    components: { Layout, PageHeader, vueDropzone: vue2Dropzone, Demo, FormWizard, TabContent, invoice },
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
            image: '',
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
            await this.getTasks({ username: this.currentUser.username })
            this.getDocument()
            await this.getTasksDetail({ id: 16 })
            this.task = this.DetailTask
            console.log(this.task, this.currentUser)
            this.isopen = true;

        },
        async getDocument() {
            await axios.get('/api/document/get_images', { params: { id: this.document_id ? this.document_id : 9 } }).then((response) => {
                // this.images = response.data.images // 从Flask后端获取图片数据，并将其添加到images列表中
                this.images = response.data.images.map(image => ({ url: image.data }));

            })

        },
        makeToast(variant = null, state) {
            // const content = '你可能出现了违反泄密规定的异常行为,请规范阅读'
            if (state == 'success') {
                // content = '意见已经成功被上级收到'
            }
            this.$bvToast.toast(variant, {
                title: ` ${variant || 'default'}`,
                variant: state,
                toaster: 'b-toaster-top-center',
                solid: true,
                autoHideDelay: 0
            })
        },
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
                                <h3>上传待溯源文档图片</h3>
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
                <div class="row  no-gutters align-items-center">
                    <div class="col-12 ">
                        <div class="card">

                            <div class="card-body">
                                <h3 class="card-title  header-title ">透视变换并提取水印信息</h3>
                                <div>
                                    <div class="row no-gutters align-items-center">
                                        <div class="col-md-3 text-center">
                                            <img src="@assets/images/wow7.jpg" class="card-img"
                                                style="width:150px;height:150px;margin-left:20px  " alt="..." />
                                        </div>
                                        <div class="col-md-3 align-items-center text-center">
                                            <feather type="chevrons-right" class="icon-dual-success icon-xxl"></feather>
                                            <h4>提取完整图片块</h4>
                                            <h4>透视变换</h4>
                                            <!-- class="icons-**"></feather>. Available sizes xs,lg,xl,xxl -->
                                        </div>
                                        <div class="col-md-3 text-center">
                                            <img src="@assets/images/wow7_re.jpeg" class="card-img"
                                                style="width:150px;height:150px;margin-left:20px  " alt="..." />
                                        </div>
                                        <div class="col-md-3 align-items-center text-center">
                                            <feather type="chevrons-down" class="icon-dual-success icon-xxl"></feather>
                                            <h4>水印提取</h4>
                                            <h4>查询记录</h4>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                <div class="row  no-gutters align-items-center">
                    <div class="col-12 ">
                        <div class="card">

                            <div class="card-body">
                                <h3 class="card-title  header-title ">水印信息</h3>
                                <div>
                                    <div class="row no-gutters align-items-center">
                                        <div class="col-md-2">
                                            <img src="@assets/images/small/头像6.jpeg" class="card-img"
                                                style="width:150px;height:150px;margin-left:20px  " alt="..." />
                                        </div>
                                        <div class="col-md-5">
                                            <div class="card-body"
                                                style="border:1px solid;margin-right: 20px;height:200px;margin-left: 20px">
                                                <h3 class="card-title  header-title " style="margin-bottom: 20px;">水印信息</h3>
                                                <h5 class="card-title font-size-16"> - 用户ID：214124124</h5>
                                                <h5 class="card-title font-size-16"> - 用户姓名：kerwin</h5>
                                                <h5 class="card-title font-size-16"> - 泄密时间：2023.4.23 10:15</h5>
                                                <!-- <h5 class="card-title font-size-16"> - IP地址：192.168.68.1</h5> -->
                                                <!-- <p class="card-text">
                                    Last updated 3 mins ago
                                </p> -->
                                            </div>
                                        </div>
                                        <div class="col-md-5">
                                            <div class="card-body"
                                                style="border:1px solid;margin-right: 20px; height:200px">
                                                <h3 class="card-title  header-title " style="margin-bottom: 20px;">对应文档信息
                                                </h3>
                                                <h5 class="card-title font-size-16"> - 文档负责人：bob</h5>
                                                <h5 class="card-title font-size-16"> - 目标文档：XXX有限公司2022 年度财务报表
                                                </h5>
                                                <h5 class="card-title font-size-16"> - 文档泄密威胁：MEDIUM</h5>
                                                <!-- <p class="card-text">
                                    Last updated 3 mins ago
                                </p> -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                <div class="row  no-gutters align-items-center">
                    <div class="col-12 ">
                        <div class="card">

                            <div class="card-body">
                                <h3 class="card-title  header-title ">事件处理</h3>
                                <div>
                                    <form-wizard color="#5369f8">
                                        <tab-content title="处理泄密人员">
                                            <div class="row">
                                                <div class="col-6">
                                                    <div class="form-group row mb-3">
                                                        <label class="col-md-3 col-form-label">泄密人员</label>
                                                        <div class="col-md-9">
                                                            <input type="text" class="form-control" name="userName"
                                                                value="kerwin" disabled />
                                                        </div>
                                                    </div>
                                                    <div class="form-group row mb-3">
                                                        <label class="col-md-3 col-form-label">对应账号ID</label>
                                                        <div class="col-md-9">
                                                            <input type="text" class="form-control" value="214124124"
                                                                disabled />
                                                        </div>
                                                    </div>

                                                    <div class="form-group row mb-3">
                                                        <label class="col-md-3 col-form-label">运行情况</label>
                                                        <div class="col-md-9">
                                                            <input type="text" class="form-control" value="运行" disabled />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-6 text-center">
                                                    <h2 class="mt-0">
                                                        <i class="mdi mdi-check-all"></i>
                                                    </h2>
                                                    <h3 class="mt-0">针对该用户的泄密行为，需强制进行账号注销
                                                    </h3>
                                                    <h3 class="mt-0">
                                                        停止账号服务以防该用户进一步的损害文件的机密性
                                                    </h3>

                                                    <b-button variant="outline-danger"
                                                        @click="makeToast('停止用户服务成功', 'success')">停止用户服务</b-button>

                                                </div>
                                                <!-- end col -->
                                            </div>
                                            <!-- end row -->
                                        </tab-content>
                                        <tab-content title="通知任务人员">
                                            <div class="row">
                                                <div class="col-6">
                                                    <div class="form-group row mb-3">
                                                        <label class="col-md-3 col-form-label" for="name">文档任务人员</label>
                                                        <div class="col-md-9">
                                                            <input type="text" name="name" class="form-control" value="bob"
                                                                disabled />
                                                        </div>
                                                    </div>
                                                    <div class="form-group row mb-3">
                                                        <label class="col-md-3 col-form-label" for="surname">对应文档</label>
                                                        <div class="col-md-9">
                                                            <input type="text" name="surname" class="form-control"
                                                                value="XXX有限公司2022 年度财务报表" disabled />
                                                        </div>
                                                    </div>

                                                    <div class="form-group row mb-3">
                                                        <label class="col-md-3 col-form-label" for="email">文档执行情况</label>
                                                        <div class="col-md-9">
                                                            <input type="email" name="email" class="form-control"
                                                                value="75%" disabled />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-6 text-center">
                                                    <h2 class="mt-0">
                                                        <i class="mdi mdi-check-all"></i>
                                                    </h2>
                                                    <h3 class="mt-0">及时通知任务人员文档泄密情况
                                                    </h3>
                                                    <h3 class="mt-0">
                                                        对任务安全性进行重新审核
                                                    </h3>

                                                    <b-button variant="outline-danger"
                                                        @click="makeToast('通知文档发布者该信息', 'success')">泄密事件通知</b-button>

                                                </div>
                                                <!-- end col -->
                                            </div>
                                            <!-- end row -->
                                        </tab-content>
                                        <tab-content title="形成事件报告">
                                            <div class="row">
                                                <div class="col-12">
                                                    <div class="text-center">
                                                        <h2 class="mt-0">
                                                            <i class="mdi mdi-check-all"></i>
                                                        </h2>
                                                        <h3 class="mt-0">对该事件进行立案调查</h3>
                                                        <h3 class="mt-0">跟进后续事件处理</h3>
                                                        <b-button variant="outline-danger"
                                                            @click="makeToast('已成功生成后续调查事件', 'success')">生成泄密事件并保存泄密报告</b-button>
                                                        <!-- <p class="w-75 mb-2 mx-auto">
                                                            Quisque nec turpis at urna dictum luctus. Suspendisse
                                                            convallis dignissim eros at volutpat. In egestas mattis
                                                            dui. Aliquam mattis dictum aliquet.
                                                        </p> -->

                                                        <!-- <div class="mb-3">
                                                            <div class="custom-control custom-checkbox">
                                                                <input id="customCheck1" type="checkbox"
                                                                    class="custom-control-input" />
                                                                <label class="custom-control-label" for="customCheck1">I
                                                                    agree with the
                                                                    Terms and Conditions</label>
                                                            </div>
                                                        </div> -->
                                                    </div>
                                                </div>
                                                <!-- end col -->
                                            </div>
                                            <!-- end row -->
                                        </tab-content>
                                    </form-wizard>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
            <div class="col-12">
                <div class="card">
                    <div class="row no-gutters align-items-center">

                        <!-- <div class="col-xl-6 col-lg-3">

                            <div class="card-body">
                                <h3 class="card-title  header-title ">具体泄密文档</h3>
                                <div
                                    style="border:1px dashed; margin-right: 20px;margin-left: 20px;height: 700px;overflow:scroll;">
                                    <div v-for="(image, index) in images"><b-img-lazy :id="'tooltip-button-' + (index + 1)"
                                            :src="image.url" v-bind="mainProps" alt="Image 2"></b-img-lazy>

                                    </div>
                                </div>


                            </div>
                        </div> -->
                        <div class="col-xl-12 col-lg-3">

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
                                                    <h5 class="card-title font-size-16"> alice、 2023 joker、bob
                                                    </h5>
                                                    <h5 class="card-title font-size-16"> - 存在泄密等级HIGH的人：2人
                                                    </h5>
                                                    <h5 class="card-title font-size-16"> 2023 joker、 bob
                                                    </h5>

                                                </div>

                                            </div>
                                            <div class="col-xl-6 col-lg-3">
                                                <div class="card-body" style="border:1px solid;margin-right: 20px;">
                                                    <h5 class="card-title font-size-16"> - 泄密的可能相关记录：4条</h5>
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
                                                        <span class="badge badge-soft-success">LOW</span>
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
                            <div class="card-body"
                                style="border:1px solid;margin-right: 20px;height:555px;overflow-y: scroll">

                                <invoice />


                            </div>

                        </div>

                    </div>
                </div>
                <div class="row  no-gutters align-items-center">
                    <div class="col-12 ">
                        <div class="card">

                            <div class="card-body">
                                <h3 class="card-title  header-title ">事件处理</h3>
                                <div>
                                    <form-wizard color="#5369f8">
                                        <tab-content title="处理泄密人员">
                                            <div class="row">
                                                <div class="col-6">
                                                    <div class="form-group row mb-3">
                                                        <label class="col-md-3 col-form-label">泄密人员</label>
                                                        <div class="col-md-9">
                                                            <input type="text" class="form-control" name="userName"
                                                                value="kerwin" disabled />
                                                        </div>
                                                    </div>
                                                    <div class="form-group row mb-3">
                                                        <label class="col-md-3 col-form-label">对应账号ID</label>
                                                        <div class="col-md-9">
                                                            <input type="text" class="form-control" value="214124124"
                                                                disabled />
                                                        </div>
                                                    </div>

                                                    <div class="form-group row mb-3">
                                                        <label class="col-md-3 col-form-label">运行情况</label>
                                                        <div class="col-md-9">
                                                            <input type="text" class="form-control" value="运行" disabled />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-6 text-center">
                                                    <h2 class="mt-0">
                                                        <i class="mdi mdi-check-all"></i>
                                                    </h2>
                                                    <h3 class="mt-0">针对该用户的泄密行为，需强制进行账号注销
                                                    </h3>
                                                    <h3 class="mt-0">
                                                        停止账号服务以防该用户进一步的损害文件的机密性
                                                    </h3>

                                                    <b-button variant="outline-danger">停止用户服务</b-button>

                                                </div>
                                                <!-- end col -->
                                            </div>
                                            <!-- end row -->
                                        </tab-content>
                                        <tab-content title="通知任务人员">
                                            <div class="row">
                                                <div class="col-6">
                                                    <div class="form-group row mb-3">
                                                        <label class="col-md-3 col-form-label" for="name">文档任务人员</label>
                                                        <div class="col-md-9">
                                                            <input type="text" name="name" class="form-control" value="bob"
                                                                disabled />
                                                        </div>
                                                    </div>
                                                    <div class="form-group row mb-3">
                                                        <label class="col-md-3 col-form-label" for="surname">对应文档</label>
                                                        <div class="col-md-9">
                                                            <input type="text" name="surname" class="form-control"
                                                                value="XXX有限公司2022 年度财务报表" disabled />
                                                        </div>
                                                    </div>

                                                    <div class="form-group row mb-3">
                                                        <label class="col-md-3 col-form-label" for="email">文档执行情况</label>
                                                        <div class="col-md-9">
                                                            <input type="email" name="email" class="form-control"
                                                                value="75%" disabled />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-6 text-center">
                                                    <h2 class="mt-0">
                                                        <i class="mdi mdi-check-all"></i>
                                                    </h2>
                                                    <h3 class="mt-0">及时通知任务人员文档泄密情况
                                                    </h3>
                                                    <h3 class="mt-0">
                                                        对任务安全性进行重新审核
                                                    </h3>

                                                    <b-button variant="outline-danger">泄密事件通知</b-button>

                                                </div>
                                                <!-- end col -->
                                            </div>
                                            <!-- end row -->
                                        </tab-content>
                                        <tab-content title="形成事件报告">
                                            <div class="row">
                                                <div class="col-12">
                                                    <div class="text-center">
                                                        <h2 class="mt-0">
                                                            <i class="mdi mdi-check-all"></i>
                                                        </h2>
                                                        <h3 class="mt-0">对该事件进行立案调查</h3>
                                                        <h3 class="mt-0">跟进后续事件处理</h3>
                                                        <b-button variant="outline-danger">生成泄密事件并保存泄密报告</b-button>
                                                        <!-- <p class="w-75 mb-2 mx-auto">
                                                            Quisque nec turpis at urna dictum luctus. Suspendisse
                                                            convallis dignissim eros at volutpat. In egestas mattis
                                                            dui. Aliquam mattis dictum aliquet.
                                                        </p> -->

                                                        <!-- <div class="mb-3">
                                                            <div class="custom-control custom-checkbox">
                                                                <input id="customCheck1" type="checkbox"
                                                                    class="custom-control-input" />
                                                                <label class="custom-control-label" for="customCheck1">I
                                                                    agree with the
                                                                    Terms and Conditions</label>
                                                            </div>
                                                        </div> -->
                                                    </div>
                                                </div>
                                                <!-- end col -->
                                            </div>
                                            <!-- end row -->
                                        </tab-content>
                                    </form-wizard>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    </Layout>
</template>
