<template>
	<v-card class="auth d-flex flex-row justify-content-center align-items-center primary-light-bg h-100 w-100">
		<form id="loginForm" class="w-100 px-2.5" @submit.prevent="userLogin">
			<div class="pa-3 centric-inner">
				<div>
					<v-text-field
						v-model="email" 
						label="Email" 
						solo 
						required
					></v-text-field>
				</div>
				<div>
					<v-text-field
						v-model="password" 
						label="Password" 
						solo 
						required
					></v-text-field>
				</div>
				<v-btn 
					class="text-white primary-bg" 
					type="submit"
					large 
					block
				>
					LOG IN
				</v-btn>
			</div>
		</form>
	</v-card>
</template>

<script>
export default {
	name: 'PageAuth',
	data() {
		return {
			email: null,
			password: null
		}
	},
	methods: {
		userLogin() {
			this.$store.dispatch('userLogin', {
				email: this.email,
				password: this.password,
			})
		}
	}
}
</script>