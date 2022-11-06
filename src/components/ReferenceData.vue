<template>
	<v-card class="references position-absolute top-0 w-100 white-bg overflow-hidden">
		<div class="position-absolute top-0 left-0 d-flex flex-column flex-nowrap w-100 h-100 overflow-hidden">
			<ReferenceContent />
			<footer class="d-flex flex-row justify-content-center">
				<v-btn 
					class="primary-color ma-2"
					icon 
					dark 
					@click="$store.dispatch('hideReferenceData')"
				>
					<div><v-icon>mdi-close</v-icon></div>
				</v-btn>
			</footer>
		</div>
	</v-card>
</template>

<script>
import ReferenceContent from '@/components/ReferenceContent'
export default {
	name: 'ReferenceData',
	components: {
		ReferenceContent
	},
	computed: {
		data() {
			return this.$store.getters?.refData?.references
		},
		isReferenceDataVisible() {
			return this.$store.getters.isReferenceDataVisible
		},
		animationTimeline() {
			return this.gsap.timeline({
				defaults: { 
					duration: 0.3,
					ease: 'none',
				}
			})
		}
	},
	watch: {
		isReferenceDataVisible(to) {
			if (to) this.showReferenceData()
			else this.hideReferenceData()
		} 
	},
	mounted() {
		if (this.isReferenceDataVisible) this.showReferenceData()
		else this.hideReferenceData()
	},
	methods: {
		showReferenceData() {
			this.animationTimeline
				.to(this.$el, {
					height: '100%',
					maxHeight: '100%'
				})
		},
		hideReferenceData() {
			this.animationTimeline
				.to(this.$el, {
					height: 0,
					maxHeight: 0
				})
		}
	}
}
</script>

<style lang="scss" scoped>
.references {
	z-index: 999; 
	height: 0;

}
</style>