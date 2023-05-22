<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import axios from 'axios'
import StatChart from '@components/widget-stat-chart'
import Overview from '@components/overview'
import Member from '@components/member'
import Task from '@components/task'
import Chat from '@components/chat'

import {
	revenueAreaChart,
	targetsBarChart,
	salesDonutChart,
	ordersData,
} from './data'

/**
 * Dashboard-1 Component
 */
export default {
	page: {
		title: '数据统计',
		meta: [{ name: 'description', content: appConfig.description }],
	},
	components: {
		VuePerfectScrollbar,
		Layout,
		StatChart,
		Overview,
		Member,
		Task,
		Chat,
	},
	data() {
		return {
			revenueAreaChart: revenueAreaChart,
			targetsBarChart: targetsBarChart,
			salesDonutChart: salesDonutChart,
			ordersData: null,
			series: [
				{
					name: '文档记录数',
					data: null,
				},
			],
			maxHeight: '328px',
			overviewData: null,
			membersData: [
				{
					image: require('@assets/images/users/avatar-7.jpg'),
					text: 'Senior Sales Guy',
					name: 'officeShield N',
				},
				{
					image: require('@assets/images/users/avatar-9.jpg'),
					text: 'Social Media Campaign',
					name: 'Greeva Y',
				},
				{
					image: require('@assets/images/users/avatar-4.jpg'),
					text: 'Inventory Manager',
					name: 'Nik G',
				},
				{
					image: require('@assets/images/users/avatar-1.jpg'),
					text: 'Sales Persons',
					name: 'Hardik G',
				},
				{
					image: require('@assets/images/users/avatar-2.jpg'),
					text: 'Sales Persons',
					name: 'Stive K',
				},
			],
			tasksData: null,
			statChart: null,
			chatMessages: [
				{
					id: 1,
					image: require('@assets/images/users/avatar-9.jpg'),
					name: 'Greeva',
					message: 'Hello!',
					time: '10:00',
				},
				{
					id: 2,
					image: require('@assets/images/users/avatar-7.jpg'),
					name: 'officeShield',
					message: 'Hi, How are you? What about our next meeting?',
					time: '10:01',
				},
				{
					id: 3,
					image: require('@assets/images/users/avatar-9.jpg'),
					name: 'Greeva',
					message: 'Yeah everything is fine',
					time: '10:01',
				},
				{
					id: 4,
					image: require('@assets/images/users/avatar-7.jpg'),
					name: 'officeShield',
					message: 'Awesome! let me know if we can talk in 20 min',
					time: '10:02',
				},
			],
			dateConfig: {
				mode: 'range',
			},
			selectedDate: [new Date().setDate(new Date().getDate() - 7), new Date()],
		}
	},
	async created() {
		await axios.get('/api/management/dashboard').then(response => {
			const data = response.data
			this.overviewData = data.overdata[0]
			this.statChart = data.statChart[0]
			this.salesDonutChart.series = data.salesDonutChartdata
			this.ordersData = data.ordersData

			this.series[0].data = data.record_day
			// .map(item => {
			// 	const date = new Date(item[0]) // 将时间字符串转成 Date 对象
			// 	return [date, item[1]]
			// })
			this.targetsBarChart.series[0].data = data.high_record_day
			this.targetsBarChart.series[1].data = data.medium_record_day

			this.targetsBarChart.series[2].data = data.low_record_day
			console.log(data.danger_record)
			this.tasksData = data.ideas
		})
	}
}
</script>

<template>
	<Layout>
		<div v-if="series[0].data">
			<div class="row page-title align-items-center">
				<div class="col-sm-4 col-xl-6">
					<h4 class="mb-1 mt-0">数据统计</h4>
				</div>
				<div class="col-sm-8 col-xl-6">
					<form class="form-inline float-sm-right mt-3 mt-sm-0">
						<div class="form-group mb-sm-0 mr-2">
							<flat-pickr v-model="selectedDate" class="form-control" :config="dateConfig"
								name="date"></flat-pickr>
						</div>
						<div class="btn-group">
							<b-dropdown variant="primary" right>
								<template v-slot:button-content>
									<i class="uil uil-file-alt mr-1"></i>导出
									<i class="icon">
										<feather type="chevron-down" class="align-middle"></feather>
									</i>
								</template>
								<b-dropdown-item href="#" class="notify-item">
									<feather type="mail" class="icon-dual icon-xs mr-2 align-middle"></feather>
									<span>Email</span>
								</b-dropdown-item>
								<b-dropdown-item href="#" class="notify-item">
									<feather type="printer" class="icon-dual icon-xs mr-2 align-middle"></feather>
									<span>Print</span>
								</b-dropdown-item>
								<b-dropdown-divider></b-dropdown-divider>
								<b-dropdown-item href="#" class="notify-item">
									<feather type="file" class="icon-dual icon-xs mr-2 align-middle"></feather>
									<span>Re-Generate</span>
								</b-dropdown-item>
							</b-dropdown>
						</div>
					</form>
				</div>
			</div>

			<div class="row">
				<div v-for="stat of statChart" :key="stat.mainTitle" class="col-md-6 col-xl-3">
					<StatChart :main-title="stat.mainTitle" :value="stat.value" :sub-value="stat.subValue"
						:chart-color="stat.chartColor" />
				</div>
			</div>

			<div class="row">


				<div class="col-xl-6">
					<div class="card">
						<div class="card-body pb-0">
							<ul class="nav card-nav float-right">
								<li class="nav-item">
									<a class="nav-link text-muted" href="javascript: void(0);">Today</a>
								</li>
								<li class="nav-item">
									<a class="nav-link text-muted" href="javascript: void(0);">7d</a>
								</li>
								<li class="nav-item">
									<a class="nav-link active" href="javascript: void(0);">15d</a>
								</li>
								<li class="nav-item">
									<a class="nav-link text-muted" href="javascript: void(0);">1m</a>
								</li>
								<li class="nav-item">
									<a class="nav-link text-muted" href="javascript: void(0);">1y</a>
								</li>
							</ul>
							<h5 class="card-title mb-0 header-title " v-if="series[0].data">每日文档记录</h5>
							<!-- Revenue Area Chart -->
							<apexchart v-if="series[0].data" type="area" height="350" :series="this.series"
								:options="revenueAreaChart.chartOptions"></apexchart>
							<!-- end revenue chart -->
						</div>
					</div>
				</div>
				<div class="col-xl-6">
					<div class="card">
						<div class="card-body pb-0">
							<h5 class="card-title header-title">每日多级风险汇总</h5>
							<!-- Target Radialbar chart -->
							<div class="mt-3">
								<apexchart type="bar" height="335" :series="targetsBarChart.series"
									:options="targetsBarChart.chartOptions"></apexchart>
							</div>
							<!-- end target chart -->
						</div>
					</div>
				</div>

				<div class="col-xl-3">
					<div class="card">
						<!-- <div class="card-body pb-0">
							<h5 class="card-title header-title">Targets</h5>
					
							<div class="mt-3">
								<apexchart type="bar" height="335" :series="targetsBarChart.series"
									:options="targetsBarChart.chartOptions"></apexchart>
							</div>
						
						</div> -->
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-xl-5">
					<div class="card">
						<div class="card-body">
							<h5 class="card-title mt-0 pb-2 header-title">全部记录汇总</h5>
							<!-- Sales donut chart -->
							<apexchart type="donut" height="304" :series="salesDonutChart.series"
								:options="salesDonutChart.chartOptions"></apexchart>
							<!-- end sales chart -->
						</div>
					</div>
				</div>
				<div class="col-xl-7">
					<div class="card">
						<div class="card-body" style="height:360px">
							<a href="javascript: void(0);" class="btn btn-primary btn-sm float-right">
								<i class="uil uil-export ml-1"></i> 导出
							</a>
							<h5 class="card-title mt-0 mb-0 header-title">文档任务</h5>
							<div class="table-responsive mt-4 mb-0" style="height:270px; overflow-y: scroll">
								<b-table-simple class="table table-hover table-nowrap mb-0">
									<b-thead class="thead-white">
										<b-tr>
											<b-th>#任务编号</b-th>
											<b-th>文档</b-th>
											<b-th>创建人</b-th>
											<b-th>结束时间</b-th>
											<b-th>完成状态</b-th>
										</b-tr>
									</b-thead>
									<b-tbody>
										<b-tr v-for="order in ordersData" :key="order.name" v-if="ordersData">
											<b-td>{{ order.id }}</b-td>
											<b-td class="ellipsis">{{ order.document.substr(0, 40) }}</b-td>
											<b-td>{{ order.createUser }}</b-td>
											<b-td>{{ order.deadline_time.substr(0, 11) }}</b-td>
											<b-td>
												<span class="badge" :class="{
													'badge-soft-warning': `${order.status}` === 'Pending',
													'badge-soft-success':
														`${order.status}` === 'Completed',
													'badge-soft-danger': `${order.status}` === 'Declined',
												}">{{ order.status }}</span>
											</b-td>
										</b-tr>
									</b-tbody>
								</b-table-simple>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-xl-4">
					<div class="card">
						<div class="card-body pt-2 pb-2">
							<h5 class="mb-4 header-title">高风险异常行为通知</h5>
							<div v-for="member of membersData" :key="member.name" style="max-height: 390px;">
								<Member :image="member.image" :name="member.name" :text="member.text" />
							</div>
						</div>
					</div>
				</div>

				<div class="col-xl-4">
					<div class="card">
						<div class="card-body pt-2 pb-3">
							<!-- <router-link to="/task/list" class="btn btn-primary btn-sm mt-2 float-right">View
								All</router-link> -->
							<h5 class="mb-4 header-title">已采纳的意见</h5>

							<VuePerfectScrollbar style="height: 385px;">
								<div>
									<div v-for="task in tasksData" :key="task.id">
										<Task :id="task.id" :text="task.user_name" :title="task.description" />
									</div>
								</div>
							</VuePerfectScrollbar>
						</div>
					</div>
				</div>

				<div class="col-xl-4">
					<div class="card">
						<div class="card-body pt-2 pb-3">
							<h5 class="mb-4 header-title">统计</h5>
							<Overview :items="overviewData" style="height: 360px;" />
						</div>
					</div>



				</div>
			</div>
			<!-- <div class="row">

				<div class="col-xl-3">
					<Chat :chat-window-height="maxHeight" :messages="chatMessages" title="Recent Conversation" />
				</div>
			</div> -->
		</div>
	</Layout>
</template>
<style scoped>
.ellipsis {
	width: 100px;
	/* 设置宽度 */
	height: 20px;
	/* 设置高度 */
	overflow: hidden;
	/* 溢出隐藏 */
	white-space: nowrap;
	/* 防止换行 */
	text-overflow: ellipsis;
	/* 省略号显示 */
}
</style>