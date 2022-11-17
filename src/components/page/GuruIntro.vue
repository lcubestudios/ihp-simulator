<template>
	<v-card id="guruIntro" class="position-absolute top-0 w-100 h-100 gray2-bg">
		<div class="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
			<div class="position-relative">
				<video 
					id="guruIntroVideo" 
					@ended="onVideoEnd"
					@pause="onVideoPause"
					@play="onVideoPlay"
					:poster="thumbnail"
					playsinline
					muted
				>
					<source :src="video" type="video/mp4" />
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
			<div v-if="script" class="pa-4">
				<v-card
					class="secondary-light-bg pa-4"
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
			isVideoPlaying: false
		}
	},
	computed: {
		isPatientIntroComplete() {
			return this.$store.getters.isPatientIntroComplete
		},
		isGuruIntroComplete() {
			return this.$store.getters.isGuruIntroComplete
		},
		video() {
			return this.$store.getters?.refData?.guru_intro_video_url
		},
		thumbnail() {
			return this.$store.getters?.refData?.guru_intro_video_thumbnail
		},
		script() {
			return this.$store.getters?.refData?.guru_intro_video_text
		}
	},
	mounted() {
		setTimeout(() => {
			if (!this.isGuruIntroComplete) {
					this.$el.querySelector('video').play()
					setTimeout(() => {
						this.$el.querySelector('video').muted = false
					}, 500)
			}
		}, 150)
	},
	methods: {
		onVideoPlay() {
			this.isVideoPlaying = true
		},
		onVideoPause() {
			this.isVideoPlaying = false
		},
		onVideoEnd() {
			this.$store.dispatch('completeGuruIntro')
		},
		toggleVideo() {
			const video = this.$el.querySelector('#guruIntroVideo')

			if (this.isVideoPlaying) video.pause()
			else video.play()
		}
	}
}
</script>

<style lang="scss" scoped>
video {
	width: 100%;
	min-width: 100%;
	max-width: 100%;
}
</style>