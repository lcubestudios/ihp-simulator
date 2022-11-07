
import VueRouter from 'vue-router'
import ErrorPage from '@/pages/404'
import MissingPage from '@/pages/Missing'
import InvalidPage from '@/pages/Invalid'
import Simulator from '@/pages/Simulator'


const routes = [
	{
		path: '/:jn',
		name: 'simulator',
		component: Simulator,
	},
	{
		path: '/',
		name: 'missing',
		component: MissingPage,
		meta: {
			hideAll: 1
		}
	},
	{
		path: '/invalid/:jn',
		name: 'invalid',
		component: InvalidPage,
		meta: {
			hideAll: 1
		}
	},
	{
		path: '*',
		name: 'error',
		component: ErrorPage,
		meta: {
			hideAll: 1
		}
	}
]

// Create Vue Router Object
const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
