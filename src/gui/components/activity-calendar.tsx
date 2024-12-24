// Copy from https://github.com/grubersjoe/react-activity-calendar with modification
import React, { Fragment } from 'react'
import {
  getDay,
  subWeeks,
  nextDay,
  eachDayOfInterval,
  formatISO,
  parseISO,
  Day,
  differenceInCalendarDays,
} from 'date-fns'
import './activity-calendar.css'

export interface Activity {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

type Color = string

export interface ActivityCalendarProps {
  activities?: Array<Activity>
  weekStart?: Day
  maxLevel?: number
}

export const generate = () => {
  const year = new Date().getFullYear()
  const days = eachDayOfInterval({
    start: new Date(year, 0, 1),
    end: new Date(year, 11, 31),
  })

  return days.map((date) => ({
    date: formatISO(date, { representation: 'date' }),
    count: 0,
    level: 0,
  }))
}

const ActivityCalendar = React.forwardRef<HTMLElement, ActivityCalendarProps>(
  (props, ref) => {
    const { activities = generate(), weekStart = 0, maxLevel = 5 } = props

    const fillHoles = (activities: Array<Activity>) => {
      const calendar = new Map<string, Activity>(
        activities.map((a) => [a.date, a]),
      )
      const firstActivity = activities[0] as Activity
      const lastActivity = activities[activities.length - 1] as Activity

      return eachDayOfInterval({
        start: parseISO(firstActivity.date),
        end: parseISO(lastActivity.date),
      }).map((day) => {
        const date = formatISO(day, { representation: 'date' })

        if (calendar.has(date)) {
          return calendar.get(date) as Activity
        }

        return {
          date,
          count: 0,
          level: 0,
        }
      })
    }
    const groupByWeeks = (activities: Array<Activity>, weekStart: Day = 0) => {
      const normalizedActivities = fillHoles(activities)

      // Determine the first date of the calendar. If the first date is not the
      // passed weekday, the respective weekday one week earlier is used.
      const firstActivity = normalizedActivities[0] as Activity
      const firstDate = parseISO(firstActivity.date)
      const firstCalendarDate =
        getDay(firstDate) === weekStart
          ? firstDate
          : subWeeks(nextDay(firstDate, weekStart), 1)

      // To correctly group activities by week, it is necessary to left-pad the list
      // because the first date might not be set start weekday.
      const paddedActivities = [
        ...(Array(differenceInCalendarDays(firstDate, firstCalendarDate)).fill(
          undefined,
        ) as Array<Activity>),
        ...normalizedActivities,
      ]

      const numberOfWeeks = Math.ceil(paddedActivities.length / 7)

      // Finally, group activities by week
      return [...Array(numberOfWeeks).keys()].map((weekIndex) =>
        paddedActivities.slice(weekIndex * 7, weekIndex * 7 + 7),
      )
    }

    const getDimensions = () => {
      return {
        width: weeks.length * (8 + 3) - 3,
        height: (8 + 3) * 7 - 3,
      }
    }

    const calcColorScale = (
      base: string,
      colors: [from: Color, to: Color],
      steps: number,
    ) => {
      const scale = [...Array(steps).keys()].map((i) => {
        const mixFactor = (i / (steps - 1)) * 100
        return `color-mix(in oklab, ${colors[1]} ${parseFloat(mixFactor.toFixed(2))}%, ${colors[0]})`
      })
      return [base].concat(scale)
    }
    const weeks = groupByWeeks(activities as Array<Activity>, weekStart)
    const colorScale = calcColorScale(
      '#ebedf0',
      ['#9be9a8', '#216e39'],
      maxLevel + 1,
    )

    const renderCalendar = () => {
      return weeks
        .map((week) =>
          week.map((activity, dayIndex) => {
            if (!activity) {
              return null
            }
            const block = (
              <rect
                x={0}
                y={(8 + 3) * dayIndex}
                width={8}
                height={8}
                rx={2}
                ry={2}
                fill={colorScale[activity.level]}
                data-date={activity.date}
                data-level={activity.level}
                style={{ stroke: 'rgba(0, 0, 0, 0.08)' }}
              />
            )
            return <Fragment key={activity.date}>{block}</Fragment>
          }),
        )
        .map((week, x) => (
          <g key={x} transform={`translate(${(8 + 3) * x}, 0)`}>
            {week}
          </g>
        ))
    }
    const { width, height } = getDimensions()

    return (
      <article className="container" ref={ref}>
        <div className="scrollContainer">
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="calendar"
          >
            {renderCalendar()}
          </svg>
        </div>
      </article>
    )
  },
)

export default ActivityCalendar
