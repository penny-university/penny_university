import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'reactstrap'
import PropTypes from 'prop-types'

const CancelButton = ({
  className, type, size, onClick,
}) => (
  <Button size={size} color="secondary" className={className} onClick={onClick}>
    <FontAwesomeIcon icon={faTimes} />
    {' '}
    Cancel
    {type}
  </Button>
)

CancelButton.propTypes = {
  type: PropTypes.string,
  size: PropTypes.string,
}

CancelButton.defaultProps = {
  size: 'md',
}

export default CancelButton
