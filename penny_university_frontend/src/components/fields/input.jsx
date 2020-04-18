import React from 'react'
import { Input as InputStrap, Label, FormGroup } from 'reactstrap'
import propTypes from 'prop-types'

const Input = ({
  type, name, id, placeholder, onChange, label, value, required,
}) => (
  <FormGroup>
    <Label for={id}>{label}</Label>
    <InputStrap
      type={type}
      name={name}
      id={id}
      placeholder={placeholder}
      class="form-control"
      onChange={(e) => {
        e.persist()
        onChange(e.target.value)
      }}
      value={value}
      required={required}
    />
  </FormGroup>
)

Input.propTypes = {
  type: propTypes.string.isRequired,
  name: propTypes.string.isRequired,
  id: propTypes.string.isRequired,
  placeholder: propTypes.string,
  onChange: propTypes.func.isRequired,
  label: propTypes.string.isRequired,
  required: propTypes.bool,
}

Input.defaultProps = {
  placeholder: '',
  required: false,
}

export default Input
