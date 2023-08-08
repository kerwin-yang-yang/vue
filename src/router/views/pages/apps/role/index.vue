<script>
import { VueEditor } from 'vue2-editor'

import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import axios from 'axios'
export default {
    page: {
        title: '泄密事件列表',
        meta: [{ name: 'description', content: appConfig.description }],
    },
    components: { Layout, PageHeader, VueEditor },
    data() {
        return {
            title: '账号角色管理',
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
            users: null,
        }
    },
    async mounted() {
        if (this.users == null) {
            await axios.get('/api/user').then(response => {
                // 筛选管理员和任务发布者
                const admins = [];
                const publishers = [];
                const people = []
                response.data.forEach(item => {
                    if (item.user_role_name === '管理人员') {
                        admins.push(item);
                    } else if (item.user_role_name === '任务发布者') {
                        publishers.push(item);
                    } else {
                        people.push(item)
                    }
                });

                // 按照特定字段（例如 username）进行排序
                admins.sort((a, b) => a.username.localeCompare(b.username));
                publishers.sort((a, b) => a.username.localeCompare(b.username));
                people.sort((a, b) => a.username.localeCompare(b.username));

                // 合并排序后的数组
                this.users = admins.concat(publishers).concat(people).map(item => ({
                    username: item.username,
                    user_role_name: item.user_role_name,
                    icon: item.icon,
                    id: item.id,
                    online: item.online,
                    age: item.age
                }));
            });
        }
    }
}
</script>

<template>
    <Layout>
        <PageHeader :title="title" :items="items" />
        <div>
            <div class="row">
                <div class="col-lg-12">
                    <div class="card">
                        <div class="card-body">
                            <div class=" float-right button-list">

                                <b-button variant="primary" style="margin-left: 20px;">添加系统成员</b-button>
                                <b-button variant="warning" style="margin-left: 20px;">检测运行状态</b-button>
                                <!-- <a href="javascript: void(0);" class="btn btn-primary btn-sm ">
                                    <i class="uil uil-export ml-1"></i> 导出
                                </a> -->
                            </div>

                            <h4 class="header-title mt-0 mb-1">人员角色管理</h4>
                            <!-- <p class="sub-header"></p> -->

                            <div class="table-responsive">
                                <table class="table mb-0">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>姓名</th>
                                            <th>角色</th>
                                            <th>授权码</th>
                                            <th>运行状态</th>
                                            <th>安全指标</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <!-- <tr class="table-active">
                                            <th scope="row">1</th>
                                            <td>Column content</td>
                                            <td>Column content</td>
                                            <td>Column content</td>
                                            <td>Column content</td>
                                            <td>Column content</td>
                                            <td>
                                                <div class="button-list">
                                                    <b-button variant="primary">修改信息</b-button>
                                                    <b-button variant="secondary">运行状态切换</b-button>
                                                    <b-button variant="success">查看登录记录</b-button>
                                                    <b-button variant="danger">删除改用户</b-button>
                                                    <b-button variant="outline-warning">Warning</b-button>
                                                    <b-button variant="outline-info">Info</b-button>
                                                    <b-button variant="outline-dark">Dark</b-button>
                                                </div>
                                            </td>
                                        </tr> -->

                                        <tr v-for="user in users" style="justify-items: center;"
                                            :class="{ 'table-success': user.user_role_name == '任务发布者', 'table-danger': user.user_role_name == '管理人员' }">
                                            <th scope="row"><img :src="user.icon"
                                                    class="option__image avatar-sm m-1 rounded-circle" alt=""></th>
                                            <td>{{ user.username }}</td>
                                            <td>{{ user.user_role_name }}</td>
                                            <td style="text-shadow: 2px 2px 2px #b97575;font-weight: bold;color:rgb(56, 46, 125)">
                                                llll
                                            </td>
                                            <td
                                                :class="{ 'text-success': user.online == 1, 'text-danger': user.online == 0 }">
                                                <strong>{{ user.online == 1 ?
                                                    '在线' : '离线' }}</strong>
                                                <b-spinner type="grow" v-if="user.online == 1" variant="success"
                                                    class="ml-3"></b-spinner>
                                                <b-spinner type="grow" v-if="user.online == 0" variant="danger"
                                                    class="ml-3"></b-spinner>
                                            </td>
                                            <td>{{ user.age }} <b-progress :value="user.age" :max="100"
                                                    v-if="user.age >= 90" class="mb-3" variant="success"
                                                    animated></b-progress>
                                                <b-progress :value="user.age" :max="100" class="mb-3" variant="warning"
                                                    v-if="user.age < 90" animated></b-progress>
                                            </td>
                                            <td>

                                                <b-dropdown variant="success" right class=" text-center ml-1">
                                                    <template slot="button-content">
                                                        用户管理
                                                        <i class="uil uil-angle-down"></i>
                                                    </template>
                                                    <b-dropdown-item href="#"><b-button variant="primary"
                                                            style="width:100%">修改信息</b-button></b-dropdown-item>
                                                    <b-dropdown-item href="#"><b-button variant="secondary"
                                                            style="width:100%">状态切换</b-button></b-dropdown-item>
                                                    <b-dropdown-item href="#" style="width:100%"> <b-button
                                                            variant="success"
                                                            style="width:100%">查看记录</b-button></b-dropdown-item>
                                                    <b-dropdown-item href="#"> <b-button style="width:100%"
                                                            variant="danger">删除用户</b-button></b-dropdown-item>

                                                </b-dropdown>
                                            </td>
                                        </tr>

                                        <!-- <tr class="table-info">
                                            <th scope="row">3</th>
                                            <td>Column content</td>
                                            <td>Column content</td>
                                            <td>Column content</td>
                                        </tr>

                                        <tr class="table-warning">
                                            <th scope="row">4</th>
                                            <td>Column content</td>
                                            <td>Column content</td>
                                            <td>Column content</td>
                                        </tr>

                                        <tr class="table-danger">
                                            <th scope="row">5</th>
                                            <td>Column content</td>
                                            <td>Column content</td>
                                            <td>Column content</td>
                                        </tr> -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>



        </div>


    </Layout>
</template>
