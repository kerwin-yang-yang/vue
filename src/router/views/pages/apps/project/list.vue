<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import Multiselect from 'vue-multiselect'
import { projectData } from './data-list'
import { authComputed, TaskComputed, TasksMethods } from '@/src/state/helpers'
import axios from 'axios'

export default {
	page: {
		title: 'Projects List',
		meta: [{ name: 'description', content: appConfig.description }],
	},
	components: { Layout, Multiselect },
	data() {
		return {
			projectData: '',
			users: null,
			documents: null,

			value1: null,
			value2: null,
			notes: null,
			nowtime: null,
			datetime: null,

			show: false,
			dateTimePicker: {
				enableTime: true,
				dateFormat: 'Y-m-d H:i:00',
			},

		}
	},
	computed: {
		...authComputed,
		...TaskComputed,
	},
	created() {

	},
	async mounted() {
		if (this.Tasks != '') {
			this.$set(this, 'projectData', this.Tasks)
		}
		else {
			await this.getTasks({ username: this.currentUser.username })
			this.$set(this, 'projectData', this.Tasks)
		}

	},
	methods: {
		...TasksMethods,
		formDate() {
			const nowtime = new Date();

			// 格式化日期（年-月-日）
			const formatDate = `${nowtime.getFullYear()}-${(nowtime.getMonth() + 1).toString().padStart(2, '0')}-${nowtime.getDate().toString().padStart(2, '0')}`;

			// 格式化时间（时:分:秒）
			const formatTime = `${nowtime.getHours().toString().padStart(2, '0')}:${nowtime.getMinutes().toString().padStart(2, '0')}:${nowtime.getSeconds().toString().padStart(2, '0')}`;

			return (`${formatDate} ${formatTime}`);
		},
		confirmJump(id) {
			// 在路由跳转前弹出提示框，询问用户是否确认跳转

			// 用户点击了“确定”按钮，继续执行路由跳转

			this.$router.push({ name: '任务详情', query: { task_id: id } });

		},
		async createProject() {

			if (this.users == null && this.document == null) {
				await axios.get('/api/user').then(response => {

					this.users = response.data.map(item => ({
						username: item.username,
						user_role_name: item.user_role_name,
						icon: item.icon,
						id: item.id,
						// label:`<img class='avatar' src='${item.icon}'> ${item.username}`

					}));


				})
				await axios.get('/api/document/').then(response => {


					this.documents = response.data.map(item => ({
						access_level_name: item.access_level_name,
						title: item.title,
						update_time: item.update_time,
						id: item.id,

					}));


				})
			}
			this.show = true
			this.nowtime = this.formDate()



		},
		pullTask() {
			// 提交数据到后端

			axios.post('/api/documentTask/createTask', { 'document': this.value2, 'users': this.value1, 'createUser': this.currentUser.id, 'create_time': this.nowtime, 'deadline_time': this.datetime, 'notes': this.notes })
				.then(response => {
					console.log(response.data)
					this.show = false
					this.makeToast('创建任务成功！！')
				})
				.catch(error => {
					console.log(error)
				})
		},
		makeToast(variant = null) {
			this.$bvToast.toast(variant, {
				title: ` ${variant || 'default'}`,
				variant: "success",
				toaster: 'b-toaster-top-center',
				solid: true
			})
		},
	},
	beforeDestroy() {
		console.log(this.value1)
		console.log(this.value2)
	}
}
</script>

<template>
	<Layout>

		<div class="row page-title align-items-center">
			<div class="col-md-3 col-xl-6">
				<h4 class="mb-1 mt-0">文档项目</h4>
			</div>
			<div class="col-md-9 col-xl-6 text-md-right">
				<div class="mt-4 mt-md-0">
					<button type="button" class="btn btn-danger mr-4 mb-3 mb-sm-0" @click="createProject">
						<i class="uil-plus mr-1"></i> 创建新文档项目
					</button>
					<b-modal size="lg" v-model="show" centered hide-footer title="文档任务设置"
						title-class="font-18 align-items-center" no-close-on-backdrop>
						<div class="row">
							<div class="col-xl-6 col-lg-6">
								<div class="form-group">
									<label for="default">授权用户：</label>
									<multiselect v-model="value1" :options="users" :multiple="true" :close-on-select="false"
										:clear-on-select="false" label="username" track-by="username" :optionHeight="5"
										:show-labels="false" :maxHeight="300" class="border-top">
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
								<div class="form-group">
									<label for="default">选择文档：</label>
									<multiselect v-model="value2" :options="documents" label="title">
										<template slot="option" slot-scope="props">
											<div class="option__desc">
												<span class="option__title title small" style="width:50px">{{
													props.option.title
												}}</span>

												<span class="option__small"> -------><strong>{{
													props.option.access_level_name
												}}</strong> </span>

											</div>
										</template>
									</multiselect>
								</div>


								<div class="form-group">
									<label for="default">开始日期：</label>
									<input v-model="nowtime" v-mask="'####-##-## ##:##:##'" :config="dateTimePicker"
										type="text" class="form-control" />
									<!-- <span class="font-13 text-muted">格式: "DD-MM-YYYY HH:MM:SS"</span> -->
								</div>
								<div class="form-group">
									<label for="default">截止日期：</label>
									<!-- <input v-model="datetime" v-mask="'####-##-## ##:##:##'" type="text"
																			class="form-control" /> -->
									<flat-pickr v-model="datetime" :config="dateTimePicker" v-mask="'####-##-## ##:##:##'"
										class="form-control" placeholder="Date and Time"></flat-pickr>
									<!-- <span class="font-13 text-muted">格式: "DD-MM-YYYY HH:MM:SS"</span> -->
								</div>
								<div class="form-group">
									<label for="default">关于项目：</label>
									<b-form-textarea id="example-textarea" v-model="notes" size="sm"
										rows="4"></b-form-textarea>
								</div>
							</div>
							<div class=" col-xl-6 col-lg-6">

								<div class="text-center align-items-center" style="top:500px">
									<!-- <h4 class="text-danger mt-4">{{ value2.title }} </h4> -->
									<i class="uil-no-entry text-danger display-3"></i>
									<h4 class="text-danger mt-4">目标文档是否对应文档 </h4>
									<h4 class="w-75 mx-auto text-danger">检查所有需授权人员是否在内</h4>

									<div class="mt-4">
										<a class="btn btn-outline-dark btn-rounded width-md" href="javascript: void(0);"
											@click="pullTask">
											创建文档任务
										</a>
									</div>
								</div>

							</div>
						</div>

					</b-modal>

					<div class="btn-group mb-3 mb-sm-0">
						<button type="button" class="btn btn-primary">All</button>
					</div>
					<div class="btn-group ml-1">
						<button type="button" class="btn btn-white">正在执行</button>
						<button type="button" class="btn btn-white">已经完成</button>
					</div>
					<div class="btn-group ml-2 d-none d-sm-inline-block">
						<button type="button" class="btn btn-primary btn-sm">
							<i class="uil uil-apps"></i>
						</button>
					</div>
					<div class="btn-group d-none d-sm-inline-block">
						<button type="button" class="btn btn-white btn-sm">
							<i class="uil uil-align-left-justify"></i>
						</button>
					</div>
				</div>
			</div>
		</div>

		<div class="row">
			<div v-for="project in projectData" :key="project.id" class="col-xl-4 col-lg-6"
				@click="confirmJump(project.id)">
				<div class="card" style="height: 90%;">
					<div class="card-body" style="height: 80%;">
						<div class="badge badge-success float-right"
							:class="{ 'badge-warning': `${project.status}` === 'Pending' }">{{ project.status }}</div>
						<span v-for="tag, index in project.type" style="margin-right: 5px;"
							class="text-success text-uppercase font-size-12 mb-2" :class="{
								' text-warning':
									`${index % 3}` == 0,
								' text-success':
									`${index % 3}` == 1,
								' text-danger':
									`${index % 3}` == 2,
							}">{{ tag.name }}</span>
						<div style="height:66px">
							<h5 cl>
								<a href="javascript: void(0)" class="text-dark">{{
									project.title
								}}</a>
							</h5>
						</div>

						<div style="height:66px" class="small">
							<p class="text-muted mb-4">{{ project.text }}</p>
							<!-- <p class="text-muted mb-4">{{ project.notes }}</p> -->
						</div>
						<div style="">
							<a href="javascript: void(0);" v-for="(user, index) in project.users"
								:id="`user-tooltip-${project.title}-${index}`">
								<img :src="`${user.icon}`" alt class="avatar-sm m-1 rounded-circle" />
								<b-tooltip :target="`user-tooltip-${project.title}-${index}`" triggers="hover"
									placement="top">{{ user.username }} {{ user.user_role_name }}</b-tooltip>
							</a>
						</div>
					</div>
					<div class="card-body border-top">
						<div class="row align-items-center">
							<div class="col-sm-auto">
								<ul class="list-inline mb-0">
									<li class="list-inline-item pr-2">
										<a :id="`date-tooltip-${project.id}`" href="javascript: void(0)"
											class="text-muted d-inline-block">
											<b-tooltip :target="`date-tooltip-${project.id}`" triggers="hover"
												placement="top">截止日期</b-tooltip>
											<i class="uil uil-calender mr-1"></i>
											{{ project.deadline_time.substr(0, 11) }}
										</a>
									</li>
									<li class="list-inline-item pr-2">
										<a :id="`task-tooltip-${project.id}`" href="javascript: void(0)"
											class="text-muted d-inline-block">
											<b-tooltip :target="`task-tooltip-${project.id}`" triggers="hover"
												placement="top">记录</b-tooltip>
											<i class="uil uil-bars mr-1"></i>
											{{ project.bars }}
										</a>
									</li>
									<li class="list-inline-item">
										<a :id="`comment-tooltip-${project.id}`" href="javascript: void(0)"
											class="text-muted d-inline-block">
											<b-tooltip :target="`comment-tooltip-${project.id}`" triggers="hover"
												placement="top">意见</b-tooltip>
											<i class="uil uil-comments-alt mr-1"></i>
											{{ project.comment }}
										</a>
									</li>
								</ul>
							</div>
							<div class="col offset-sm-1">
								<b-progress :value="project.progress" :variant="project.color" height="5px"
									class="m-0"></b-progress>
							</div>
						</div>
					</div>
				</div>
				<!-- end card -->
			</div>
		</div>
		<div class="row mb-3 mt-2">
			<div class="col-12">
				<div class="text-center">
					<a href="javascript:void(0);" class="btn btn-white">
						<feather type="loader" class="icon-dual icon-xs mr-2 align-middle"></feather>Load more
					</a>
				</div>
			</div>
			<!-- end col-->
		</div>
		<!-- end row -->
	</Layout>
</template>
<style scoped>
/* 自定义选项的样式 */
.multiselect__content-wrapper .multiselect__option {
	background-color: #f5f5f5;
}

/* 自定义已选择的选项的样式 */
.multiselect__tags .multiselect__tag {
	background-color: #337ab7;
}

.multiselect__option {
	min-height: 10px;
}
</style>
