<script>
import Layout from '@layouts/default'
import { authMethods } from '@state/helpers'
import appConfig from '@src/app.config'

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
	methods: {
		...authMethods,
		// Try to register the user in with the email, fullname
		// and password they provided.
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
					<div class="col-xl-10">
						<div class="card">
							<div class="card-body p-0">
								<div class="row">
									<div class="col-lg-6 p-5">
										<div class="mx-auto mb-5">
											<a href="/">
												<img src="@assets/images/logo.png" alt height="24" />
												<h3 class="d-inline align-middle ml-1 text-logo">officeShield</h3>
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
														placeholder="Your full name" required />
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
														placeholder="hello@coderthemes.com" />
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
													<input id="email" v-model="phone"  class="form-control"
														placeholder="phoneNumber" />
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
													<input id="repassword" v-model="message" type="password"
														class="form-control" placeholder="System access code" />
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
										<div class="auth-page-sidebar">
											<div class="overlay"></div>
											<div class="auth-user-testimonial">
												<p class="font-size-24 font-weight-bold text-white mb-1">I officeShield


												</p>
												<p class="lead">基于抗屏摄文档暗水印和分级异常行为检测技术的涉密文件协同远程办公系统</p>
												<p>~</p>
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
									Already have account?
									<router-link tag="a" to="/login" class="text-primary font-weight-bold ml-1">Log
										In</router-link>
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

<style lang="scss" module></style>
