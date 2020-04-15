import React from 'react'
import moment from 'moment'

const Date = ({ date, className }) => (
  <p className={className}><strong>{moment(date).format('M/D/YYYY')}</strong></p>
)

export default Date
