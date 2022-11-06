<template>
	<v-card id="guruResponse" class="position-absolute top-0 w-100 h-100 gray8-bg">
		<div class="w-100 h-100 d-flex justify-content-center align-items-center">
			<video 
				v-if="videoUrl"
				id="guruResponseVideo" 
				@ended="onVideoEnd"
				@pause="onVideoPause"
				@play="onVideoPlay"
				:poster="thumbnail"
				playsinline
				muted
			>
				<source :src="videoUrl" type="video/mp4" />
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
		videoUrl() {
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
			console.log(this.progress?.stages
				.filter((stage) => stage.stage === this.stage && stage.group === this.group)
			)
		}, 100)
	},
	watch: {
	},
	methods: {
		onVideoPlay() {
			this.isVideoPlaying = true
		},
		onVideoPause() {
			this.isVideoPlaying = false
		},
		onVideoEnd() {
			console.log('hide Video')
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

</style>