<template>
	<v-card id="guruIntro" class="position-absolute top-0 w-100 h-100 gray8-bg">
		<div class="w-100 h-100 d-flex justify-content-center align-items-center">
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
		</div>
		<div 
			class="video-overlay position-absolute top-0 left-0 bottom-0 right-0 d-flex flex-column justify-content-center align-items-center ma-2.5"
			@click="toggleVideo()"
		>
			<v-btn v-if="!isVideoPlaying" icon :ripple="false">
				<v-icon
					size="160"
					color="#4e9d2d"
				>mdi-play-circle-outline</v-icon>
			</v-btn>
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
		}
	},
	watch: {
		isPatientIntroComplete(to) {
			if (to && !this.$store.getters.isGuruIntroComplete) {
				setTimeout(() => {
					this.$el.querySelector('.video-overlay').click()
					setTimeout(() => {
						this.$el.querySelector('video').muted = false
					}, 500)
				}, 150)
			}
		},
		isGuruIntroComplete(to) {
			if (to) console.log('hide guru intro')
		}
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
#guruIntro {
	z-index: 99;
}

video {
	max-width: 100%;
}
</style>