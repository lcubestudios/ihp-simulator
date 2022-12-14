<template>
	<form class="form" @submit.prevent="">
		<div class="check-list">
			<p>{{ question }} </p>
			<div>
				<template v-if="type === 'multiselect'">
					<div class="d-flex flex-column gap-3 disabled">
						<template v-if="isCompleted">
							<div
								v-for="(choice, choice_ndx) in choices" 
								:key="choice_ndx"
								class="d-flex align-items-start black-label"
							>
								<v-checkbox 
									:id="name + '_' + choice_ndx"
									class="ma-0 pa-0 black-label" 
									:name="name + '_' + choice_ndx"
									:true-value="choice.choice_value"
									:ripple="false"
									disabled
									color="#4e9d2d"
									:input-value="isAnswered(choice.choice_order)"
								></v-checkbox>
								<label 
									:for="name + '_' + choice_ndx" 
									class="v-label theme--light" 
									style="left: 0px; right: auto; position: relative;" 
									v-html="choice.choice_text"
								></label>
							</div>
						</template>
						<template v-else>
							<div
								v-for="(choice, choice_ndx) in choices" 
								:key="choice_ndx"
								class="d-flex align-items-start black-label"
							>
								<v-checkbox 
									:id="name + '_' + choice_ndx"
									class="ma-0 pa-0 black-label" 
									:name="name + '_' + choice_ndx"
									:true-value="choice.choice_value"
									:ripple="false"
									color="#4e9d2d"
								></v-checkbox>
								<label 
									:for="name + '_' + choice_ndx" 
									class="v-label theme--light" 
									style="left: 0px; right: auto; position: relative;" 
									v-html="choice.choice_text"
								></label>
							</div>
						</template>
					</div>
				</template>
				<template v-if="type === 'multichoice'">
					<template v-if="isCompleted">
						<v-radio-group v-model="selectedRadio">
							<div class="d-flex flex-column gap-3">
								<div
									v-for="(choice, choice_ndx) in choices" 
									:key="choice_ndx"
									class="d-flex align-items-start black-label"
								>
									<v-radio 
										:id="name + '_' + choice_ndx"
										class="ma-0 pa-0 black-label" 
										:name="name + '_' + choice_ndx"
										:value="choice.choice_value"
										:true-value="choice.choice_value"
										:ripple="false"
										disabled
										color="#4e9d2d"
										:input-value="isAnswered(choice.choice_order)"
									></v-radio>
									<label 
										:for="name + '_' + choice_ndx" 
										class="v-label theme--light" 
										style="left: 0px; right: auto; position: relative;" 
										v-html="choice.choice_text"
									></label>
								</div>
							</div>
						</v-radio-group>
					</template>
					<template v-else>
						<v-radio-group>
							<div class="d-flex flex-column gap-3">
								<div
									v-for="(choice, choice_ndx) in choices" 
									:key="choice_ndx"
									class="d-flex align-items-start black-label"
								>
									<v-radio 
										:id="name + '_' + choice_ndx"
										class="ma-0 pa-0 black-label" 
										:name="name + '_' + choice_ndx"
										:value="choice.choice_value"
										:true-value="choice.choice_value"
										:ripple="false"
										color="#4e9d2d"
									></v-radio>
									<label 
										:for="name + '_' + choice_ndx" 
										class="v-label theme--light" 
										style="left: 0px; right: auto; position: relative;" 
										v-html="choice.choice_text"
									></label>
								</div>
							</div>
						</v-radio-group>
					</template>
				</template>
			</div>
		</div>
	</form>
</template>

<script>
export default {
	name: "UiForm",
	props: {
		data: {
			type: Object,
			default: () => {}
		},
		stage: {
			type: Number,
			default: null
		},
		group: {
			type: Number,
			default: null
		},
		view: {
			type: Number,
			default: null
		},
	},
	computed: {
		question() {
			return this?.data?.question
		},
		type() {
			return this?.data?.type
		},
		choices() {
			return this?.data?.choices
				.filter((choice) => !choice.choice_is_hidden)
		},
		answers() {
			return this?.data?.answers
		},
		feedback() {
			return this?.data?.feedback
		},
		notes() {
			return this?.data?.notes
		},
		testResults() {
			return this?.data?.test_results
		},
		name() {
			return this?.data?.name
		},
		isCompleted() {
			return this.$store.getters?.progress?.stages
				.filter(
					(stage) => stage.stage === this.stage
						&& stage.group === this.group
						&& stage.type === 'question'
				)[0]
				.isCompleted
		},
		selectedRadio()  {
			return this.$store.getters?.progress?.stages
				.filter(
					(stage) => stage.stage === this.stage
						&& stage.group === this.group
						&& stage.type === 'question'
				)[0]
				.answers[0]
				.choice_order
		}
	},
	methods: {
		isAnswered(id) {
			return this.answers.filter((item) => item.choice_order === id).length > 0
		},
	}
};
</script>

<style lang="scss" scoped>
.form {
	label {
		margin-top: 0.25em;
		height: auto !important;
	}
}
</style>