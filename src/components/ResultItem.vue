<template>
	<div
		v-if="!answers || (answers && !(!isAnswered(order) && !isCorrect))"
		class="pa-2.5 mb-1/2"
		:class="{
			'primary-lighter-bg': isCorrect
		}"
	>
		<div class="result-item d-flex flex-row flex-nowrap gap-2.5">
			<div v-if="answers">
				<span class="primary-color font-13 fw-bold">
					<v-icon
						v-if="isAnswered(order) && isCorrect"
						size="13"
						color="#4e9d2d"
					>mdi-check</v-icon>
					<v-icon
						v-if="(!isAnswered(order) && isCorrect) || (isAnswered(order) && !isCorrect)"
						size="13"
						color="#9E1539"
					>mdi-close</v-icon>
				</span>
			</div>
			<div class="flex-grow-1">
				<div class="d-flex flex-row flex-nowrap align-items-start gap-2.5">
					<p 
						class="flex-grow-1 ma-0"
						:class="{
							'fw-bold': isCorrect
						}"
					>{{ text }}</p>
					<div class="d-flex flex-row flex-nowrap">
						<v-btn 
							v-if="answers && feedback"
							class="h-auto pa-0 ma-0" 
							width="28"
							icon
							@click="toggleFeedback"
						>
							<span>
								<v-icon
									size="20"
									color="#082ecf"
								>mdi-information-outline</v-icon>
							</span>
						</v-btn>
						<v-btn 
							v-if="(isCorrect || !answers) && labs"
							class="h-auto pa-0 ma-0" 
							width="28"
							icon
							@click="toggleLabs"
						>
							<span>
								<v-icon
									size="20"
									color="#082ecf"
								>{{ isLabsRead ? 'mdi-clipboard-check' : 'mdi-clipboard-text' }}</v-icon>
							</span>
						</v-btn>
					</div>
				</div>
				<div 
					v-if="feedback" 
					class="result-item-feedback font-12 overflow-hidden"
				>
					<div class="pt-2.5" v-html="feedback"></div>
				</div>
				<div 
					v-if="labs"
					class="result-item-labs font-12 overflow-hidden"
				>
					<div class="pt-2.5">
						<h3 class="font-inherit fw-bold mb-4">Labs</h3>
						<div v-if="labs.description" v-html="labs.description"></div>
						<div class="labs" v-if="labs.result">
							<div v-if="labs.result.text" v-html="labs.result.text"></div>
							<div class="position-relative mb-4" v-if="labs.result.image_url">
								<img :src="labs.result.image_url" />
							</div>
							<div v-if="labs.result.reference" v-html="labs.result.reference"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'ResultItem',
	props: {
		data: {
			type: Object,
			required: true
		},
		answers: {
			type: Array,
			default: null
		}
	},
	data() {
		return {
			isFeedbackActive: false,
			isLabsActive: false,
			isLabsRead: !!this?.data?.choice_is_labs_read
		}
	},
	computed: {
		id() {
			return this?.data?.choice_id
		},
		order() {
			return this?.data?.choice_order
		},
		text() {
			return this?.data?.choice_text
		},
		value() {
			return this?.data?.choice_value
		},
		isCorrect() {
			return this?.data?.choice_is_correct
		},
		feedback() {
			return this?.data?.choice_feedback
		},
		labs() {
			return this?.data?.choice_labs
		},
		animationTimeline() {
			return this.gsap.timeline({
				defaults: { 
					duration: 0.4,
					ease: 'circ',
				}
			})
		}
	},
	mounted() {
		setTimeout(() => {
			this.isLabsRead = !!this?.data?.choice_is_labs_read
		}, 100)
	},
	methods: {
		isAnswered(id) {
			return this.answers.filter((item) => item.choice_order === id).length > 0
		},
		toggleFeedback() {
			if (this.isFeedbackActive) this.hideFeedback()
			else this.showFeedback()
		},
		showFeedback() {
			const feedback = this.$el.querySelector('.result-item-feedback')
			const feedbackContent = feedback.querySelector('div')

			if (this.isLabsActive) this.hideLabs()

			this.animationTimeline
				.to(feedback, {
					maxHeight: feedbackContent.offsetHeight,
					onComplete: () => {
						this.isFeedbackActive = true
					}
				})
		},
		hideFeedback() {
			const feedback = this.$el.querySelector('.result-item-feedback')
			
			this.animationTimeline
				.to(feedback, {
					maxHeight: 0,
					onComplete: () => {
						this.isFeedbackActive = false
					}
				})
		},
		toggleLabs() {
			if (this.isLabsActive) this.hideLabs()
			else this.showLabs()
		},
		showLabs() {
			const labs = this.$el.querySelector('.result-item-labs')
			const labsContent = labs.querySelector('div')

			if (this.isFeedbackActive) this.hideFeedback()

			this.animationTimeline
				.to(labs, {
					maxHeight: labsContent.offsetHeight,
					onComplete: () => {
						this.isLabsActive = true
						if (!this.isLabsRead) this.setChoiceLabsRead()
					}
				})
		},
		hideLabs() {
			const labs = this.$el.querySelector('.result-item-labs')
			
			this.animationTimeline
				.to(labs, {
					maxHeight: 0,
					onComplete: () => {
						this.isLabsActive = false
					}
				})
		},
		setChoiceLabsRead() {
			this.$store.dispatch('setChoiceLabsRead', this.order)
			this.isLabsRead = true
		}
	}
}
</script>

<style lang="scss" scoped>
.result-item-feedback,
.result-item-labs {
	max-height: 0px;
}

.labs {
	img {
		width: 100%;
		max-width: 100%;
	}
}
</style>