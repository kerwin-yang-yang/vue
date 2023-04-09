<script>
import { authComputed } from '@state/helpers'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import {userInfoComputed} from '@state/helpers'

export default {
	components: {
		VuePerfectScrollbar,
	},
	props: {
		user: {
			type: Object,
			required: false,
			default: () => ({}),
		},
		isMenuOpened: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			fullscreen: false,
		}
	},
	computed: {
		...authComputed,
		...userInfoComputed
	},

	methods: {
		formatTime(timestamp) {
			const diff = Date.now() - new Date(timestamp.replace(/-/g,'/')).getTime()
      
      if (diff <= (1000 * 60)) return '刚刚'
      else if (diff <= (1000 * 60 * 60)) return Math.floor(diff / (1000 * 60)) + '分钟前'
      else if (diff <= (1000 * 60 * 60 *24)) return Math.floor(diff / (1000 * 60 * 60)) + '小时前'
      else return Math.floor(diff / (1000 * 60 * 60 *24)) + '天前'
    }
  ,
		toggleMenu() {
			this.$parent.toggleMenu()
		},
		toggleRightSidebar() {
			this.$parent.toggleRightSidebar()
		},
		screen() {
			let element = document.documentElement;
			if (this.fullscreen) {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			} else {
				if (element.requestFullscreen) {
					element.requestFullscreen();
				} else if (element.webkitRequestFullScreen) {
					element.webkitRequestFullScreen();
				} else if (element.mozRequestFullScreen) {
					element.mozRequestFullScreen();
				} else if (element.msRequestFullscreen) {
					// IE11
					element.msRequestFullscreen();
				}
			}
			this.fullscreen = !this.fullscreen;
		},
	},
}
</script>

<template>
	<!-- Topbar Start -->
	<div class="navbar navbar-expand flex-column flex-md-row navbar-custom">
		<div class="container-fluid">
			<!-- LOGO -->
			<a href="/" class="navbar-brand mr-0 mr-md-2 logo">
				<span class="logo-lg">
					<img src="@assets/images/logo.png" alt height="24" />
					<span class="d-inline h5 ml-2 text-logo">Shreyu</span>
				</span>
				<span class="logo-sm">
					<img src="@assets/images/logo.png" alt height="24" />
				</span>
			</a>

			<ul class="navbar-nav bd-navbar-nav flex-row list-unstyled menu-left mb-0">
				<li class>
					<button class="button-menu-mobile open-left disable-btn" :class="{ open: isMenuOpened }"
						@click="toggleMenu">
						<feather type="menu" class="menu-icon align-middle"></feather>
						<feather type="x" class="close-icon"></feather>
					</button>
				</li>
			</ul>

			<ul class="navbar-nav flex-row ml-auto d-flex list-unstyled topnav-menu float-right mb-0">
				<li class="d-none d-sm-block">
				<div class="app-search">
					<form>
						<div class="input-group">
							<input type="text" class="form-control" placeholder="Search..." />
							<feather type="search" class="align-middle"></feather>
						</div>
					</form>
				</div>
			</li>

			<li class="dropdown d-none d-lg-block" id="fullscreen-tooltip">
				<a href="javascript:void(0);" class="nav-link right-bar-toggle toggle-right" @click="screen">
					<b-tooltip target="fullscreen-tooltip" placement="left">Full screen</b-tooltip>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
						stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
						class="feather feather-maximize">
						<path
							d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3">
						</path>
					</svg></a>
			</li>
				<b-nav-item-dropdown id="project-tooltip" right variant="black" class="dropdown d-none d-lg-block" no-caret>
					<template v-slot:button-content>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
							stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
							class="feather feather-grid">
							<rect x="3" y="3" width="7" height="7"></rect>
							<rect x="14" y="3" width="7" height="7"></rect>
							<rect x="14" y="14" width="7" height="7"></rect>
							<rect x="3" y="14" width="7" height="7"></rect>
						</svg>
					</template>
					<b-tooltip target="project-tooltip" placement="left">Project Information</b-tooltip>
					<!-- item-->

					<div class="dropdown-menu dropdown-lg dropdown-menu-end p-0 show" data-popper-placement="bottom-end"
						style="position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate(-276px, 72px);">

						<div class="p-1">
							<div class="row g-0">
								<div class="col">
									<a class="dropdown-icon-item" href="#">
										<img src="@assets/images/brands/slack.png" alt="slack">
										<br/>
										<span>Slack</span>
									</a>
								</div>
								<div class="col">
									<a class="dropdown-icon-item" target="_blank" href="https://github.com/kerwin-yang-yang/vue">
										<img src="@assets/images/brands/github.png"  alt="Github">
										<br/>
										<span>GitHub</span>
									</a>
								</div>
								<div class="col">
									<a class="dropdown-icon-item" href="#">
										<img src="@assets/images/brands/dribbble.png" alt="dribbble">
										<br/>
										<span>Dribbble</span>
									</a>
								</div>
							</div>
						</div>

					</div>

					<!-- <b-dropdown-text href="javascript:void(0);" class="notify-item">
							<img src="@assets/images/brands/slack.png" alt="user-image" class="mr-2" height="12" />
							<span class="align-middle">German</span>
						</b-dropdown-text>

					
						<b-dropdown-text href="javascript:void(0);" class="notify-item">
							<img src="@assets/images/flags/italy.jpg" alt="user-image" class="mr-2" height="12" />
							<span class="align-middle">Italian</span>
						</b-dropdown-text>

					
						<b-dropdown-text href="javascript:void(0);" class="notify-item">
							<img src="@assets/images/flags/spain.jpg" alt="user-image" class="mr-2" height="12" />
							<span class="align-middle">Spanish</span>
						</b-dropdown-text>

					
						<b-dropdown-text href="javascript:void(0);" class="notify-item">
							<img src="@assets/images/flags/russia.jpg" alt="user-image" class="mr-2" height="12" />
							<span class="align-middle">Russian</span>
						</b-dropdown-text> -->
				</b-nav-item-dropdown>

				<b-nav-item-dropdown id="globe-tooltip" right variant="black" class="dropdown d-none d-lg-block" no-caret>
					<template v-slot:button-content>
						<feather type="globe"></feather>
					</template>
					<b-tooltip target="globe-tooltip" placement="left">Change language</b-tooltip>
					<!-- item-->
					<b-dropdown-text href="javascript:void(0);" class="notify-item">
						<img src="@assets/images/flags/germany.jpg" alt="user-image" class="mr-2" height="12" />
						<span class="align-middle">German</span>
					</b-dropdown-text>

					<!-- item-->
					<b-dropdown-text href="javascript:void(0);" class="notify-item">
						<img src="@assets/images/flags/italy.jpg" alt="user-image" class="mr-2" height="12" />
						<span class="align-middle">Italian</span>
					</b-dropdown-text>

					<!-- item-->
					<b-dropdown-text href="javascript:void(0);" class="notify-item">
						<img src="@assets/images/flags/spain.jpg" alt="user-image" class="mr-2" height="12" />
						<span class="align-middle">Spanish</span>
					</b-dropdown-text>

					<!-- item-->
					<b-dropdown-text href="javascript:void(0);" class="notify-item">
						<img src="@assets/images/flags/russia.jpg" alt="user-image" class="mr-2" height="12" />
						<span class="align-middle">Russian</span>
					</b-dropdown-text>
				</b-nav-item-dropdown>

				<b-nav-item-dropdown id="bell-notification" right variant="white" class="notification-list"
					title="8 new unread notifications" menu-class="dropdown-lg"  v-if="Notification">
					<template v-slot:button-content>
						<feather type="bell" class="align-middle"></feather>
						<span class="noti-icon-badge"></span>
					</template>
					<b-tooltip target="bell-notification" placement="left">{{ Notification.length }} new unread notifications</b-tooltip>
					<!-- item-->
					<b-dropdown-text class="noti-title border-bottom pb-2" tag="div">
						<h5 class="m-0 font-size-16">
							<span class="float-right">
								<a href class="text-dark">
									<small>Clear All</small>
								</a> </span>Notification
						</h5>
					</b-dropdown-text>

					<VuePerfectScrollbar v-once class="noti-scroll">
						<!-- item-->
						<b-dropdown-text href="javascript:void(0);" class="notify-item border-bottom"  v-for="notification in Notification" :key="notification.id">
							<div class="notify-icon">
								<!-- <i class="uil uil-user-plus"></i> -->
								<img :src="notification.sender_picture" class="img-fluid rounded-circle" />
							</div>
							<p class="notify-details">
								{{notification.content}}
								<small class="text-muted">{{formatTime(notification.timestamp)}}</small>
							</p>
						</b-dropdown-text>

						
						<!-- <b-dropdown-text href="javascript:void(0);" class="notify-item border-bottom">
							<div class="notify-icon">
								<img src="@assets/images/users/avatar-1.jpg" class="img-fluid rounded-circle" alt />
							</div>
							<p class="notify-details">Karen Robinson</p>
							<p class="text-muted mb-0 user-msg">
								<small>Wow ! this admin looks good and awesome design</small>
							</p>
						</b-dropdown-text>

						
						<b-dropdown-text href="javascript:void(0);" class="notify-item border-bottom">
							<div class="notify-icon">
								<img src="@assets/images/users/avatar-2.jpg" class="img-fluid rounded-circle" alt />
							</div>
							<p class="notify-details">Cristina Pride</p>
							<p class="text-muted mb-0 user-msg">
								<small>Hi, How are you? What about our next meeting</small>
							</p>
						</b-dropdown-text>

						
						<b-dropdown-text href="javascript:void(0);" class="notify-item border-bottom active">
							<div class="notify-icon bg-success">
								<i class="uil uil-comment-message"></i>
							</div>
							<p class="notify-details">
								Jaclyn Brunswick commented on Dashboard
								<small class="text-muted">
									1 min ago
								</small>
							</p>
						</b-dropdown-text>

						
						<b-dropdown-text href="javascript:void(0);" class="notify-item border-bottom">
							<div class="notify-icon bg-danger">
								<i class="uil uil-comment-message"></i>
							</div>
							<p class="notify-details">
								Caleb Flakelar commented on Admin
								<small class="text-muted">
									4 days ago
								</small>
							</p>
						</b-dropdown-text>

						
						<b-dropdown-text href="javascript:void(0);" class="notify-item">
							<div class="notify-icon bg-primary">
								<i class="uil uil-heart"></i>
							</div>
							<p class="notify-details">
								Carlos Crouch liked
								<b>Admin</b>
								<small class="text-muted">13 days ago</small>
							</p>
						</b-dropdown-text> -->
					</VuePerfectScrollbar>
					<!-- All-->
					<b-dropdown-text href="javascript:void(0);"
						class="text-center text-primary notify-item notify-all border-top">
						View all
						<i class="fi-arrow-right"></i>
					</b-dropdown-text>
				</b-nav-item-dropdown>

				<li id="setting-tooltip" class="dropdown notification-list" title="Settings">
					<a href="javascript:void(0);" class="nav-link right-bar-toggle toggle-right"
						@click="toggleRightSidebar">
						<feather type="settings" class="toggle-right"></feather>
					</a>
					<b-tooltip target="setting-tooltip" placement="left">Settings</b-tooltip>
				</li>

				<b-nav-item-dropdown right class="notification-list align-self-center profile-dropdown"
					toggle-class="nav-user mr-0">
					<template v-slot:button-content>
						<div class="media user-profile">
							<img :src="user.icon" alt="user-image"
								class="rounded-circle align-self-center" />
							<div class="media-body text-left">
								<h6 class="pro-user-name ml-2 my-0">
									<span>{{ user.username }}</span>
									<span class="pro-user-desc text-muted d-block mt-1">{{user.user_role_name}}</span>
								</h6>
							</div>
							<feather type="chevron-down" class="ml-2 align-self-center"></feather>
						</div>
					</template>
					<b-dropdown-item href="/pages/profile" class="notify-item p-0">
						<feather type="user" class="icon-dual icon-xs mr-2"></feather>
						<span>My Account</span>
					</b-dropdown-item>

					<b-dropdown-item href="javascript:void(0);" class="notify-item p-0">
						<feather type="settings" class="icon-dual icon-xs mr-2"></feather>
						<span>Settings</span>
					</b-dropdown-item>

					<b-dropdown-item href="javascript:void(0);" class="notify-item p-0">
						<feather type="help-circle" class="icon-dual icon-xs mr-2"></feather>
						<span>Support</span>
					</b-dropdown-item>

					<b-dropdown-item href="pages-lock-screen.html" class="notify-item p-0">
						<feather type="lock" class="icon-dual icon-xs mr-2"></feather>
						<span>Lock Screen</span>
					</b-dropdown-item>

					<b-dropdown-divider></b-dropdown-divider>

					<b-dropdown-item href="/logout" class="notify-item p-0">
						<feather type="log-out" class="icon-dual icon-xs mr-2"></feather>
						<span>Logout</span>
					</b-dropdown-item>
				</b-nav-item-dropdown>
			</ul>
		</div>
	</div>
	<!-- end Topbar -->
</template>

<style lang="scss" >
.noti-scroll {
	height: 220px;
}

.ps>.ps__scrollbar-y-rail {
	width: 8px !important;
	background-color: transparent !important;
}

.ps>.ps__scrollbar-y-rail>.ps__scrollbar-y,
.ps.ps--in-scrolling.ps--y>.ps__scrollbar-y-rail>.ps__scrollbar-y,
.ps>.ps__scrollbar-y-rail:active>.ps__scrollbar-y,
.ps>.ps__scrollbar-y-rail:hover>.ps__scrollbar-y {
	width: 6px !important;
}

.button-menu-mobile {
	outline: none !important;
}


.dropdown-icon-item {

    border-radius: 3px;
    line-height: 34px;
    text-align: center;
    padding: 15px 0 9px;

    border: 1px solid transparent;
    color: #4b4b5a;
	display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.col img {
    width: 24px;
	height: 24px;
}
</style>
