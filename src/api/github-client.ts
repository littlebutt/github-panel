// eslint-disable-next-line import/no-unresolved
import { Octokit } from "octokit"

export interface GithubClientProps {
    accessToken: string
}

const headers = {
    'X-GitHub-Api-Version': '2022-11-28'
}

export class GithubClient {
    private accessToken: string
    private octokit: Octokit

    init(props: GithubClientProps) {
        this.accessToken = props.accessToken
        this.octokit = new Octokit({
            auth: this.accessToken
        })
    }

    async validate() {
        const {
            data
        } = await this.octokit.request('GET /user', {
            headers
        })
        return 'login' in data
    }

    async getAuthenticatedUser() {
        const {
            data
        } = await this.octokit.request('GET /user', {
            headers
        })
        return data
    }

    async listRepositoriesForAuthenticatedUser() {
        const {
            data
        } = await this.octokit.request('GET /user/repo', {
            headers
        })
        return data
    }
}