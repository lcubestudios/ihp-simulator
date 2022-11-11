<template>
	<v-dialog
		v-model="isTOCVisible"
		fullscreen
		hide-overlay
		transition="dialog-top-transition"
		class="nav-menu overflow-hidden"
	>
		<v-card class="h-100 gray6-bg overflow-hidden">
			<div class="h-100 d-flex flex-column white-bg">
				<header class="primary-light-bg d-flex flex-row justify-content-between align-items-center pl-2.5">
					<h4 class="primary-color ma-0">My Progress</h4>
					<v-btn 
						class="primary-color ma-2"
						icon 
						dark 
						@click="hideTOC"
					>
						<div><v-icon>mdi-close</v-icon></div>
					</v-btn>
				</header>
				<ProgressMenu />
			</div>
		</v-card>
	</v-dialog>
</template>

<script>
import ProgressMenu from '@/components/page/ProgressMenu'

export default {
	name: 'PageTOC',
	components: {
		ProgressMenu,
	},
	computed: {
		isTOCVisible() {
			return this.$store.getters.isTOCVisible
		}
	},
	methods: {
		hideTOC() {
			this.$store.dispatch('hideTOC')
		},
	}
}
</script>

<style lang="scss" scoped>
.nav-menu { z-index: 9999999999; }
</style>