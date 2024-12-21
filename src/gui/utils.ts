/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
export const getStarred = (
  consumer: (e: number) => void,
  rejector: (err: any) => void = console.log,
) => {
  // @ts-ignore
  window.GithubAPI.listRepositoriesForAuthenticatedUser()
    .then((res: any[]) => {
      const stars = res
        .map((e) => e?.watchers ?? 0)
        .reduce((ac, va) => ac + va, 0)
      consumer(stars)
    })
    .catch((err: any) => rejector(err))
}

export const getCommits = (
  timespan: number,
  username: string,
  consumer: (e: number) => void,
  rejector: (err: any) => void = console.log,
) => {
  // @ts-ignore
  window.GithubAPI.listCommitsForAuthenticatedUser(timespan, username)
    .then((res: { total_count: any }) => {
      consumer(res?.total_count ?? 0)
    })
    .catch((err: any) => rejector(err))
}

export const getPRs = (
  timespan: number,
  username: string,
  consumer: (e: number) => void,
  rejector: (err: any) => void = console.log,
) => {
  // @ts-ignore
  window.GithubAPI.listPRsForAuthenticatedUser(timespan, username)
    .then((res: { total_count: any }) => {
      consumer(res?.total_count ?? 0)
    })
    .catch((err: any) => rejector(err))
}

export const getIssues = (
  timespan: number,
  username: string,
  consumer: (e: number) => void,
  rejector: (err: any) => void = console.log,
) => {
  // @ts-ignore
  window.GithubAPI.listIssuesForAuthenticatedUser(timespan, username)
    .then((res: { total_count: any }) => {
      consumer(res?.total_count ?? 0)
    })
    .catch((err: any) => rejector(err))
}
