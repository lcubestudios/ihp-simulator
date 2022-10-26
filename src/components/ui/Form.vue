<template>
	<form class="form" @submit.prevent="">
		<div class="check-list">
			<p>{{ question }}</p>
			<div>
				<template v-if="type === 'multiselect'">
					<div class="d-flex flex-column gap-3">
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
					</div>
				</template>
				<template v-if="type === 'multichoice'">
					<v-radio-group>
						<div class="d-flex flex-column gap-3">
							<v-radio 
								v-for="(choice, choice_ndx) in choices" 
								:key="choice_ndx"
								class="ma-0 pa-0 black-label" 
								:name="name + '_' + choice_ndx"
								:label="choice.choice_text" 
								:true-value="choice.choice_value"
								:ripple="false"
								color="#4e9d2d"
							></v-radio>
						</div>
					</v-radio-group>
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
		}
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
		}
	},
	mounted() {
		// console.log(this.data)
	}
};
</script>