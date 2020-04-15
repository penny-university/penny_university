import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'reactstrap'

const CreateButton = ({
  className, type, size, onClick,
}) => (
  <Button size={size} color="primary" onClick={onClick} className={className}>
    <FontAwesomeIcon icon={faPlus} />
    {' '}
    Add New
    {type}
  </Button>
)

CreateButton.propTypes = {
  type: PropTypes.string,
  size: PropTypes.string,
}

CreateButton.defaultProps = {
  size: 'md',
}

export default CreateButton
