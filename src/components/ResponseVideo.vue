<template>
	<section v-if="isCorrect" class="result-video mb-4 position-relative w-100 gray2-bg overflow-hidden">
		<video 
			v-if="isCorrect"
			:id="`guruResponse_${ stage }_${ group }`"
			class="w-100"
			:poster="thumbnail"
			@pause="onVideoPause"
			@play="onVideoPlay"
			@ended="onVideoEnd"
			playsinline
		>
			<source src="https://cdn.atpoc.com/cdn/ihp/global/guru-spot-on.mp4" type="video/mp4" />
		</video>
		<div 
			class="position-absolute top-0 left-0 w-100 h-100"
			@click="toggleVideo()"
		>
			<v-btn 
				class="position-absolute bottom-0 left-0 ma-2.5"
				icon
			>
				<v-icon
					size="32"
					color="#4e9d2d"
					:ripple="false"
				>{{ isVideoPlaying ? 'mdi-pause-circle-outline' : 'mdi-play-circle-outline' }}</v-icon>
			</v-btn>
		</div>
	</section>
	<section v-else class="result-video mb-4 position-relative w-100 gray2-bg overflow-hidden">
		<video 
			:id="`guruResponse_${ stage }_${ group }`"
			class="w-100"
			:poster="thumbnail"
			@pause="onVideoPause"
			@play="onVideoPlay"
			@ended="onVideoEnd"
			playsinline
		>
			<source src="https://cdn.atpoc.com/cdn/ihp/global/guru-not-quite.mp4" type="video/mp4" />
		</video>
		<div 
			class="position-absolute top-0 left-0 w-100 h-100"
			@click="toggleVideo()"
		>
			<v-btn 
				class="position-absolute bottom-0 left-0 ma-2.5"
				icon
			>
				<v-icon
					size="32"
					color="#4e9d2d"
					:ripple="false"
				>{{ isVideoPlaying ? 'mdi-pause-circle-outline' : 'mdi-play-circle-outline' }}</v-icon>
			</v-btn>
		</div>
	</section>
</template>

<script>
export default {
	name: 'ResponseVideo',
	props: {
		stage: {
			type: Number,
			default: null
		},
		group: {
			type: Number,
			default: null
		},
		info: {
			type: Object,
			default: null
		}
	},
	watch: {
		currView() {
			this.setVideoUrl()
		},
	},
	data() {
		return {
			isCorrect: false,
			correctUrl: null,
			incorrectUrl: null,
			isVideoPlaying: false
		}
	},
	mounted() {
		setTimeout(() => {
			const question = this.$store.getters?.stages[this.stage].questions[this.group]
			this.correctUrl = question?.correct_video_url.replace(/\{\{CORRECT_VIDEO\}\}/gi, 'global/guru-spot-on.mp4')
			this.incorrectUrl = question?.incorrect_video_url.replace(/\{\{INCORRECT_VIDEO\}\}/gi, 'global/guru-not-quite.mp4')
			this.setVideoUrl()
		}, 100)
	},
	computed: {
		progress() {
			return this.$store.getters?.progress
		},
		thumbnail() {
			return this.$store.getters?.refData?.guru_intro_video_thumbnail
		},
		currView() {
			return this.$store.getters?.currView
		},
	},
	methods: {
		setVideoUrl() {
			const curr = this?.progress?.stages.filter((stage) => stage.view === this.currView)[0]

			if (this.stage === curr.stage && this.group === curr.group) {
				const question = this.$store.getters?.stages[this.stage].questions[this.group]
				const correctAnswers = question.answers ? question?.answers.filter((answer) => answer.choice_is_correct)?.length : null
				const correctChoices = question.choices ? question?.choices.filter((choice) => choice.choice_is_correct)?.length : null

				console.log('---', question)
				console.log(correctAnswers)
				console.log(correctChoices)
				
				if (correctAnswers === correctChoices) this.isCorrect = true
				else this.isCorrect = false
			}
		},
		onVideoPlay() {
			this.isVideoPlaying = true
		},
		onVideoPause() {
			this.isVideoPlaying = false
		},
		onVideoEnd() {
			this.gsap
				.timeline({ defaults: { duration: 0.25, ease: 'none' } })
				.to(this.$el, {
					height: 0,
					maxHeight: 0,
					onComplete: () => {
						this.$el.parentNode.removeChild(this.$el)
					}
				})
		},
		toggleVideo() {
			const video = this.$el.querySelector('video')

			if (this.isVideoPlaying) video.pause()
			else video.play()
		}
	}
}
</script>