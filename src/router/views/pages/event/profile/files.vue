<script>
import invoice from '@src/router/views/pages/secondary/invoice.vue'
export default {
	components: { invoice },
	data() {
		return {
			showmodal: false,
		}
	},
	methods: {
		show() {
			this.showmodal = true;
		}
	}
}
</script>


<template>
	<div>
		<h5 class="mt-3">事件相关文件</h5>

		<div class="card mb-2 shadow-none border">
			<div class="p-1 px-2">
				<div class="row align-items-center">
					<div class="col-auto">
						<img src="@assets/images/projects/project-1.jpg" class="avatar-sm rounded" alt="file-image" />
					</div>
					<div class="col pl-0">
						<a href="javascript:void(0);" class="text-muted font-weight-bold">泄密事件总体报告.jpg</a>
						<p class="mb-0">2.3 MB</p>
					</div>
					<div class="col-auto">
						<!-- Button -->
						<a href="javascript:void(0);" title="Download" class="btn btn-link text-muted btn-lg p-0"
							@click="show">
							<i id="111" class="uil   uil-eye font-size-16"></i>
							<b-tooltip target="111" triggers="hover" placement="bottom">浏览</b-tooltip>
						</a>
						<a href="javascript:void(0);" title="Download" class="btn btn-link text-muted btn-lg p-0">
							<i id="tooltip" class="uil uil-cloud-download font-size-16"></i>
							<b-tooltip target="tooltip" triggers="hover" placement="bottom">下载</b-tooltip>
						</a>
						<a href="javascript:void(0);" title="Delete" class="btn btn-link text-danger btn-lg p-0 ml-1">
							<i id="delete" class="uil uil-multiply font-size-16"></i>
							<b-tooltip target="delete" triggers="hover" placement="bottom">删除</b-tooltip>
						</a>
					</div>
				</div>
			</div>
		</div>
		<div class="card mb-2 shadow-none border">
			<div class="p-1 px-2">
				<div class="row align-items-center">
					<div class="col-auto">
						<img src="@assets/images/projects/project-2.jpg" class="avatar-sm rounded" alt="file-image" />
					</div>
					<div class="col pl-0">
						<a href="javascript:void(0);" class="text-muted font-weight-bold">
							机密文件办公规则.pdf
						</a>
						<p class="mb-0">1.25 MB</p>
					</div>
					<div class="col-auto">
						<!-- Button -->
						<a href="javascript:void(0);" title="Download" class="btn btn-link text-muted btn-lg p-0">
							<i id="tooltip" class="uil   uil-eye font-size-16"></i>
							<b-tooltip target="tooltip" triggers="hover" placement="bottom">浏览</b-tooltip>
						</a>
						<a href="javascript:void(0);" title="Download" class="btn btn-link text-muted btn-lg p-0">
							<i id="tooltip" class="uil uil-cloud-download font-size-16"></i>
							<b-tooltip target="tooltip" triggers="hover" placement="bottom">下载</b-tooltip>
						</a>
						<a href="javascript:void(0);" title="Delete" class="btn btn-link text-danger btn-lg p-0 ml-1">
							<i id="delete" class="uil uil-multiply font-size-16"></i>
							<b-tooltip target="delete" triggers="hover" placement="bottom">删除</b-tooltip>
						</a>
					</div>
				</div>
			</div>
		</div>
		<div class="card mb-2 shadow-none border">
			<div class="p-1 px-2">
				<div class="row align-items-center">
					<div class="col-auto">
						<img src="@assets/images/projects/project-2.jpg" class="avatar-sm rounded" alt="file-image" />
					</div>
					<div class="col pl-0">
						<a href="javascript:void(0);" class="text-muted font-weight-bold">
							违反纪律严重后果批示.pdf
						</a>
						<p class="mb-0">1.25 MB</p>
					</div>
					<div class="col-auto">
						<!-- Button -->
						<a href="javascript:void(0);" title="Download" class="btn btn-link text-muted btn-lg p-0">
							<i id="tooltip" class="uil   uil-eye font-size-16"></i>
							<b-tooltip target="tooltip" triggers="hover" placement="bottom">浏览</b-tooltip>
						</a>
						<a href="javascript:void(0);" title="Download" class="btn btn-link text-muted btn-lg p-0">
							<i id="tooltip" class="uil uil-cloud-download font-size-16"></i>
							<b-tooltip target="tooltip" triggers="hover" placement="bottom">下载</b-tooltip>
						</a>
						<a href="javascript:void(0);" title="Delete" class="btn btn-link text-danger btn-lg p-0 ml-1">
							<i id="delete" class="uil uil-multiply font-size-16"></i>
							<b-tooltip target="delete" triggers="hover" placement="bottom">删除</b-tooltip>
						</a>
					</div>
				</div>
			</div>
		</div>
		<div class="text-center">
			<button type="button" class="btn btn-primary btn-sm mr-1">上传文件</button>
			<button type="button" class="btn btn-white btn-sm ml-1">修改文件</button>
		</div>
		<b-modal v-model="showmodal" size="xl" title="泄密事件报告" title-class="text-black font-18" hide-footer>
			<div>
				<!-- <h3 class="card-title  header-title "></h3> -->
				<div class="card-body" style="border:1px solid;margin-right: 20px;height:555px;overflow-y: scroll">

					<invoice />


				</div>
			</div>
		</b-modal>

		<!-- end attachments -->
	</div>
</template>