<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'

/**
 * Invoice component
 */
export default {
	page: {
		title: 'Invoice',
		meta: [{ name: 'description', content: appConfig.description }],
	},
	components: { Layout, PageHeader },
	data() {
		return {
			// title: 'Invoice',
			// items: [
			// 	{
			// 		text: 'officeShield',
			// 		href: '/',
			// 	},
			// 	{
			// 		text: 'Pages',
			// 		href: '/',
			// 	},
			// 	{
			// 		text: 'Invoice',
			// 		active: true,
			// 	},
			// ],
			invoiceDetail: {
				customer: 'Greeva Navadiya',
				notes:
					'All accounts are to be paid within 7 days from receipt of invoice. To be paid by cheque or credit card or direct payment online. If account is not paid within 7 days the credits details supplied as confirmation of work undertaken will be charged the agreed quoted fee noted above',
				invoice_date: 'Jul 17, 2019',
				due_date: 'Jul 27, 2019',
				invoice_id: '#sh1001',
				address: {
					line_1: '795 Folsom Ave, Suite 600',
					city: 'San Francisco',
					state: 'CA',
					zip: 94107,
					phone: '(123) 456-7890',
				},
				billing_address: {
					line_1: '795 Folsom Ave, Suite 600',
					city: 'San Francisco',
					state: 'CA',
					zip: 94107,
					phone: '(123) 456-7890',
				},
				items: [
					{
						id: 1,
						name: 'Web Design',
						description: '2 Pages static website - my website',
						qty: 22,
						unit_cost: '$30.00',
						total: '$660.00',
					},
					{
						id: 2,
						name: 'Software Development',
						description: "Invoice editor software - AB'c Software",
						qty: 112.5,
						unit_cost: '$35.00',
						total: '$3937.50',
					},
				],
				sub_total: '$4597.50',
				discount: '$459.75',
				total: '$4137.75',
			},
		}
	},
}
</script>

<template>
	<!-- <PageHeader :title="title" :items="items" class="d-print-none" /> -->
	<div class="row">
		<div class="col-12">
			<div class="card">
				<div class="card-body ">
					<!-- Logo & title -->
					<div class="clearfix">
						<div class="float-right">
							<img src="@src/state/logo3.jpg" alt height="50" />
							<img src="@src/state/name.png" alt height="30" />
							<address class="pl-2 mt-2 ">
								事件编号：
								{{ invoiceDetail.address.state }}
								{{ invoiceDetail.address.zip }}
								<br />
								<abbr title="Phone">联系电话：</abbr>
								{{ invoiceDetail.address.phone }}
							</address>
						</div>
						<div class="float-left">
							<h4 class="m-0 d-print-none">泄密事件详情</h4>
							<dl class="row mb-2 mt-3">
								<dt class="col-sm-3 font-weight-normal">泄密人员 :</dt>
								<dd class="col-sm-9 font-weight-normal">kerwin</dd>

								<dt class="col-sm-3 font-weight-normal">泄密时间：</dt>
								<dd class="col-sm-9 font-weight-normal">2023.4.23 10:15</dd>

								<dt class="col-sm-3 font-weight-normal">用户ID：</dt>
								<dd class="col-sm-9 font-weight-normal">214124124</dd>
							</dl>
						</div>
					</div>

					<div class="row mt-4">
						<div class="col-md-6">
							<h6 class="font-size-16">相关人员</h6>
							<h6 class="font-weight-normal">项目负责人：kerwin</h6>
							<h6 class="font-weight-normal">
								相关人员：alice、2023 joker、kerwin
							</h6>
						</div>
						<!-- end col -->

						<div class="col-md-6">
							<div class="text-md-right">
								<h6 class="font-weight-normal">综合分析影响</h6>
								<h2>中等</h2>
							</div>
						</div>
						<!-- end col -->
					</div>
					<!-- end row -->

					<div class="row">
						<div class="col-12">
							<div class="table-responsive">
								<table class="table mt-4 table-centered">
									<thead>
										<tr>
											<th>编号</th>
											<th>详情</th>
											<th style="width: 10%">时间</th>
											<th style="width: 10%">等级</th>
											<th style="width: 10%" class="text-right">泄密是否发生</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>123</td>
											<td>
												<h5 class="font-size-16 mt-0 mb-2">中级泄密，可能会产生影响，注意检查</h5>
												<p class="text-muted mb-0">
													时长:00:00:13 共暂停: 0 次 退出全屏模式: 1 次
												</p>
											</td>
											<td>2023-04-17 19:24:48</td>
											<td>MEDIUM</td>
											<td class="text-right">是</td>
										</tr>
										<tr>
											<td>134 </td>
											<td>
												<h5 class="font-size-16 mt-0 mb-2">中级泄密，可能会产生影响，注意检查</h5>
												<p class="text-muted mb-0">
													时长:00:00:13 共暂停: 0 次 退出全屏模式: 1 次
												</p>
											</td>
											<td>2023-04-23 17:03:36</td>
											<td>MEDIUM</td>
											<td class="text-right">否</td>
										</tr>
										<tr>
											<td>136 </td>
											<td>
												<h5 class="font-size-16 mt-0 mb-2">中级泄密，可能会产生影响，注意检查</h5>
												<p class="text-muted mb-0">
													时长:00:00:39 共暂停: 0 次 退出全屏模式: 1 次
												</p>
											</td>
											<td>2023-04-23 17:05:27 </td>
											<td>MEDIUM</td>
											<td class="text-right">否</td>
										</tr>
										<tr>
											<td>138 </td>
											<td>
												<h5 class="font-size-16 mt-0 mb-2">低级泄密危险，可以忽略</h5>
												<p class="text-muted mb-0">
													时长:00:00:56 共暂停: 1 次 退出全屏模式: 0 次
												</p>
											</td>
											<td>2023-04-21 09:20:50</td>
											<td>LOW</td>
											<td class="text-right">否</td>
										</tr>
									</tbody>
								</table>
							</div>
							<!-- end table-responsive -->
						</div>
						<!-- end col -->
					</div>
					<!-- end row -->

					<div class="row">
						<div class="col-sm-6">
							<div class="clearfix ">
								<h6 class="text-muted">降低泄密影响:</h6>

								<span class="text-muted">
									及时应对：立即采取行动来限制进一步泄密。这可能包括暂停相关系统或服务，更改密码或撤销访问权限。


								</span>
								<p class="text-muted">快速通知：及时通知受影响的用户、客户或利益相关者。提供清晰、准确的信息，说明泄密的性质、范围和可能的影响</p>
							</div>
						</div>
						<!-- end col -->
						<div class="col-sm-6">
							<div class="float-right mt-4">
								<div class="text-md-right" style="margin-top:20px">
									<h6 class="font-weight-normal">综合分析影响</h6>
									<h2>中等</h2>
								</div>
							</div>
							<div class="clearfix"></div>
						</div>
						<!-- end col -->
					</div>
					<!-- end row -->

					<div class="mt-5 mb-1">
						<div class="text-right d-print-none">
							<a href="javascript:window.print()" class="btn btn-dark outline-dark">
								<i class="uil uil-print mr-1"></i> 打印报告
							</a>
							<!-- <a href="javascript: void(0);" class="btn btn-dark ml-1">发送</a> -->

						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- end col -->
	</div>
	<!-- end row -->
	<!-- end row -->
</template>
