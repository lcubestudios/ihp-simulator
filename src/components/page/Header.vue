<template>
  <div class="z_index pa-0">
		<v-toolbar class="radious-header shadow-none">
			<div class="brand h-100 d-flex flex-row gap-2.5">
				<img class="h-100" src="https://secureapi.atpoc.com/cdn/assets/production/suite-library/pik-icon.png" @click="restart"/>
				<span class="w-1px h-100 gray6-bg"></span>
				<img class="h-100" src="https://secureapi.atpoc.com/cdn/assets/production/suite-library/ihp-logo.png" />
			</div>
			<v-spacer></v-spacer>
			<div 
				class="d-block d-md-none"
			>
				<v-app-bar-nav-icon @click="showNavMenu"></v-app-bar-nav-icon>
			</div>
			<div 
				class="d-none d-md-block"
			>
				<v-btn 
					class="toggle-sidebar"
					:class="{
						'gray8-color': currSidebarView !== 0,
						'primary-color': currSidebarView === 0,
						'pointer-events-none': currSidebarView === 0,
					}"
					text
					view-id="0"
					@click="goToSidebarView(0)"
				>
					Patient Information
				</v-btn>
				<v-btn 
					class="toggle-sidebar"
					:class="{
						'gray8-color': currSidebarView !== 1,
						'primary-color': currSidebarView === 1,
						'pointer-events-none': currSidebarView === 1,
					}"
					text
					view-id="1"
					@click="goToSidebarView(1)"
				>
					My Progress
				</v-btn>
				<v-btn 
					class="toggle-sidebar"
					:class="{
						'gray8-color': currSidebarView !== 2,
						'primary-color': currSidebarView === 2,
						'pointer-events-none': currSidebarView === 2,
					}"
					text
					view-id="2"
					@click="goToSidebarView(2)"
				>
					Referrences
				</v-btn>
			</div>
		</v-toolbar>
  </div>
</template>

<script>
export default {
  name: "PageHeader",
	computed: {
		currSidebarView() {
			return this.$store.getters.sidebarView
		},
		appMode() {
			return this.$store.getters.appMode
		}
	},
	watch: {
		appMode() {
			this.goToSidebarView(0)
		}
	},
  methods: {
		goToSidebarView(id) {
			this.$store.dispatch('setSidebarView', id)
		},
		showNavMenu() {
			this.$store.dispatch('showNavMenu')
		},
		restart() {
			this.$store.dispatch('restartCase')
		}
	},
};
</script>


<style lang="scss" scoped>
button.v-app-bar__nav-icon.v-btn.v-btn--icon.v-btn--round.theme--light.v-size--default {
  color: #4e9d2d;
}
button.v-btn.v-btn--icon.v-btn--round.theme--dark.v-size--default {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #4e9d2d;
}

.thumb-box.pa-4 {
  @media (max-width: 430px) {
    position: absolute;
    width: 100%;
    bottom: 3em;
  }
}
.v-list-item--active {
  border-left: 3px solid #4e9d2d;
}
.active-list {
  border-left: 3px solid #4e9d2d !important;
}
@media (max-width: 430px) {
  .radious-box.length-box.v-card.v-sheet.v-sheet--outlined.theme--light.rounded-0.white {
    margin-top: 0.5em !important;
  }
}
.list-box.w-100 {
  min-height: 92vh;
  background-color: #fff;
}
.v-card__actions {
  padding: 0 !important;
  margin: 0 !important;
}
.z_index {
  @media (max-width: 500px) {
    z-index: 111;
    background: #e0e0e0;
  }
}
</style>