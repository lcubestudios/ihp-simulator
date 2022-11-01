<template>
	<div class="clipboard position-absolute pointer-events-none top-0 w-100"> 
		<v-card class="clipboard-content pointer-events-initial">
			<div class="h-100">
				<PatientInformation 
					:auto-play="true"
				/>
			</div>
		</v-card>
		<div 
			class="clipboard-handle"
			:class="{ 
				'opacity-0': !isPatientIntroComplete || !isGuruIntroComplete,
				'pointer-events-none': !isPatientIntroComplete || !isGuruIntroComplete,
				'pointer-events-initial': isPatientIntroComplete || isGuruIntroComplete,
			}"
			@click="toggleClipboard"
		>
			<div class="position-relative text-center">
				<div class="label position-absolute white-color fw-bold font-12">{{ text }}</div>
				<svg
					version="1.1"
					id="Layer_1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					x="0px"
					y="0px"
					viewBox="0 0 892.6 175.23"
					style="enable-background: new 0 0 892.6 175.23"
					xml:space="preserve"
				>
					<g>
						<path
							class="st0"
							d="M84.9,0l34.79,57.5c5.71,9.45,15.95,15.22,27,15.22h199.95l0.02,0.02c23.99,0.61,43.69,18.44,47.23,41.58v0.01
							l1.03,0.91l0.01,0.01l0.01,0.01c3.28,23.72,23.49,42.02,48.05,42.3l0,0l0.74,0.65l0.74-0.65l0.01-0.01
							c24.4-0.45,44.43-18.69,47.69-42.3l0.02-0.02l0.23-0.2c3.25-23.59,23.28-41.83,47.66-42.29l0.01-0.01h0.01l0.02-0.01h199.96
							c11.04,0,21.28-5.77,26.99-15.22L801.87,0H84.9z"
						/>
						<g>
							<defs>
								<circle id="SVGID_1_" cx="444.38" cy="108.57" r="40.3" />
							</defs>

							<clipPath id="SVGID_2_">
								<use xlink:href="#SVGID_1_" style="overflow: visible" />
							</clipPath>

							<g style="clip-path: url(#SVGID_2_)">
								<image
									style="overflow: visible"
									width="512"
									height="512"
									:xlink:href="img"
									transform="matrix(0.1882 0 0 0.1882 397.2084 61.2088)"
								></image>
							</g>
						</g>
					</g>
				</svg>
			</div>
		</div>
	</div>
</template>

<script>
import PatientInformation from '@/components/PatientInformation'

export default {
	name: "PageClipboard",
	components: {
		PatientInformation
	},
	computed: {
		isPatientIntroComplete() {
			return this.$store.getters.isPatientIntroComplete
		},
		isGuruIntroComplete() {
			return this.$store.getters.isGuruIntroComplete
		},
		animationTimeline() {
			return this.gsap.timeline({
				defaults: { 
					duration: 0.2,
					ease: 'none',
				}
			})
		},
		isActive() {
			return this.$store.getters.isClipboardVisible
		},
		text() {
			return this.isActive
				? "Hide Patient Information"
				: "View Patient Information";
		},
		img() {
			return this.$store.getters?.refData?.patient_information?.patient_image_url
		}
	},
	watch: {
		isPatientIntroComplete(to) {
			if (this.isActive && to) {
				this.$store.dispatch('hideClipboard')
				setTimeout(() => {
					const wrap = this.$el.closest("[class*=\"-container\"]");
					const body = wrap
						.querySelector(".page-body")
						.querySelector(".v-card");
					const handle = this.$el.querySelector(".clipboard-handle");

					this.gsap.set(body, {
						paddingTop: handle.offsetHeight
					});
				}, 100)
			}
		},
		isActive(to) {
			if (to) this.showClipboard()
			else this.hideClipboard()
		}
	},
	mounted() {
		this.setClipboard()
		window.addEventListener("resize", () => this.setClipboard);
	},
	methods: {
		setClipboard() {
			const wrap = this.$el.closest("[class*=\"-container\"]");
			const body = wrap
				.querySelector(".page-body")
				.querySelector(".v-card");
			const content = this.$el.querySelector(".clipboard-content");
			const handle = this.$el.querySelector(".clipboard-handle");

			this.gsap.set(body, {
				paddingTop: handle.offsetHeight
			});

			if (this.isActive || !this.isPatientIntroComplete) {
				this.$store.dispatch('showClipboard')
				if (this.isActive) this.showClipboard()
			}
			else {
				this.$store.dispatch('hideClipboard')
				this.gsap.set(content, {
					height: 0,
					maxHeight: 0
				});
			}
		},
		showClipboard(){
			const wrap = this.$el.closest("[class*=\"-container\"]");
			const body = wrap.querySelector(".page-body")
			const content = this.$el.querySelector(".clipboard-content");

			this.animationTimeline
				.to(content, {
					height: body.offsetHeight,
					maxHeight: body.offsetHeight
				})
		},
		hideClipboard(){
			const content = this.$el.querySelector(".clipboard-content");

			this.animationTimeline
				.to(content, {
					height: 0,
					maxHeight: 0
				})
		},
		toggleClipboard() {
			if (!this.isActive) this.$store.dispatch('showClipboard')
			else this.$store.dispatch('hideClipboard')
		}
	},
}
</script>

<style lang="scss" scoped>
.clipboard { 
	z-index: 999; 
	.clipboard-content {
		overflow: hidden;
	}
	.clipboard-handle { 
		display: block; 
		margin: 0 auto; 
		width: 100%; 
		max-width: 400px; 
		cursor: pointer;
		.label {
			margin-top: 8px;
			left: 50%;
			transform: translateX(-50%)
		}
	}
}
/*--svg css--*/

.st0 {
	fill: #4e9d2d;
}

.st1 {
	fill: #f1f2f2;
}

.st2 {
	font-family: "MyriadPro-Regular";
}

.st3 {
	font-size: 36px;
}
</style>