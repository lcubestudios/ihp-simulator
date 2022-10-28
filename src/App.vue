<template>
  <v-app>
    <v-main class="body-bg-color">
			<v-container
				class="h-100 d-grid gap-2.5 lighten-5"
				:class="{
					'mobile-container': appMode === 'mobile',
					'desktop-container': appMode === 'desktop'
				}" 
				fluid
			>
				<v-row class="page-header" no-gutters>
					<v-card class="pa-0 overflow-hidden rounded-lg">
						<PageHeader />
						<PageFunderLine 
							v-if="appMode === 'mobile'" 
						/>
					</v-card>
				</v-row>
				<template v-if="appMode === 'mobile'">
					<v-row class="page-body" no-gutters>
						<v-card class="px-0 position-relative overflow-visible rounded-lg font-16">
							<PageClipboard />
							<router-view></router-view>
						</v-card>
					</v-row>
					<v-row class="page-footer" no-gutters>
						<div class="d-flex flex-column gap-2.5 pa-0">
							<v-btn
								v-if="isContinueEnabled"
								class="next-button text-white primary-bg font-18"
								large
								block
								@click="stageClick()"
							>{{ continueButtonLabel }}</v-btn>
							<v-btn
								v-else
								class="next-button text-white primary-bg font-18"
								large
								block
								disabled
								@click="stageClick()"
							>{{ continueButtonLabel }}</v-btn>
							<PageProgress />
						</div>
					</v-row>
				</template>
				<template v-else>
					<v-row class="page-content d-grid gap-2.5" no-gutters>
						<v-col>
							<v-card class="page-sidebar h-100 pa-0 overflow-hidden rounded-lg">
								<PageSidebar />
							</v-card>
						</v-col>
						<v-col>
							<v-card class="page-body d-grid h-100 pa-0 overflow-hidden rounded-lg">
								<v-row no-gutters>
									<PageFunderLine />
								</v-row>
								<v-row class="position-relative font-16" no-gutters>
									<router-view></router-view>
								</v-row>
							</v-card>
						</v-col>
					</v-row>
				</template>
			</v-container>
    </v-main>
		<v-dialog
			v-model="isLightBoxVisible"
			fullscreen
			hide-overlay
			transition="dialog-top-transition"
		>
			<v-card class="h-100 gray6-bg text-right rounded-0">
				<PageLightBox />
			</v-card>
		</v-dialog>
		<PageNavMenu />
  </v-app>
</template>

<script>
import PageHeader from '@/components/page/Header'
import PageFunderLine from '@/components/page/FunderLine'
import PageSidebar from '@/components/page/Sidebar'
import PageProgress from '@/components/page/Progress'
import PageClipboard from '@/components/page/Clipboard'
import PageNavMenu from '@/components/page/NavMenu.vue'
import PageLightBox from '@/components/page/LightBox.vue'

export default {
  name: "App",
  components: {
		PageHeader,
		PageFunderLine,
		PageSidebar,
		PageProgress,
		PageClipboard,
		PageNavMenu,
    PageLightBox,
  },
	data() {
		return {
			isEnd: false
		}
	},
	mounted() {
		this.setAppMode()
		this.$store.dispatch('setStages')
		window.addEventListener('resize', this.setAppMode)
	},
	computed: {
    appMode() {
			return this.$store.getters.appMode
		},
		isContinueEnabled() {
			return this.$store.getters.isContinueEnabled
		},
		continueButtonLabel() {
			return this.$store.getters.continueButtonText
		},
		stages() {
			return this.$store.getters?.stages
		},
		currStage() {
			return this.$store.getters?.currStage
		},
		currGroup() {
			return this.$store.getters?.currGroup
		},
		totalGroup() {
			return this?.stages[this.currStage]?.questions.length
		},
		currView() {
			return this.$store.getters?.currView
		},
		isLightBoxVisible() {
			return this.$store.getters?.isLightBoxVisible
		},
	},
	methods: {
		setAppMode() {
			if (window.innerWidth > 960) {
				this.$store.dispatch('setAppMode', 'desktop')
				this.$store.dispatch('hideNavMenu')
			}
			else {
				this.$store.dispatch('setAppMode', 'mobile')
				this.$store.dispatch('setSidebarView', 0)
			}
		},
		stageClick() {
			const stageWrap = this.$el.querySelector('.stages')
			const views = Array.from(stageWrap.querySelectorAll('.view'))
			const currViewIndex = this.currView
			const currView = views[currViewIndex]
			const viewType = currView.getAttribute('data-view-type')

			if (viewType === 'question') {
				const form = currView.querySelector('form')
				const payload = this.serializeForm(form)

				this.$store.dispatch('submitQuestion', payload)
				this.nextStage()
			}
			else {
				this.nextStage()
			}
		},
		serializeForm(form) {
			const obj = {};
			const fields = form.querySelectorAll('input');

			fields
				.forEach((el) => {
					if (el.checked || el.getAttribute('aria-checked') === 'true') obj[el.getAttribute('name')] = el.value.trim();
				})

			return obj;
		},
		nextStage() {
			const stageWrap = this.$el.querySelector('.stages')
			const currViewIndex = this.$store.getters.currView
			const stages = Array.from(stageWrap.querySelectorAll('.stage'))
			const views = Array.from(stageWrap.querySelectorAll('.view'))
			const next = views[currViewIndex + 1]
			const timeline = this.gsap.timeline({
				defaults: { 
					duration: 0.3,
					ease: 'none',
				}
			})

			if (next) {
				const nextViewIndex = currViewIndex + 1
				const nextStageIndex = stages.indexOf(next.closest('.stage'))
				const isLastView = (nextViewIndex + 1) === views.length
				
				timeline
					.to(stageWrap, {
						xPercent: nextViewIndex * -100,
						onComplete: () => {
							// Update Stage
							this.$store.dispatch('setCurrStage', nextStageIndex)
							// Update View
							this.$store.dispatch('setCurrView', nextViewIndex)
							// Toggle end of case
							if ((nextViewIndex + 1) === views.length) this.isEnd = true
							else this.isEnd = false
							// Set Button Text
							if (isLastView) {
								this.$store.dispatch('setContinueButtonText', 'end')
							}
							else {
								this.$store.dispatch('setContinueButtonText', views[nextViewIndex].getAttribute('data-view-type'))
								if (views[nextViewIndex].getAttribute('data-view-type') === 'feedback') this.$store.dispatch('checkLabs')
							}
						}
					}, '<')
			}
		}
	}
};
</script>
