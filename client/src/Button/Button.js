
import React from 'react';
class Button extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      type: props.type,
      name: props.name,
    }
  }
  clickHandler = () => {
    if(this.state.type == 'login'){
      
    }
    else{
      this.setState({type: 'login', name: 'Login'});
    }
  }
  render() {
    return (
    <button onClick = {this.clickHandler}>
      {this.state.name}
    </button>
    );
  }
}

export default Button;