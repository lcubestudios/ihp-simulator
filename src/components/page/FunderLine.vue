<template>
	<div class="radious-tab gray4-bg pa-3 height-60">
		<v-row class="align-items-center">
			<v-col cols="12">
				<div class="w-100 d-flex flex-row flex-nowrap justify-content-between align-items-center gap-2.5">
					<div 
						class="pa-2.5 fex-grow-1"
					>
						<div class="funder-line" v-html="funderLine"></div>
					</div>
					<div
						class="pa-2.5 menu-box d-flex flex-row flex-sm-row gap-2 align-items-center justify-content-center justify-content-sm-end"
					>
						<v-btn
							class="primary-light-bg font-9 text-capitalize fw-bold"
							text
							small
							:href="posttestURL"
							target="blank"
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
					</div>
				</div>
			</v-col>
		</v-row>
	</div>
</template>

<script>
export default {
	name: 'PageFunderLine',
	computed: {
		funderLine() {
			return this.$store.getters
				?.refData
				?.cme_information
				?.funderInfo[0]
				?.funderHTML
		},
		posttestURL() {
			return this.$store.getters?.posttestURL
		}
	},
	methods: {
		showCmeInfo() {
			this.$store.dispatch('showCmeInfo')
		}
	}
}
</script>

<style lang="scss">
.funder-line {
	p {
		font-size: 10px !important;
		&:last-child { margin-bottom: 0 !important; }
	}
}
</style>