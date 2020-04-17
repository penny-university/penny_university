import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus, faTimes, faPen, faSave, faHeart,
} from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames/dedupe'
import { Button } from 'reactstrap'
import PropTypes from 'prop-types'

require('./style.scss')

const IconButton = ({
  className, size, onClick, title, detail, icon, color,
}) => {
  const text = title && detail ? `${title} ${detail}` : title || detail
  return (
    <Button size={size} color={color} onClick={onClick} className={classNames(className, 'edit-button')}>
      <FontAwesomeIcon icon={icon} />
      {text}
    </Button>
  )
}

IconButton.propTypes = {
  size: PropTypes.string,
  title: PropTypes.string,
  detail: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  icon: PropTypes.element.isRequired,
  color: PropTypes.string,
}

IconButton.defaultProps = {
  size: 'md',
  color: 'primary',
  detail: '',
  className: '',
  title: '',
  onClick: null,
}

const CancelButton = ({
  className, onClick, type: detail,
}) => (
  <IconButton color="secondary" className={className} onClick={onClick} detail={detail} title="Cancel" icon={faTimes} />
)

CancelButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
}

CancelButton.defaultProps = {
  className: '',
}

const CreateButton = ({
  className, type: detail, onClick,
}) => (
  <IconButton onClick={onClick} className={className} detail={detail} title="Add New" icon={faPlus} />
)

CreateButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
}

CreateButton.defaultProps = {
  className: '',
}

const EditButton = ({
  className, onClick, type: detail,
}) => (
  <IconButton detail={detail} title="Edit" className={className} onClick={onClick} icon={faPen} />
)

EditButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
}

EditButton.defaultProps = {
  className: '',
}

const HeartButton = ({ className, count: detail }) => (
  <IconButton color="red" className={className} detail={detail} icon={faHeart} />
)

HeartButton.propTypes = {
  className: PropTypes.string,
  count: PropTypes.number.isRequired,
}

HeartButton.defaultProps = {
  className: '',
}

const SaveButton = ({
  className, type: detail, onClick,
}) => (
  <IconButton className={className} onClick={onClick} icon={faSave} title="Save" detail={detail} />
)

SaveButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
}

SaveButton.defaultProps = {
  className: '',
}

export {
  HeartButton, CreateButton, EditButton, SaveButton, CancelButton,
}

export default IconButton
