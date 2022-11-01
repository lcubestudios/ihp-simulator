<template>
	<div class="w-100 h-100 d-flex justify-content-center align-items-center">
		<div><span class="loader"></span></div>
	</div>
</template>

<script>
export default {
	name: 'PageLoader'
}
</script>

<style scoped>
.loader {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: block;
  margin:15px auto;
  position: relative;
  background: #d4e4cd;
  box-shadow: -24px 0 #d4e4cd, 24px 0 #d4e4cd;
  box-sizing: border-box;
  animation: shadowPulse 2s linear infinite;
}

@keyframes shadowPulse {
  33% {
    background: #d4e4cd;
    box-shadow: -24px 0 #4e9d2d, 24px 0 #d4e4cd;
  }
  66% {
    background: #4e9d2d;
    box-shadow: -24px 0 #d4e4cd, 24px 0 #d4e4cd;
  }
  100% {
    background: #d4e4cd;
    box-shadow: -24px 0 #d4e4cd, 24px 0 #4e9d2d;
  }
}
</style>