// @flow

import React, { useState } from 'react'
import {
  ModalHeader, ModalBody, Button,
} from 'reactstrap'
import modalDispatch from '../dispatch'
import { DeleteButton, CancelButton } from '../../buttons'

require('./styles.scss')

type ConfirmDeleteModalProps = {
  warning: string,
  confirmOnPress: () => void,
}

const ConfirmDeleteModal = ({ warning, confirmOnPress }: ConfirmDeleteModalProps) => {
  return (
    <>
      <ModalHeader toggle={modalDispatch.close}>{warning}</ModalHeader>
      <ModalBody className="modal-buttons">
        <CancelButton onClick={modalDispatch.close} />
        <DeleteButton
          onClick={() => {
            confirmOnPress()
            modalDispatch.close()
          }} 
        />
      </ModalBody>
    </>
  )
}

export default ConfirmDeleteModal
