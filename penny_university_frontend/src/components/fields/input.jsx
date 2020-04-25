import React from 'react'
import { Input as InputStrap, Label, FormGroup, FormText } from 'reactstrap'
import propTypes from 'prop-types'

const Input = ({
  type, name, id, placeholder, onChange, label, value, required, helperText
}) => (
  <FormGroup>
    <Label for={id}>{label}</Label>
    <InputStrap
      type={type}
      name={name}
      id={id}
      placeholder={placeholder}
      className="form-control"
      onChange={(e) => {
        e.persist()
        onChange(e.target.value)
      }}
      value={value}
      required={required}
    />
    {helperText ? <FormText color="muted">{helperText}</FormText> : null}
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
  helperText: propTypes.string,
}

Input.defaultProps = {
  placeholder: '',
  required: false,
  helperText: '',
}

export default Input
