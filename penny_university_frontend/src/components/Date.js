import React from 'react'
import moment from 'moment'

const Date = ({date}) => (
  <p className='text-secondary'><strong>{moment(date).format('M/D/YYYY')}</strong></p>
)

export default Date
