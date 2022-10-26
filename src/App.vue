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
  </v-app>
</template>

<script>
import PageHeader from '@/components/page/Header'
import PageFunderLine from '@/components/page/FunderLine'
import PageSidebar from '@/components/page/Sidebar'
import PageProgress from '@/components/page/Progress'
import PageClipboard from '@/components/page/Clipboard'

export default {
  name: "App",
  components: {
		PageHeader,
		PageFunderLine,
		PageSidebar,
		PageProgress,
		PageClipboard,
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
		isNavMenuVisible() {
			return this.$store.getters.isNavMenuVisible
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
		hideNavMenu() {
			this.$store.dispatch('hideNavMenu')
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
			const data = new FormData(form)
			const output = []

			for (let [key, value] of data) {
				if (output[key] !== undefined) {
					if (!Array.isArray(output[key])) {
						output[key] = [output[key]]
					}
					output[key].push(value)
				} else {
					output[key] = value
				}
			}

			return output
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
