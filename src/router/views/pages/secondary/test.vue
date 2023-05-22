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
			title: 'test',
			items: [
				{
					text: 'officeShield',
					href: '/',
				},
				{
					text: 'Pages',
					href: '/',
				},
				{
					text: 'Test',
					active: true,
				},
			],

		}
	},
}
</script>

<template>
	<Layout>
		<PageHeader :title="title" :items="items" class="d-print-none" />
		<div class="row">
			<div class="col-12">
				<div class="card">
					<div class="card-body">
						<div>hhhh</div>
					</div>
				</div>
			</div>
			<!-- end col -->
		</div>
		<!-- end row -->
		<!-- end row -->
	</Layout>
</template>
