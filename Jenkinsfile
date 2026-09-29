// Executa o comando com o shell certo (bat no Windows, sh no Linux/macOS).
def runCmd(String command) {
  if (isUnix()) {
    sh command
  } else {
    bat command
  }
}

// Corre um ficheiro de testes e grava o relatorio JUnit em reports/junit-<nome>.xml.
// Cada incremento do laboratorio acrescenta um stage que chama esta funcao.
def runTests(String nome, String ficheiro) {
  runCmd "npx vitest run ${ficheiro} --reporter=default --reporter=junit --outputFile.junit=reports/junit-${nome}.xml"
}

pipeline {
  agent any

  // Requer o plugin NodeJS e uma instalacao com este nome em:
  // Manage Jenkins > Tools > NodeJS installations
  // Se o Node ja estiver no PATH da maquina, podes apagar este bloco.
  tools {
    nodejs 'NodeJS-22'
  }

  options {
    timestamps()
    timeout(time: 30, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '20'))
    disableConcurrentBuilds()
  }

  environment {
    CI = 'true'
    NEXT_TELEMETRY_DISABLED = '1'
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Instalar dependencias') {
      steps {
        runCmd 'npm ci'
      }
    }

    // O schema nao usa env() no bloco datasource (a ligacao vem do
    // adaptador PrismaPg em runtime), por isso o generate nao precisa de DB_URL.
    stage('Prisma Generate') {
      steps {
        runCmd 'npx prisma generate'
      }
    }

    // Lint e typecheck nao dependem um do outro: correm em paralelo.
    stage('Qualidade') {
      parallel {
        stage('Lint') {
          steps {
            catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
              runCmd 'npm run lint'
            }
          }
        }
        stage('Typecheck') {
          steps {
            runCmd 'npm run typecheck'
          }
        }
      }
    }

    // Um stage por funcionalidade testada. Cada incremento do laboratorio
    // acrescenta o seu stage aqui, sem mexer nos anteriores.
    stage('Testes') {
      stages {
        // base
        stage('Teste: GetDbUserId') {
          steps {
            runTests('00-GetDbUserId', 'src/actions/user-action.test.ts')
          }
        }
      }
      post {
        always {
          // Junta os relatorios de todos os stages no separador "Test Result".
          junit testResults: 'reports/junit-*.xml', allowEmptyResults: false
        }
      }
    }

    // Suite completa (todos os ficheiros de teste) com cobertura de codigo.
    stage('Cobertura') {
      steps {
        runCmd 'npx vitest run --coverage'
      }
      post {
        always {
          // Requer o plugin "Coverage". Se nao o tiveres instalado, comenta a linha.
          recordCoverage(
            tools: [[parser: 'COBERTURA', pattern: 'coverage/cobertura-coverage.xml']],
            sourceCodeRetention: 'EVERY_BUILD'
          )

          archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
        }
      }
    }

    stage('Build') {
      steps {
        withCredentials([
          string(credentialsId: 'DB_URL', variable: 'DB_URL'),
          string(credentialsId: 'CLERK_SECRET_KEY', variable: 'CLERK_SECRET_KEY'),
          string(credentialsId: 'CLERK_PUBLISHABLE_KEY', variable: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'),
          string(credentialsId: 'UPLOADTHING_TOKEN', variable: 'UPLOADTHING_TOKEN')
        ]) {
          runCmd 'npm run build'
        }
      }
    }

    // ---------- A partir daqui e CD: so corre na branch principal ----------

    stage('Empacotar') {
      when { branch 'main' }
      steps {
        archiveArtifacts artifacts: '.next/**', fingerprint: true
      }
    }

    stage('Aprovacao para producao') {
      when { branch 'main' }
      steps {
        timeout(time: 15, unit: 'MINUTES') {
          input message: "Promover a build #${env.BUILD_NUMBER} para producao?", ok: 'Promover'
        }
      }
    }

    stage('Deploy') {
      when { branch 'main' }
      steps {
        echo "A implantar a build #${env.BUILD_NUMBER}"
        // Substitui pela tua forma de implantar. Exemplos:
        //   runCmd 'npx vercel deploy --prebuilt --prod --token %VERCEL_TOKEN%'
        //   runCmd 'xcopy /E /I /Y .next C:\\deploy\\socialmedia\\.next'
      }
    }
  }

  post {
    success {
      echo "Build #${env.BUILD_NUMBER} concluida com sucesso."
    }
    failure {
      echo "Build #${env.BUILD_NUMBER} falhou. Ver o separador Test Result e a consola."
    }
    cleanup {
      cleanWs()
    }
  }
}
