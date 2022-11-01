<template>
	<div class="radious-tab gray4-bg pa-3 height-60">
		<v-row class="align-items-center">
			<v-col 
				class="pa-2.5"
				cols="6"
				sm="7"
				md="9"
			>
				<p class="mb-0 font-8">
					This independent CME/CE activity is supported by an educational grant from <b>Projects In Knowledge Powered By Kaplan.</b>
				</p>
			</v-col>
			<v-col 
				class="pa-2.5 menu-box d-flex flex-row flex-sm-row gap-2 align-items-center justify-content-center justify-content-sm-end"
				cols="6"
				sm="5"
				md="3"
			>
				<v-btn
					class="primary-light-bg font-9 text-capitalize fw-bold"
					text
					small
				>
					Claim Credit
				</v-btn>
				<v-btn
					class="primary-light-bg font-9 text-capitalize fw-bold"
					text
					small
					@click="showCmeInfo"
				>
					CME Info
			</v-btn>
			</v-col>
		</v-row>
	</div>
</template>

<script>
export default {
	name: 'PageFunderLine',
	methods: {
		showCmeInfo() {
			this.$store.dispatch('showCmeInfo')
		}
	}
}
</script>