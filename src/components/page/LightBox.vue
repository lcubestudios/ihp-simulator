<template>
	<div class="light-box h-100 black-bg">
		<v-btn 
			class="position-absolute top-0 right-0 primary-color ma-2"
			icon 
			dark 
			@click="hideLightBox"
		>
			<div><v-icon>mdi-close</v-icon></div>
		</v-btn>
		<div class="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
			<img :src="image" />
		</div>
	</div>
</template>

<script>
export default {
	name: 'PageLightBox',
	computed: {
		image() {
			return this.$store.getters?.lightBoxImage
		}
	},
	methods: {
		hideLightBox() {
			this.$store.dispatch('hideLightBox')
		}
	}
}
</script>

<style lang="scss" scoped>
img {
	width: 100%;
	height: 100%;
	object-fit: contain;
}
</style>