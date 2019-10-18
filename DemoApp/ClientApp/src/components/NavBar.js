import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, Header, Dropdown, MenuItem } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { actionCreators } from '../store/Authentication';
import { bindActionCreators } from 'redux';
import './NavMenu.css'

import PropTypes from 'prop-types'

const NavBar = (props) => (
    <Menu 
    fixed={props.menuFixed?'top' : undefined} style={props.menuFixed? {
      backgroundcolor: '#fff',
      border: '1px solid #ddd',
      boxshadow: '0px 3px 5px rgba(0, 0, 0, 0.2)'
    } : {  
      border: 'none',
      boxshadow: 'none',
      marginBottom: '1em',
      marginTop: '0.5em',
      transition: 'box-shadow 0.5s ease, padding 0.5s ease'
    }} 
    borderless  >
      <MenuItem header>
        <Link to="/"><Header size='large'>Prototype</Header></Link>
      </MenuItem>
      <Menu.Menu position='right'>
        <MenuItem icon='log out' onClick={props.logout} />
        <Dropdown item icon='bars' simple>
          <Dropdown.Menu>
            <DropMenuItem link="/imove" name= "재고이동" />
            <DropMenuItem link="/isearch" name= "이동조회" />
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
    </Menu>
)

const DropMenuItem = ({link, name}) => (  
  <Dropdown.Item>
    <Link to={link}>{name}</Link>
  </Dropdown.Item>
)

NavBar.propTypes = {
  logout: PropTypes.func.isRequired
}

export default connect(
  state => state.login,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(NavBar);
