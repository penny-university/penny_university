import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPen} from '@fortawesome/free-solid-svg-icons'
import {Button} from 'reactstrap'
import PropTypes from 'prop-types'

const EditButton = ({className, text, size, onClick}) => {
  return (
    <Button outline size={size} color='primary' className={className} onClick={onClick}>
      <FontAwesomeIcon icon={faPen}/> {text}
    </Button>
  )
}

EditButton.propTypes = {
  size: PropTypes.string
}

EditButton.defaultProps = {
  size: 'md'
}

export default EditButton
