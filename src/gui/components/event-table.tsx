/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

import './event-table.css'

export interface ColumnType<RecordType = any> {
  key: string
  title: string
  colspan?: number
  rowspan?: number
  width?: string | number
  render?: (target: any) => React.ReactNode
}

export interface EventTableProps<RecordType = any> {
  columns: ColumnType<RecordType>[]
  records: RecordType[]
  style?: React.CSSProperties
  id?: string
  className?: string
}

const EventTable = React.forwardRef<HTMLTableElement, EventTableProps>(
  (props: EventTableProps, ref) => {
    const tableRef = React.useRef<HTMLTableElement>(null)
    return (
      <table ref={tableRef} id={props.id} className={props.className}>
        <thead>
          <tr>
            {props.columns.map((column) => (
              <th
                key={column.key}
                colSpan={column.colspan}
                rowSpan={column.rowspan}
                style={{ width: column.width }}
              >
                <div>{column.title}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.records.map((record) => (
            <tr>
              {props.columns.map((column) => (
                <td>
                  {column.render
                    ? column.render(record[column.key])
                    : <span>{record[column.key]}</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  },
)

export default EventTable
