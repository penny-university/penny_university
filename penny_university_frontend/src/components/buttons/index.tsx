import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus, faTimes, faPen, faSave, faHeart, IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames/dedupe'
import { Button } from 'reactstrap'


require('./style.scss')

const IconButton = ({
  className, size, onClick, title, detail, icon, color,
}: { className: string, size: 'md', onClick: () => void, title: string, detail: string, icon: IconDefinition, color: 'secondary' | 'primary' | string, }) => {
  const text = title && detail ? `${title} ${detail}` : title || detail
  return (
    <Button size={size} color={color} onClick={onClick} className={classNames(className, 'edit-button')}>
      <FontAwesomeIcon icon={icon} />
      {text}
    </Button>
  )
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
}: { className: string, type?: string, onClick: () => void }) => (
    <IconButton color="secondary" className={className} onClick={onClick} detail={detail} title="Cancel" icon={faTimes} />
  )

CancelButton.defaultProps = {
  className: '',
}

const CreateButton = ({
  className, type: detail, onClick,
}: { className: string, type: string, onClick: () => void }) => (
    <IconButton onClick={onClick} className={className} detail={detail} title="Add New" icon={faPlus} />
  )


CreateButton.defaultProps = {
  className: '',
}

const EditButton = ({
  className, onClick, type: detail,
}: { className: string, type: string, onClick: () => void }) => (
    <IconButton detail={detail} title="Edit" className={className} onClick={onClick} icon={faPen} />
  )

EditButton.defaultProps = {
  className: '',
}

const HeartButton = ({ className, count: detail }: { className: string, count: number }) => (
  <IconButton color="red" className={className} detail={detail.toString()} icon={faHeart} />
)

HeartButton.defaultProps = {
  className: '',
}

const SaveButton = ({
  className, type: detail, onClick,
}: { className: string, type: string, onClick: () => void }) => (
    <IconButton className={className} onClick={onClick} icon={faSave} title="Save" detail={detail} />
  )

SaveButton.defaultProps = {
  className: '',
}

export {
  HeartButton, CreateButton, EditButton, SaveButton, CancelButton,
}

export default IconButton
