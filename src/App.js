import React, { Component } from 'react';
// import * as Preg from './reusable/preg';
import UserPanel from './constants/User'
import LoginFrom from './constants/Login'
import Browser from './screens/Browser';
import './App.css';


class App extends Component {
  constructor() {
    super();
    this.state = {
      form: false,
      uuid: localStorage.getItem('uuid'),
      auth: localStorage.getItem('auth'),
      user: {},
    }
    this._bootstrapAsync()
  }

  _bootstrapAsync = async () => {
    let path = await window.location.pathname.split('/')
    if (path[1] === 'oauth') {
      let token = path[2].split('.')[1]

      fetch('/token_login/'+token, {
        method: 'GET',
        Accept: 'application/json',
      })
      .then(response => response.json())
      .then(res => {
        if (res) {
          localStorage.setItem('auth', res.auth)
          localStorage.setItem('uuid', res.uuid)
        }
      }).then(() => window.location.replace('/'))
      .catch(err => console.error('Caught error on start: ', err))    
    }
  }

  _logOut = async () => {
    await localStorage.clear();
    setTimeout(() => window.location.replace('/'), 155);
  }

  render() {
    return (
      <div className="App">
        <header className='titleBar'>
          <p>HypoTube</p>
          {!this.state.uuid
            ? <p className='login-btn' onClick={() => this.setState({form: !this.state.form})}>Log in / Register</p>
            : <p className='login-btn' onClick={() => this.setState({form: !this.state.form})}>{this.state.uuid}</p>
          }
        </header>
        <div className="App-header">
          <div className='notes'>
            {!this.state.uuid
              ? <LoginFrom visible={this.state.form} login={this._logIn} />
              : <UserPanel visible={this.state.form} logout={this._logOut} uuid={this.state.uuid} auth={this.state.auth}/>
            }
            <Browser />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
