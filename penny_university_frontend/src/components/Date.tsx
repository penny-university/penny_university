import React from 'react'
import moment from 'moment'

type DateProps = {
  date: string,
  className: string,
}

const Date = ({ date, className }: DateProps) => (
  <p className={className}><strong>{moment(date).format('M/D/YYYY')}</strong></p>
)

export default Date
