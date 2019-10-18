import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Grid, Header, Segment} from 'semantic-ui-react';
import { actionCreators } from '../store/Authentication';
import { bindActionCreators } from 'redux';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify'
import {LabelInputField, BasicButton } from './controls'


class Login extends Component {


    state = {}

    
    notifyWarn = msg => this.toastId = toast.warn(msg, { autoClose: true})

    constructor(props) {
        super(props)

        this.state = {
            user_id: Cookies.get('user_id') ? Cookies.get('user_id') : '',
            password: ''
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleLogin = this.handleLogin.bind(this)
    }


    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    
    handleLogin = (e) => {
        e.preventDefault();
        console.log('jell')
      
        const { user_id, password } = this.state
        
        this.props.loginRequest(user_id, password)
                .then(() => {
                        
                    if(this.props.login.status !== "SUCCESS") {
                        this.notifyWarn(this.props.login.message)
                    }
                })
    }

    render() {
    return (<Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{maxWidth: 450}}>
            <Header as='h2' color='teal' textAlign='center'>
            </Header>
            <Form size='large'>
                <Segment stacked>
                    <LabelInputField
                        name='user_id'
                        value={this.state.user_id}
                        icon='user'
                        placeholder='ID'
                        onChange={this.handleChange} />
                    <LabelInputField
                        name='password'
                        value={this.state.password}
                        icon='lock'
                        placeholder='Password'
                        type='password'
                        onChange={this.handleChange} />
                    <BasicButton onclick={this.handleLogin} label="Log In" />
                </Segment>
            </Form>
        </Grid.Column>
    </Grid>)}
}

Login.propTypes = {
  loginRequest: PropTypes.func.isRequired,
  login: PropTypes.object
}


export default connect(
    state => state.login,
    dispatch => bindActionCreators(actionCreators, dispatch)
  )(Login);
  