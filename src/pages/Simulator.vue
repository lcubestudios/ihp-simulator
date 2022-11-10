<template>
	<div class="h-100 d-flex flex-row flex-nowrap">
		<v-container class="content-container h-100">
			<v-row class="h-100 position-relative overflow-hidden" no-gutters>
				<section 
					class="d-none pa-0 w-100 h-100 d-flex flex-column"
					:data-curr-stage="currStage"
					:data-curr-view="currView"
				>
					<header class="stage-header primary-color">
						<h2>{{ stageName }}</h2>
						<p v-if="isIndicatorVisible">{{ currGroup + 1 }} / {{ totalGroup }}</p>
					</header>
					<div class="stages flex-grow-1 position-relative overflow-visible">
						<div
							v-for="(stage, stage_ndx) in stages"
							:key="stage_ndx"
							:data-stage="stage_ndx"
							class="stage"
						>
							<template v-if="stage.type === 'question'">
								<div 
									v-for="(question, question_ndx) in stage.questions"
									:key="question_ndx"
									class="group"
								>
									<div
										class="view"
										data-view-type="question"
									>
										<div class="d-flex flex-column pr-md-5">
											<section class="flex-grow-1">
												<UiForm 
													:data-stage-name="stage.name"
													:data-question-order="question_ndx"
													:data="{
														...question,
														name: stage.order + '_' + question_ndx,
													}"
													:stage="stage_ndx"
													:group="question_ndx"
												/>
											</section>	
											<div 
												v-if="appMode === 'desktop'"
												class="d-flex flex-column gap-2.5"
											>
												<div>
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
												</div>
												<PageProgress />
											</div>
										</div>
									</div>
									<div
										class="view"
										:class="{
											'opacity-0': !progress.stages
												.filter((stage) => 
													stage.type === 'question' 
													&& stage.stage === stage_ndx 
													&& stage.group === question_ndx
												)[0]
												.isCompleted
										}"
										data-view-type="feedback"
									>
										<div class="result-content">
											<template v-if="isSubmitLoading
													&& stage_ndx === currStage
													&& question_ndx === currGroup
													&& progress.stages.filter((stage) => 
														stage.view === currView
														&& stage.type === 'feedback'
														&& !stage.isCompleted
													).length > 0"
											>
												<PageLoader />
											</template>
											<template v-else>
												<GuruResponse 
													v-if="appMode === 'mobile'
														&& stage_ndx === currStage
														&& question_ndx === currGroup
														&& progress.stages.filter((stage) => 
															stage.view === currView
															&& stage.type === 'feedback'
															&& !stage.isCompleted
														).length > 0" 
												/>
												<section class="flex-grow-1 overflow-y-auto">
													<UiResult 
														:question="question.question"
														:choices="question.choices"
														:answers="question.answers"
														:feedback="question.feedback"
														:notes="question.notes"
														:test-results="question.test_results"
													/>
												</section>	
											</template>
										</div>
										<ResultFeedback
											v-if="question.feedback" 
											class="result-feedback"
											:data="question.feedback" 
										/>
									</div>
								</div>
							</template>
							<template v-if="stage.type === 'info'">
								<div class="group">
									<div
										class="view"
										data-view-type="info"
									>
										<div class="d-flex flex-column">
											<section class="flex-grow-1">
												<div v-html="stage.content"></div>
											</section>
											<div 
												v-if="appMode === 'desktop'"
												class="d-flex flex-column gap-2.5"
											>
												<div>
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
												</div>
												<PageProgress />
											</div>
										</div>
									</div>
								</div>
							</template>
						</div>
					</div>                             
				</section>
			</v-row>
		</v-container>
	</div>
</template>

<script>
import UiForm from '@/components/ui/Form'
import UiResult from '@/components/ui/Result'
import ResultFeedback from '@/components/ResultFeedback'
import GuruResponse from '@/components/GuruResponse'
import PageLoader from '@/components/page/Loader'
import PageProgress from '@/components/page/Progress'

export default {
	name: "DemoPage",
	components: {
    UiForm,
    UiResult,
    ResultFeedback,
    GuruResponse,
    PageLoader,
		PageProgress
	},
	data() {
		return {
		}
	},
	computed: {
		isSubmitLoading() {
			return this.$store.getters?.isSubmitLoading
		},
		appMode() {
			return this.$store.getters?.appMode
		},
		progress() {
			return this.$store.getters?.progress || []
		},
		stages() {
			return this.$store.getters?.stages || []
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
		stageName() {
			return this?.stages[this.currStage]?.name
		},
		isIndicatorVisible() {
			return this?.stages[this.currStage]?.type === 'question'
		},
		isContinueEnabled() {
			return this.$store.getters?.isContinueEnabled
		},
		continueButtonLabel() {
			return this.$store.getters?.continueButtonText
		},
		isPatientIntroComplete() {
			return this.$store.getters?.isPatientIntroComplete
		},
		isGuruIntroComplete() {
			return this.$store.getters?.isGuruIntroComplete
		}
	},
	watch: {
		currView() {
			this.setView()
			this.$store.dispatch('checkLabs')
		},
	},
	mounted() {
		this.setView()
		setTimeout(() => {
			this.resizeResults()
		}, 100)
		window.addEventListener('resize', this.resizeResults)
	},
	destroyed() {
		window.removeEventListener('resize', this.resizeResults)
	},
	methods: {
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
				if (viewType === 'guru-intro') {
					await this.$store.dispatch('completeGuruIntro')
				}
				else if (viewType === 'patient-intro') {
					await this.$store.dispatch('completePatientIntro')
					this.$el.querySelector('#patientVideo').pause()
				}
			}
		},
		nextStage() {
			const stageWrap = this.$el.querySelector('.stages')
			const currViewIndex = this.$store.getters.currView
			const stages = Array.from(stageWrap.querySelectorAll('.stage'))
			const groups = Array.from(stageWrap.querySelectorAll('.group'))
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
				const nextGroupIndex = groups.indexOf(views[nextViewIndex].closest('.group'))
				const nextStageIndex = stages.indexOf(next.closest('.stage'))
				
				timeline
					.to(stageWrap, {
						xPercent: this.appMode === 'desktop'
							? nextGroupIndex * -100
							: nextViewIndex * -100,
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
		},
		isFeedbackComplete({ stage, group }) {
			const isViewComplete = this.$store.getters?.progress?.stages
				.filter((item) => 
					item.stage === stage
					&& item.group === group
					&& item.type === 'feedback'
					&& item.isComplete
				).length > 0
			
			return isViewComplete
		},
		setView() {
			const stageWrap = this.$el.querySelector('.stages')
			const groups = Array.from(stageWrap.querySelectorAll('.group'))
			const views = Array.from(stageWrap.querySelectorAll('.view'))

			// Set Views Position
			this.$el
				.querySelectorAll(".view")
				.forEach((el, ndx) => {
					this.gsap.set(el, {
						xPercent: this.appMode === 'desktop' && (el.getAttribute('data-view-type') !== 'question' && el.getAttribute('data-view-type') !== 'feedback')
							? Math.ceil((ndx * 50)/100)*100
							: ndx * 100
					});
				});
			// Set Visible View
			this.gsap.set(stageWrap, {
				xPercent: this.appMode === 'desktop'
					? groups.indexOf(views[this.currView].closest('.group')) * -100
					: this.currView * -100
			});
		},
		resizeResults() {
			const results = this.$el.querySelectorAll('.result-content')

			results
				.forEach((el) => {
					const feedback = el.parentNode.querySelector('.result-feedback')

					if (feedback) {
						this.gsap
							.set(el, {
								height: el.parentNode.offsetHeight - feedback.querySelector('.feedback-trigger').offsetHeight
							})
					}
				})
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
	}
}
</script>

<style lang="scss" scoped>
.stage-header {
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: flex-end;
	margin-bottom: 12px !important;

	h2 {
		margin: 0 !important;
		font-size: 20px !important;
		font-weight: 500 !important;
	}

	p {
		margin: 0 !important;
		font-size: 14px !important;
	}
}
.stage {
	.group {
		.view {
			z-index: 1;
			position: absolute;
			width: 100%;
			height: 100%;
			background-color: #fff;

			&[data-view-type="question"],
			&[data-view-type="feedback"] {
				@media (min-width: 961px) {
					width: 50%;
				}
			}

			> div {
				display: flex;
				flex-flow: column nowrap;
				height: 100%;
			}
		}
	}
}
</style>

<style lang="scss">
.feedback {
	z-index: 9;
	article {
		font-size: 12px;
		h1 {
			font-size: 16px;
			font-weight: bold;
		}
		h3 {
			font-size: 14px;
			font-weight: bold;
		}
		ul {
			margin-bottom: 1rem;
		}
	}
}
.result-video {
	height: auto;
	max-height: 240px;
	video {
		height: 100%;
		max-height: 100%;
		max-width: 100%;
	}
}
</style>