<template>
  <v-app>
    <v-main :class="{
			'body-bg-color': !isLoading && !$route.meta.hideAll,
			'white-bg': isLoading || $route.meta.hideAll
		}">
			<v-container
				class="h-100"
				:class="{
					'mobile-container': isAuth && appMode === 'mobile',
					'desktop-container': isAuth && appMode === 'desktop',
					'd-grid': isAuth && !isLoading && !$route.meta.hideAll,
					'gap-2.5': isAuth && !isLoading && !$route.meta.hideAll,
					'lighten-5': isAuth && !isLoading && !$route.meta.hideAll,
				}" 
				fluid
			>
				<template v-if="$route.meta.hideAll">
					<v-row class="h-100" no-gutters>
						<v-col class="h-100">
							<router-view></router-view>
						</v-col>
					</v-row>
				</template>
				<template v-else-if="isLoading">
					<v-row class="h-100" no-gutters>
						<v-col class="h-100">
							<PageLoader />
						</v-col>
					</v-row>
				</template>
				<template v-else-if="isAuth">
					<v-row class="page-header" no-gutters>
						<v-card class="pa-0 overflow-hidden rounded-lg gray1-bg">
							<PageHeader />
							<PageFunderLine v-if="appMode === 'mobile'"/>
						</v-card>
					</v-row>
					<template v-if="appMode === 'mobile'">
						<v-row class="page-body" no-gutters>
							<v-card class="px-0 position-relative overflow-visible rounded-lg font-16">
								<PageClipboard />
								<router-view
									:class="{
										'opacity-0': !isPatientIntroComplete || !isGuruIntroComplete
									}"
								></router-view>
								<PageGuruIntro 
									v-if="!isGuruIntroComplete" 
								/>
								<CmeInfo />
								<ReferenceData />
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
								<template v-if="isLastView">
									<v-btn
										class="next-button text-white primary-bg font-18"
										large
										block
										:href="posttestURL"
										target="_blank"
									>{{ continueButtonLabel }}</v-btn>
								</template>
								<template v-else>
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
								</template>
								<PageProgress v-if="isPatientIntroComplete && isGuruIntroComplete" />
							</div>
						</v-row>
						<PageTOC />
					</template>
					<template v-else>
						<v-row class="page-content d-grid gap-2.5" no-gutters>
							<v-col>
								<v-card class="page-sidebar h-100 pa-0 overflow-hidden rounded-lg">
									<PageGuruIntro 
										v-if="!isGuruIntroComplete" 
										:class="{
											'above': !isGuruIntroComplete,
										}"
									/>
									<PageSidebar 
										:class="{
											'above': isGuruIntroComplete && !isPatientIntroComplete,
											'below': !isGuruIntroComplete,
										}" 
									/>
									<GuruResponse 
										v-if="appMode === 'desktop'"
									/>
								</v-card>
							</v-col>
							<v-col>
								<v-card class="page-body d-grid h-100 pa-0 overflow-hidden rounded-lg">
									<v-row no-gutters>
										<PageFunderLine />
									</v-row>
									<v-row class="position-relative font-16" no-gutters>
										<template v-if="isPatientIntroComplete && isGuruIntroComplete">
											<router-view></router-view>
											<CmeInfo />
										</template>
										<template v-else>
											<div class="d-flex justify-content-center align-items-center">
												<div 
													v-if="!isCmeInfoVisible && !isReferenceDataVisible"
													class="d-flex flex-column gap-2.5 pa-0"
												>
													<div class="text-center">
														<p v-if="!isGuruIntroComplete">
															Welcome to IHP Simulator.
															<br>
															Click Button Below to Skip and Continue.
														</p>
														<p v-if="isGuruIntroComplete && !isPatientIntroComplete">
															Review Patient Information before Continuing to Questions.
															<br>
															Click Button Below to Continue.
														</p>
													</div>
													<div>
														<template v-if="isLastView">
															<v-btn
																class="next-button text-white primary-bg font-18"
																large
																block
																:href="posttestURL"
																target="_blank"
															>{{ continueButtonLabel }}</v-btn>
														</template>
														<template v-else>
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
														</template>
													</div>
													<PageProgress v-if="isPatientIntroComplete && isGuruIntroComplete" />
												</div>	
											</div>											
										</template>
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
import GuruResponse from '@/components/GuruResponse'

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
    GuruResponse
  },
	data() {
		return {
			isEnd: false
		}
	},
	mounted() {
		if (!this.$route.query.jn) this.$store.dispatch('setRedirectURL', `/missing`)

		this.setAppMode()
		this.$store.dispatch('setEnvironment', this.$route.query.jn)

		window.addEventListener('resize', () => {
			this.setAppMode()
		})
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
		progress() {
			return this.$store.getters?.progress
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
		isLastView() {
			return (this.currView + 1) === this.progress.stages.length
		},
		posttestURL() {
			return this.$store.getters?.posttestURL
		},
		redirectURL() {
			return this.$store.getters?.redirectURL
		}
	},
	watch: {
		appMode() {
			this.$store.dispatch('isLoading')
			this.$store.dispatch('setEnvironment', this.$route.query.jn)
		},
		redirectURL(to) {
			if (to) this.$router.push(to)
		},
		currView(to) {
			const stage = this.progress.stages
				.filter((stage) => stage.view === to)[0]
			this.$store.dispatch('submitAnalytics', {
				event: 'View',
				label: `${
					this.stages[stage.stage].name
				} | stage ${
					this.stages[stage.stage].id
				}${
					stage.type === 'question' || stage.type === 'feedback'
					? ` | group ${ this.stages[stage.stage].questions[stage.group].id }`
					: ''
				} | type ${
					stage.type
				}`,
				metavalue: `${ location.href } | IHP Simulator${
					stage.type === 'question' || stage.type === 'feedback'
					? ` | ${ this.stages[stage.stage].questions[stage.group].question }`
					: stage.type === 'info'
					? ` | ${ this.stages[stage.stage].content }`
					: ''
				}`,
			})
		}
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
		async stageClick() {
			let viewType
			if (this.isPatientIntroComplete && this.isGuruIntroComplete) {
				const stageWrap = this.$el.querySelector('.stages')
				const views = Array.from(stageWrap.querySelectorAll('.view'))
				const currViewIndex = this.currView
				const currView = views[currViewIndex]
				viewType = currView.getAttribute('data-view-type')

				if (viewType === 'question') {
					const form = currView.querySelector('form')
					const payload = this.serializeForm(form)

					await this.$store.dispatch('isSubmitLoading')
					await this.$store.dispatch('submitQuestion', payload)
					this.nextStage()
				}
				else {
					this.nextStage()
				}
			}
			else {
				viewType = !this.isGuruIntroComplete
					? 'guru-intro'
					: !this.isPatientIntroComplete
					? 'patient-intro'
					:  null

				console.log(viewType)

				if (viewType === 'guru-intro') {
					await this.$store.dispatch('completeGuruIntro')
					this.$store.dispatch('setContinueButtonText')
				}
				else if (viewType === 'patient-intro') {
					await this.$store.dispatch('completePatientIntro')
					this.$el.querySelector('#patientVideo').pause()
					this.$store.dispatch('setContinueButtonText')
				}
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

							this.$store.dispatch('updateProgress')
						}
					}, '<')
			}
		}
	}
};
</script>

<style>
#pageSidebar { position: relative; }
.above { z-index: 9999999; }
.below { z-index: 99999; }
</style>