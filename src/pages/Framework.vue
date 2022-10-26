<template>
	<v-container class="content-container h-100">
		<v-row class="h-100" no-gutters>
			<v-col class="h-100 position-relative overflow-y-auto" cols="6">
				<div class="position-absolute top-0 w-100 h-100 max-h-100 overflow-y-auto">
					<div class="test">
						Left
					</div>
				</div>
			</v-col>
			<v-col class="h-100 position-relative" cols="6">
				<div class="position-absolute top-0 w-100 h-100 max-h-100 overflow-y-auto">
					<div class="test">
						Right
					</div>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: 'FrameworkPage'
}
</script>

<style scoped>
.test-wrap {
	height: 200px;
	max-height: 200px;
}

.test { height: 2000px; }
</style>