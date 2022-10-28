
import Vue from 'vue'
import Vuex from 'vuex'
import test from '@/data/test.json'

Vue.use(Vuex)

const state = () => {
	return {
		appMode: 'desktop',
		sidebarView: 0,
		isNavMenuVisible: false,
		isClipboardVisible: false,
		currStage: 0,
		currGroup: 0,
		currView: 0,
		isContinueEnabled: true,
		continueButtonText: 'Continue',
		caseData: test,
		stages: {},
		isLightBoxVisible: false,
		lightBoxImage: null,
		isReferencesVisible: false,
		isCmeInfoVisible: false,
	}
}

const mutations = {
	setCaseData(state, val) {
		state.caseData = val
	},
	setStages(state, val) {
		state.stages = val
	},
	setAppMode(state, val) {
		state.appMode = val
	},
	setSidebarView(state, val) {
		state.sidebarView = val
	},
	setNavMenuVisible(state, val) {
		state.isNavMenuVisible = val
	},
	setClipboardVisible(state, val) {
		state.isClipboardVisible = val
	},
	setCurrStage(state, val) {
		state.currStage = val
	},
	setCurrView(state, val) {
		state.currView = val
	},
	setCurrGroup(state, val) {
		state.currGroup = val
	},
	setContinueEnabled(state, val) {
		state.isContinueEnabled = val
	},
	setContinueButtonText(state, val) {
		state.continueButtonText = val
	},
	setAnswers(state, val) {
		state.stages[state.currStage]
			.questions[state.currGroup]
			.answers = val
	},
	setChoiceLabsRead(state, val) {
		state.stages[state.currStage]
			.questions[state.currGroup]
			.choices[
				state.stages[state.currStage]
				.questions[state.currGroup]
				.choices
				.findIndex((choice) => choice.choice_order == val)
			]
			.choice_is_labs_read = true
	},
	setLightBoxVisible(state, val) {
		state.isLightBoxVisible = val
	},
	setLightBoxImage(state, val) {
		state.lightBoxImage = val
	}
}

const actions = {
	submitAnalytics() {
		console.log('analytics')
	},
	setCaseData({ commit }, val) {
		commit('setCaseData', val)
	},
	setStages({ state, commit }) {
		const data = [
			...state.caseData.stages,
			{
				name: "Follow Up",
				type: "info",
				content: state.caseData.follow_up
			},
			{
				name: "Conclusions",
				type: "info",
				content: state.caseData.conclusions
			}
		]

		console.log(state.caseData)

		const views = []
		data
			.map((stage, stage_ndx) => {
				if (stage.type === 'question') {
					stage.questions
						.map((_, q_ndx) => {
							views.push(stage_ndx + '.' + q_ndx + '.0')
							views.push(stage_ndx + '.' + q_ndx + '.1')
						})
				}
				else if (stage.type === 'info') {
					views.push(stage_ndx + '.0')
				}
			})

		const key = state.currStage + '.' + state.currGroup + (data[state.currStage].type === 'question' ? '.0' : '')

		commit('setStages', data)
		commit('setCurrView', views.findIndex((view) => view === key))
	},
	setAppMode({ commit }, val) {
		commit('setAppMode', val)
	},
	setSidebarView({ commit }, val) {
		commit('setSidebarView', val)
	},
	setNavMenuVisible({ commit }, val) {
		commit('setNavMenuVisible', val)
	},
	showNavMenu({ dispatch }) {
		dispatch('setNavMenuVisible', true)
	},
	hideNavMenu({ dispatch }) {
		dispatch('setNavMenuVisible', false)
	},
	setClipboardVisible({ commit }, val) {
		commit('setClipboardVisible', val)
	},
	showClipboard({ dispatch }) {
		dispatch('setClipboardVisible', true)
	},
	hideClipboard({ dispatch }) {
		dispatch('setClipboardVisible', false)
	},
	setCurrStage({ commit }, val) {
		commit('setCurrStage', val)
	},
	setCurrView({ state, commit }, val) {
		commit('setCurrView', val)

		const groupKeys = []
		
		state.stages
			.forEach((stage) => {
				if (stage.type === 'question') {
					stage.questions
						.forEach((_, ndx) => {
							groupKeys.push(ndx)
							groupKeys.push(ndx)
						})
				}
				else if (stage.type === 'info') {
					groupKeys.push(0)
				}
			})
		
		commit('setCurrGroup', groupKeys[state.currView])
	},
	setCurrGroup({ commit } ,val) {
		commit('setCurrGroup', val)
	},
	enableContinueButton({ commit }) {
		commit('setContinueEnabled', true)
	},
	disableContinueButton({ commit }) {
		commit('setContinueEnabled', false)
	},
	setContinueButtonText({ state, commit }, type) {
		const totalGroup = state.stages[state.currStage].type === 'question'
			? state.stages[state.currStage]?.questions.length
			: 1
		const val = type === 'question'
				?'Submit ' + state.stages[state.currStage].name + (
					totalGroup > 1 && state.currGroup < totalGroup
					? ' Part ' + (state.currGroup + 1)
					: ''
				)
			: type === 'feedback' || type === 'info'
			? 'Continue to ' + (
					totalGroup > 1 && state.currGroup + 1 < totalGroup
					? state.stages[state.currStage].name + ' Part ' + (state.currGroup + 2)
					: state.stages[state.currStage + 1].name
				)
			: type === 'end'
			? 'End of Case'
			: 'Continue'

		commit('setContinueButtonText', val)
	},
	submitQuestion({ state, commit }, payload) {
		const output = []

		Object.keys(payload)
			.map((item) => {
				const id = item.split('_')[2]
				const question = state.stages[state.currStage].questions[state.currGroup]

				output.push(question.choices[id])
			})
		
		commit('setAnswers', output)
	},
	setChoiceLabsRead({ dispatch, commit }, id) {
		commit('setChoiceLabsRead', id)
		dispatch('checkLabs')
	},
	checkLabs({ state, dispatch }) {
		const hasUnreadLabs = state.stages[state.currStage]
			.questions[state.currGroup]
			.choices
			.filter((choice) => !!choice.choice_labs && !choice.choice_is_labs_read)
			.length > 0
		
			if (hasUnreadLabs) dispatch('disableContinueButton')
			else dispatch('enableContinueButton')
	},
	showLightBox({ commit }, { image_url }) {
		commit('setLightBoxVisible', true)
		commit('setLightBoxImage', image_url)
	},
	hideLightBox({ commit }) {
		commit('setLightBoxVisible', false)
		commit('setLightBoxImage', null)
	},
	setLightBoxImage({ commit }, val) {
		commit('setLightBoxImage', val)
	}
}

const getters = {
	caseData(state) {
		return state.caseData
	},
	stages(state) {
		return state.stages
	},
	appMode(state) {
		return state.appMode
	},
	sidebarView(state) {
		return state.sidebarView
	},
	isNavMenuVisible(state) {
		return state.isNavMenuVisible
	},
	isClipboardVisible(state) {
		return state.isClipboardVisible
	},
	currStage(state) {
		return state.currStage
	},
	currView(state) {
		return state.currView
	},
	currGroup(state) {
		return state.currGroup
	},
	isContinueEnabled(state) {
		return state.isContinueEnabled
	},
	continueButtonText(state) {
		return state.continueButtonText
	},
	isLightBoxVisible(state) {
		return state.isLightBoxVisible
	},
	lightBoxImage(state) {
		return state.lightBoxImage
	}
}

const store = new Vuex.Store({
	state,
	mutations,
	actions,
	getters
})

export default store