pipeline{
    agent { label 'lcube-web' }
    tools { nodejs 'node-14.18.3' }
    environment {
        //Mandatory
        REPO_NAME = 'ihp-simulator'
        PACKAGE_MANAGER = 'npm install --force' // npm
        BUILD_COMMAND = 'npm run build'  // npm run build

				// ENV Variables
				// ## CONFIG
				VUE_APP_BASE_URL='/'

				// ## SEO
				VUE_APP_SITE_TITLE='IHP Simulator | Powered by Kaplan, Inc.'

				// ## APIs
				VUE_APP_AUTH_API='https://secureapi.atpoc.com/api-suite/8.2/auth/token'
				VUE_APP_PROFILE_API='https://secureapi.atpoc.com/api-suite/8.2/profile'
				VUE_APP_CME_INFO_API='https://secureapi.atpoc.com/s1/moonlight/content/'
				VUE_APP_CASE_DATA_API='https://cdn.atpoc.com/cdn/ihp/'
				VUE_APP_ANSWER_API='https://secureapi.atpoc.com/api-suite/8.2/answersihp'
				VUE_APP_ANALYTICS_API='https://secureapi.atpoc.com/api-suite/8.2/analytics/eventihp/'

        // static
        APACHE_DIR = '/var/www/html'
        SNYK_ID = 'lcube-snyk-token'
        JK_WORKSPACE = '/var/www/jenkins/workspace'

    }

    stages{
        stage("build") {
            steps {
                echo "building the application on ${NODE_NAME}."
                slackSend color: "warning", message: "Starting build process for ${REPO_NAME} from ${BRANCH_NAME} branch..."
                sh 'cd ${JK_WORKSPACE}/${REPO_NAME}_${BRANCH_NAME} && ${PACKAGE_MANAGER} && ${BUILD_COMMAND}'
                sh "if [ ! -d ${APACHE_DIR}/${BRANCH_NAME}/${REPO_NAME}/ ]; then mkdir -p ${APACHE_DIR}/${BRANCH_NAME}/${REPO_NAME}/; fi"
                sh "rsync -Puqr --delete-during ${JK_WORKSPACE}/${REPO_NAME}_${BRANCH_NAME}/dist/ ${APACHE_DIR}/${BRANCH_NAME}/${REPO_NAME}/"
                slackSend color: "good", message: "Success building the application."
            }
        }
        stage("scan") {
            steps {
                echo 'Scanning code for vulnerabilities.'
                slackSend color: "warning", message: "Scanning code for vulnerabilities on ${REPO_NAME}/${BRANCH_NAME}..."
                snykSecurity(
                    snykInstallation: 'snyk-latest',
                    snykTokenId: "${SNYK_ID}",
                    failOnIssues: "false",
                )
                slackSend color: "good", message: "Success scanning the code."
            }
        }
        stage("deploy") {
            when{
                expression{
                    BRANCH_NAME == "master"
                }
            }
            steps {
                echo 'deploying the application.'
            }
        }
    }
    post {
        success {
            echo 'The pipeline completed successfully.'
            slackSend color: "good", message: "The pipeline completed successfully. https://${BRANCH_NAME}.lcubestudios.io/${REPO_NAME}/"
        }
        failure {
            echo 'pipeline failed, at least one step failed'
            slackSend color: "danger", message: "Pipeline failed, at least one step failed"
        }
    }      
}