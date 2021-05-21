import React from 'react';
import Container from '@material-ui/core/Container';
import SignInForm from './SignInForm/SignInForm';
import SignUpForm from './SignUpForm/SignUpForm';

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      isLoggedIn: false,
      haveAccount: false,
    }
  }


  render(){
    let form = null;
    let dashboard = null;

    let isLoggedIn = this.state.isLoggedIn;
    let haveAccount = this.state.haveAccount;
    if(isLoggedIn===false && haveAccount===true){
      form = <SignInForm
                dontHaveAccountClick={(e)=>this.setState({haveAccount:false})}
                signInComplete={()=>this.setState({isLoggedIn:true})}
             />
    }
    else if (isLoggedIn === false && haveAccount === false){
      form = <SignUpForm 
                signUpComplete={()=>this.setState({haveAccount:true})} haveAccountClick={(e)=>this.setState({haveAccount:true})} 
            />
    }

    else if(isLoggedIn){
      dashboard = <div> <h3>Main Page</h3></div>
    }
    return (
      <Container maxWidth="lg">
        {form}
        {dashboard}
      </Container>
    );
  }  
}

export default App;