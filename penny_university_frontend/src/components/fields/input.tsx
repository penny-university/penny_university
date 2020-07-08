import React from 'react'
import {
  Input as InputStrap, Label, FormGroup, FormText,
} from 'reactstrap'
import { InputType } from 'reactstrap/lib/Input'

type InputProps = {
  type: InputType,
  name: string,
  id: string,
  placeholder?: string,
  onChange: (text: string) => void,
  label: string,
  value: string,
  required: boolean,
  helperText?: string,
}

const Input = ({
  type, name, id, placeholder, onChange, label, value, required, helperText,
}: InputProps) => (
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

Input.defaultProps = {
  placeholder: '',
  required: false,
  helperText: '',
}

export default Input
