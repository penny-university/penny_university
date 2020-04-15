import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'reactstrap'
import PropTypes from 'prop-types'

const SaveButton = ({
  className, type, size, onClick,
}) => (
  <Button size={size} color="primary" className={className} onClick={onClick}>
    <FontAwesomeIcon icon={faSave} />
    {' '}
    Save
    {type}
  </Button>
)

SaveButton.propTypes = {
  type: PropTypes.string,
  size: PropTypes.string,
}

SaveButton.defaultProps = {
  size: 'md',
}

export default SaveButton
