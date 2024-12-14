import React from 'react'
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

const StatPanel: React.FC = () => {
  const avatar_url = 'https://avatars.githubusercontent.com/u/583231?v=4'
  const name = 'littlebutt'
  const followers = 6
  const following = 12
  const location = 'Shanghai'
  const stat = 50

  return (
    <div className="main">
      <div className="left">
        <div className="avatar">
          <Avatar src={avatar_url} alt="avatar" size={150}></Avatar>
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
                <Text>{stat}</Text>
              </div>
            </div>
          </div>
          <div className="commit">
            <div className="info-box">
              <Text size="small">Commits</Text>
              <div>
                <GitCommitIcon size={16} verticalAlign="middle" />{' '}
                <Text>{stat}</Text>
              </div>
            </div>
          </div>
          <div className="pr">
            <div className="info-box">
              <Text size="small">PRs</Text>
              <div>
                <GitPullRequestIcon size={16} verticalAlign="middle" />{' '}
                <Text>{stat}</Text>
              </div>
            </div>
          </div>
          <div className="issue">
            <div className="info-box">
              <Text size="small">Issues</Text>
              <div>
                <IssueOpenedIcon size={16} verticalAlign="middle" />{' '}
                <Text>{stat}</Text>
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
