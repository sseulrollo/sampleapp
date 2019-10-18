import React from 'react'
import {Button} from 'semantic-ui-react';

const BasicButton = (props) => (
    <Button 
        basic 
        fluid 
        type="submit" 
        size={props.size ? props.size : 'large'}
        onClick={props.onclick}
        key={'btn' + props.name}
        name={props.name}
        >
        {props.label}
    </Button>
)

export default BasicButton;