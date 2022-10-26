
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
		stages: {}
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
	}
}

const actions = {
	submitAnalytics() {
		console.log('analytics')
	},
	setCaseData({ commit }, val) {
		commit('setCaseData', val)
	},
	setStages({ state, commit, dispatch }) {
		const data = state.caseData.stages

		commit('setStages', data)
		dispatch('setCurrGroup', data)
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
	setCurrView({ dispatch, commit }, val) {
		commit('setCurrView', val)
		dispatch('setCurrGroup')
	},
	setCurrGroup({ state, commit }) {
		const groupKeys = []
		
		state.stages
			.forEach((stage) => {
				stage.questions
					.forEach((_, ndx) => {
						groupKeys.push(ndx)
						if (stage.type === 'question') groupKeys.push(ndx)
					})
			})
		
		commit('setCurrGroup', groupKeys[state.currView])
	},
	enableContinueButton({ commit }) {
		commit('setContinueEnabled', true)
	},
	disableContinueButton({ commit }) {
		commit('setContinueEnabled', false)
	},
	setContinueButtonText({ state, commit }, type) {
		const totalGroup = state.stages[state.currStage]?.questions.length
		const val = type === 'question'
				?'Submit ' + state.stages[state.currStage].name + (
					totalGroup > 1 && state.currGroup < totalGroup
					? ' Part ' + (state.currGroup + 1)
					: ''
				)
			: type === 'feedback'
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

			console.log(state.stages[state.currStage]
				.questions[state.currGroup]
				.choices
				.filter((choice) => !!choice.choice_labs && !choice.choice_is_labs_read))
		
			if (hasUnreadLabs) dispatch('disableContinueButton')
			else dispatch('enableContinueButton')

			console.log(state.isContinueEnabled)
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
	}
}

const store = new Vuex.Store({
	state,
	mutations,
	actions,
	getters
})

export default store