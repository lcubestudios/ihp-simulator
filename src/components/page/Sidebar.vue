<template>
	<div id="pageSidebar" class="h-100">
		<div
			v-if="currSidebarView === 0"
			class="h-100 d-flex flex-column"
		>
			<div class="height-60 d-flex align-items-center primary-light-bg rounded-0 pa-2.5 primary-color">
				<h3 class="font-18 ma-0">Patient Information</h3>
			</div>
			<div class="flex-grow-1 d-flex flex-column pt-2">
				<PatientInformation />
			</div>
		</div>
		<div
			v-if="currSidebarView === 1"
			class="h-100 d-flex flex-column"
		>
			<div class="height-60 d-flex align-items-center primary-light-bg rounded-0 pa-2.5 primary-color">
				<h3 class="font-18 ma-0">Your Progress</h3>
			</div>
			<div class="flex-grow-1 d-flex flex-column pt-2">
				<PageProgressMenu />
			</div>
		</div>
		<div
			v-if="currSidebarView === 2"
			class="h-100 d-flex flex-column"
		>
			<div class="height-60 d-flex align-items-center primary-light-bg rounded-0 pa-2.5 primary-color">
				<h3 class="font-18 ma-0">Referrences</h3>
			</div>
			<div class="position-relative flex-grow-1 d-flex flex-column pt-2">
				<ReferenceContent :show-title="false" />
			</div>
		</div>
	</div>
</template>

<script>
import PatientInformation from '@/components/PatientInformation'
import PageProgressMenu from '@/components/page/ProgressMenu'
import ReferenceContent from '@/components/ReferenceContent'

export default {
	name: 'PageSidebar',
	components: {
		PatientInformation,
		PageProgressMenu,
		ReferenceContent,
	},
	computed: {
		currSidebarView() {
			return this.$store.getters.sidebarView
		}
	},
}
</script>
