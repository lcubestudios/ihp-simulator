<template>
	<v-dialog
		v-model="isNavMenuVisible"
		fullscreen
		hide-overlay
		transition="dialog-top-transition"
	>
		<v-card class="h-100 gray6-bg text-right">
			<div class="h-100 primary-light-bg">
				<header>
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
						<v-btn class="text-dark font-18" text>
							Table Of Contents
						</v-btn>
					</div>
					<div>
						<v-btn class="text-dark font-18" text>
							Patient Information
						</v-btn>
					</div>
					<div>
						<v-btn class="text-dark font-18" text>
							CME Information
						</v-btn>
					</div>
					<div>
						<v-btn class="text-dark font-18" text>
							Referrences
						</v-btn>
					</div>
					<div>
						<v-btn class="text-dark font-18" text>
							Claim Credit
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
	},
	methods: {
		hideNavMenu() {
			this.$store.dispatch('hideNavMenu')
		},
	}
}
</script>