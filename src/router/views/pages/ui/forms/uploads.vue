<script>
import vue2Dropzone from 'vue2-dropzone'

import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
export default {
	page: {
		title: '文档上传',
		meta: [{ name: 'description', content: appConfig.description }],
	},
	components: { Layout, PageHeader, vueDropzone: vue2Dropzone },
	data() {
		return {
			title: '文档上传',
			items: [
				{
					text: 'Shreyu',
					href: '/',
				},
				{
					text: 'Management',
					href: '/',
				},
				{
					text: 'Document Upload',
					active: true,
				},
			],
			dropzoneOptions: {
				url: 'http://127.0.0.1:5001/api/document/uploadDocument',
				thumbnailWidth: 150,
				maxFilesize: 30,
				headers: { content: 'header value' },
			},
			// 其中包含上传文件的相关配置，如上传地址、缩略图宽度、最大文件大小等
		}
	},
}
</script>

<template>
	<Layout>
		<PageHeader :title="title" :items="items" />
		<div class="row">
			<div class="col-12">
				<div class="card">
					<div class="card-body">
						<h4 class="vue-editor mt-0 mb-1">上传文档并指定机密等级</h4>
						<p class="text-muted font-13 m-b-30"
							>Upload documents and specify confidentiality level</p
						>
						<!-- file upload -->
						<vue-dropzone
							id="dropzone"
							ref="myVueDropzone"
							:options="dropzoneOptions"
							:use-custom-slot="true"
						>
							<div class="text-center">
								<i class="h1 text-muted uil-cloud-upload"></i>
								<h3>上传完整文档</h3>
								<span class="text-muted font-size-13">
									(文档将会被加密传输并进行jpeg保存)
								</span>
							</div>
						</vue-dropzone>
					</div>
				</div>
			</div>
		</div>
	</Layout>
</template>
