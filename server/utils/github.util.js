import assert from 'assert'

import axios from 'axios'

import { github, anmUserWithHost } from '../config'

const ghURL = `https://${github.usernameToken}@${github.api}`

const repoUrl = `${ghURL}/${github.repoURL}`
const dispatchURL = `${repoUrl}/dispatches`

const isConfigured = github.usernameToken && github.repoURL && anmUserWithHost

export async function startDeploy (env, ref) {
  assert.ok(
    isConfigured,
    new Error("server don't required env setup to access github")
  )

  const remote = `${anmUserWithHost}:/var/www/anm/web-${env}`

  const data = {
    event_type: 'deploy-trigger',
    client_payload: {
      pre_script: `copy-${env}-env`,
      ref: (ref + '').replace('heads/', '').replace('tags/', ''),
      remote
    }
  }

  const config = {
    headers: {
      // this header is required as api is in preview
      Accept: 'application/vnd.github.everest-preview+json'
    }
  }

  const response = await axios.post(dispatchURL, data, config)

  return response
}

export async function refExist (ref) {
  assert.ok(
    isConfigured,
    new Error("server don't required env setup to access github")
  )

  const url = `${repoUrl}/git/ref/${ref}`

  try {
    const response = await axios.get(url)
    return response.status === 200
  } catch (err) {
    return false
  }
}
