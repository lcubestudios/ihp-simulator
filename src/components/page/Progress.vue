<template>
	<ul class="on-select">
		<li
			v-for="(slide) in total"
			:key="slide"
			class="pointer-events-initial"
			:class="{ active: (slide - 1) == activeIndex }"
			@click="goToStage(slide - 1)"
		></li>
	</ul>
</template>

<script>
export default {
	name: 'PageProgress',
	computed: {
		total() {
			return this.$store.getters?.stages
				.filter((stage) => stage.type !== 'intro').length
		},
		activeIndex() {
			return this.$store.getters.currStage
		}
	},
	methods: {
		goToStage(ndx) {
			this.$store.dispatch('goToStage', ndx)
		}
	}
}
</script>

<style lang="scss" scoped>
.on-select {
	padding: 0px;
	margin: 0px;
	text-align: center;

	li {
		background-color: white;
		display: inline-block;
		width: 20px !important;
		height: 6px;
		margin: 5px;
		border-radius: 5px;

		@media (min-width: 961px) {
			background-color: black;
			opacity: 0.2;
		}
		
		cursor: pointer;
	}
	
	li:hover,
	.active {
    background: #4e9d2d;
		opacity: 1;
  }

	pointer-events: none;
	// .active { pointer-events: none; }
}
</style>