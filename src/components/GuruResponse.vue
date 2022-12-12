<template>
	<v-card 
		id="guruResponse" 
		class="w-100 rounded-0 gray2-bg"
		:class="{
			'position-absolute': appMode === 'desktop',
			'top-0': appMode === 'desktop',
			'w-100': appMode === 'desktop',
			'h-100': appMode === 'desktop',
		}"
		:elevation="0"
	>
		<div 
			class="video-wrap w-100 h-100 d-flex flex-column justify-content-center align-items-center"
			:class="{
				'flex-column': appMode === 'desktop'
			}"
		>
			<div 
				class="position-relative w-100"
				:class="{
					'h-100': appMode === 'mobile'
				}"
			>
				<video 
					v-if="videoURL"
					id="guruResponseVideo" 
					class="w-100"
					@ended="onVideoEnd"
					@pause="onVideoPause"
					@play="onVideoPlay"
					:poster="thumbnail"
					playsinline
					muted
				>
					<source :src="videoURL" type="video/mp4" />
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
			</div>
			<div v-if="script && appMode === 'desktop'" class="pa-4">
				<v-card
					class="guru-script secondary-light-bg pa-4"
					:elavation="2"
				>
					<div v-html="script"></div>
				</v-card>
			</div>
		</div>
	</v-card>
</template>

<script>
export default {
	name: 'PageGuruIntro',
	data() {
		return {
			isVideoPlaying: false,
			script: null
		}
	},
	computed: {
		appMode() {
			return this.$store.getters.appMode
		},
		isPatientIntroComplete() {
			return this.$store.getters.isPatientIntroComplete
		},
		isGuruIntroComplete() {
			return this.$store.getters.isGuruIntroComplete
		},
		videoURL() {
			return this.$store.getters?.guruResponseURL
		},
		thumbnail() {
			return this.$store.getters?.refData?.guru_intro_video_thumbnail
		},
		progress() {
			return this.$store.getters?.progress
		},
		stage() {
			return this.$store.getters.currStage
		},
		group() {
			return this.$store.getters.currGroup
		},
		view() {
			return this.$store.getters.currView
		}
	},
	mounted() {
		setTimeout(() => {
			this.setVideoURL()
		}, 100)
	},
	watch: {
		videoURL(to) {
			if (to) this.showVideo()
			else this.hideVideo()
		},
		view() {
			this.setVideoURL()
		}
	},
	methods: {
		setVideoURL() {
			const checkProgress = this.$route.params.stage
				? this.progress?.stages
					.filter((stage) => 
						stage.view === this.$route.params.stage + 1
					)[0]
				: this.progress?.stages
					.filter((stage) => 
						stage.stage === this.stage 
						&& stage.group === this.group
						&& !stage.isCompleted
					)[0]

			console.log(this.$route.params.stage)
			console.log(checkProgress)

			if (checkProgress && checkProgress.type === 'feedback' && !checkProgress.isCompleted) {
				const question = this.$store.getters?.stages[this.stage].questions[this.group]
				const correctAnswers = question.answers ? question?.answers.filter((answer) => answer.choice_is_correct)?.length : null
				const correctChoices = question.choices ? question?.choices.filter((choice) => choice.choice_is_correct)?.length : null
				let videoURL

				if (correctAnswers === correctChoices) {
					videoURL = question?.correct_video_url.replace(/\{\{CORRECT_VIDEO\}\}/gi, 'global/guru-spot-on.mp4')
					this.script = question?.correct_video_text
				}
				else {
					videoURL = question?.incorrect_video_url.replace(/\{\{INCORRECT_VIDEO\}\}/gi, 'global/guru-not-quite.mp4')
					this.script = question?.incorrect_video_text
				}

				this.$store.dispatch('setGuruResponseURL', videoURL)
			}
			else {
				this.$store.dispatch('setGuruResponseURL', null)
				this.script = null
			}
		},
		onVideoPlay() {
			this.isVideoPlaying = true
		},
		onVideoPause() {
			this.isVideoPlaying = false
		},
		onVideoEnd() {
			this.hideVideo()
		},
		showVideo() {
			const movement = this.appMode === 'desktop'
				? { xPercent: 100 }
				: { height: '240px', maxHeight: '240px', marginBottom: '16px' }

			this.gsap.to(this.$el, {
				duration: 0.25,
				ease: 'none',
				...movement,
				onComplete: () => {
					this.$el.querySelector('video').play()
					this.$el.querySelector('video').muted = false
				}
			})
		},
		hideVideo() {
			const movement = this.appMode === 'desktop'
				? { xPercent: -100 }
				: { height: '0px', maxHeight: '0px', marginBottom: '0px' }

			this.gsap.to(this.$el, {
				duration: 0.25,
				ease: 'none',
				...movement,
				onComplete: () => {
					this.$store.dispatch('setGuruResponseURL', null)
					this.$store.dispatch('checkLabs') 
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

<style lang="scss" scoped>
#guruResponse {
	margin-bottom: 16px;
	overflow: hidden !important;
	
	@media (min-width: 961px) {
		margin-bottom: 0;
		transform: translateX(-100%);
	}
	> .video-wrap {
		height: 240px;
	}

	video {
		height: 100%;
		max-height: 100%;
		max-width: 100%;
	}
}
</style>

<style lang="scss">
#guruResponse {
	z-index: 1;
}
.guru-script {
	p:last-child {
		margin: 0 !important;
	}
}
</style>