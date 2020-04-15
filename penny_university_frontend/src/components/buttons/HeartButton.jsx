import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'reactstrap'
import PropTypes from 'prop-types'

const HeartButton = ({ className, count, size }) => (
  <Button size={size} color="red" className={className}>
    <FontAwesomeIcon icon={faHeart} />
    {' '}
    {count}
  </Button>
)

HeartButton.propTypes = {
  count: PropTypes.number,
  size: PropTypes.string,
}

HeartButton.defaultProps = {
  size: 'md',
}

export default HeartButton
