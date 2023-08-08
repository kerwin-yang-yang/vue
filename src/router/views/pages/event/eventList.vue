<script>
import { VueEditor } from 'vue2-editor'

import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'

export default {
    page: {
        title: '泄密事件列表',
        meta: [{ name: 'description', content: appConfig.description }],
    },
    components: { Layout, PageHeader, VueEditor },
    data() {
        return {
            title: '泄密事件列表',
            items: [
                {
                    text: 'officeShield',
                    href: '/',
                },
                {
                    text: 'Forms',
                    href: '/',
                },
                {
                    text: 'EventList',
                    active: true,
                },
            ],
        }
    },
    methods: {
        confirmJump(id) {
            // 在路由跳转前弹出提示框，询问用户是否确认跳转

            // 用户点击了“确定”按钮，继续执行路由跳转

            this.$router.push({ name: '事件详情', query: { Event_id: id } });

        },
    }
}
</script>

<template>
    <Layout>
        <PageHeader :title="title" :items="items" />
        <div>
            <div class="row">
                <div class="col-4">

                    <div class="card">
                        <div class="card-body p-3">
                            <div class="media">
                                <img src="@assets/images/small/头像6.jpeg" class="mr-3 avatar-lg rounded" alt="..." />
                                <!-- <img src="@assets/images/users/avatar-7.jpg" class="mr-3 avatar-lg rounded"
                                    alt="officeShield" /> -->
                                <div class="media-body">
                                    <h5 class="mt-1 mb-0">kerwin</h5>
                                    <h6 class="font-weight-normal mt-1 mb-1">
                                        <a href>219919119@qq.com</a>
                                    </h6>
                                    <p class="text-muted">拍照泄密 | 个人泄密 | 中等泄密</p>
                                </div>
                            </div>
                            <div class="row mt-2 border-top pt-2">
                                <div class="col">
                                    <div class="media">
                                        <span class="icon-dual align-self-center mr-2">
                                            <feather type="users"></feather>
                                        </span>
                                        <div class="media-body">
                                            <h5 class="mt-2 pt-1 mb-0 font-size-16">4人</h5>
                                            <h6 class="font-weight-normal mt-0">涉及人员</h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="media">
                                        <span class="icon-dual align-self-center mr-2">
                                            <feather type="eye"></feather>
                                        </span>
                                        <div class="media-body">
                                            <h5 class="mt-2 pt-1 mb-0 font-size-16">中等</h5>
                                            <h6 class="font-weight-normal mt-0">影响范围</h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="media">
                                        <span class="icon-dual align-self-center mr-2">
                                            <feather type="file-text"></feather>
                                        </span>
                                        <div class="media-body">
                                            <h5 class="mt-2 pt-1 mb-0 font-size-16">刚刚</h5>
                                            <h6 class="font-weight-normal mt-0">发生时间</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row mt-3 text-center">
                                <div class="col">
                                    <button type="button" class="btn btn-primary btn-sm btn-block mr-1"
                                        @click="confirmJump(1)">查看事件</button>
                                </div>
                                <!-- <div class="col">
                                    <button type="button" class="btn btn-white btn-sm btn-block"></button>
                                </div> -->
                            </div>
                        </div>
                    </div>

                </div>
                <div class="col-4">

                    <div class="card">
                        <div class="card-body p-3">
                            <div class="media">
                                <img src="@assets/images/small/头像5.jpeg" class="mr-3 avatar-lg rounded" alt="..." />
                                <!-- <img src="@assets/images/users/avatar-7.jpg" class="mr-3 avatar-lg rounded"
                alt="officeShield" /> -->
                                <div class="media-body">
                                    <h5 class="mt-1 mb-0">bob</h5>
                                    <h6 class="font-weight-normal mt-1 mb-1">
                                        <a href>1352456234@qq.com</a>
                                    </h6>
                                    <p class="text-muted">拍照泄密 | 个人泄密 | 中等泄密</p>
                                </div>
                            </div>
                            <div class="row mt-2 border-top pt-2">
                                <div class="col">
                                    <div class="media">
                                        <span class="icon-dual align-self-center mr-2">
                                            <feather type="users"></feather>
                                        </span>
                                        <div class="media-body">
                                            <h5 class="mt-2 pt-1 mb-0 font-size-16">7人</h5>
                                            <h6 class="font-weight-normal mt-0">涉及人员</h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="media">
                                        <span class="icon-dual align-self-center mr-2">
                                            <feather type="eye"></feather>
                                        </span>
                                        <div class="media-body">
                                            <h5 class="mt-2 pt-1 mb-0 font-size-16">严重</h5>
                                            <h6 class="font-weight-normal mt-0">影响范围</h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="media">
                                        <span class="icon-dual align-self-center mr-2">
                                            <feather type="file-text"></feather>
                                        </span>
                                        <div class="media-body">
                                            <h5 class="mt-2 pt-1 mb-0 font-size-16">2023.07.24</h5>
                                            <h6 class="font-weight-normal mt-0">发生时间</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row mt-3 text-center">
                                <div class="col">
                                    <button type="button" class="btn btn-primary btn-sm btn-block mr-1"
                                        @click="confirmJump(2)">查看事件</button>
                                </div>
                                <!-- <div class="col">
                <button type="button" class="btn btn-white btn-sm btn-block"></button>
            </div> -->
                            </div>
                        </div>
                    </div>

                </div>
                <!-- <div class="col-4">

                    <div class="card">
                        <div class="card-body p-3">
                            <div class="media">
                                <img src="@assets/images/small/头像6.jpeg" class="mr-3 avatar-lg rounded" alt="..." />
                                <div class="media-body">
                                    <h5 class="mt-1 mb-0">kerwin</h5>
                                    <h6 class="font-weight-normal mt-1 mb-1">
                                        <a href>219919119@qq.com</a>
                                    </h6>
                                    <p class="text-muted">拍照泄密 | 个人泄密 | 危险泄密</p>
                                </div>
                            </div>
                            <div class="row mt-2 border-top pt-2">
                                <div class="col">
                                    <div class="media">
                                        <span class="icon-dual align-self-center mr-2">
                                            <feather type="users"></feather>
                                        </span>
                                        <div class="media-body">
                                            <h5 class="mt-2 pt-1 mb-0 font-size-16">4人</h5>
                                            <h6 class="font-weight-normal mt-0">涉及人员</h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="media">
                                        <span class="icon-dual align-self-center mr-2">
                                            <feather type="eye"></feather>
                                        </span>
                                        <div class="media-body">
                                            <h5 class="mt-2 pt-1 mb-0 font-size-16">较低</h5>
                                            <h6 class="font-weight-normal mt-0">影响范围</h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="media">
                                        <span class="icon-dual align-self-center mr-2">
                                            <feather type="file-text"></feather>
                                        </span>
                                        <div class="media-body">
                                            <h5 class="mt-2 pt-1 mb-0 font-size-16">刚刚</h5>
                                            <h6 class="font-weight-normal mt-0">发生时间</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row mt-3 text-center">
                                <div class="col">
                                    <button type="button" class="btn btn-primary btn-sm btn-block mr-1">查看事件</button>
                                </div>
                      
                            </div>
                        </div>
                    </div>

                </div> -->


            </div>



        </div>


    </Layout>
</template>
