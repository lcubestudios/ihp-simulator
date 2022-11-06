
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import Cookies from 'js-cookie'

Vue.use(Vuex)

const state = () => {
	return {
		isLoading: true,
		isPatientIntroComplete: false,
		isGuruIntroComplete: false,
		appMode: 'desktop',
		isAuth: false,
		userToken: null,
		userProfile: null,
		sessionId: null,
		stages: null,
		progress: null,
		sidebarView: 0,
		isNavMenuVisible: false,
		isClipboardVisible: false,
		currStage: 0,
		currGroup: 0,
		currView: 0,
		isContinueEnabled: true,
		continueButtonText: 'Continue',
		refData: null,
		isLightBoxVisible: false,
		lightBoxImage: null,
		isCmeInfoVisible: false,
		isReferenceDataVisible: false,
		isTOCVisible: false,
		guruResponseURL: null
	}
}

const mutations = {
	setIsLoading(state, val) {
		state.isLoading = val
	},
	setAppMode(state, val) {
		state.appMode = val
	},
	setPatientIntroComplete(state, val) {
		state.isPatientIntroComplete = val
	},
	setGuruIntroComplete(state, val) {
		state.isGuruIntroComplete = val
	},
	setAuth(state, val) {
		state.isAuth = val
	},
	setUserToken(state, val) {
		state.userToken = val
	},
	setUserProfile(state, val) {
		state.userProfile = val
	},
	setSessionId(state, val) {
		state.sessionId = val
	},
	setRefData(state, val) {
		state.refData = val
	},
	setStages(state, val) {
		state.stages = val
	},
	setProgress(state, val) {
		state.progress = val
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
	setLabs(state, { stage, group, choice_order, val }) {
		state.stages[stage]
			.questions[group]
			.choices[
				state.stages[stage]
				.questions[group]
				.choices
				.findIndex((choice) => choice.choice_order == choice_order)
			]
			.choice_is_labs_read = val
	},
	setLightBoxVisible(state, val) {
		state.isLightBoxVisible = val
	},
	setLightBoxImage(state, val) {
		state.lightBoxImage = val
	},
	setCmeInfoVisible(state, val) {
		state.isCmeInfoVisible = val
	},
	setReferenceDataVisible(state, val) {
		state.isReferenceDataVisible = val
	},
	setTOCVisible(state, val) {
		state.isTOCVisible = val
	},
	setGuruResponseURL(state, val) {
		state.guruResponseURL = val
	} 
}

const actions = {
	submitAnalytics() {
		console.log('analytics')
	},
	setIsLoading({ commit }, val) {
		commit('setIsLoading', val)
	},
	isLoading({ dispatch }) {
		dispatch('setIsLoading', true)
	},
	isLoaded({ dispatch }) {
		dispatch('setIsLoading', false)
	},
	setAppMode({ commit }, val) {
		commit('setAppMode', val)
	},
	setPatientIntroComplete({ commit }, val) {
		commit('setPatientIntroComplete', val)
	},
	completePatientIntro({ dispatch }) {
		const progress = Object.assign(
			JSON.parse(Cookies.get('ihp_progress')), 
			{ isPatientIntroComplete: true }
		)

		dispatch('setProgress', progress)
		dispatch('setPatientIntroComplete', true)
	},
	resetPatientIntro({ dispatch }) {
		const progress = Object.assign(
			JSON.parse(Cookies.get('ihp_progress')), 
			{ isPatientIntroComplete: false }
		)

		dispatch('setProgress', progress)
		dispatch('setPatientIntroComplete', false)
	},
	setGuruIntroComplete({ commit }, val) {
		commit('setGuruIntroComplete', val)
	},
	completeGuruIntro({ dispatch }) {
		const progress = Object.assign(
			JSON.parse(Cookies.get('ihp_progress')), 
			{ isGuruIntroComplete: true }
		)

		dispatch('setCurrStage', 0)
		dispatch('setCurrView', 0)
		dispatch('setProgress', progress)
		dispatch('setGuruIntroComplete', true)
		dispatch('updateProgress')
	},
	resetGuruIntro({ dispatch }) {
		const progress = Object.assign(
			JSON.parse(Cookies.get('ihp_progress')), 
			{ isGuruIntroComplete: false }
		)

		dispatch('setProgress', progress)
		dispatch('setGuruIntroComplete', false)
	},
	setAuth({ commit }, val) {
		commit('setAuth', val)
	},
	setUserProfile({ commit }, val) {
		commit('setUserProfile', val)
	},
	async setUserToken({ dispatch, commit }, val) {
		if (val) {
			await axios.get(`https://secureapi.atpoc.com/api-suite/8.2/profile?token=${ val }`)
				.then((res) => {
					Cookies.set('ihp_user_token', val)
					dispatch('setUserProfile', res?.data?.personal)
					dispatch('setAuth', true)
				})
		}
		else {
			Cookies.remove('ihp_user_token')
			dispatch('setAuth', false)
		}

		commit('setUserToken', val)
	},
	async userLogin({ dispatch }, creds) {
		dispatch('isLoading')
		await axios.get(`https://secureapi.atpoc.com/api-suite/8.2/auth/token?email=${ creds.email }&password=${ creds.password }`)
			.then(async (res) => {
				if (res.data.error) throw res.data.error
				if (res.data.token) {
					await dispatch('setUserToken', res.data.token)
					await dispatch('setEnvironment')
				}
			})
			.catch((err) => {
				throw err
			})
	},
	userLogout({ dispatch }) {
		dispatch('setUserToken', null)
	},
	async getRefData({ commit }) {
		const getCmeInfo = await axios.get('https://cdn.atpoc.com/cdn/ihp/2537.11/2537.11.json').then((res) => { return res.data})
		const getCaseData = await axios.get('https://cdn.atpoc.com/cdn/ihp/2537.11/case.json').then((res) => { return res.data})

		return await Promise.all([
				getCmeInfo,
				getCaseData
			])
				.then((res) => {
					const cmeInfo = res[0]
					const caseData = res[1]

					const output = {
						...caseData,
						cme_information: cmeInfo?.cme
					}

					commit('setStages', output.stages)
					return output
				})
	},
	setRefData({ commit }, val) {
		commit('setRefData', val)
	},
	createSessionId({ state }) {
		const sessionId = Date.now() + '.' + state.userToken

		Cookies.set('ihp_session_id', sessionId)
		return sessionId
	},
	setSessionId({ commit }, val) {
		commit('setSessionId', val)
	},
	createProgress({ state }) {
		let view = 0
		const stages = []

		state.stages
			.map((stage, stage_ndx) => {
				const { questions, type } = stage

				if (type === 'question') {
					questions
						.map((q, q_ndx) => {
							// Question view
							stages.push({
								stage: stage_ndx,
								group: q_ndx,
								view,
								type: 'question',
								isCompleted: false,
								answers: [],
							})
							view += 1
							// Feedback view
							stages.push({
								stage: stage_ndx,
								group: q_ndx,
								view,
								type: 'feedback',
								isCompleted: false,
								labs: []
							})
							view += 1
						})
				}
				else if (type === 'info') {
					// Info View
					stages.push({
						stage: stage_ndx,
						group: 0,
						view,
						type: 'info',
						isCompleted: false,
					})
					view += 1
				}
			})
			
		const progress = {
			isPatientIntroComplete: state.isPatientIntroComplete,
			isGuruIntroComplete: state.isGuruIntroComplete,
			stages
		}

		return progress
	},
	async setProgress({ dispatch, commit }, val) {
		Cookies.set('ihp_progress', JSON.stringify(val))
		commit('setProgress', val)
		const progress = val

		// Set Patient Intro
		dispatch('setPatientIntroComplete', progress.isPatientIntroComplete)
		// Set Guru Intro
		dispatch('setGuruIntroComplete', progress.isGuruIntroComplete)
		// Set Answers
		dispatch('setAnswers', progress.stages)
		// Set Labs
		dispatch('setLabs', progress.stages)
	},
	async updateProgress({ state, dispatch }) {
		const progress = JSON.parse(Cookies.get('ihp_progress'))
		const startIndex = progress.stages
			.findIndex((stage) => 
				stage.stage === state.currStage 
				&& stage.group === state.currGroup
				&& stage.view === state.currView
			)

		if (startIndex > 0) {
			const completeIndex = startIndex - 1
			progress.stages[completeIndex].isCompleted = true
			if (progress.stages[completeIndex].type === 'question') {
				progress.stages[completeIndex].answers = state.stages[state.currStage].questions[state.currGroup].answers
			}
		}
		
		dispatch('setProgress', progress)
		dispatch('setContinueButtonText')
	},
	async setEnvironment({ dispatch }) {
		let userToken, sessionId, refData, progress
		// Get Reference Data
		refData = await dispatch('getRefData')
		// IF no ref data -> Throw error
		if (!refData) throw 'data not found'
		// Store ref data
		await dispatch('setRefData', refData)
		// check token
		userToken = Cookies.get('ihp_user_token')

		if (userToken) {
			await dispatch('setUserToken', userToken)
			// Check Session Id
			sessionId = Cookies.get('ihp_session_id')
			// IF no session id -> create session id
			if (!sessionId) sessionId = await dispatch('createSessionId')
			// Store session id
			await dispatch('setSessionId', sessionId)
			// Check progress
			progress = Cookies.get('ihp_progress')
				? JSON.parse(Cookies.get('ihp_progress'))
				: null
			// IF no progress -> create progress
			if (!progress) progress = await dispatch('createProgress')
			// Store progress
			await dispatch('setProgress', progress)
			// Set stage + view
			if (progress.isPatientIntroComplete && progress.isGuruIntroComplete) {
				const incomplete = progress.stages.filter((stage) => !stage.isCompleted)
				const hasIncomplete = incomplete.length > 0
	
				if (hasIncomplete) {
					await dispatch('setCurrStage', incomplete[0].stage)
					await dispatch('setCurrView', incomplete[0].view)
				}
				else {
					await dispatch('setCurrStage', progress.stages[progress.stages.length - 1].stage)
					await dispatch('setCurrView', progress.stages[progress.stages.length - 1].view)
				}
			}
			// Set button Text
			await dispatch('setContinueButtonText')
		}
		else {
			await dispatch('setUserToken', null)
		}

		dispatch('isLoaded')
	},
	setSidebarView({ commit }, val) {
		commit('setSidebarView', val)
	},
	setNavMenuVisible({ commit }, val) {
		commit('setNavMenuVisible', val)
	},
	showNavMenu({ state, dispatch }) {
		dispatch('setNavMenuVisible', true)
		dispatch('hideCmeInfo')
		dispatch('hideReferenceData')
		if (state.isPatientIntroComplete) dispatch('hideClipboard')
		dispatch('hideLightBox')
		dispatch('hideTOC')
	},
	hideNavMenu({ dispatch }) {
		dispatch('setNavMenuVisible', false)
	},
	setClipboardVisible({ commit }, val) {
		commit('setClipboardVisible', val)
	},
	showClipboard({ dispatch }) {
		dispatch('setClipboardVisible', true)
		dispatch('hideNavMenu')
		dispatch('hideReferenceData')
		dispatch('hideCmeInfo')
		dispatch('hideLightBox')
		dispatch('hideTOC')
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
	setContinueButtonText({ state, commit }) {
		let totalGroup
		totalGroup = state.stages[state.currStage].type === 'question'
			? state.stages[state.currStage]?.questions.length
			: 1
		const type = !state.isPatientIntroComplete
			? 'patient-intro'
			: !state.isGuruIntroComplete
			? 'guru-intro'
			: state.progress.stages.findIndex((stage) => stage.view === state.currView) + 1 === state.progress.stages.length
				? 'end'
				: state.progress.stages.filter((stage) => stage.view === state.currView)[0].type === 'question'
					&& state.progress.stages.filter((stage) => stage.view === state.currView)[0].isCompleted
						? 'feedback'
						: state.progress.stages.filter((stage) => stage.view === state.currView)[0].type

		const val = type === 'guru-intro'
			? 'Continue to ' + state.stages[0].name
			: type === 'question'
				? 'Submit ' + state.stages[state.currStage].name + (
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
			? 'Continue to Post Test'
			: 'Continue'

		commit('setContinueButtonText', val)
	},
	async submitQuestion({ state, commit }, payload) {
		const output = []

		Object.keys(payload)
			.map((item) => {
				const id = item.split('_')[2]
				const question = state.stages[state.currStage].questions[state.currGroup]

				output.push(question.choices[id])
			})

		const postPayload = {
			userid: state.userProfile.user_id,
			token: state.userToken,
			session_id: state.sessionId,
			jobnum: state.refData.jobnum,
			stage_id: state.stages[state.currStage].id,
			question_id: state.stages[state.currStage].questions[state.currGroup].id,
			answers: output.map((ans) => {
				delete ans.choice_labs
				delete ans.choice_is_labs_read
				delete ans.choice_feedback
				return ans
			})
		}

		await axios.post('https://secureapi.atpoc.com/api-suite/8.2/answersihp', postPayload)
			.then(() => {
				commit('setAnswers', output)
			})
			.catch((err) => console.log(err))
	},
	setAnswers({ state, commit }, val) {
		const output = state.stages

		val
			.map((item) => {
				if (item.type === 'question') output[item.stage].questions[item.group].answers = item.answers
			})
		
		commit('setStages', output)
	},
	setLabs({ commit }, val) {
		val
			.map((item) => {
				if (item.type === 'feedback') {
					item.labs
						.map((lab) => {
							commit('setLabs', {
								stage: item.stage,
								group: item.group,
								choice_order: lab.choice_order,
								val: lab.choice_is_labs_read
							})
						})
				}
			})
	},
	setChoiceLabsRead({ state, dispatch, commit }, id) {
		const progress = JSON.parse(Cookies.get('ihp_progress'))
		
		progress.stages
			.filter((stage) => stage.view === state.currView)[0]
			.labs
			.push({ choice_order: id, choice_is_labs_read: true})

		commit('setChoiceLabsRead', id)
		dispatch('setProgress', progress)
		dispatch('checkLabs')
	},
	checkLabs({ state, dispatch }) {
		const hasUnreadLabs = state.progress.stages.filter((stage) => stage.view === state.currView)[0].type === 'feedback'
			? state.stages[state.currStage]
					.questions[state.currGroup]
					.choices
					.filter((choice) => !!choice.choice_labs && !choice.choice_is_labs_read)
					.length > 0
			: null
		
		if (hasUnreadLabs) dispatch('disableContinueButton')
		else dispatch('enableContinueButton')
	},
	showLightBox({ state, commit, dispatch }, { image_url }) {
		commit('setLightBoxVisible', true)
		commit('setLightBoxImage', image_url)
		dispatch('hideNavMenu')
		dispatch('hideReferenceData')
		dispatch('hideCmeInfo')
		if (state.isPatientIntroComplete) dispatch('hideClipboard')
		dispatch('hideTOC')
	},
	hideLightBox({ commit }) {
		commit('setLightBoxVisible', false)
		commit('setLightBoxImage', null)
	},
	setLightBoxImage({ commit }, val) {
		commit('setLightBoxImage', val)
	},
	goToStage({ dispatch }, val) {
		const progress = JSON.parse(Cookies.get('ihp_progress'))

		const stage = progress.stages.filter((stage) => stage.stage === val)
		const incomplete = stage.filter((items) => !items.isCompleted)
		const hasIncomplete = incomplete.length > 0

		if (!hasIncomplete) {
			dispatch('setCurrStage', stage[stage.length - 1].stage)
			dispatch('setCurrView', stage[stage.length - 1].view)
		}
		else {
			dispatch('setCurrStage', incomplete[0].stage)
			dispatch('setCurrView', incomplete[0].view)
		}

		dispatch('setContinueButtonText')
	},
	setCmeInfoVisible({ commit }, val) {
		commit('setCmeInfoVisible', val)
	},
	showCmeInfo({ state, dispatch }) {
		dispatch('setCmeInfoVisible', true)
		dispatch('hideNavMenu')
		dispatch('hideReferenceData')
		if (state.isPatientIntroComplete) dispatch('hideClipboard')
		dispatch('hideLightBox')
		dispatch('hideTOC')
	},
	hideCmeInfo({ dispatch }) {
		dispatch('setCmeInfoVisible', false)
	},
	setReferenceDataVisible({ commit }, val) {
		commit('setReferenceDataVisible', val)
	},
	showReferenceData({ state, dispatch }) {
		dispatch('setReferenceDataVisible', true)
		dispatch('hideNavMenu')
		dispatch('hideCmeInfo')
		if (state.isPatientIntroComplete) dispatch('hideClipboard')
		dispatch('hideLightBox')
		dispatch('hideTOC')
	},
	hideReferenceData({ dispatch }) {
		dispatch('setReferenceDataVisible', false)
	},
	setTOCVisible({ commit }, val) {
		commit('setTOCVisible', val)
	},
	showTOC({ state, dispatch }) {
		dispatch('setTOCVisible', true)
		dispatch('hideNavMenu')
		dispatch('hideCmeInfo')
		if (state.isPatientIntroComplete) dispatch('hideClipboard')
		dispatch('hideLightBox')
		dispatch('hideReferenceData')
	},
	hideTOC({ dispatch }) {
		dispatch('setTOCVisible', false)
	},
	setGuruResponseURL({ commit }, val) {
		commit('setGuruResponseURL', val)
	} 
}

const getters = {
	isLoading(state) {
		return state.isLoading
	},
	appMode(state) {
		return state.appMode
	},
	isPatientIntroComplete(state) {
		return state.isPatientIntroComplete
	},
	isGuruIntroComplete(state) {
		return state.isGuruIntroComplete
	},
	isAuth(state) {
		return state.isAuth
	},
	sessionId(state) {
		return state.sessionId
	},
	refData(state) {
		return state.refData
	},
	stages(state) {
		return state.stages
	},
	progress(state) {
		return state.progress
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
	},
	isCmeInfoVisible(state) {
		return state.isCmeInfoVisible
	},
	isReferenceDataVisible(state) {
		return state.isReferenceDataVisible
	},
	isTOCVisible(state) {
		return state.isTOCVisible
	},
	guruResponseURL(state) {
		return state.guruResponseURL
	}
}

const store = new Vuex.Store({
	state,
	mutations,
	actions,
	getters
})

export default store