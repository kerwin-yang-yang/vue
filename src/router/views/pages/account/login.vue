<script>
import Layout from '@layouts/default'
import { authMethods, userInfoMethods, TasksMethods } from '@state/helpers'
import appConfig from '@src/app.config'
import axios from 'axios'
import * as THREE from 'three'
import WAVES from 'vanta/src/vanta.waves'
/**
 * Login component
 */
export default {
	page: {
		title: 'Log in',
		meta: [{ name: 'description', content: `Log in to ${appConfig.title}` }],
	},
	components: { Layout },
	data() {
		return {
			username: 'top-admin',
			password: 'admin',
			authError: null,
			tryingToLogIn: false,
			isAuthError: false,
			hhhh: null
		}
	},
	computed: {
		placeholders() {
			return process.env.NODE_ENV === 'production'
				? {}
				: {
					username: 'Use "admin" to log in with the mock API',
					password: 'Use "password" to log in with the mock API',
				}
		},

	},
	methods: {
		...authMethods,
		...userInfoMethods,
		...TasksMethods,
		makeToast(variant = null) {
			this.$bvToast.toast('你的意见我们会在审核后选择性采纳', {
				title: ` ${variant || 'default'}`,
				variant: "success",
				toaster: 'b-toaster-top-center',
				solid: true
			})
		},    
		screen() {
      let element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    },
		// Try to log the user in with the username
		// and password they provided.
		tryToLogIn() {
			this.tryingToLogIn = true
			// Reset the authError if it existed.
			this.authError = null

			return this.logIn({
				username: this.username,
				password: this.password,
			})
				.then((token) => {
					// this.makeToast('')
					this.getDocuments({ username: this.username })
					this.getCalendars({ username: this.username })
					this.getNotifications({ username: this.username })
					this.authError = '登录失败，密码错误'
					this.tryingToLogIn = false
					this.isAuthError = false
					// Redirect to the originally requested page, or to the home page
					this.$router.push(
						{ name: '日志管理' }
					)
				})
				.catch((error) => {
					this.tryingToLogIn = false
					this.authError = '登录失败，密码错误'
					this.isAuthError = true
				})
		},
	},
	mounted() {
		this.screen()
		 this.vantaEffect = WAVES({
			el: this.$refs.vantaRef,
			THREE: THREE
		})
		VANTA.WAVES({
			el: this.$refs.vantaRef,
			mouseControls: true,
			touchControls: true,
			gyroControls: false,
			minHeight: 200.00,
			minWidth: 200.00,
			scale: 1.00,
			scaleMobile: 1.00,
			shininess: 150.00,
			waveHeight: 40.00,
			waveSpeed: 1.35,
			zoom: 0.65,
			color: 0x210062
		})

	},
	beforeDestroy() {
		if (this.vantaEffect) {
			this.vantaEffect.destroy()
		}
	},
}
</script>

<template>
	<Layout>
		<!-- end row -->
		<div class="account-pages my-5">
			<div class="container">

				<div class="row justify-content-center">
					<div class="col-xl-12">
						<div class="card">
							<div class="card-body p-0">
								<div class="row">
									<div class="col-md-6 p-5 align-self-center" style="">
										<div class="mx-auto mb-5">
											<a routerLink="/">
												<img src="@src/state/logo3.jpg" alt height="50" />
												<img src="@src/state/name.png" alt height="30" />
												<!-- <h3 class="d-inline align-middle ml-1 text-logo">officeShield</h3> -->
											</a>
										</div>
										<b-alert v-model="isAuthError" variant="danger" dismissible>{{ authError
										}}</b-alert>
										<h6 class="h5 mb-0 mt-4">欢迎回来</h6>
										<p class="text-muted mt-1 mb-4">
											填入账号信息，获取绑定的隐藏手机验证执行登录
										</p>



										<b-form class="authentication-form" @submit.prevent="tryToLogIn">
											<div class="form-group">
												<label class="form-control-label">账号</label>
												<div class="input-group input-group-merge">

													<div class="input-group-prepend">
														<span class="input-group-text">
															<feather type="mail" class="align-middle icon-dual"></feather>
														</span>
													</div>
													<b-form-input id="input-1" v-model="username" type="text" required
														placeholder="Enter username"></b-form-input>
												</div>
											</div>
											<div class="form-group mt-4">
												<label class="form-control-label">密码</label>
												<router-link to="forget-password"
													class="float-right text-muted text-unline-dashed ml-1">忘记密码</router-link>
												<div class="input-group input-group-merge">
													<div class="input-group-prepend">
														<span class="input-group-text">
															<feather type="lock" class="align-middle icon-dual"></feather>
														</span>
													</div>
													<b-form-input id="password" v-model="password" type="password" required
														placeholder="Enter your password"></b-form-input>
												</div>
											</div>
											<div class="form-group mt-4">
												<label class="form-control-label">手机验证码</label>
												<router-link to="forget-password"
													class="float-right text-muted text-unline-dashed ml-1">发送验证码</router-link>
												<div class="input-group input-group-merge">
													<div class="input-group-prepend">
														<span class="input-group-text">
															<feather type="check-square" class="align-middle icon-dual">
															</feather>
														</span>
													</div>
													<b-form-input id="password" v-model="hhhh" required
														placeholder="Enter your cell phone verification code"></b-form-input>
												</div>
											</div>
											<div class="form-group mb-4">
												<div class="custom-control custom-checkbox">
													<input id="checkbox-signin" type="checkbox" class="custom-control-input"
														checked />
													<label class="custom-control-label" for="checkbox-signin">
														Remember me
													</label>
												</div>
											</div>
											<b-form-group id="button-group" class="mt-4 mb-1">
												<b-button type="submit" variant="primary" class="btn-block">登录</b-button>
											</b-form-group>
										</b-form>
										<!-- <div class="py-3 text-center">
											<span class="font-size-16 font-weight-bold">Or</span>
										</div>
										<div class="row">
											<div class="col-6">
												<a href="javascript: void(0);" class="btn btn-white">
													<i class="uil uil-google icon-google mr-2"></i>With
													Google
												</a>
											</div>
											<div class="col-6 text-right">
												<a href="javascript: void(0);" class="btn btn-white">
													<i class="uil uil-facebook mr-2 icon-fb"></i>With
													Facebook
												</a>
											</div>
										</div> -->
									</div>
									<div class="col-lg-6 d-none d-md-inline-block">

										<!-- <div class="auth-page-sidebar">
											<div class="overlay"></div>
											<div class="auth-user-testimonial">
												<p class="font-size-24 font-weight-bold text-white mb-1">officeShield
												</p>
												<p class="lead">基于抗屏摄文档暗水印和分级异常行为检测技术的涉密文件协同远程办公系统</p>
												<p> ~</p>
											</div>
										</div> -->
										<div>
											<div ref="vantaRef" style="width:100%;height:100vh">
												<div class="my_title">
													<div class="auth-user-testimonial">
														<p class="text-center"><img src="@src/state/logo3.jpg" alt
																height="100" /></p>
														<p class="text-center"><img src="@src/state/name.png" alt
																height="30" /></p>
														<!-- <p
															class="font-size-24 font-weight-bold text-white mb-1 text-center">
															officeShield
														</p> -->
														<p class="font-size-24 font-weight-bold mb-1 text-center">
															面向在线办公的隐私泄露 </p>

														<p class="font-size-24 font-weight-bold mb-1 text-center">
															多维感知与溯源防护系统</p>
													</div>
												</div>
											</div>

										</div>
									</div>
								</div>
							</div>
							<!-- end card-body -->
						</div>
						<!-- end card -->
						<!-- <b-alert v-model="isAuthError" variant="danger" dismissible>{{ authError
										}}</b-alert> -->


						<div class="row mt-3">
							<div class="col-12 text-center">
								<p class="text-muted">
									没有账号？
									<router-link tag="a" to="/register" class="text-primary font-weight-bold ml-1">
										<b>注册账号</b>
									</router-link>
									<!-- <a
	                    routerLink="/account/signup"
	                    class="text-primary font-weight-bold ml-1"
	                  >Sign Up</a> -->
								</p>
							</div>

						</div>
						<!-- end row -->
					</div>
					<!-- end col -->
				</div>
				<!-- end row -->
			</div>
			<!-- end container -->
		</div>
	</Layout>
</template>

<style  >
.my_title {
	z-index: 999;
	position: relative;
	
	top: 35%;
	/* left: 4%;
	right: 4%; */
	color: aquamarine;
	font-size: 15px;
	font-weight: bolder;
}</style>
