<template>
	<div class="feedback position-absolute left-0 bottom-0 right-0 white-bg overflow-hidden">
		<section>
			<div class="d-flex flex-column overflow-hidden">
				<div class="feedback-trigger gray1-bg text-center primary-color">
					<v-btn 
						class="w-100 h-auto pa-0 ma-0" 
						text
						@click="toggleCollapsible"
					>
						<div class="py-3 primary-color">
							<span>
								<v-icon
									size="20"
									color="#4e9d2d"
								>{{ isActive ? 'mdi-menu-down' : 'mdi-menu-up' }}</v-icon>
							</span>
							<p class="fw-bold ma-0">Read More</p>
						</div>
					</v-btn>
				</div>
				<div class="feedback-content flex-grow-1 overflow-y-scroll">
					<div class="h-100 pa-2.5">
						<article v-html="data"></article>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
export default {
	name: 'ResultFeedback',
	props: {
		data: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			isActive: false,
		}
	},
	computed: {
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
		if (!this.isActive) this.hideContent()
		else this.showContent()

		this.resizeContent()
		window.addEventListener('resize', this.resizeContent)
	},
	destroyed() {
		window.removeEventListener('resize', this.resizeContent)
	},
	methods: {
		toggleCollapsible() {
		if (this.isActive) this.hideContent()
		else this.showContent()
		},
		hideContent() {
			this.resizeContent()
			this.animationTimeline
				.to(this.$el, {
					height: this.$el.querySelector('.feedback-trigger').offsetHeight,
					onComplete: () => {
						this.isActive = false
					}
				})
		},
		showContent() {
			this.resizeContent()
			this.animationTimeline
				.to(this.$el, {
					height: this.$el.parentNode.offsetHeight,
					onComplete: () => {
						this.isActive = true
					}
				})
		},
		resizeContent() {
			this.gsap
				.set(this.$el.querySelector('.feedback-content'), {
					height: this.$el.parentNode.offsetHeight - this.$el.querySelector('.feedback-trigger').offsetHeight
				})
		}
	}
}
</script>

<style lang="scss">
article {
	img {
		margin-bottom: 20px;
	}
}
</style>