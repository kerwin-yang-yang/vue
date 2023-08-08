<template>
	<div class="card">
		<div class="card-body">
			<div class="text-center mt-3">
				<!-- <img :src="user.icon" alt class="avatar-lg rounded-circle" /> -->
				<img src="@assets/images/small/头像6.jpeg" class="avatar-lg rounded-circle" alt="..." />
				<h5 class="mt-2 mb-0">{{ user.username }}</h5>
				<h6 class="text-muted font-weight-normal mt-2 mb-0">普通员工</h6>
				<h6 class="text-muted font-weight-normal mt-1 mb-4">违反保密规定</h6>

				<div class="progress mb-4" style="height: 20px;">
					<div class="progress-bar bg-success" role="progressbar" style="width: 20%;" aria-valuenow="60"
						aria-valuemin="0" aria-valuemax="100">
						<span class="font-size-12 font-weight-bold" style="color:black">
							事件处理过程
							<span class="font-size-11">20%</span> -- 发现泄密源头
						</span>
					</div>
				</div>

				<button type="button" class="btn btn-primary btn-sm mr-1">更多信息</button>
				<button type="button" class="btn btn-white btn-sm ml-1">内容修改</button>
			</div>

			<!-- profile  -->
			<div class="mt-5 pt-2 border-top">
				<h4 class="mb-3 font-size-15">事件介绍</h4>
				<p class="text-muted mb-4">
					用户<strong>kerwin</strong>使用手机拍照<strong>《
						XXX有限公司2022 年度财务报表》</strong>文档内容造成泄密，违反机密文件保密协议规定
				</p>
			</div>
			<div class="mt-3 pt-2 border-top">
				<h4 class="mb-3 font-size-15">联系信息</h4>
				<div class="table-responsive">
					<table class="table table-borderless mb-0 text-muted">
						<tbody>
							<tr>
								<th scope="row">Email</th>
								<td>{{ user.email }}</td>
							</tr>
							<tr>
								<th scope="row">Phone</th>
								<td>(123) {{ user.phone }}</td>
							</tr>
							<tr>
								<th scope="row">Address</th>
								<td>
									<!-- <strong>{{ user.documents[0].description }}</strong> -->
									{{ user.address }}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<!-- <div class="mt-3 pt-2 border-top">
				<h4 class="mb-3 font-size-15">能力</h4>
				<label class="badge badge-soft-primary">UI design</label>
				<label class="badge badge-soft-primary ml-1">UX</label>
				<label class="badge badge-soft-primary ml-1">Sketch</label>
				<label class="badge badge-soft-primary ml-1">Photoshop</label>
				<label class="badge badge-soft-primary ml-1">Frontend</label>
			</div> -->
		</div>
	</div>
	<!-- end card -->
</template>
<script>
export default {
	props: {
		user: {
			type: Object,
			required: false,
			default: () => ({}),
		},
	}
}
</script>