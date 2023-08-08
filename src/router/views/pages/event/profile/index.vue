<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import stepsProgress from 'vue2-steps-progress'
import UserCard from './user-card'
import Activities from './activities'
import Messages from './messages'
import Projects from './projects'
import Tasks from './tasks'
import Files from './files'
import { activities, messageData, projectData, tasks } from './data-profile'

/**
 * Profile component
 */
export default {
	page: {
		title: '事件详情',
		meta: [{ name: 'description', content: appConfig.description }],
	},
	// props: {
	// 	user: {
	// 		type: Object,
	// 		required: false,
	// 		default: () => ({}),
	// 	},
	// },
	components: {
		Layout,
		stepsProgress,
		PageHeader,
		UserCard,
		Activities,
		Messages,
		Projects,
		Tasks,
		Files,
	},
	data() {
		return {
			currentProgress: 10,
			// user: this.$store ? this.$store.state.auth.currentUser : {} || {},
			activities: activities,
			messageData: messageData,
			projectData: projectData,
			tasks: tasks,
			title: '事件详情',
			items: [
				{
					text: 'officeShield',
					href: '/',
				},
				{
					text: 'Pages',
					href: '/',
				},
				{
					text: 'eventDetail',
					active: true,
				},
			],
			thing: "[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1,0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0,1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]",
			user: {
				icon: '@assets/images/small/头像6.jpeg',
				username: 'kerwin',
				email: '219919119@qq.com',
				phone: '13658429051',
				address: '中国',
			}
		}
	},
	methods: {
		// confirmJump(id) {
		// 	// 在路由跳转前弹出提示框，询问用户是否确认跳转

		// 	// 用户点击了“确定”按钮，继续执行路由跳转

		// 	this.$router.push({ name: '事件详情', query: { task_id: id } });

		// },
	}
}
</script>

<template>
	<Layout>
		<PageHeader :title="title" :items="items" />
		<div class="row">
			<div class="col-lg-3">
				<UserCard :user="user" />
			</div>

			<div class="col-lg-9">
				<div class="card">
					<div class="card-body">
						<h6 class="card-title border-bottom p-3 mb-0 header-title">事件处理</h6>

						<div class="row bg-light p-3">
							<div class="col-lg-6 col-xl-3">
								<b-card no-body img-top style="height:350px;">
									<b-card-body>
										<b-card-title>
											<h5 class="card-title font-size-16">获取水印信息</h5>
										</b-card-title>
										<b-card-text class="title">{{ thing.substr(0, 80) }}...]
										</b-card-text>
									</b-card-body>
									<ul class="list-group list-group-flush">
										<li class="list-group-item">水印信息：0434</li>
										<li class="list-group-item">对应人员：kerwin
										</li>
										<li class="list-group-item">对应访问记录：编号34
										</li>

									</ul>
									<ul class="list-group list-group-flush">
										<li class="list-group-item text-center">已处理</li>
									</ul>
									<!-- <div class="text-center">
										<b-spinner type="grow" variant="success"></b-spinner>
										<b-spinner type="grow" variant="success" class="ml-3"></b-spinner>
										<b-spinner type="grow" variant="success" class="ml-3"></b-spinner>
										<b-spinner type="grow" variant="danger" class="ml-3"></b-spinner>
										<b-spinner type="grow" variant="warning" class="ml-3"></b-spinner>
										<b-spinner type="grow" variant="info" class="ml-3"></b-spinner>
									</div> -->
								</b-card>
							</div>

							<div class="col-lg-6 col-xl-3">
								<b-card no-body img-top style="height:350px">
									<!-- :img-src="require('@assets/images/small/img-2.jpg')" img-alt="Card image" -->
									<b-card-body>
										<b-card-title>
											<h5 class="card-title font-size-16">通知相关人员</h5>
										</b-card-title>
										<b-card-text><strong>对应文件：</strong>《 XXX有限公司2022 年度财务报表》</b-card-text>
										<b-card-text> <strong>通知文件负责人：</strong>bob</b-card-text>
									</b-card-body>
									<ul class="list-group list-group-flush">
										<li class="list-group-item text-center">正在处理</li>
									</ul>
									<div class="text-center">
										<b-spinner type="grow" variant="success"></b-spinner>
										<b-spinner type="grow" variant="success" class="ml-3"></b-spinner>
										<b-spinner type="grow" variant="success" class="ml-3"></b-spinner>
										<!-- <b-spinner type="grow" variant="danger" class="ml-3"></b-spinner>
										<b-spinner type="grow" variant="warning" class="ml-3"></b-spinner>
										<b-spinner type="grow" variant="info" class="ml-3"></b-spinner> -->
									</div>
									<!-- <div class="card-body">
										<a href="javascript:void(0);" class="card-link text-custom">Card link</a>
										<a href="javascript:void(0);" class="card-link text-custom">Another link</a>
									</div> -->
								</b-card>
							</div>
							<div class="col-lg-6 col-xl-3">
								<b-card no-body img-top style="height:350px">
									<!-- :img-src="require('@assets/images/small/img-2.jpg')" img-alt="Card image" -->
									<b-card-body>
										<b-card-title>
											<h5 class="card-title font-size-16">控制泄密人员</h5>
										</b-card-title>
										<b-card-text>对泄密人员进行控制防止进一步泄密，追究泄密人员责任</b-card-text>
									</b-card-body>
									<ul class="list-group list-group-flush">
										<li class="list-group-item text-center">待处理</li>
									</ul>
									<!-- <div class="card-body">
										<a href="javascript:void(0);" class="card-link text-custom">Card link</a>
										<a href="javascript:void(0);" class="card-link text-custom">Another link</a>
									</div> -->
								</b-card>
							</div>
							<div class="col-lg-6 col-xl-3">
								<b-card no-body style="height:350px" img-top>
									<!-- :img-src="require('@assets/images/small/img-2.jpg')" img-alt="Card image" -->
									<b-card-body>
										<b-card-title>
											<h5 class="card-title font-size-16">处理泄密影响</h5>
										</b-card-title>
										<b-card-text>分析泄密影响范围，全面的调查，确定机密信息的泄露范围、类型以及可能受到影响的人员或部门，进行详细的安全评估，审查现有安全控制和流程，并加强安全控制，以避免类似事件再次发生</b-card-text>
									</b-card-body>
									<ul class="list-group list-group-flush">
										<li class="list-group-item text-center">待处理</li>
									</ul>
									<!-- <div class="card-body">
										<a href="javascript:void(0);" class="card-link text-custom">Card link</a>
										<a href="javascript:void(0);" class="card-link text-custom">Another link</a>
									</div> -->
								</b-card>
							</div>

							<!-- <div class="col-xl-6">
								<div class="card">
									<div class="row no-gutters align-items-center">
										<div class="col-md-5">
											<img src="@assets/images/small/img-6.jpg" class="card-img" alt="..." />
										</div>
										<div class="col-md-7">
											<div class="card-body">
												<h5 class="card-title font-size-16">Card title</h5>
												<p class="card-text text-muted">This is a wider card with supporting text
													lead-in to
													additional content.</p>
												<p class="card-text">
													<small class="text-muted">Last updated 3 mins ago</small>
												</p>
											</div>
										</div>
									</div>
								</div>
								<div class="card">
									<div class="row no-gutters align-items-center">
										<div class="col-md-7">
											<div class="card-body">
												<h5 class="card-title font-size-16">Card title</h5>
												<p class="card-text text-muted">This is a wider card with supporting text
													lead-in to
													additional content.</p>
												<p class="card-text">
													<small class="text-muted">Last updated 3 mins ago</small>
												</p>
											</div>
										</div>
										<div class="col-md-5">
											<img src="@assets/images/small/img-4.jpg" class="card-img" alt="..." />
										</div>
									</div>
								</div>
							</div> -->
						</div>
						<h4 class="mb-3 font-size-15">处理进程</h4>
						<b-progress :value="50" :max="100" class="mb-3" variant="success" height="15px"
							animated></b-progress>
						<!-- <b-progress :value="100" :max="100" class="mb-3" variant="danger" animated></b-progress>
						<b-progress :value="75" :max="100" class="mb-3" variant="warning" animated></b-progress> -->
						<div class="text-center">


							<button type="button" class="btn btn-primary btn-sm mr-1"
								style="margin-top: 20px;">修改事件处理状态</button>
							<!-- <button type="button" class="btn btn-white btn-sm ml-1">内容修改</button> -->
						</div>
					</div>
				</div>
				<div class="card">
					<div class="card-body">
						<b-tabs class="navtab-bg" pills justified>
							<b-tab title="行为时间线" active>
								<Activities :activities="activities" />
							</b-tab>
							<!-- <b-tab title="其他人员交流信息">
								<Messages :messages="messageData" />
							</b-tab> -->
							<b-tab title="曾参与的文档项目">
								<Projects :projects="projectData" />
							</b-tab>
							<!-- <b-tab title="Tasks">
								<Tasks :tasks="tasks" />
							</b-tab> -->
							<b-tab title="相关文件">
								<Files />
							</b-tab>
						</b-tabs>
					</div>
				</div>
			</div>
		</div>
	</Layout>
</template>

<style scoped>
.demo {
	width: 1000px;
	height: 50px;
	margin: 100px auto;
}

.slot-currentProgress {
	position: relative;
	background-color: rgb(1, 152, 121);
	width: 2em;
	border-radius: 50%;
	line-height: 2;
	color: white;
}

.slot-currentProgress::before {
	content: '';
	position: absolute;
	bottom: -.2em;
	left: 50%;
	width: 1em;
	height: 1em;
	background-color: inherit;
	z-index: -1;
	transform: translateX(-50%) rotate(-45deg);
}

.text {
	position: absolute;
	font-size: 0.16rem;
	top: 120%;
	left: 50%;
	transform: translateX(-50%);
	white-space: nowrap;
}
</style>
