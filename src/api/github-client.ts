/* eslint-disable no-unsafe-optional-chaining */
// eslint-disable-next-line import/no-unresolved
import { Octokit } from 'octokit'
import { addDays, format } from 'date-fns'

export interface GithubClientProps {
  accessToken: string
}

const headers = {
  'X-GitHub-Api-Version': '2022-11-28',
  Accept: 'application/vnd.github+json',
}

export class GithubClient {
  private accessToken: string
  private octokit: Octokit

  init(props: GithubClientProps) {
    this.accessToken = props.accessToken
    this.octokit = new Octokit({
      auth: this.accessToken,
    })
  }

  async validate() {
    const { data } =
      (await this.octokit?.request('GET /user', {
        headers,
      })) ?? {}
    return 'login' in data
  }

  async getAuthenticatedUser() {
    const { data } =
      (await this.octokit?.request('GET /user', {
        headers,
      })) ?? {}
    return data
  }

  async listRepositoriesForAuthenticatedUser() {
    const { data } =
      (await this.octokit?.request('GET /user/repos', {
        headers,
      })) ?? {}
    return data
  }

  // FIXME: Octokit bug here and use `fetch` instead
  async listCommitsForAuthenticatedUser(timespan: number, username: string) {
    const now = new Date()
    const before = addDays(now, -timespan)
    const fHeaders = {
      Authorization: this.accessToken,
      'X-GitHub-Api-Version': '2022-11-28',
      Accept: 'application/vnd.github+json',
    }
    const res = await fetch(
      ` https://api.github.com/search/commits?q=author:${username}+committer-date:>${format(before, 'yyyy-MM-dd')}`,
      {
        headers: fHeaders,
      },
    )
    const data = await res.json()
    return data
  }
}
