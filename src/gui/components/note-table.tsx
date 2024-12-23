/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

import './note-table.css'

export interface ColumnType<RecordType = any> {
  key: string
  title: string
  colspan?: number
  rowspan?: number
  width?: string | number
  render?: (record: RecordType) => React.ReactNode
}

export interface NoteTableProps<RecordType = any> {
  columns: ColumnType<RecordType>[]
  records: RecordType[]
  style?: React.CSSProperties
  id?: string
  className?: string
}

const NoteTable = React.forwardRef<HTMLTableElement, NoteTableProps>(
  (props: NoteTableProps, ref) => {
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
                    : record[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  },
)

export default NoteTable
