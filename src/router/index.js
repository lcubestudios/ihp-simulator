
import VueRouter from 'vue-router'
import Framework from '@/pages/Framework'
import Demo from '@/pages/Demo'


const routes = [
	{
		path: '/',
		name: 'Demo',
		component: Demo,
	},
	{
		path: '/framework',
		name: 'Framework',
		component: Framework,
	},
]

// Create Vue Router Object
const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
