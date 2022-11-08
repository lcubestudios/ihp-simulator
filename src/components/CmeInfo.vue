<template>
	<v-card class="cme-info position-absolute top-0 w-100 white-bg overflow-hidden">
		<div class="position-absolute top-0 left-0 d-flex flex-column w-100 h-100 pa-2.5">
			<section class="flex-grow-1 position-relative">
				<div class="position-absolute top-0 left-0 right-0 bottom-0">
					<div class="w-100 h-100 pa-4 overflow-y-auto">
						<h2 class="primary-color mb-4">{{ label }} Information</h2>
						<article v-if="content" @click.stop="">
							<section class="panels grid grid-cols-1 gird-rows-auto gap-4">
								<section>
									<div class="logos d-flex flex-column flex-sm-row align-items-start gap-2.5 mb-4">
										<img 
											src="https://api.atpoc.com/cdn/DESIGN/breakingmed/logos/PIK.gif"
											alt="Projects In Knowledge" 
										>
										<img 
											src="https://api.atpoc.com/cdn/DESIGN/breakingmed/logos/TIK.gif"
											alt="Peer Reviewed" 
										>
									</div>
									<div class="cme-funder-line" v-html="funderLine"></div>
								</section>
								<section v-if="faculty && faculty.length > 0">
									<div class="d-flex flex-column gap-4">
										<div
											v-for="(fac, fac_ndx) in faculty"
											:key="fac_ndx"
										>
											<h4>{{ fac.role }}</h4>
											<div class="d-flex flex-row gap-2.5"> 
												<div class="faculty-image">
													<img
														:src="fac.facultyImage"
														:alt="fac.fullName"
													/>
												</div>
												<div class="d-flex flex-column gap-2.5">
													<p class="ma-0 fw-bold">{{ fac.fullName }}</p>
													<p class="ma-0" v-html="fac.jobAffiliations"></p>
												</div>
											</div>
										</div>
									</div>
								</section>
								<section v-if="estimatedTimeToComplete">
									<h4>{{ estimatedTimeToComplete.availFor }}</h4>
									<v-container class="ettc-table text-center d-flex flex-column">
										<v-row class="fw-bold border-bottom">
											<v-col class="d-flex justify-content-center align-items-center"></v-col>
											<v-col class="d-flex justify-content-center align-items-center">Physicians</v-col>
											<v-col class="d-flex justify-content-center align-items-center">Nurses</v-col>
										</v-row>
										<v-row class="border-bottom">
											<v-col class="d-flex justify-content-center align-items-center fw-bold">Release Date</v-col>
											<v-col class="d-flex justify-content-center align-items-center">{{ estimatedTimeToComplete.cme_publishDate }}</v-col>
											<v-col class="d-flex justify-content-center align-items-center">{{ estimatedTimeToComplete.cpe_publishDate }}</v-col>
										</v-row>
										<v-row>
											<v-col class="d-flex justify-content-center align-items-center fw-bold">Termination Date</v-col>
											<v-col class="d-flex justify-content-center align-items-center">{{ estimatedTimeToComplete.cme_terminationDate }}</v-col>
											<v-col class="d-flex justify-content-center align-items-center">{{ estimatedTimeToComplete.cpe_terminationDate }}</v-col>
										</v-row>
									</v-container>
								</section>
								<section v-if="creditsAvailable && creditsAvailable.length > 0">
									<h4>Credits Available</h4>
									<div class="d-flex flex-column gap-2.5">
										<p
											class="ma-0" 
											v-for="(credAvail, credAvail_ndx) in creditsAvailable"
											:key="credAvail_ndx"
										>
											{{ credAvail.creditType }}: {{ credAvail.actualCredit }}
										</p>
									</div>
								</section>
								<section v-if="credits && credits.length > 0">
									<h4>Estimated time for completion of this activity:</h4>
									<div class="d-flex flex-column gap-2.5">
										<p
											class="ma-0" 
											v-for="(cred, cred_ndx) in credits"
											:key="cred_ndx"
										>
											{{ cred.creditType }}: {{ cred.actualCredit }}
										</p>
										<p v-if="isMoc" class="ma-0 font-italic">You are Eligible for AMA PRA Category 1 Credit(s)<sup>&trade;</sup> ABIM MOC points</p>
									</div>
								</section>
								<section v-if="cmeInstructions && cmeInstructions.length > 0">
									<div>
										<div
											v-for="(instruction, instruction_ndx) in cmeInstructions"
											:key="instruction_ndx"
										>
											<div class="cme-instructions" v-html="instruction.cmeInstructions"></div>
											<p v-if="instruction.noFeeDisclaimer">{{ instruction.noFeeDisclaimer }}</p>
										</div>
									</div>
								</section>
								<section v-if="contactInfo">
									<div v-html="contactInfo"></div>
								</section>
								<section v-if="targetAudience">
									<h4>Target Audience</h4>
									<p>{{ targetAudience }}</p>
								</section>
								<section v-if="activityGoal">
									<h4>Activity Goal</h4>
									<p>{{ activityGoal }}</p>
								</section>
								<section v-if="learningObjectives && learningObjectives.length > 0">
									<h4>Learning Objective(s)</h4>
									<ul class="custom-list">
										<li 
											v-for="(objective, objective_ndx) in learningObjectives"
											:key="objective_ndx"
											class="ma-0"
										>{{ objective.objective }}</li>
									</ul>
								</section>
								<section v-if="cmeInfo && cmeInfo.length > 0">
									<div>
										<div
											v-for="(info, info_ndx) in cmeInfo"
											:key="info_ndx"
										>
											<div class="cme-instructions" v-html="info.creditDesignation"></div>
										</div>
									</div>
								</section>
								<section v-if="disclosureInformation">
									<h4>Disclosure Information</h4>
									<div v-html="disclosureInformation"></div>
								</section>
								<section v-if="mutualResponsibility">
									<div v-html="mutualResponsibility"></div>
								</section>
							</section>
							<footer class="mt-5">
								<p v-if="trademark" v-html="trademark"></p>
								<p v-if="jobnum">{{ jobnum }}</p>
							</footer>
						</article>
					</div>
				</div>
			</section>
			<footer class="d-flex flex-row justify-content-center">
				<v-btn 
					class="primary-color ma-2"
					icon 
					dark 
					@click="$store.dispatch('hideCmeInfo')"
				>
					<div><v-icon>mdi-close</v-icon></div>
				</v-btn>
			</footer>
		</div>
	</v-card>
</template>

<script>
export default {
	name: 'CmeInfo',
	computed: {
		content() {
			return this.$store.getters?.refData?.cme_information
		},
		isMoc() {
			return this?.content?.is_moc == 1
		},
		label() {
			return this.isMoc
				? 'CME/CE/ABIM MOC'
				: 'CME/CE'
		},
		funderLine() {
			return this?.content
				?.funderInfo[0]
				?.funderHTML
		},
		faculty() {
			return this?.content?.faculty
		},
		estimatedTimeToComplete() {
			return this?.content?.estimatedTimeToComplete[0]
		},
		creditsAvailable() {
			return this?.content?.credits_available
		},
		credits() {
			return this?.content?.credits
		},
		cmeInstructions() {
			return this?.content?.cmeInstructions
		},
		contactInfo() {
			return this?.content?.contactInfo
		},
		targetAudience() {
			return this?.content?.targetAudience
		},
		activityGoal() {
			return this?.content?.activityGoal
		},
		learningObjectives() {
			return this?.content?.learningObjectives
		},
		cmeInfo() {
			return this?.content?.cmeInfo
		},
		disclosureInformation() {
			return this?.content?.disclosureInformation
		},
		mutualResponsibility() {
			return this?.content?.mutualResponsibility
		},
		trademark() {
			return this?.content?.trademark
		},
		jobnum() {
			return this.$store.getters?.refData?.jobnum
		},
		isCmeInfoVisible() {
			return this.$store.getters.isCmeInfoVisible
		},
		animationTimeline() {
			return this.gsap.timeline({
				defaults: { 
					duration: 0.3,
					ease: 'none',
				}
			})
		}
	},
	watch: {
		isCmeInfoVisible(to) {
			if (to) this.showCmeInfo()
			else this.hideCmeInfo()
		} 
	},
	mounted() {
		console.log(this.$store.getters?.refData?.cme_information)
		if (this.isCmeInfoVisible) this.showCmeInfo()
		else this.hideCmeInfo()
	},
	methods: {
		showCmeInfo() {
			this.animationTimeline
				.to(this.$el, {
					height: '100%',
					maxHeight: '100%'
				})
		},
		hideCmeInfo() {
			this.animationTimeline
				.to(this.$el, {
					height: 0,
					maxHeight: 0
				})
		}
	}
}
</script>

<style lang="scss" scoped>
.cme-info {
	z-index: 999; 
	height: 0;

	article {
		> section {
			> section {
				padding: 24px 0px;
				border-bottom: 1px solid #d7d2cd;

				h4 {
					margin-bottom: 16px !important;
				}
			}
		}
		img {
			margin-bottom: 0 !important;
		}
	}

	.faculty-image {
		min-width: 120px;
		img {
			min-width: 100%;
		}
	}

	// .ettc-table {
	// 	> div {
	// 		> div {
	// 			padding:
	// 		}
	// 	}
	// }
}
</style>

<style>
.cme-funder-line p { margin-bottom: 0 !important; }
.cme-instructions h3 { font-size: calc(1.275rem + 0.3vw) !important; }
</style>