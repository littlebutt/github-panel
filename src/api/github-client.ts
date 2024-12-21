/* eslint-disable no-unsafe-optional-chaining */
// eslint-disable-next-line import/no-unresolved
import { Octokit } from 'octokit'
import { addDays, format } from 'date-fns'

export interface GithubClientProps {
  accessToken: string
}

export interface Headers {
  [key: string]: string
}

export class GithubClient {
  private accessToken: string
  private headers: Headers
  private octokit: Octokit

  init(props: GithubClientProps) {
    this.accessToken = props.accessToken
    this.headers = {
      'X-GitHub-Api-Version': '2022-11-28',
      'Accept': 'application/vnd.github+json',
      'Authorization': this.accessToken
    }
    this.octokit = new Octokit({
      auth: this.accessToken      
    })
  }

  async validate() {
    const { data } =
      (await this.octokit?.request('GET /user', {
        headers: this.headers
      })) ?? {}
    return 'login' in data
  }

  async getAuthenticatedUser() {
    const { data } =
      (await this.octokit?.request('GET /user', {
        headers: this.headers
      })) ?? {}
    return data
  }

  async listRepositoriesForAuthenticatedUser() {
    const { data } =
      (await this.octokit?.request('GET /user/repos', {
        headers: this.headers
      })) ?? {}
    return data
  }

  // XXX: The octokit API cannot process GraphQL properly so we use fetch API instead. Note that the fetch
  // API can only tolerant limited requests
  async listCommitsForAuthenticatedUser(timespan: number, username: string) {
    const now = new Date()
    const before = addDays(now, -timespan)
    const res = await fetch(
      ` https://api.github.com/search/commits?q=author:${username}+committer-date:>${format(before, 'yyyy-MM-dd')}`,
      {
        headers: this.headers,
      },
    )
    const data = await res.json()
    return data
  }

  async listPRsForAuthenticatedUser(timespan: number, username: string) {
    const now = new Date()
    const before = addDays(now, -timespan)
    const res = await fetch(
      ` https://api.github.com/search/issues?q=author:${username}+type:pr+created:>${format(before, 'yyyy-MM-dd')}`,
      {
        headers: this.headers,
      },
    )
    const data = await res.json()
    return data
  }

  async listIssuesForAuthenticatedUser(timespan: number, username: string) {
    const now = new Date()
    const before = addDays(now, -timespan)
    const res = await fetch(
      ` https://api.github.com/search/issues?q=author:${username}+type:issue+created:>${format(before, 'yyyy-MM-dd')}`,
      {
        headers: this.headers,
      },
    )
    const data = await res.json()
    return data
  }
}