<script>
import Layout from '@layouts/default'
import { authMethods } from '@state/helpers'
import appConfig from '@src/app.config'
export default {
  page: {
    title: 'Confirm',
    meta: [
      { name: 'description', content: `Confirm account to ${appConfig.title}` },
    ],
  },
  components: { Layout },
  data() {
    return {}
  },
  computed: {},
  methods: {
    ...authMethods,
  },
}
</script>

<template>
  <Layout>
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6 col-xl-5">
        <div class="card bg-pattern">
          <div class="card-body p-4" style="padding-bottom: 2px;">
            <div class="text-center w-75 m-auto">
              <a href="/"> </a>
            </div>

            <div class="mt-3 text-center">
              <h3>账号注册成功，可以返回登录</h3>

              <router-link tag="a" to="/login"
                class="btn btn-block btn-primary waves-effect waves-light mt-3">立刻登录</router-link>
              <div style="margin-top: 10px;">
                <small>

                  (请检查是否有来自系统的电子邮件,并点击其中包含的链接来重设密码)</small>
              </div>

            </div>
          </div>
          <!-- end card-body -->
        </div>
        <!-- end card -->
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->
  </Layout>
</template>

<style lang="scss" module></style>
