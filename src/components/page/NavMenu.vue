<template>
	<v-dialog
		v-model="isNavMenuVisible"
		fullscreen
		hide-overlay
		transition="dialog-top-transition"
		class="nav-menu"
	>
		<v-card class="h-100 gray6-bg">
			<div class="h-100 primary-light-bg">
				<header class="text-right">
					<v-btn 
						class="primary-color ma-2"
						icon 
						dark 
						@click="hideNavMenu"
					>
						<div><v-icon>mdi-close</v-icon></div>
					</v-btn>
				</header>
				<section class="d-flex flex-column gap-4 mt-4">
					<div>
						<v-btn
							class="text-dark font-18"
							text
							@click="showTOC"
						>
							My Progress
						</v-btn>
					</div>
					<div>
						<v-btn
							class="text-dark font-18"
							text
							@click="showClipboard"
						>
							Patient Information
						</v-btn>
					</div>
					<div>
						<v-btn
							class="text-dark font-18"
							text
							@click="showCmeInfo"
						>
							CME Information
						</v-btn>
					</div>
					<div>
						<v-btn
							class="text-dark font-18"
							text
							@click="showReferenceData"
						>
							References
						</v-btn>
					</div>
					<div>
						<v-btn
							class="text-dark font-18" 
							text
							:href="posttestURL"
							target="blank"
						>
							Claim Credit
						</v-btn>
					</div>
					<div>
						<v-btn
							class="text-dark font-18"
							text
							@click="userLogout"
						>
							Log Out
						</v-btn>
					</div>
				</section>
			</div>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	name: 'PageNavMenu',
	computed: {
		isNavMenuVisible() {
			return this.$store.getters.isNavMenuVisible
		},
		posttestURL() {
			return this.$store.getters?.posttestURL
		}
	},
	methods: {
		hideNavMenu() {
			this.$store.dispatch('hideNavMenu')
		},
		userLogout() {
			this.hideNavMenu()
			this.$store.dispatch('userLogout')
		},
		async showTOC() {
			if (!this.isGuruIntroComplete) await this.$store.dispatch('completeGuruIntro')
			this.$store.dispatch('showTOC')
		},
		async showClipboard() {
			if (!this.isGuruIntroComplete) await this.$store.dispatch('completeGuruIntro')
			this.$store.dispatch('showClipboard')
		},
		async showCmeInfo() {
			if (!this.isGuruIntroComplete) await this.$store.dispatch('completeGuruIntro')
			this.$store.dispatch('showCmeInfo')
		},
		async showReferenceData() {
			if (!this.isGuruIntroComplete) await this.$store.dispatch('completeGuruIntro')
			this.$store.dispatch('showReferenceData')
		}
	}
}
</script>

<style lang="scss" scoped>
.nav-menu { z-index: 9999999999; }
</style>