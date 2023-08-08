<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import listPlugin from '@fullcalendar/list'
import { required } from 'vuelidate/lib/validators'
// import axios from 'axios'
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import { userInfoComputed, authComputed, userInfoMethods } from '@state/helpers'

import { calendarEvents, categories } from './data-calendar'

export default {
	page: {
		title: '日志管理',
		meta: [{ name: 'description', content: appConfig.description }],
	},
	components: { FullCalendar, Layout, PageHeader },
	data() {
		return {
			title: '日志管理',
			items: [
				{
					text: 'officeShield',
					href: '/',
				},
				{
					text: 'Apps',
					href: '/',
				},
				{
					text: 'Calendar',
					active: true,
				},
			],
			calendarWeekends: true,
			calendarPlugins: [
				dayGridPlugin,
				timeGridPlugin,
				interactionPlugin,
				bootstrapPlugin,
				listPlugin,
			],
			themeSystem: 'bootstrap',
			calendarEvents: '',
			createModal: false,
			showmodal: false,
			eventModal: false,
			categories: categories,
			submitted: false,
			submit: false,
			newEventData: {},
			edit: {},
			deleteId: {},
			event: {
				title: '',
				category: '',
				start: '',
				end: ''
			},
			editevent: {
				editTitle: '',
			},
			dateTimePicker: {
				enableTime: true,
				// dateFormat: 'd-m-Y H:i',
			},
			// remainingTime: ''
		}
	},
	created() {
		// console.log(this.Calendar)
		this.calendarEvents = this.Calendar
		console.log(this.calendarEvents)
	},
	computed: {
		...userInfoComputed,
		...authComputed,
		remainingTime(start, end) {
			const startDate = new Date(start);
			const endDate = new Date(end);

			const currentTime = new Date();
			let remainingMilliseconds = endDate.getTime() - currentTime.getTime();

			// 如果当前时间已经超过了截止时间，剩余时间为0
			if (remainingMilliseconds < 0) {
				remainingMilliseconds = 0;
			}

			// 计算剩余的小时数、分钟数和秒数
			const hours = Math.floor(remainingMilliseconds / (1000 * 60 * 60));
			const minutes = Math.floor((remainingMilliseconds / (1000 * 60)) % 60);
			const seconds = Math.floor((remainingMilliseconds / 1000) % 60);

			// 构建剩余时间字符串
			return `${hours}小时 ${minutes}分钟 ${seconds}秒`;
		}
	},
	validations: {
		event: {
			title: { required },
			category: { required },
		},
	},
	methods: {
		/**
		 * Modal form submit
		 */
		...userInfoMethods,
		async handleSubmit(e) {
			this.submitted = true

			// stop here if form is invalid
			this.$v.$touch()
			if (this.$v.$invalid) {
				return
			} else {
				const title = this.event.title
				const category = this.event.category
				const start = this.event.start
				const end = this.event.end
				const username = this.currentUser.username
				// 发送到服务端进行存储操作
				// await axios.post('/api/addEvents', { title, category, start, end,username  })

				this.calendarEvents = this.calendarEvents.concat({
					id: this.calendarEvents.length + 1,
					title,
					start: start,
					end: end,
					classNames: [category],
				})
				console.log(title)
				this.createCalendarsEvent({ id: this.calendarEvents.length, title: title, category: category, start: start, end: end, username: username })


				this.showmodal = false
				this.newEventData = {}
			}
			this.submitted = false
			this.event = {}
		},
		/**
		 * Hide modal along with form reset
		 */
		hideModal(e) {
			this.submitted = false
			this.showmodal = false
			this.event = {}
		},
		/**
		 * Edit event modal submit
		 */
		editSubmit(e) {
			this.submit = true
			const editTitle = this.editevent.editTitle
			this.edit.setProp('title', editTitle)
			this.eventModal = false
			this.updateCalendarsEvent({ id: this.edit.id, title: this.edit.title, category: this.edit.category, start: this.edit.start, end: this.edit.end })
		},

		/**
		 * Delete event
		 */
		deleteEvent() {
			var deleteId = this.edit.id
			this.calendarEvents = this.calendarEvents.filter(
				(x) => '' + x.id !== '' + deleteId
			)
			this.eventModal = false
			this.deleteCalendarsEvent({ id: this.edit.id })
		},
		/**
		 * Modal open for add event
		 */
		dateClicked(info) {
			this.newEventData = info
			this.showmodal = true
		},
		/**
		 * Modal open for edit event
		 */
		editEvent(info) {
			console.log(info)
			this.edit = info.end ? info : info.event
			this.editevent.editTitle = this.edit.title
			this.eventModal = true
		},
		/**
		 * Closes the modal
		 */
		closeModal() {
			this.eventModal = false
		},
		calculateRemainingTime(start, end) {
			const startDate = new Date(start);
			const endDate = new Date(end);
			const currentTime = new Date();
			const timeDiff = endDate.getTime() - currentTime.getTime();

			// 计算剩余时间的天、小时、分钟和秒
			const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
			const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

			return `${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`;
		},

	},
}
</script>

<template>
	<Layout>
		<PageHeader :title="title" :items="items" />
		<div class="row">
			<div class="col-5">
				<div class="card">
					<div class="card-body">
						<div class="row align-items-center text-center">
							<div class="col-xl-12 col-lg-12 col-12 ">
								<img src="@assets/images/cal.png" class="mr-4 align-self-center img-fluid" alt="cal" />
							</div>
							<div class="col-xl-10 col-lg-9 ">
								<div class="mt-4 mt-lg-0">
									<h5 class="mt-0 mb-1 font-weight-bold text-center">欢迎来到你的日历</h5>
									<!-- <p class="text-muted mb-2">
										日历显示了从你所有链接的日历中同步的事件
										日历。点击事件来查看或编辑细节。您可以
										可以通过点击 "创建新事件 "来创建新事件
										按钮或下面日历中的任何单元格来创建新事件。
									</p> -->
									<!-- 
									<button id="btn-new-event" class="btn btn-primary mt-2 mr-1 " style='margin-left: 30px;'
										@click="showmodal = true">
										<i class="uil-plus-circle "></i> 创建新的日志
									</button> -->
									<!-- <button class="btn btn-white mt-2">
										<i class="uil-sync"></i> Link Calendars
									</button> -->
								</div>
							</div>
						</div>
					</div>

				</div>
				<div class="card">
					<div class="card-body">
						<a href="javascript: void(0);" class="btn btn-primary btn-sm float-right">
							<i class="uil uil-export ml-1"></i> 导出
						</a>
						<h5 class="card-title mt-0 mb-0 header-title">代办事项</h5>
						<div class="table-responsive mt-4 mb-0" style="width:100%">
							<b-table-simple class="table table-hover table-nowrap mb-0">
								<b-thead class="thead-white">
									<b-tr>
										<!-- <b-th>#编号</b-th> -->
										<b-th>详情</b-th>
										<!-- <b-th>开始</b-th>
										<b-th>结束</b-th> -->
										<b-th>剩余时间</b-th>
									</b-tr>
								</b-thead>
								<b-tbody>
									<b-tr v-for="order in calendarEvents" :key="order.id" v-if="calendarEvents"
										@click="editEvent(order)">
										<!-- <b-td>{{ order.id }}</b-td> -->
										<b-td class="ellipsis">{{ order.title.substr(0, 22) }}....</b-td>
										<!-- <b-td>{{ order.start }}</b-td>
										<b-td>{{ order.end }}</b-td> -->
										<!-- .substr(0, 11) -->
										<b-td>
											<!-- <span class="badge" :class="{
												'badge-soft-warning': `${order.status}` === 'Pending',
												'badge-soft-success':
													`${order.status}` === 'Completed',
												'badge-soft-danger': `${order.status}` === 'Declined',
											}">{{ order.status }}</span> 
										-->{{ calculateRemainingTime(order.start, order.end) }}
										</b-td>
									</b-tr>
								</b-tbody>
							</b-table-simple>
						</div>
					</div>
					<!-- <div class="card-body">
						<h5 class="card-title header-title">代办事件</h5>
						<p v-for="item in  calendarEvents ">
							{{ item }}
						</p>

					</div> -->
				</div>



			</div>
			<div class="col-7">
				<div class="card">
					<div class="card-body">
						<div class="app-calendar">
							<FullCalendar ref="fullCalendar" default-view="dayGridMonth" :header="{
								left: 'prev,next today',
								center: 'title',
								right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
							}" :button-text="{
	today: '今天',
	month: '月',
	week: '周',
	day: '天',
	list: '列表',
	prev: '上月',
	next: '下月',
}" :bootstrap-font-awesome="false" :editable="true" :droppable="true" :plugins="calendarPlugins"
								:events="calendarEvents" :weekends="calendarWeekends" :theme-system="themeSystem"
								@dateClick="dateClicked" @eventClick="editEvent" />
						</div>
					</div>
				</div>
			</div>

		</div>


		<!-- <div class="row">
			<div class="col-12">
				<div class="card">
					<div class="card-body">
						<div class="app-calendar">
							<FullCalendar ref="fullCalendar" default-view="dayGridMonth" :header="{
								left: 'prev,next today',
								center: 'title',
								right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
							}" :button-text="{
	today: 'Today',
	month: 'Month',
	week: 'Week',
	day: 'Day',
	list: 'List',
	prev: 'Prev',
	next: 'Next',
}" :bootstrap-font-awesome="false" :editable="true" :droppable="true" :plugins="calendarPlugins"
								:events="calendarEvents" :weekends="calendarWeekends" :theme-system="themeSystem"
								@dateClick="dateClicked" @eventClick="editEvent" />
						</div>
					</div>
				</div>
			</div>
		</div> -->

		<b-modal v-model="showmodal" title="添加待办" title-class="text-black font-18" hide-footer>
			<form @submit.prevent="handleSubmit">
				<div class="row">
					<div class="col-12">
						<div class="form-group">
							<label for="name">待办内容</label>
							<input id="name" v-model="event.title" type="text" class="form-control" placeholder="待办详情"
								:class="{ 'is-invalid': submitted && $v.event.title.$error }" />
							<div v-if="submitted && !$v.event.title.required" class="invalid-feedback">This value is
								required.</div>
						</div>
					</div>
					<div class="col-12">
						<div class="form-group">
							<label for="name">开始时间</label>
							<flat-pickr v-model="event.start" :config="dateTimePicker" class="form-control"
								placeholder="选择时间"></flat-pickr>
							<div v-if="submitted && !$v.event.start.required" class="invalid-feedback">This value is
								required.</div>
						</div>
					</div>
					<div class="col-12">
						<div class="form-group">
							<label for="name">结束时间</label>
							<flat-pickr v-model="event.end" :config="dateTimePicker" class="form-control"
								placeholder="选择时间"></flat-pickr>
							<div v-if="submitted && !$v.event.end.required && event.end < event.start"
								class="invalid-feedback">This value is wrong.</div>
						</div>
					</div>
					<div class="col-12">
						<div class="form-group">
							<label class="control-label">类别</label>
							<select v-model="event.category" class="form-control" name="category"
								:class="{ 'is-invalid': submitted && $v.event.category.errors }">
								<option v-for="option in categories" :key="option.backgroundColor"
									:value="`${option.value}`">{{ option.name }}</option>
							</select>
							<div v-if="submitted && !$v.event.category.required" class="invalid-feedback">This value is
								required.</div>
						</div>
					</div>

				</div>

				<div class="text-right">
					<button type="submit" class="btn btn-success">Save</button>
					<b-button class="ml-1" variant="light" @click="hideModal">Close</b-button>
				</div>
			</form>
		</b-modal>

		<!-- Edit Modal -->
		<b-modal v-model="eventModal" title="编辑待办" title-class="text-black font-18" hide-footer body-class="p-0">
			<form @submit.prevent="editSubmit">
				<div class="p-3">
					<label>修改内容</label>
					<div class="input-group m-b-15">
						<input v-model="editevent.editTitle" class="form-control" type="text" />
						<span class="input-group-append">
							<button type="submit" class="btn btn-success btn-md">
								<i class="fa fa-check"></i> 保存
							</button>
						</span>
					</div>
				</div>
				<div class="text-right p-3">
					<b-button variant="light" @click="closeModal">关闭</b-button>
					<b-button class="ml-1" variant="danger" @click="deleteEvent">删除</b-button>
				</div>
			</form>
		</b-modal>
	</Layout>
</template>
