<template>
	<div>
		<div
			v-if="currSidebarView === 0"
		>
			<div class="height-60 d-flex align-items-center primary-light-bg rounded-0 pa-2.5 primary-color">
				<h3 class="font-18 ma-0">Patient Information</h3>
			</div>
			<div class="pt-2">
				<PatientInformation />
			</div>
		</div>
		<div
			v-if="currSidebarView === 1"
		>
			<div class="height-60 d-flex align-items-center primary-light-bg rounded-0 pa-2.5 primary-color">
				<h3 class="font-18 ma-0">Table of Contents</h3>
			</div>
			<div>Sidebar</div>
		</div>
		<div
			v-if="currSidebarView === 2"
		>
			<div class="height-60 d-flex align-items-center primary-light-bg rounded-0 pa-2.5 primary-color">
				<h3 class="font-18 ma-0">Referrences</h3>
			</div>
			<div>Sidebar</div>
		</div>
	</div>
</template>

<script>
import PatientInformation from '@/components/PatientInformation'

export default {
	name: 'PageSidebar',
	components: {
		PatientInformation
	},
	computed: {
		currSidebarView() {
			return this.$store.getters.sidebarView
		}
	},
}
</script>
