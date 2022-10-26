<template>
	<v-container class="content-container h-100">
		<v-row class="h-100 position-relative overflow-hidden" no-gutters>
			<section 
				class="pa-0 w-100 h-100 d-flex flex-column"
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
									<div>
										<section>
											<UiForm 
												:data-stage-name="stage.name"
												:data-question-order="question_ndx"
												:data="{
													...question,
													name: stage.order + '_' + question_ndx,
												}"
											/>
										</section>	
									</div>
								</div>
								<div
									class="view"
									data-view-type="feedback"
								>
									<div class="result-content">
										<section>
											<UiResult 
												:question="question.question"
												:choices="question.choices"
												:answers="question.answers"
												:feedback="question.feedback"
												:notes="question.notes"
												:test-results="question.test_results"
											/>
										</section>	
									</div>
									<ResultFeedback
										v-if="question.feedback" 
										class="result-feedback"
										:data="question.feedback" 
									/>
								</div>
							</div>
						</template>
					</div>
				</div>                             
			</section>
		</v-row>
	</v-container>
</template>

<script>
import UiForm from '@/components/ui/Form'
import UiResult from '@/components/ui/Result'
import ResultFeedback from '@/components/ResultFeedback'

export default {
	name: "DemoPage",
	components: { 
		UiForm,
		UiResult,
		ResultFeedback
	},
	computed: {
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
		}
	},
	mounted() {
		const stageWrap = this.$el.querySelector('.stages')
		const views = Array.from(stageWrap.querySelectorAll('.view'))
		const isLastView = (this.currView + 1) === views.length

		if (views.length > 0) {
			// Set Views Position
			this.$el
				.querySelectorAll(".view")
				.forEach((el, ndx) => {
					this.gsap.set(el, {
						xPercent: ndx * 100
					});
				});
			// Set Visible View
			this.gsap.set(stageWrap, {
				xPercent: this.currView * -100,
			});
			// Set Button Text
			if (isLastView) {
				this.$store.dispatch('setContinueButtonText', 'end')
			}
			else {
				this.$store.dispatch('setContinueButtonText', views[this.currView].getAttribute('data-view-type'))
				if (views[this.currView].getAttribute('data-view-type') === 'feedback') this.$store.dispatch('checkLabs') 
			}
		}

		this.resizeResults()
		window.addEventListener('resize', this.resizeResults)
	},
	destroyed() {
		window.removeEventListener('resize', this.resizeResults)
	},
	methods: {
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
		}
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

			> div {
				display: flex;
				flex-flow: column nowrap;
				height: 100%;

				section {
					flex: 1;
					overflow-y: auto;
				}
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
</style>