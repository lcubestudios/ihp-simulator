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
									<p v-html="funderLine"></p>
								</section>
								<section v-if="content.authorbyline">
									<h4>Medical Writer</h4>
									<p v-html="content.authorbyline"></p>
								</section>
								<section v-if="content.reviewerbyline">
									<h4>Reviewer</h4>
									<p v-html="content.reviewerbyline"></p>
								</section>
								<section v-if="content.releasedate">
									<h4>{{ label }}</h4>
									<table class="table-auto w-full border border-gray-004 text-center">
										<tr class="border-b border-gray-004">
											<th class="border-r border-gray-004"></th>
											<th class="border-r border-gray-004">Physicians</th>
											<th>Nurses</th>
										</tr>
										<tr class="border-b border-gray-004">
											<td class="border-r border-gray-004"><strong>Release Date</strong></td>
											<td class="border-r border-gray-004">{{ content.releasedate.split(' ')[0] }}</td>
											<td>{{ content.releasedate.split(' ')[0] }}</td>
										</tr>
										<tr v-if="content.termdate">
											<td class="border-r border-gray-004"><strong>Termination Date</strong></td>
											<td class="border-r border-gray-004">{{ content.termdate }}</td>
											<td>{{ content.termdate }}</td>
										</tr>
									</table>
								</section>
								<section v-if="hasEstimate">
									<h4>Estimated time for completion of this activity</h4>
									<p v-if="content.cme_credit">CME: {{ content.cme_credit }}</p>
									<p v-if="content.ce_credit">CNE: {{ content.ce_credit }}</p>
									<p v-if="hasMoc">{{ content.moc_credit_information }}</p>
								</section>
								<section v-if="content.cmedisclosures">
									<h4>CME/CE Instructions</h4>
									<p v-html="content.cmedisclosures"></p>
								</section>
								<section v-if="content.contact_information">
									<h4>Contact Information</h4>
									<p v-html="content.contact_information"></p>
								</section>
								<section v-if="content.target_audience">
									<h4>Target Audience</h4>
									<p v-html="content.target_audience"></p>
								</section>
								<section v-if="content.activity_goal">
									<h4>Activity Goal</h4>
									<p v-html="content.activity_goal"></p>
								</section>
								<section v-if="content.learning_objectives">
									<h4>Learning Objectives</h4>
									<p v-html="content.learning_objectives"></p>
								</section>
								<section v-if="content.cme_statement">
									<p v-html="content.cme_statement"></p>
								</section>
								<section v-if="content.nursingcestatement">
									<p v-html="content.nursingcestatement"></p>
								</section>
								<section v-if="content.responsibility_contract">
									<h4>Contract for Mutual Responsibility in CME/CE</h4>
									<p v-html="content.responsibility_contract"></p>
								</section>
							</section>
							<footer class="mt-5">
								<p v-if="content.trademark" v-html="content.trademark"></p>
								<p v-if="content.jobnum">{{ content.jobnum }}</p>
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
			return null // this.$store.getters?.refData?.cme_information
		},
		label() {
			return this?.content?.is_moc == 1
				? 'CME/CE/ABIM CE'
				: 'CME/CE'
		},
		funderLine() {
			return this?.content
				?.funderInfo[0]
				?.funderHTML
		},
		facebulty() {
			return this?.content
				?.faculty
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
		section {
			border-bottom: 1px solid #d7d2cd;
		}
		img {
			margin-bottom: 0 !important;
		}
	}
}
</style>