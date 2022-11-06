<template>
	<section class="flex-grow-1 d-flex flex-column position-relative">
		<div class="position-absolute top-0 left-0 bottom-0 right-0">
			<div class="w-100 h-100 d-flex flex-column justify-content-around overflow-y-auto pa-2.5">
				<div
					v-for="(stage, stage_ndx) in stages"
					:key="stage_ndx"
					class="toc-item d-flex flex-row gap-2.5 align-items-center"
					:class="{
						'active': stage_ndx == activeIndex, 
						'pointer-events-none': !isPatientIntroComplete && !isGuruIntroComplete,
						'gray7-color': stage_ndx !== activeIndex && !isCompleted(stage_ndx) && !isPatientIntroComplete && !isGuruIntroComplete,
						'primary-color': stage_ndx == activeIndex,
						'black-color': isCompleted(stage_ndx),
					}"
					@click="goToStage(stage_ndx)"
				>
					<p class="ma-0 font-16">{{ stage.name }}</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
export default {
	name: 'ProgressMenu',
	computed: {
		stages() {
			return this.$store.getters?.stages
				.filter((stage) => stage.type !== 'intro')
		},
		activeIndex() {
			return this.$store.getters.currStage
		},
		isPatientIntroComplete() {
			return this.$store.getters.isPatientIntroComplete
		},
		isGuruIntroComplete() {
			return this.$store.getters.isGuruIntroComplete
		}
	},
	methods: {
		hideTOC() {
			this.$store.dispatch('hideTOC')
		},
		isCompleted(id) {
			return !(this.$store.getters?.progress?.stages
				.filter((stage) => stage.stage === id && !stage.isCompleted).length > 0)
		},
		goToStage(ndx) {
			this.$store.dispatch('goToStage', ndx)
			this.hideTOC()
		}
	}
}
</script>

<style lang="scss" scoped>
.toc-item {
	&.active { border-left: none !important; }
	&::before {
		content: '';
		display: inline-block;
		width: 4px;
		height: 150%;
		background-color: transparent;
		border-radius: 2px;
	}
	&.active::before {
		background-color: #4e9d2d;
	}
}
</style>