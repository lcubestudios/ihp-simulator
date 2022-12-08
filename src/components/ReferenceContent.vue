<template>
	<section class="flex-grow-1 position-relative">
		<div class="position-absolute top-0 left-0 right-0 bottom-0">
			<div class="w-100 h-100 pa-5 overflow-y-auto">
				<h2 v-if="showTitle" class="primary-color">References</h2>
				<ol 
					v-if="references && references.length > 0"
					class="reference-list"
				>
					<li
						v-for="(reference, reference_ndx) in references"
						:key="reference_ndx"
					>
						<p>
							<span v-html="reference.title"></span>
							<a 
								v-if="reference.href"
								:href="reference.href"
								target="_blank"
								rel="noreferrer nofollow"
							>
								{{ reference.link_text || reference.href }}
							</a>
						</p>
					</li>
				</ol>
			</div>
		</div>
	</section>
</template>

<script>
export default {
	name: 'ReferenceContent',
	computed: {
		references() {
			return this.$store.getters?.refData?.references
		},
	},
	props: {
		showTitle: {
			type: Boolean,
			default: true
		}
	}
}
</script>