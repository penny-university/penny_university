import React from 'react'
import {connect} from 'react-redux'
import {ThunkDispatch} from 'redux-thunk'
import {AnyAction} from 'redux'
import {
  ModalHeader, ModalBody, Button, ModalFooter,
} from 'reactstrap'
import modalDispatch from '../dispatch'
import {deleteFollowUp} from '../../../actions/chat';

type DeleteFollowUpModalProps = {
  deleteFollowUp: (followUpID: number, chatID: number) => AnyAction,
  followUpID: number,
  chatID: number,
}

const DeleteFollowUpModal = ({deleteFollowUp, followUpID, chatID}: DeleteFollowUpModalProps) => {
  const deleteOnPress = () => {
    deleteFollowUp(followUpID, chatID)
    modalDispatch.close()
  }
  return (
    <>
      <ModalHeader toggle={modalDispatch.close}>Delete Follow Up</ModalHeader>
      <ModalBody>
        Are you sure you want to delete this Follow Up? This action cannot be undone.
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={deleteOnPress}>
          Confirm
        </Button>
        <Button onClick={modalDispatch.close}>
          Cancel
        </Button>
      </ModalFooter>
    </>
  )
}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => ({
  deleteFollowUp: (followUpID: number, chatID: number) => dispatch(deleteFollowUp(followUpID, chatID)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DeleteFollowUpModal)
