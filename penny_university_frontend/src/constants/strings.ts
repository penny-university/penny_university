const General = {
  save: 'Save',
  edit: 'Edit',
  cancel: 'Cancel',
  delete: 'Delete',
  followUps: 'Follow Ups',
}

const Confirmation = {
  deleteFollowUp: (id: string) => `Are you sure you want to delete this Follow Up? This action cannot be undone. ${id}`,
}

const ModalHeaders = {
  deleteFollowUp: 'Delete Follow Up',
}

export {
  General,
  Confirmation,
  ModalHeaders,
}
