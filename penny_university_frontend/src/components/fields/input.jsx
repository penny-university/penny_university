import React from 'react'
import { Input as InputStrap, Label } from 'reactstrap'
import propTypes from 'prop-types'

const Input = ({
  type, name, id, placeholder, onChange, label,
}) => (
  <>
    <Label for={id}>{label}</Label>
    <InputStrap
      type={type}
      name={name}
      id={id}
      placeholder={placeholder}
      onChange={(e) => {
        e.persist()
        onChange(e.target.value)
      }}
    />
  </>
)

Input.propTypes = {
  type: propTypes.string.isRequired,
  name: propTypes.string.isRequired,
  id: propTypes.string.isRequired,
  placeholder: propTypes.string,
  onChange: propTypes.func.isRequired,
  label: propTypes.string.isRequired,
}

Input.defaultProps = {
  placeholder: '',
}

export default Input
