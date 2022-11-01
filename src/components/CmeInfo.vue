<template>
	<v-card class="cme-info position-absolute top-0 w-100 white-bg overflow-hidden">
		<div class="position-absolute top-0 left-0 d-flex flex-column w-100 h-100 pa-2.5">
			<section class="flex-grow-1 position-relative">
				<div class="position-absolute top-0 left-0 right-0 bottom-0">
					<div class="w-100 h-100 pa-5 overflow-y-auto">
						<h2 class="primary-color">CME Information</h2>
						<div v-if="data" v-html="data"></div>
					</div>
				</div>
			</section>
			<footer class="d-flex flex-row justify-content-center">
				<v-btn 
					class="primary-color ma-2"
					icon 
					dark 
					@click="$store.dispatch('hideCmeInfo')"
				>
					<div><v-icon>mdi-close</v-icon></div>
				</v-btn>
			</footer>
		</div>
	</v-card>
</template>

<script>
export default {
	name: 'CmeInfo',
	computed: {
		data() {
			return null
		},
		isCmeInfoVisible() {
			return this.$store.getters.isCmeInfoVisible
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
		isCmeInfoVisible(to) {
			if (to) this.showCmeInfo()
			else this.hideCmeInfo()
		} 
	},
	mounted() {
		if (this.isCmeInfoVisible) this.showCmeInfo()
		else this.hideCmeInfo()
	},
	methods: {
		showCmeInfo() {
			this.animationTimeline
				.to(this.$el, {
					height: '100%',
					maxHeight: '100%'
				})
		},
		hideCmeInfo() {
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
.cme-info {
	z-index: 999; 
	height: 0;

}
</style>