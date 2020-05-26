import React from 'react'
import moment from 'moment'

type DateProps = {
  date: string,
  className: string,
}

const Date = ({ date, className }: DateProps) => {
  let format = moment(date) > moment() ? 'M/D/YYYY @ h:mm A' : 'M/D/YYYY'
  return (
    <p className={className}><strong>{moment(date).format(format)}</strong></p>
  )
}

export default Date
