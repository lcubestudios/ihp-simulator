<template>
	<section class="result-video position-relative w-100 gray2-bg overflow-hidden">
		<video 
			v-if="videoUrl"
			class="w-100"
			:poster="thumbnail"
			@pause="onVideoPause"
			@play="onVideoPlay"
			@ended="onVideoEnd"
			playsinline
			muted
		>
			<source 
				:src="videoUrl" 
				type="video/mp4" 
			/>
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
		}
	},
	watch: {
		currView(to) {
			const currStage = this.progress.stages.filter((stage) => stage.view === to)[0]
			if (currStage?.stage === this.stage && currStage?.group === this.group) this.setVideoUrl()
		},
	},
	data() {
		return {
			videoUrl: null,
			isVideoPlaying: false
		}
	},
	mounted() {
		setTimeout(() => {
			const currStage = this.progress.stages.filter((stage) => stage.view === this.currView)[0]
			if (currStage?.stage === this.stage && currStage?.group === this.group) this.setVideoUrl()
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
			const question = this.$store.getters?.stages[this.stage].questions[this.group]
			const correctAnswers = question.answers ? question?.answers.filter((answer) => answer.choice_is_correct)?.length : null
			const correctChoices = question.choices ? question?.choices.filter((choice) => choice.choice_is_correct)?.length : null
			
			if (correctAnswers === correctChoices) this.videoUrl = question?.correct_video_url.replace(/\{\{CORRECT_VIDEO\}\}/gi, 'global/guru-spot-on.mp4')
			else this.videoUrl = question?.incorrect_video_url.replace(/\{\{INCORRECT_VIDEO\}\}/gi, 'global/guru-not-quite.mp4')

			setTimeout(() => {
				this.$el.querySelector('video').play()
				this.$el.querySelector('video').muted = false
			}, 100)
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
					marginBottom: 0
				})
		},
		toggleVideo() {
			const video = this.$el.querySelector('video')

			if (this.isVideoPlaying) video.pause()
			else video.play()

			if (video.muted) video.muted = false
		}
	}
}
</script>

<style lang="scss" scoped>
.result-video { margin-bottom: 16px; }
</style>