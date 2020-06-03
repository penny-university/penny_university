import React from 'react'

type DateProps = {
  date: string,
  className: string,
}

const Date = ({ date, className }: DateProps) => (
  <p className={className}><strong>{date}</strong></p>
)

export default Date
