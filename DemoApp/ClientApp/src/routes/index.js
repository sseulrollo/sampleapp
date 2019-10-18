import React, { Component } from 'react'
import NavBar from '../components/NavBar'
import {Visibility, Button} from 'semantic-ui-react'


class Routes extends Component {

  state = {
    menuFixed: false,
    overlayFixed: false,
    intervalId: 0
  }

  constructor(props) {
    super(props)
    
    this.scrollToTop = this.scrollToTop.bind(this)
  }

  scrollStep() {
    if (window.pageYOffset === 0) {
        clearInterval(this.state.intervalId);
    }
    window.scroll(0, window.pageYOffset - this.props.scrollStepInPx);
  }
  
  scrollToTop() {
    let intervalId = setInterval(this.scrollStep.bind(this), this.props.delayInMs);
    this.setState({ intervalId: intervalId });
  }

  stickTopMenu = () => this.setState({ menuFixed: true })
  unStickTopMenu = () => this.setState({ menuFixed: false })

  render() {
    const { menuFixed} = this.state
    const {children} = this.props
    
    return (
      <div>
        <Visibility
          onBottomPassed={this.stickTopMenu}
          onBottomVisible={this.unStickTopMenu}
          once={false}
        >
          <NavBar menuFixed={menuFixed}/>
        </Visibility>
        {children}
        <div
          style={{position:'fixed', padding:'0em',  margin:'0em', bottom:'4em', right:'0.5em', 
                  border:'none'}}>
          <Button icon='arrow up' size="medium" circular onClick={this.scrollToTop} />
        </div>
      </div>
    )
  }
}


export default Routes