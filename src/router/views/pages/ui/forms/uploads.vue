<script>
import vue2Dropzone from 'vue2-dropzone'
import axios from 'axios'
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import Multiselect from 'vue-multiselect'
import { authComputed, TaskComputed, TasksMethods } from '@/src/state/helpers'
export default {
	page: {
		title: '文档上传',
		meta: [{ name: 'description', content: appConfig.description }],
	},
	components: { Layout, PageHeader, vueDropzone: vue2Dropzone, Multiselect },
	data() {
		return {
			title: '文档上传',
			isopen: false,
			value: null,
			users: null,
			upsuccess: {
				title: null,
				type: null,
				message: null,

			},
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
					text: 'Document Upload',
					active: true,
				},
			],
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
			if (response.status == 'success') {
				this.upsuccess.title = '文件上传成功'
				this.upsuccess.type = response.type
				this.upsuccess.message = response.upload
			}

			// await this.getTasksDetail({ id: 1 })
			// this.task = this.DetailTask
			// console.log(this.task, this.currentUser)
			this.isopen = true;

		},
		async loadUsers() {
			if (this.users == null) {
				await axios.get('/api/user').then(response => {

					// this.users = response.data.map(item => {
					// 	if (item.user_role_name == '任务发布者') {
					// 		username: item.username,
					// 			user_role_name: item.user_role_name,
					// 				icon: item.icon,
					// 					id: item.id,
					// 	// label:`<img class='avatar' src='${item.icon}'> ${item.username}`
					// }


					// });
					this.users = response.data.filter(item => item.user_role_name == '任务发布者' || item.user_role_name == '管理人员')
						.map(item => ({
							username: item.username,
							user_role_name: item.user_role_name,
							icon: item.icon
						}));
					console.log(this.users)
				})

			}
		}
	},
	computed: {
		...authComputed,
		...TaskComputed,
		fileSizeInMB() {
			// return this.upsuccess.message.total / (1024 * 1024).toFixed(2);
			const fileSizeInMB = this.upsuccess.message.total / (1000 * 1000);
			return fileSizeInMB.toFixed(1);
		}

	},
	mounted() {
		this.loadUsers()

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
						<label for="default">授权任务发布人员：</label>
						<multiselect v-if="this.users" v-model="value" :options="users" :multiple="true"
							:close-on-select="false" :clear-on-select="false" label="username" track-by="username"
							:optionHeight="5" :show-labels="false" :maxHeight="220" class="border-top">
							<template slot="singleLabel" slot-scope="props"><img
									class="option__image avatar-sm m-1 rounded-circle" :src="props.option.icon"
									alt="No Man’s Sky"><span class="option__desc"><span class="option__title">{{
										props.option.user_role_name }}</span></span></template>
							<template slot="option" slot-scope="props"><img
									class="option__image avatar-sm m-1 rounded-circle" :src="props.option.icon"
									alt="No Man’s Sky">
								<div class="option__desc">
									<span class="option__title">{{ props.option.username
									}}</span>

									<span class="option__small float-right small strong">角色: {{
										props.option.user_role_name
									}}</span>

								</div>
							</template>
						</multiselect>
					</div>
				</div>
			</div>
			<!-- <div class="col-6">
				<div class="card">
					<div class="card-body">
					</div>
				</div>
			</div> -->
		</div>
		</div>

		<div class="row">
			<div class="col-12">
				<div class="card">
					<div class="card-body">
						<h4 class="vue-editor mt-0 mb-1">上传文档并指定机密等级</h4>
						<p class="text-muted font-13 m-b-30">Upload documents and specify confidentiality level</p>
						<!-- file upload -->
						<vue-dropzone id="dropzone" ref="myVueDropzone" :options="dropzoneOptions" :use-custom-slot="true"
							@vdropzone-success="handleFileUploadSuccess" @vdropzone-success-multiple="false">
							<div class="text-center">
								<i class="h1 text-muted uil-cloud-upload"></i>
								<h3>上传完整文档</h3>
								<span class="text-muted font-size-13">
									(文档将会被加密传输并进行jpeg保存)
								</span>
							</div>
						</vue-dropzone>
					</div>
				</div>
			</div>
		</div>
		<div class="row" v-show="isopen" v-if="upsuccess.message">
			<div class="col-12">
				<div class="card">
					<div class="row no-gutters align-items-center">
						<!-- <div class="col-md-2">
							<img src="@assets/images/small/头像6.jpeg" class="card-img"
								style="width:150px;height:150px;margin-left:20px ;" alt="..." />
						</div> -->
						<div class="col-md-6">
							<div class="card-body" style="border:1px solid;margin-right: 20px;">
								<h3 class="card-title  header-title " style="margin-bottom: 20px;">{{ upsuccess.title }}
								</h3>
								<h5 class="card-title font-size-16"> 文件格式：{{ upsuccess.type }}</h5>
								<h5 class="card-title font-size-16"> 文件名称：{{ upsuccess.message.filename }}</h5>
								<h5 class="card-title font-size-16"> 文件UUID：{{ upsuccess.message.uuid }}</h5>
								<h5 class="card-title font-size-16"> 文件大小：{{ fileSizeInMB }} MB</h5>
								<!-- <p class="card-text">
                                    Last updated 3 mins ago
                                </p> -->
							</div>
						</div>
						<div class="col-md-6">
							<div class="card-body" style="border:1px solid;margin-right: 20px;">
								<h3 class="card-title  header-title " style="margin-bottom: 20px;">上传加密后信息</h3>
								<h5 class="card-title font-size-16"> - 文档发布人：{{ currentUser.username }}</h5>
								<h5 class="card-title font-size-16"> - 加密用时：5.6秒</h5>
								<h5 class="card-title font-size-16">- 共加密图片：4张 </h5>
								<h5 class="card-title font-size-16">- 可授权文档任务发布人数：4人</h5>
								<!-- <p class="card-text">
                                    Last updated 3 mins ago
                                </p> -->
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- <div class="col-12">
				<div class="card">
					<div class="row no-gutters align-items-center">

						<div class="col-xl-6 col-lg-3">

							<div class="card-body"
								style="border:1px dashed; margin-right: 20px;margin-left: 20px;height: 700px;overflow:scroll;">
								<div v-for="(image, index) in images"><b-img-lazy :id="'tooltip-button-' + (index + 1)"
										:src="image.url" v-bind="mainProps" alt="Image 2"></b-img-lazy>

								</div>

							</div>
						</div>
						<div class="col-xl-6 col-lg-3">

							<div class="card-body"
								style="border:1px dashed;margin-right: 20px;height: 700px;overflow:scroll;">
								<Demo :task="task" :createUser="this.currentUser" v-if="task" />
							</div>

						</div>
					</div>
				</div>
			</div> -->
		</div>
	</Layout>
</template>
