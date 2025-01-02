/* eslint-disable @typescript-eslint/no-explicit-any */
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

const log = (target: any, name: string, descriptor: PropertyDescriptor) => {
  const original = descriptor.value
  descriptor.value = async function(...args: any) {
    console.log(`[Github API] target: ${name}`)
    try {
      return original.apply(this, args)
    } catch (e) {
      console.log(`[Github API] target: ${name} error: ${e}`)
      throw e
    }
  }
  return descriptor
}

// FIXME: API returns undefined sometimes
export class GithubClient {
  private accessToken: string
  private headers: Headers
  private octokit: Octokit

  init(props: GithubClientProps) {
    this.accessToken = props.accessToken
    this.headers = {
      'X-GitHub-Api-Version': '2022-11-28',
      Accept: 'application/vnd.github+json',
      Authorization: this.accessToken,
    }
    this.octokit = new Octokit({
      auth: this.accessToken,
      request: { retries: 5, retryAfter: 5 }
    })
  }

  @log
  async validate() {
    const { data } =
      await this.octokit.rest.users.getAuthenticated()
    return 'login' in data
  }

  @log
  async getAuthenticatedUser() {
    const { data } =
      await this.octokit?.rest.users.getAuthenticated()

    return data
  }

  @log
  async listRepositoriesForAuthenticatedUser() {
    const { data } =
      await this.octokit.request('GET /user/repos', {
        headers: this.headers,
      })
    return data
  }

  // XXX: The octokit API cannot process GraphQL properly so we use fetch API instead. Note that the fetch
  // API can only tolerant limited requests
  @log
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

  @log
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

  @log
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

  @log
  async listContributionsForUser(username: string) {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
    )
    const data = await res.json()
    return data
  }

  @log
  async listNotificationsForAuthenticatedUser(username: string) {
    const { data } =
      await this.octokit?.request(`GET /users/${username}/received_events`, {
        username,
        headers: this.headers,
      })
    return data
  }
}
