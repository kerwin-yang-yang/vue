<script>
import Layout from '@layouts/default'
import { authMethods, userInfoMethods, TasksMethods } from '@state/helpers'
import appConfig from '@src/app.config'
import axios from 'axios'
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
					this.getDocuments({ username: this.username })
					this.getCalendars({ username: this.username })
					this.getNotifications({ username: this.username })

					this.tryingToLogIn = false
					this.isAuthError = false
					// Redirect to the originally requested page, or to the home page
					this.$router.push(
						{ name: '日志管理' }
					)
				})
				.catch((error) => {
					this.tryingToLogIn = false
					this.authError = error.response ? error.response.data.message : ''
					this.isAuthError = true
				})
		},
	},
}
</script>

<template>
	<Layout>
		<!-- end row -->
		<div class="account-pages my-5">
			<div class="container">
				<div class="row justify-content-center">
					<div class="col-xl-10">
						<div class="card">
							<div class="card-body p-0">
								<div class="row">
									<div class="col-md-6 p-5">
										<div class="mx-auto mb-5">
											<a routerLink="/">
												<img src="@src/state/login1 (2).png" alt height="30" />
												<h3 class="d-inline align-middle ml-1 text-logo">officeShield</h3>
											</a>
										</div>

										<h6 class="h5 mb-0 mt-4">欢迎回来</h6>
										<p class="text-muted mt-1 mb-4">
											填入账号信息，获取绑定的隐藏手机验证执行登录
										</p>

										<b-alert v-model="isAuthError" variant="danger" dismissible>{{ authError
										}}</b-alert>

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
														placeholder="Enter your password"></b-form-input>
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
										<div class="auth-page-sidebar">
											<div class="overlay"></div>
											<div class="auth-user-testimonial">
												<p class="font-size-24 font-weight-bold text-white mb-1">officeShield
												</p>
												<p class="lead">基于抗屏摄文档暗水印和分级异常行为检测技术的涉密文件协同远程办公系统</p>
												<p> ~</p>
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

<style lang="scss" module></style>
