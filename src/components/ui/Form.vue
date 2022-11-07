<template>
	<form class="form" @submit.prevent="">
		<div class="check-list">
			<p>{{ question }} </p>
			<div>
				<template v-if="type === 'multiselect'">
					<div class="d-flex flex-column gap-3 disabled">
						<template v-if="isCompleted">
							<v-checkbox 
								v-for="(choice, choice_ndx) in choices" 
								:key="choice_ndx"
								class="ma-0 pa-0 black-label" 
								:name="name + '_' + choice_ndx"
								:label="choice.choice_text" 
								:true-value="choice.choice_value"
								:ripple="false"
								disabled
								color="#4e9d2d"
								:input-value="isAnswered(choice.choice_order)"
							></v-checkbox>
						</template>
						<template v-else>
							<v-checkbox 
								v-for="(choice, choice_ndx) in choices" 
								:key="choice_ndx"
								class="ma-0 pa-0 black-label" 
								:name="name + '_' + choice_ndx"
								:label="choice.choice_text" 
								:true-value="choice.choice_value"
								:ripple="false"
								color="#4e9d2d"
							></v-checkbox>
						</template>
					</div>
				</template>
				<template v-if="type === 'multichoice'">
					<template v-if="isCompleted">
						<v-radio-group v-model="selectedRadio">
							<div class="d-flex flex-column gap-3">
								<v-radio 
									v-for="(choice, choice_ndx) in choices" 
									:key="choice_ndx"
									class="ma-0 pa-0 black-label" 
									:name="name + '_' + choice_ndx"
									:label="choice.choice_text" 
									:value="choice.choice_value"
									:true-value="choice.choice_value"
									:ripple="false"
									disabled
									color="#4e9d2d"
									:input-value="isAnswered(choice.choice_order)"
								></v-radio>
							</div>
						</v-radio-group>
					</template>
					<template v-else>
						<v-radio-group>
							<div class="d-flex flex-column gap-3">
								<v-radio 
									v-for="(choice, choice_ndx) in choices" 
									:key="choice_ndx"
									class="ma-0 pa-0 black-label" 
									:name="name + '_' + choice_ndx"
									:label="choice.choice_text" 
									:value="choice.choice_value"
									:true-value="choice.choice_value"
									:ripple="false"
									color="#4e9d2d"
								></v-radio>
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