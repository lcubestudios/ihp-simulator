<template>
  <v-app>
    <v-main class="body-bg-color">
			<v-container
				class="h-100"
				:class="{
					'mobile-container': isAuth && appMode === 'mobile',
					'desktop-container': isAuth && appMode === 'desktop',
					'd-grid': isAuth,
					'gap-2.5': isAuth,
					'lighten-5': isAuth,
				}" 
				fluid
			>
				<template v-if="isAuth">
					<v-row class="page-header" no-gutters>
						<v-card class="pa-0 overflow-hidden rounded-lg gray1-bg">
							<PageHeader />
							<PageFunderLine 
								v-if="appMode === 'mobile' && !isLoading"
							/>
						</v-card>
					</v-row>
					<template v-if="appMode === 'mobile'">
						<v-row class="page-body" no-gutters>
							<v-card class="px-0 position-relative overflow-visible rounded-lg font-16">
								<template v-if="isLoading">
									<PageLoader />
								</template>
								<template v-else>
									<PageClipboard />
									<PageGuruIntro 
										v-if="!isGuruIntroComplete" 
										:class="{
											'opacity-0': !isPatientIntroComplete
										}"
									/>
									<router-view
										:class="{
											'opacity-0': !isPatientIntroComplete || !isGuruIntroComplete
										}"
									></router-view>
									<CmeInfo />
									<ReferenceData />
								</template>
							</v-card>
						</v-row>
						<v-row 
							v-if="!isLoading"
							class="page-footer"
							:class="{
								'opacity-0': !(!isClipboardVisible || !isPatientIntroComplete)
							}" 
							no-gutters
						>
							<div 
								v-if="!isCmeInfoVisible && !isReferenceDataVisible"
								class="d-flex flex-column gap-2.5 pa-0"
							>
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
								<PageProgress v-if="isPatientIntroComplete && isGuruIntroComplete" />
							</div>
						</v-row>
						<PageTOC />
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
				</template>
				<template v-else>
					<v-row class="h-100" no-gutters>
						<v-col class="h-100">
							<PageAuth />
						</v-col>
					</v-row>
				</template>
			</v-container>
    </v-main>
  </v-app>
</template>

<script>
import PageLoader from '@/components/page/Loader'
import PageAuth from '@/components/page/Auth'
import PageHeader from '@/components/page/Header'
import PageFunderLine from '@/components/page/FunderLine'
import PageSidebar from '@/components/page/Sidebar'
import PageProgress from '@/components/page/Progress'
import PageClipboard from '@/components/page/Clipboard'
import PageNavMenu from '@/components/page/NavMenu'
import PageLightBox from '@/components/page/LightBox'
import PageGuruIntro from '@/components/page/GuruIntro'
import PageTOC from '@/components/page/TOC'
import CmeInfo from '@/components/CmeInfo'
import ReferenceData from '@/components/ReferenceData'

export default {
  name: "App",
  components: {
		PageLoader,
		PageAuth,
		PageHeader,
		PageFunderLine,
		PageSidebar,
		PageProgress,
		PageClipboard,
		PageNavMenu,
    PageLightBox,
    PageGuruIntro,
    PageTOC,
    CmeInfo,
    ReferenceData,
  },
	data() {
		return {
			isEnd: false
		}
	},
	mounted() {
		this.setAppMode()
		this.$store.dispatch('setEnvironment')
		console.log('url stage - ', this.$route.query.stage)
		window.addEventListener('resize', this.setAppMode)
	},
	destroyed() {
		window.removeEventListener('resize', this.setAppMode)
	},
	computed: {
		isLoading() {
			return this.$store.getters.isLoading
		},
    appMode() {
			return this.$store.getters?.appMode
		},
		isAuth() {
			return this.$store.getters?.isAuth
		},
		isPatientIntroComplete() {
			return this.$store.getters?.isPatientIntroComplete
		},
		isGuruIntroComplete() {
			return this.$store.getters?.isGuruIntroComplete
		},
		isClipboardVisible() {
			return this.$store.getters?.isClipboardVisible
		},
		isContinueEnabled() {
			return this.$store.getters?.isContinueEnabled
		},
		isCmeInfoVisible() {
			return this.$store.getters?.isCmeInfoVisible
		},
		isReferenceDataVisible() {
			return this.$store.getters?.isReferenceDataVisible
		},
		continueButtonLabel() {
			return this.$store.getters?.continueButtonText
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
				if (this.isPatientIntroComplete) this.$store.dispatch('hideClipboard')
				this.$store.dispatch('hideCmeInfo')
				this.$store.dispatch('hideReferenceData')
				this.$store.dispatch('hideTOC')
				this.$store.dispatch('hideLightBox')
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
			const viewType = !this.isPatientIntroComplete
				? 'patient-intro'
				: !this.isGuruIntroComplete
				? 'guru-intro'
				: currView.getAttribute('data-view-type')

			if (viewType === 'patient-intro') {
				this.$store.dispatch('completePatientIntro')
			}
			else if (viewType === 'guru-intro') {
				this.$store.dispatch('completeGuruIntro')
			}
			else if (viewType === 'question') {
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
								const viewType = views[nextViewIndex].getAttribute('data-view-type')
								this.$store.dispatch('setContinueButtonText', viewType)
								if (viewType === 'feedback') this.$store.dispatch('checkLabs')
							}

							this.$store.dispatch('updateProgress')
						}
					}, '<')
			}
		}
	}
};
</script>

<style>
#test {
	z-index: 999999999;
}

</style>