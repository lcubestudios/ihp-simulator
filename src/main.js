import Vue from 'vue'
import App from '@/App.vue'

// UI Kits
import vuetify from '@/plugins/vuetify'
import { BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Axios
import axios from 'axios'
import VueAxios from 'vue-axios'

// Routes
import VueRouter from 'vue-router'
import router from '@/router'

// Store
import store from '@/store'

// Styling
import '@/assets/scss/main.scss'
import 'vuetify/dist/vuetify.min.css'

// Mixins
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger"
import VueCookies from 'vue-cookies'

gsap.registerPlugin(ScrollTrigger);

Vue.config.productionTip = false

Vue
	.use(VueRouter)
	.use(VueAxios, axios)
	.use(BootstrapVue)
	.use(BootstrapVueIcons)
	.use(VueCookies)
	.mixin({
		created: function () {
			this.gsap = gsap;
		}
	});

new Vue({
  vuetify,
  router,
	store,
  render: h => h(App)
}).$mount('#app')
