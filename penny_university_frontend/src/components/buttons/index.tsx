import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus, faTimes, faPen, faSave, faHeart, IconDefinition, faBan, faEllipsisH,
} from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames/dedupe'
import { Button } from 'reactstrap'


require('./style.scss')

const IconButton = ({
  className, size, onClick, title, detail, icon, color, id,
}: { className: string, size: 'md', onClick: () => void, title: string, detail: string, icon: IconDefinition, color: string, id: string }) => {
  const text = title && detail ? `${title} ${detail}` : title || detail
  return (
    <Button size={size} color={color} onClick={onClick} className={classNames(className, 'edit-button')} id={id}>
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
  id: '',
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
  className, onClick, type: detail, color
}: { className: string, type: string, onClick: () => void, color?: string }) => (
    <IconButton detail={detail} title="Edit" className={className} onClick={onClick} icon={faPen} color={color} />
  )

EditButton.defaultProps = {
  className: '',
  color: 'primary',
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

const DeleteButton = ({
  className, type: detail, onClick, color
}: { className: string, type: string, onClick: () => void, color: string }) => (
  <IconButton className={className} onClick={onClick} icon={faBan} title="Delete" detail={detail} color={color} />
)

DeleteButton.defaultProps = {
  className: '',
  color: 'danger',
  type: '',
}

const MoreOptions = ({
  className, onClick, id
}: { className: string, id: string, onClick: () => void, }) => (
  <IconButton className={className} onClick={onClick} icon={faEllipsisH} id={id} color="link" />
)

MoreOptions.defaultProps = {
  className: '',
  onClick: () => {  },
}

export {
  HeartButton, CreateButton, EditButton, SaveButton, CancelButton, DeleteButton, MoreOptions,
}

export default IconButton
