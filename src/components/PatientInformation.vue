<template>
  <div class="tabs-menu d-flex flex-column h-100 w-100">
    <ul class="menu cf">
			<li
				v-if="profile"
				:class="{
					'active': currView === 'profile'
				}"
				@click="toggleView('profile')"
			>
				<a class="top-10" v-text="'Profile'"></a>
			</li>
			<li
				v-if="history"
				:class="{
					'active': currView === 'history'
				}"
				@click="toggleView('history')"
			>
				<a class="top-10" v-text="'History'"></a>
			</li>
			<li
				v-if="physical"
				:class="{
					'active': currView === 'physical'
				}"
				@click="toggleView('physical')"
			>
				<a class="top-10" v-text="'Physical'"></a>
			</li>
			<li
				v-if="vitals"
				:class="{
					'active': currView === 'vitals'
				}"
				@click="toggleView('vitals')"
			>
				<a class="top-10" v-text="'Vitals'"></a>
			</li>
			<li
				v-if="tests"
				class="d-none"
				:class="{
					'active': currView === 'tests'
				}"
				@click="toggleView('tests')"
			>
				<a class="top-10" v-text="'Tests'"></a>
			</li>
			<li
				v-if="findings"
				:class="{
					'active': currView === 'findings'
				}"
				@click="toggleView('findings')"
			>
				<a class="top-10" v-text="'Findings'"></a>
			</li>
    </ul>
    <div class="content-box flex-grow-1 d-flex flex-column h-100">
			<section class="patient-video position-relative w-100">
				<div class="gray2-bg h-100">
					<div class="video h-100">
						<video 
							id="patientVideo" 
							class="max-h-100" 
							:poster="patient_video_thumbnail"
							@pause="onVideoPause"
							@play="onVideoPlay"
							playsinline
							muted
						>
							<source 
								:src="patient_video_url"
								type="video/mp4"
							/>
						</video>
					</div>
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
			</section>
			<section class="flex-grow-1 position-relative">
				<div class="position-absolute top-2.5 left-2.5 bottom-2.5 right-2.5 overflow-y-auto">
					<div 
						v-if="profile"
						v-show="currView === 'profile'"
						class="patient-profile"
					>
						<v-container>
							<v-row 
								v-if="introduction"
								class="mb-4"
								no-gutters
							>
								<p class="pa-0 ma-0" v-html="introduction"></p>
							</v-row>
							<v-row 
								class="mb-4"
								v-for="(info, info_ndx) in profile"
								:key="info_ndx"
								no-gutters
							>
								<v-col cols="6">
									<h6 class="primary-color fw-bold">{{ info.label }}</h6>
								</v-col>
								<v-col cols="6">
									{{ info.value }}
								</v-col>
							</v-row>
						</v-container>
					</div>
					<div 
						v-if="history"
						v-show="currView === 'history'"
						class="medical-history"
					>
						<v-container>
							<v-row 
								v-if="history.description"
								class="mb-4"
								no-gutters
							>
								<div v-html="history.description"></div>
							</v-row>
							<v-row 
								class="mb-4"
								no-gutters
							>
								<v-expansion-panels class="rounded-0" accordion>
									<v-expansion-panel
										v-for="(hist, hist_ndx) in history.data"
										:key="hist_ndx"
									>
										<v-expansion-panel-header class="px-0">
											<p class="ma-0 font-16">{{ hist.label }}</p>
										</v-expansion-panel-header>
										<v-expansion-panel-content class="font-12">
											<template v-if="typeof hist.value === 'object'">
												<v-container>
													<v-row 
														class="mb-4"
														v-for="(hist_arr, hist_arr_ndx) in hist.value"
														:key="hist_arr_ndx"
														no-gutters
													>
														<v-col cols="5">
															<h6 class="primary-color font-12 fw-bold">{{ hist_arr.label }}</h6>
														</v-col>
														<v-col cols="7">
															<div v-html="hist_arr.value"></div>
														</v-col>
													</v-row>
												</v-container>

											</template>
											<template v-else-if="typeof hist.value === 'string'">
												<div v-html="hist.value"></div>
											</template>
										</v-expansion-panel-content>
									</v-expansion-panel>
								</v-expansion-panels>
							</v-row>
						</v-container>
					</div>
					<div 
						v-if="physical"
						v-show="currView === 'physical'"
						class="physical-exams"
					>
						<v-container>
							<v-row 
								v-if="physical.description"
								class="mb-4"
								no-gutters
							>
								<div v-htm="physical.description"></div>
							</v-row>
							<v-row 
								class="mb-4"
								no-gutters
							>
								<v-expansion-panels class="rounded-0" accordion>
									<v-expansion-panel
										v-for="(phys, phys_ndx) in physical.data"
										:key="phys_ndx"
									>
										<v-expansion-panel-header class="px-0 py-2.5">
											<p class="ma-0 font-16">{{ phys.label }}</p>
										</v-expansion-panel-header>
										<v-expansion-panel-content class="font-12">
											<template v-if="typeof phys.value === 'Array'">
												<v-container>
													<v-row 
														class="mb-4"
														v-for="(phys_arr, phys_arr_ndx) in phys.value"
														:key="phys_arr_ndx"
														no-gutters
													>
														<v-col cols="5">
															<h6 class="primary-color fw-bold">{{ phys_arr.label }}</h6>
														</v-col>
														<v-col cols="7">
															<div v-html="phys_arr.value"></div>
														</v-col>
													</v-row>
												</v-container>

											</template>
											<template v-else-if="typeof phys.value === 'string'">
												<div v-html="phys.value"></div>
											</template>
										</v-expansion-panel-content>
									</v-expansion-panel>
								</v-expansion-panels>
							</v-row>
						</v-container>
					</div>
					<div 
						v-if="vitals"
						v-show="currView === 'vitals'"
						class="vitals-sign"
					>
						<v-container>
							<v-row 
								class="mb-4"
								v-for="(vital, vital_ndx) in vitals"
								:key="vital_ndx"
								no-gutters
							>
								<v-col cols="6">
									<h6 class="primary-color fw-bold">{{ vital.label }}</h6>
								</v-col>
								<v-col cols="6">
									<p v-if="vital.value">{{ vital.value }}</p>
									<p 
										v-for="(other, vital_other_ndx) in vital.other"
										:key="vital_other_ndx"
									><strong>{{ other.label }}</strong>: {{ other.value }}</p>
								</v-col>
							</v-row>
						</v-container>
					</div>
					<div 
						v-if="findings"
						v-show="currView === 'findings'"
						class="key-findings"
					>
						<v-container>
							<v-row  no-gutters>
								<ul class="custom-list">
									<li
										v-for="(finding, finding_ndx) in findings"
										:key="finding_ndx"
									>
										<p v-if="finding">{{ finding }}</p>
									</li>
								</ul>
							</v-row>
						</v-container>
					</div>
				</div>
			</section>
    </div>
  </div>
  <!--/tabs-menu-->
</template>

<script>
export default {
  name: "PatientInformation",
	props: {
		defaultView: {
			type: String,
			default: 'findings'
		},
		autoPlay: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			currView: this.defaultView,
			isVideoPlaying: false,
		}
	},
	watch: {
		isClipboardVisible(to) {
			if (to) this.setDefaultView()
		},
		isGuruIntroComplete(to) {
			if (to) {
				this.$el.querySelector('#patientVideo').play()
				this.$el.querySelector('#patientVideo').muted = false
				this.toggleView('profile')
			}
		},
		isPatientIntroComplete(to) {
			if (to) this.toggleView('findings')
		}
	},
	computed: {
		isGuruIntroComplete() {
			return this.$store.getters.isGuruIntroComplete
		},
		isPatientIntroComplete() {
			return this.$store.getters.isPatientIntroComplete
		},
		isClipboardVisible() {
			return this.$store.getters.isClipboardVisible
		},
		info() {
			return this.$store.getters?.refData?.patient_information
		},
		patient_video_url() {
			return this?.info?.patient_video_url
		},
		patient_video_thumbnail() {
			return this?.info?.patient_video_thumbnail
		},
		vitals() {
			return this?.info?.vitals
		},
		introduction() {
			return this?.info?.introduction
		},
		profile() {
			return this?.info?.profile
		},
		history() {
			return this?.info?.medical_history
		},
		physical() {
			return this?.info?.physical_exams
		},
		tests() {
			return this?.info?.tests
		},
		findings() {
			return this?.info?.key_findings
		}
	},
	mounted() {
		if (!this.$store.getters.isPatientIntroComplete
		&& this.$store.getters.isGuruIntroComplete) {
			setTimeout(() => {
				this.$el.querySelector('#patientVideo').play()
				this.$el.querySelector('#patientVideo').muted = false
			}, 150)
		}
		this.setDefaultView()
	},
  methods: {
		setDefaultView() {
			if (!this.$store.getters.isPatientIntroComplete && this.$store.getters.isGuruIntroComplete) this.toggleView('profile')
			else this.toggleView('findings')
		},
		onVideoPlay() {
			this.isVideoPlaying = true
		},
		onVideoPause() {
			this.isVideoPlaying = false
		},
		toggleView(id) {
			this.currView = id
		},
		toggleVideo() {
			const video = this.$el.querySelector('#patientVideo')

			if (this.isVideoPlaying) video.pause()
			else video.play()
		}
  },
};
</script>


<style lang="scss" scoped>
.v-list-item--active {
  border-left: 3px solid #4e9d2d;
}

.patient-video {
	height: 240px;
	.video {
		display: flex;
		justify-content: center;
		> * {
			height: 100%;
			max-height: 100%;
			max-width: 100%;
		}
	}
}

.vital-sign-header {
	border-bottom: 1px solid #d4e4cd !important;
}

.tabs-menu {
  background-color: #fff;
  overflow: hidden;
  width: 100%;
  border-bottom-left-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
  border-top-right-radius: 5px;
}
.menu > li:last-child {
  border-bottom-left-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
}
/* Clearing floats */
.cf:before,
.cf:after {
  content: " ";
  display: table;
}
.cf:after {
  clear: both;
}
.cf {
  *zoom: 1;
}
/* Mini reset, no margins, paddings or bullets */
.menu,
.submenu {
  margin: 0;
  padding: 0;
  list-style: none;
}
/* Main level */
.menu {
  margin-left: 0px;
  display: flex;
  position: relative;
  right: 5px;
}
.menu > li {
  background: #d4e3cd;
  float: left;
  position: relative;
  transform: skewX(13deg);
  border-top-right-radius: 5px;
  width: 100%;
  box-shadow: 2px 0px 4px rgb(0 0 0 / 8%);
  border-right: 1px solid #eeeeee;
  margin-right: 1px;
}
.menu > li:hover a {
  color: #ffffff;
}
.menu a {
  display: block;
  color: #909090;
  text-decoration: none;
  font-size: 10px;
  text-align: center;
}
.menu a:hover {
  color: #ffffff;
}
.menu li:hover {
  background-color: #4e9d2d;
}
.menu > li > a {
  transform: skewX(-13deg);
  padding: 10px 5px;
}
.active {
  background-color: #4e9d2d !important;
  color: #ffffff !important;
	font-weight: bold !important;
}
.active-text {
  color: #ffffff !important;
}
li.active a {
  color: #ffffff !important;
}

/*-------scroll-------*/
.tab-content {
  min-height: 1000px;
}
.scroll-box {
  overflow: auto;
}
.scroll-box::-webkit-scrollbar {
  width: 4px;
  border-radius: 10px;
}
.scroll-box::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.scroll-box::-webkit-scrollbar-thumb {
  // background: #4E9D2D;
  background: #128612;
  border-radius: 10px;
}
.scroll-box::-webkit-scrollbar-thumb:hover {
  // background: #3d891c;
  background: #e0e0e0;
  border-radius: 10px;
}
/*-------/scroll-------*/

/*--svg css2--*/
.st0 {
  fill: #4e9d2d;
}
.st1 {
  fill: #f1f2f2;
}
.st2 {
  font-family: "ArialMT";
}
.st3 {
  font-size: 36px;
}
.st4 {
  fill: #d4e3cd;
}
/*--svg css2--*/
</style>