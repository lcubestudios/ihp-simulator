
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import Cookies from 'js-cookie'
// import testData from '@/data'

Vue.use(Vuex)

const state = () => {
	return {
		isLoading: true,
		isSubmitLoading: false,
		isPatientIntroComplete: false,
		isGuruIntroComplete: false,
		isGuruIntroVisible: false,
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
		guruResponseURL: null,
		posttestURL: null,
		redirectURL: null
	}
}

const mutations = {
	setPosttestURL(state, val) {
		state.posttestURL = val
	},
	setRedirectURL(state, val) {
		state.redirectURL = val
	},
	setIsLoading(state, val) {
		state.isLoading = val
	},
	setIsSubmitLoading(state, val) {
		state.isSubmitLoading = val
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
	setGuruIntroVisible(state, val) {
		state.isGuruIntroVisible = val
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
	async submitAnalytics({ state }, payload) {
		const defaultData = {
			app_id: 'xxxxxxxx',
			appname: location.href,
			apptype: 'ihp simulator',
			category: 'poc',
			metavalue: `${ location.href } | IHP Simulator`,
			event: null,
			label: null,
			platform: 'web',
			session: null,
			token: state.authToken,
			userAgent: navigator.userAgent,
			value: 1,
		}

		const params = {}
	
		const body = Object.assign(defaultData, payload || {})

		if (state?.userToken !== '') params.token = state.userToken
	
		const urlParams = Object
			.keys(params)
			.map((key) => { 
				return key + '=' + params[key]
			})
			.join('&')
			|| null
	
		const url = process.env.VUE_APP_ANALYTICS_API + (urlParams ? '?' + urlParams : '')

		await axios.post(url, body, {
			headers: {
				'content-type': 'text/json'
			}
		})
			.then(() => { console.log(body) })
			.catch((e) => console.log(e))
	},
	setPosttestURL({ commit }, val) {
		commit('setPosttestURL', val)
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
	setIsSubmitLoading({ commit }, val) {
		commit('setIsSubmitLoading', val)
	},
	isSubmitLoading({ dispatch }) {
		dispatch('setIsSubmitLoading', true)
	},
	isSubmitLoaded({ dispatch }) {
		dispatch('setIsSubmitLoading', false)
	},
	setAppMode({ commit }, val) {
		commit('setAppMode', val)
	},
	setPatientIntroComplete({ commit }, val) {
		commit('setPatientIntroComplete', val)
	},
	completePatientIntro({ state, dispatch }) {
		const progress = Object.assign(
			JSON.parse(Cookies.get(`ihp_progress_${ state.refData.jobnum }`)), 
			{ isPatientIntroComplete: true }
		)

		dispatch('setProgress', progress)
		dispatch('setPatientIntroComplete', true)
		dispatch('setCurrStage', 0)
		dispatch('setCurrView', 0)
		dispatch('updateProgress')
		dispatch('submitAnalytics', {
			event: 'View',
			label: `stage ${ state.stages[0].id } | group ${ state.stages[0].questions[0].id }`,
			metavalue: `${ location.href } | IHP Simulator | View`,
		})
	},
	resetPatientIntro({ state, dispatch }) {
		const progress = Object.assign(
			JSON.parse(Cookies.get(`ihp_progress_${ state.refData.jobnum }`)), 
			{ isPatientIntroComplete: false }
		)

		dispatch('setProgress', progress)
		dispatch('setPatientIntroComplete', false)
	},
	setGuruIntroComplete({ commit }, val) {
		commit('setGuruIntroComplete', val)
	},
	completeGuruIntro({ state, dispatch }) {
		const progress = Object.assign(
			JSON.parse(Cookies.get(`ihp_progress_${ state.refData.jobnum }`)), 
			{ isGuruIntroComplete: true }
		)

		dispatch('setProgress', progress)
		dispatch('setGuruIntroComplete', true)
		dispatch('setContinueButtonText')
		dispatch('submitAnalytics', {
			event: 'View',
			label: `Guru Introduction`,
			metavalue: `${ location.href } | IHP Simulator | View`,
		})
	},
	resetGuruIntro({ state, dispatch }) {
		const progress = Object.assign(
			JSON.parse(Cookies.get(`ihp_progress_${ state.refData.jobnum }`)), 
			{ isGuruIntroComplete: false }
		)

		dispatch('setProgress', progress)
		dispatch('setGuruIntroComplete', false)
	},
	setGuruIntroVisible({ commit }, val) {
		commit('setGuruIntroComplete', val)
	},
	showGuruIntro({ dispatch }) {
		dispatch('setGuruIntroVisible', true)
	},
	hideGuruIntro({ dispatch }) {
		dispatch('setGuruIntroVisible', false)
	},
	setAuth({ commit }, val) {
		commit('setAuth', val)
	},
	setUserProfile({ commit }, val) {
		commit('setUserProfile', val)
	},
	async setUserToken({ dispatch, commit }, val) {
		if (val) {
			await axios.get(`${ process.env.VUE_APP_PROFILE_API }?token=${ val }`)
				.then((res) => {
					Cookies.set('ihp_user_token', val, { expires: 0.25 })
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
		await axios.get(`${ process.env.VUE_APP_AUTH_API }?email=${ creds.email }&password=${ creds.password }`)
			.then(async (res) => {
				if (res?.data?.error) throw res.data.error
				if (res?.data?.token) {
					await dispatch('setUserToken', res.data.token)
					return true
				}
			})
			.catch((err) => {
				throw err
			})
	},
	userLogout({ dispatch }) {
		dispatch('setUserToken', null)
	},
	setRedirectURL({ commit }, val) {
		commit('setRedirectURL', val)
	},
	async getRefData({ dispatch, commit }, jobnum) {
		if (jobnum) {
			const getCmeInfo = await axios
				.get(`${ process.env.VUE_APP_CME_INFO_API }${ jobnum }`)
				.then((res) => { return res.data })
				.catch(() => {
					dispatch('setRedirectURL', `/invalid/?jn=${ jobnum }`)
				})
			const getCaseData = await axios
				.get(`${ process.env.VUE_APP_CASE_DATA_API }${ jobnum }/${ jobnum }-case.json`)
				.then((res) => { return res.data })
				.catch(() => {
					dispatch('setRedirectURL', `/invalid/?jn=${ jobnum }`)
				})
			// const getCmeInfo = {}
			// const getCaseData = testData[jobnum]
	
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
					.catch(() => {
						dispatch('setRedirectURL', `/invalid/?jn=${ jobnum }`)
					})
		}
	},
	setRefData({ commit }, val) {
		commit('setRefData', val)
	},
	createSessionId({ state }) {
		const sessionId = Date.now() + '.' + state.userToken

		Cookies.set('ihp_session_id', sessionId, { expires: 1 })
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
								id: stage.id,
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
								id: stage.id,
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
						id: stage.id,
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
	async setProgress({ state, dispatch, commit }, val) {
		Cookies.set(`ihp_progress_${ state.refData.jobnum }`, JSON.stringify(val), { expires: 1 })
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
		const progress = JSON.parse(Cookies.get(`ihp_progress_${ state.refData.jobnum }`))
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
	async setEnvironment({ state, dispatch }, jobnum) {
		let userToken, sessionId, refData, progress
		// Get Reference Data
		refData = await dispatch('getRefData', jobnum)
		// IF no ref data -> Throw error
		if (!refData) throw 'data not found'
		// Store ref data
		await dispatch('setRefData', refData)
		// check token
		userToken = Cookies.get('ihp_user_token')

		if (userToken) {
			await dispatch('setUserToken', userToken)
			const posttestURL = `https://secureapi.atpoc.com/beta/poc-test-module/?jn=${ refData?.jobnum }&poc_tkn=${ userToken }`
			await dispatch('setPosttestURL', posttestURL)
			// Check Session Id
			sessionId = Cookies.get('ihp_session_id')
			// IF no session id -> create session id
			if (!sessionId) sessionId = await dispatch('createSessionId')
			// Store session id
			await dispatch('setSessionId', sessionId)
			// Check progress
			progress = Cookies.get(`ihp_progress_${ state.refData.jobnum }`)
				? JSON.parse(Cookies.get(`ihp_progress_${ state.refData.jobnum }`))
				: null
			// IF no progress -> create progress
			if (!progress) progress = await dispatch('createProgress')
			// Store progress
			await dispatch('setProgress', progress)
			// View Analytics
			// Guru analytics
			if (!progress.isGuruIntroComplete) {
				dispatch('submitAnalytics', {
					event: 'View',
					label: `Guru Introduction`,
					metavalue: `${ location.href } | IHP Simulator | View`,
				})
			}
			// Patient analytics
			else if (!progress.isPatientIntroComplete) {
				dispatch('submitAnalytics', {
					event: 'View',
					label: `Patient Introduction`,
					metavalue: `${ location.href } | IHP Simulator | View`,
				})
			}
			else if (!progress.stages[0].isCompleted) {
				dispatch('submitAnalytics', {
					event: 'View',
					label: `stage ${ state.stages[0].id } | group ${ state.stages[0].questions[0].id }`,
					metavalue: `${ location.href } | IHP Simulator | View`,
				})
			}
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
			await dispatch('checkLabs')
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
		if (state.isPatientIntroComplete || (!state.isGuruIntroComplete && state.isClipboardVisible)) dispatch('hideClipboard')
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
		const type = !state.isGuruIntroComplete
			? 'guru-intro'
			: !state.isPatientIntroComplete
			? 'patient-intro'
			: state.progress.stages.findIndex((stage) => stage.view === state.currView) + 1 === state.progress.stages.length
				? 'end'
				: state.progress.stages.filter((stage) => stage.view === state.currView)[0].type === 'question'
					&& state.progress.stages.filter((stage) => stage.view === state.currView)[0].isCompleted
						? 'feedback'
						: state.progress.stages.filter((stage) => stage.view === state.currView)[0].type

		const val = type === 'patient-intro'
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
			? 'Claim Credit'
			: 'Continue'

		commit('setContinueButtonText', val)
	},
	async submitQuestion({ state, commit, dispatch }, payload) {
		const output = []

		console.log('submit question')
		await dispatch('setGuruResponseURL', null)
		
		Object.keys(payload)
			.map((item) => {
				const id = item.split('_')[2]
				const question = state.stages[state.currStage].questions[state.currGroup]

				if (question.choices[id]) output.push(question.choices[id])
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

		await axios.post(process.env.VUE_APP_ANSWER_API, postPayload)
			.then(async () => {
				await commit('setAnswers', output)
				dispatch('isSubmitLoaded')
				dispatch('submitAnalytics', {
					event: 'Submit',
					label: `${
						state.stages[state.currStage].name
					} | stage ${
						state.stages[state.currStage].id
					} | group ${ 
						state.stages[state.currStage].questions[state.currGroup].id 
					} | ${ output.length > 1 ? 'choices' : 'choice' } ${
						output.map((ans) => {
							return ans.choice_id
						}).join(',')
					}`,
					metavalue: `${ location.href } | IHP Simulator | ${
						state.stages[state.currStage].questions[state.currGroup].question
					}`,
				})
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
		const progress = JSON.parse(Cookies.get(`ihp_progress_${ state.refData.jobnum }`))
		
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
					.filter((choice) => 
						!!choice.choice_labs 
						&& !choice.choice_is_labs_read
					)
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
		if (state.isPatientIntroComplete || (!state.isGuruIntroComplete && state.isClipboardVisible)) dispatch('hideClipboard')
		dispatch('hideTOC')
	},
	hideLightBox({ commit }) {
		commit('setLightBoxVisible', false)
		commit('setLightBoxImage', null)
	},
	setLightBoxImage({ commit }, val) {
		commit('setLightBoxImage', val)
	},
	goToView({ state, dispatch }, val) {
		const stage  = state.progress.stages.filter((stage) => stage.view == val)[0]
		dispatch('setCurrStage', stage.stage)
		dispatch('setCurrGroup', stage.group)
		dispatch('setCurrView', stage.view)
		dispatch('setGuruResponseURL', null)
		dispatch('setContinueButtonText')
	},
	goToStage({ state, dispatch }, val) {
		const progress = JSON.parse(Cookies.get(`ihp_progress_${ state.refData.jobnum }`))

		if (val < -1 && (val + 1) > progress.stages.length) {
			console.log(`stage ${ val + 1 } does not exist`)
		}
		else {
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
	
			dispatch('setGuruResponseURL', null)
			dispatch('setContinueButtonText')
		}
	},
	setCmeInfoVisible({ commit }, val) {
		commit('setCmeInfoVisible', val)
	},
	showCmeInfo({ state, dispatch }) {
		dispatch('setCmeInfoVisible', true)
		dispatch('hideNavMenu')
		dispatch('hideReferenceData')
		if (state.isPatientIntroComplete || (!state.isGuruIntroComplete && state.isClipboardVisible)) dispatch('hideClipboard')
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
		if (state.isPatientIntroComplete || (!state.isGuruIntroComplete && state.isClipboardVisible)) dispatch('hideClipboard')
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
		if (state.isPatientIntroComplete || (!state.isGuruIntroComplete && state.isClipboardVisible)) dispatch('hideClipboard')
		dispatch('hideLightBox')
		dispatch('hideReferenceData')
	},
	hideTOC({ dispatch }) {
		dispatch('setTOCVisible', false)
	},
	setGuruResponseURL({ commit }, val) {
		commit('setGuruResponseURL', val)
	},
	async restartSimulator({ state, dispatch }) {
		// const { 
		// 	stages
		// } = state.progress
		// const output = {
		// 	isGuruIntroComplete: false,
		// 	isPatientIntroComplete: false,
		// 	stages: stages.map((stage) => {
		// 		stage.isCompleted = false
		// 		if (stage.type === 'question') stage.answers = []
		// 		return stage
		// 	})
		// }

		await dispatch('isLoading')
		
		dispatch('hideLightBox')
		dispatch('hideNavMenu')
		dispatch('hideReferenceData')
		dispatch('hideCmeInfo')
		if (state.isPatientIntroComplete || (!state.isGuruIntroComplete && state.isClipboardVisible)) dispatch('hideClipboard')
		dispatch('hideTOC')

		Cookies.remove(`ihp_progress_${ state.refData.jobnum }`)
		Cookies.remove('ihp_session_id')
		location.reload()
	}
}

const getters = {
	redirectURL(state) {
		return state.redirectURL
	},
	posttestURL(state) {
		return state.posttestURL
	},
	isLoading(state) {
		return state.isLoading
	},
	isSubmitLoading(state) {
		return state.isSubmitLoading
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
	isGuruIntroVisible(state) {
		return state.isGuruIntroVisible
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