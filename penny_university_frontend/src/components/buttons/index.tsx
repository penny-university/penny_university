import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus, faTimes, faTrash, faPen, faSave, faHeart, IconDefinition, faCog, faEllipsisH, faHashtag,
} from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames/dedupe'
import { Button } from 'reactstrap'

require('./style.scss')

interface Props {
  className: string,
  size: 'md',
  onClick: () => void | null,
  href: string | null,
  title: string,
  detail: string,
  icon: IconDefinition,
  color: string,
  id: string,
  testID?: string | null,
}

const IconButton = ({
  className, size, onClick, href, title, detail, icon, color, id, testID,
}: Props) => {
  const text = title && detail ? `${title} ${detail}` : title || detail
  return (
    <Button
      size={size}
      color={color}
      onClick={onClick}
      href={href}
      className={classNames(className, 'edit-button')}
      id={id}
      data-testid={testID}
    >
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
  href: null,
  id: '',
  testID: null,
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
  className, onClick, type: detail, color,
}: { className: string, type: string, onClick: () => void, color?: string }) => (
  <IconButton detail={detail} title="Edit" className={className} onClick={onClick} icon={faPen} color={color} />
)

EditButton.defaultProps = {
  className: '',
  color: 'primary',
}

const DeleteButton = ({
  className, onClick, type: detail, color,
}: { className: string, type: string, onClick: () => void, color?: string }) => (
  <IconButton detail={detail} title="Delete" className={className} onClick={onClick} icon={faTrash} color={color} />
)

DeleteButton.defaultProps = {
  className: '',
  color: 'danger',
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

const MoreOptions = ({
  className, onClick, id, testID,
}: { className: string, id: string, onClick: () => void, testID: string }) => (
  <IconButton className={className} onClick={onClick} icon={faEllipsisH} id={id} color="link" testID={testID} />
)

MoreOptions.defaultProps = {
  className: '',
  onClick: null,
}

const SettingsButton = ({
  className, onClick,
}: { className: string, onClick: () => void }) => (
  <IconButton className={className} onClick={onClick} icon={faCog} title="Settings" />
)

SettingsButton.defaultProps = {
  className: '',
}

const SlackButton = ({
  className, href,
}: { className: string, href: string | null }) => (
  <IconButton className={className} href={href} title="Go to Slack" icon={faHashtag} />
)

SlackButton.defaultProps = {
  className: '',
  href: 'slack://open',
}

export {
  HeartButton, CreateButton, DeleteButton, EditButton, SaveButton, CancelButton, MoreOptions, SettingsButton, SlackButton,
}

export default IconButton
