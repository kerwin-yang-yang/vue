<script>
import Layout from '@layouts/default'
import { authMethods } from '@state/helpers'
import appConfig from '@src/app.config'
import * as THREE from 'three'
import WAVES from 'vanta/src/vanta.waves'
/**
 * Register component
 */
export default {
	page: {
		title: 'Register',
		meta: [{ name: 'description', content: `Register to ${appConfig.title}` }],
	},
	components: { Layout },
	data() {
		return {
			username: '',
			email: '',
			password: '',
			repassword: '',
			regError: null,
			tryingToRegister: false,
			isRegisterError: false,
		}
	},
	computed: {},
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
	methods: {
		...authMethods,
		// Try to register the user in with the email, fullname
		// and password they provided.
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
		tryToRegisterIn() {
			this.tryingToRegister = true
			// Reset the regError if it existed.
			this.regError = null
			return this.register({
				username: this.username,
				email: this.email,
				password: this.password,
				repassword: this.repassword
			})
				.then((token) => {
					this.tryingToRegister = false
					this.isRegisterError = false
					// Redirect to the originally requested page, or to the confirm-account page
					this.$router.push(
						this.$route.query.redirectFrom || { name: 'confirm-account' }
					)
				})
				.catch((error) => {
					this.tryingToRegister = false
					this.regError = error.response ? error.response.data.message : ''
					this.isRegisterError = true
				})
		},
	},
}
</script>

<template>
	<Layout>
		<div class="account-pages my-5">
			<div class="container">
				<div class="row justify-content-center">
					<div class="col-xl-12">
						<div class="card">
							<div class="card-body p-0">
								<div class="row">
									<div class="col-lg-6 p-5 align-self-center">
										<div class="mx-auto mb-5">
											<a href="/">
												<img src="@src/state/logo3.jpg" alt height="50" />
												<img src="@src/state/name.png" alt height="30" />
											</a>
										</div>

										<h6 class="h5 mb-0 mt-4">创建你的账号</h6>
										<p class="text-muted mt-0 mb-4">开始使用 officeShield
										</p>

										<form class="authentication-form" @submit.prevent="tryToRegisterIn">
											<div class="form-group">
												<label class="form-control-label">姓名</label>
												<div class="input-group input-group-merge">
													<div class="input-group-prepend">
														<span class="input-group-text">
															<feather type="user" class="icon-dual"></feather>
														</span>
													</div>
													<input id="name" v-model="username" type="text" class="form-control"
														placeholder="Enter full name" required />
												</div>
											</div>

											<div class="form-group">
												<label class="form-control-label">邮箱地址</label>
												<div class="input-group input-group-merge">
													<div class="input-group-prepend">
														<span class="input-group-text">
															<feather type="mail" class="icon-dual"></feather>
														</span>
													</div>
													<input id="email" v-model="email" type="email" class="form-control"
														placeholder="Enter email address" />
												</div>
											</div>
											<div class="form-group">
												<label class="form-control-label">绑定手机</label>
												<div class="input-group input-group-merge">
													<div class="input-group-prepend">
														<span class="input-group-text">
															<feather type="phone" class="icon-dual"></feather>
														</span>
													</div>
													<input id="email" v-model="phone" class="form-control"
														placeholder="Enter phoneNumber" />
												</div>
											</div>
											<div class="form-group">
												<label class="form-control-label">密码</label>
												<div class="input-group input-group-merge">
													<div class="input-group-prepend">
														<span class="input-group-text">
															<feather type="lock" class="icon-dual"></feather>
														</span>
													</div>
													<input id="password" v-model="password" type="password"
														class="form-control" placeholder="Enter your password" />
												</div>
											</div>
											<div class="form-group">
												<label class="form-control-label">验证密码</label>
												<div class="input-group input-group-merge">
													<div class="input-group-prepend">
														<span class="input-group-text">
															<feather type="user-check" class="icon-dual"></feather>
														</span>
													</div>
													<input id="repassword" v-model="repassword" type="password"
														class="form-control" placeholder="Rewrite your password" />
												</div>
											</div>
											<div class="form-group">
												<label class="form-control-label">系统接入编码</label>
												<div class="input-group input-group-merge">
													<div class="input-group-prepend">
														<span class="input-group-text">
															<feather type="alert-circle" class="icon-dual"></feather>
														</span>
													</div>
													<input id="repassword" v-model="message" class="form-control"
														placeholder="System access code" />
												</div>
											</div>

											<div class="form-group mb-4">
												<div class="custom-control custom-checkbox">
													<input id="checkbox-signup" type="checkbox" class="custom-control-input"
														checked />
													<label class="custom-control-label" for="checkbox-signup">
														我同意
														<a href="javascript: void(0);">系统使用规范协议</a>
													</label>
												</div>
											</div>

											<div class="form-group mb-0 text-center">
												<button class="btn btn-primary btn-block" type="submit">注册</button>
											</div>
										</form>
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

						<div class="row mt-3">
							<div class="col-12 text-center">
								<p class="text-muted">
									已经有了账户？
									<router-link tag="a" to="/login"
										class="text-primary font-weight-bold ml-1">前往登录</router-link>
								</p>
							</div>
							<!-- end col -->
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

<style >
.my_title {
	z-index: 999;
	position: relative;

	top: 35%;
	/* left: 4%;
	right: 4%; */
	color: aquamarine;
	font-size: 15px;
	font-weight: bolder;
}
</style>
