<template>
	<div class="result position-relative">
		<header class="mb-4 d-flex flex-row gap-2 align-items-end">
			<h4 class="font-18 fw-bold ma-0">Results</h4>
			<p v-if="hasLabs" class="ma-0 font-12">(click on all <v-icon size="20" color="#222121">mdi-clipboard-text</v-icon> to continue)</p>
		</header>
		<section>
			<ResultItem 
				v-for="(choice, choice_index) in choices" 
				:key="choice_index"
				:data="choice"
				:answers="answers"
			/>
		</section>
		<template v-if="pastAssessments && pastAssessments.length > 0">
			<header class="my-4 d-flex flex-row gap-2 align-items-end">
				<h4 class="font-18 fw-bold ma-0">Past Assessments</h4>
			</header>
			<section>
				<ResultItem 
					v-for="(assessment, assessment_index) in pastAssessments" 
					:key="assessment_index"
					:data="assessment"
				/>
			</section>
		</template>
	</div>
</template>

<script>
import ResultItem from '@/components/ResultItem'

export default {
	name: "UiResult",
	components: {
		ResultItem
	},
	props: {
		question: {
			type: String,
			default: null
		},
		choices: {
			type: Array,
			default: () => []
		},
		answers: {
			type: Array,
			default: () => []
		},
		feedback: {
			type: String,
			default: null
		},
		notes: {
			type: String,
			default: null
		},
		testResults: {
			type: Object,
			default: () => {}
		},
	},
	computed: {
		hasLabs() {
			return this.choices
				.filter((choice) => 
					!!choice.choice_labs 
				).length > 0
		},
		pastAssessments() {
			console.log(this.choices
				.filter((choice) => 
					choice.choice_labs 
					&& !choice.choice_is_correct
				))
			return this.choices
				.filter((choice) => 
					choice.choice_labs 
					&& !choice.choice_is_correct
				)
		}
	},
	mounted() {
	}
};
</script>