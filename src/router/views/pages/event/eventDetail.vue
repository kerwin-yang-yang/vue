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
            title: '泄密事件详情页',
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
                                        <a href>@officeShield</a>
                                    </h6>
                                    <p class="text-muted">Designer | Creative | Thinker</p>
                                </div>
                            </div>
                            <div class="row mt-2 border-top pt-2">
                                <div class="col">
                                    <div class="media">
                                        <span class="icon-dual align-self-center mr-2">
                                            <feather type="users"></feather>
                                        </span>
                                        <div class="media-body">
                                            <h5 class="mt-2 pt-1 mb-0 font-size-16">1.9M</h5>
                                            <h6 class="font-weight-normal mt-0">Followers</h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="media">
                                        <span class="icon-dual align-self-center mr-2">
                                            <feather type="eye"></feather>
                                        </span>
                                        <div class="media-body">
                                            <h5 class="mt-2 pt-1 mb-0 font-size-16">19M</h5>
                                            <h6 class="font-weight-normal mt-0">Views</h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="media">
                                        <span class="icon-dual align-self-center mr-2">
                                            <feather type="file-text"></feather>
                                        </span>
                                        <div class="media-body">
                                            <h5 class="mt-2 pt-1 mb-0 font-size-16">1k</h5>
                                            <h6 class="font-weight-normal mt-0">Posts</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row mt-3 text-center">
                                <div class="col">
                                    <button type="button" class="btn btn-primary btn-sm btn-block mr-1">Follow</button>
                                </div>
                                <div class="col">
                                    <button type="button" class="btn btn-white btn-sm btn-block">Message</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="col-4">

                    <div class="card">
                        <div class="card-body p-3">
                            <div class="media">
                                <img src="@assets/images/small/头像5.jpeg" class="mr-3 avatar-lg rounded" alt="..." />
                                <div class="media-body">
                                    <h5 class="mt-1 mb-0">officeShield N</h5>
                                    <h6 class="font-weight-normal mt-1 mb-1">
                                        <a href>@officeShield</a>
                                    </h6>
                                    <p class="text-muted">Designer | Creative | Thinker</p>
                                </div>
                            </div>
                            <div class="row mt-2 border-top pt-2">
                                <div class="col">
                                    <div class="media">
                                        <span class="icon-dual align-self-center mr-2">
                                            <feather type="users"></feather>
                                        </span>
                                        <div class="media-body">
                                            <h5 class="mt-2 pt-1 mb-0 font-size-16">1.9M</h5>
                                            <h6 class="font-weight-normal mt-0">Followers</h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="media">
                                        <span class="icon-dual align-self-center mr-2">
                                            <feather type="eye"></feather>
                                        </span>
                                        <div class="media-body">
                                            <h5 class="mt-2 pt-1 mb-0 font-size-16">19M</h5>
                                            <h6 class="font-weight-normal mt-0">Views</h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="media">
                                        <span class="icon-dual align-self-center mr-2">
                                            <feather type="file-text"></feather>
                                        </span>
                                        <div class="media-body">
                                            <h5 class="mt-2 pt-1 mb-0 font-size-16">1k</h5>
                                            <h6 class="font-weight-normal mt-0">Posts</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row mt-3 text-center">
                                <div class="col">
                                    <button type="button" class="btn btn-primary btn-sm btn-block mr-1">Follow</button>
                                </div>
                                <div class="col">
                                    <button type="button" class="btn btn-white btn-sm btn-block">Message</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>



        </div>


    </Layout>
</template>
