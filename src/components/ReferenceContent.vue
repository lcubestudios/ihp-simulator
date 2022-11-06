<template>
	<section class="flex-grow-1 position-relative">
		<div class="position-absolute top-0 left-0 right-0 bottom-0">
			<div class="w-100 h-100 pa-5 overflow-y-auto">
				<h2 v-if="showTitle" class="primary-color">References</h2>
				<div v-if="data" v-html="data"></div>
			</div>
		</div>
	</section>
</template>

<script>
export default {
	name: 'ReferenceContent',
	computed: {
		data() {
			return this.$store.getters?.refData?.references
		},
	},
	props: {
		showTitle: {
			type: Boolean,
			default: true
		}
	}
}
</script>