const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: process.env.VUE_APP_BASE_URL,
	chainWebpack: config => {
		config
		.plugin('html')
		.tap(args => {
			args[0].title = process.env.VUE_APP_SITE_TITLE;
			return args;
		})
	},
  transpileDependencies: [
    'vuetify'
  ]
})
