import React from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import {
  ModalHeader, ModalBody, Button, ModalFooter,
} from 'reactstrap'
import modalDispatch from '../dispatch'
import { deleteFollowUp } from '../../../actions/chat';
import { Strings } from '../../../constants';

type DeleteFollowUpModalProps = {
  deleteFollowUp: (followUpID: number, chatID: number) => AnyAction,
  followUpID: number,
  chatID: number,
}

const DeleteFollowUpModal = ({ deleteFollowUp, followUpID, chatID }: DeleteFollowUpModalProps) => {
  const deleteOnPress = () => {
    deleteFollowUp(followUpID, chatID)
    modalDispatch.close()
  }
  return (
    <>
      <ModalHeader toggle={modalDispatch.close}>{Strings.ModalHeaders.deleteFollowUp}</ModalHeader>
      <ModalBody>
        {Strings.Confirmation.deleteFollowUp}
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

const mapDispatchToProps = (dispatch: ThunkDispatch<unknown, unknown, AnyAction>) => ({
  deleteFollowUp: (followUpID: number, chatID: number) => dispatch(deleteFollowUp(followUpID, chatID)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DeleteFollowUpModal)
