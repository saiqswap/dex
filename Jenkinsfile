pipeline {
     agent any
     stages {
        stage("Build") {
            steps {
                sh "sudo npm install"
                sh "sudo npm run build"
            }
        }
        stage("Deploy") {
            steps {
                sh "sudo rm -rf /home/ubuntu/nftc_web"
                sh "sudo cp -r ${WORKSPACE}/build/ /home/ubuntu/nftc_web/"
            }
        }
    }
}