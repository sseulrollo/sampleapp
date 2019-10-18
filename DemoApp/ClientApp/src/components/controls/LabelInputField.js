import React from 'react';
import { Form, Input } from 'semantic-ui-react'


const LabelInputField = (props) => (
    <Form.Field key={'field' + props.name}>
        {props.icon ? '' : <label key={'lbl' + props.name}>{props.placeholder}</label> }
        <Input
            type={props.type ? props.type : "text"}
            key={'txt' + props.name}
            id={'txt' + props.name}
            icon={props.icon}
            fluid
            iconPosition={props.iconPosition ? props.iconPosition : 'left'}
            name={props.name}
            placeholder={props.placeholder}
            className={props.css ? props.css : "form-control" }
            value={props.value}
            onChange={props.onChange} />
    </Form.Field>
)

export default LabelInputField