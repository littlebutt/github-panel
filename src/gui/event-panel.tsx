/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import {
  ChecklistIcon,
  GitBranchIcon,
  GitMergeIcon,
  GitPullRequestIcon,
  IssueOpenedIcon,
  RepoForkedIcon,
  RepoPushIcon,
  StarIcon,
} from '@primer/octicons-react'

import './event-panel.css'

interface RecordType {
  actor: string
  action: string
  type:
    | 'CommitCommentEvent'
    | 'CreateEvent'
    | 'DeleteEvent'
    | 'ForkEvent'
    | 'GollumEvent'
    | 'IssueCommentEvent'
    | 'IssuesEvent'
    | 'MemberEvent'
    | 'PublicEvent'
    | 'PullRequestEvent'
    | 'PullRequestReviewEvent'
    | 'PullRequestReviewCommentEvent'
    | 'PullRequestReviewThreadEvent'
    | 'PushEvent'
    | 'ReleaseEvent'
    | 'SponsorshipEvent'
    | 'WatchEvent'
  time: string
  repo: string
}

const EventPanel: React.FC = () => {
  const [records, setRecords] = useState<RecordType[]>([])

  const parseContent = (content: RecordType) => {
    let icon
    let desc
    switch (content.type) {
      case 'PublicEvent': {
        icon = <GitBranchIcon size={24} />
        desc = ' created a branch or tag for '
        break
      }
      case 'ForkEvent': {
        icon = <RepoForkedIcon size={24} />
        desc = ' forked the repo '
        break
      }
      case 'IssuesEvent': {
        icon = <IssueOpenedIcon size={24} />
        desc = ` ${content.action} an issue for `
        break
      }
      case 'PullRequestEvent': {
        icon = <GitPullRequestIcon size={24} />
        desc = ` ${content.action} a PR for `
        break
      }
      case 'PushEvent': {
        icon = <RepoPushIcon size={24} />
        desc = ' pushed to '
        break
      }
      case 'ReleaseEvent': {
        icon = <GitMergeIcon size={24} />
        desc = ` ${content.action} for `
        break
      }
      case 'WatchEvent': {
        icon = <StarIcon size={24} />
        desc = ' starred for '
        break
      }
      default: {
        icon = <ChecklistIcon size={24} />
        desc = ` emit a ${content.type} for `
      }
    }
    return (
      <div className="inner">
        <div className="left-icon">{icon}</div>
        <div className="right-desc">
          <div className='action'>
            {content.actor}
            {desc}
            {content.repo}
          </div>
          <div className="time">{content.time}</div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    // @ts-ignore
    window.GithubAPI.getAuthenticatedUser().then((res) => {
      // @ts-ignore
      window.GithubAPI.listNotificationsForAuthenticatedUser(res?.login)
        .then((_res: any) => {
          const notes = _res.map(
            (rec: {
              actor: { login: any }
              type: any
              repo: { name: any }
              payload: { action: any }
              created_at: any
            }) => {
              return {
                actor: rec.actor.login,
                type: rec.type,
                repo: rec.repo.name,
                action: rec.payload?.action,
                time: rec.created_at,
              }
            },
          )
          setRecords(notes)
        })
        .catch((err: any) => console.log(err))
    })
  })

  return (
    <div className="event-panel">
      {records.map((content) => parseContent(content))}
    </div>
  )
}

export default EventPanel
