<template>
	<div class="h-100 d-flex flex-row flex-nowrap">
		<v-container class="content-container h-100">
			<v-row class="h-100 position-relative overflow-hidden" no-gutters>
				<section 
					class="d-none pa-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
				>
					<h3 class="primary-color">Invalid Job Number - {{ $route.params.jn }}</h3>
				</section>
			</v-row>
		</v-container>
	</div>
</template>

<script>
export default {
	name: "InvalidPage",
}
</script>