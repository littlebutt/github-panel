/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react'
import { Avatar, Text } from '@primer/react'
import {
  GitCommitIcon,
  GitPullRequestIcon,
  IssueOpenedIcon,
  LocationIcon,
  PeopleIcon,
  StarIcon,
} from '@primer/octicons-react'

import './stat-panel.css'
import ActivityCalendar from './components/activity-calendar'
import { getCommits, getIssues, getPRs, getStarred } from './utils'

export interface StatPanelProps {
  timespan: number
}

const StatPanel: React.FC<StatPanelProps> = (props: StatPanelProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string>(
    'https://avatars.githubusercontent.com/u/583231?v=4',
  )
  const [name, setName] = useState<string>('')
  const [followers, setFollowers] = useState<number>(0)
  const [following, setFollowing] = useState<number>(0)
  const [location, setLocation] = useState<string>('Unknown')
  const [starred, setStarred] = useState<number>(0)
  const [commits, setCommits] = useState<number>(0)
  const [PRs, setPRs] = useState<number>(0)
  const [issues, setIssues] = useState<number>(0)

  useEffect(() => {
    // @ts-ignore
    window.GithubAPI.getAuthenticatedUser().then((res) => {
      setAvatarUrl(res?.avatar_url)
      setName(res?.login)
      setFollowers(res?.followers)
      setFollowing(res?.following)
      setLocation(res?.location ?? 'Unknown')
      getCommits(props.timespan, res?.login, setCommits)
      getPRs(props.timespan, res?.login, setPRs)
      getIssues(props.timespan, res?.login, setIssues)
    })
    getStarred(setStarred)
  })

  return (
    <div className="main">
      <div className="left">
        <div className="avatar">
          <Avatar src={avatarUrl} alt="avatar" size={150}></Avatar>
        </div>
        <div className="info">
          <div className="name">
            <Text size="medium" weight="semibold">
              {name}
            </Text>
          </div>
          <div className="follows">
            <PeopleIcon size={12} verticalAlign="middle" fill="gray" />{' '}
            <Text size="small" weight="light">
              {followers} followers · {following} following
            </Text>
          </div>
          <div className="location">
            <LocationIcon size={12} verticalAlign="middle" fill="gray" />{' '}
            <Text size="small" weight="light">
              {location}
            </Text>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="base">
          <div className="starred">
            <div className="info-box">
              <Text size="small">Stars</Text>
              <div>
                <StarIcon size={16} verticalAlign="middle" />{' '}
                <Text>{starred}</Text>
              </div>
            </div>
          </div>
          <div className="commit">
            <div className="info-box">
              <Text size="small">Commits</Text>
              <div>
                <GitCommitIcon size={16} verticalAlign="middle" />{' '}
                <Text>{commits}</Text>
              </div>
            </div>
          </div>
          <div className="pr">
            <div className="info-box">
              <Text size="small">PRs</Text>
              <div>
                <GitPullRequestIcon size={16} verticalAlign="middle" />{' '}
                <Text>{PRs}</Text>
              </div>
            </div>
          </div>
          <div className="issue">
            <div className="info-box">
              <Text size="small">Issues</Text>
              <div>
                <IssueOpenedIcon size={16} verticalAlign="middle" />{' '}
                <Text>{issues}</Text>
              </div>
            </div>
          </div>
        </div>
        <div className="activity">
          <ActivityCalendar></ActivityCalendar>
        </div>
      </div>
    </div>
  )
}

export default StatPanel
