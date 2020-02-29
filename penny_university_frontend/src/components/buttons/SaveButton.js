import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSave} from '@fortawesome/free-solid-svg-icons'
import {Button} from 'reactstrap'
import PropTypes from 'prop-types'

const SaveButton = ({className, text, size, onClick}) => {
  return (
    <Button outline size={size} color='primary' className={className} onClick={onClick}>
      <FontAwesomeIcon icon={faSave}/> {text}
    </Button>
  )
}

SaveButton.propTypes = {
  size: PropTypes.string
}

SaveButton.defaultProps = {
  size: 'md'
}

export default SaveButton
