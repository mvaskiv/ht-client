import React, { Component } from 'react';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
import * as Preg from './reusable/preg';
import { Today } from './constants/Today';
import Tasks from './screens/Tasks';
import Browser from './screens/Browser';
import './App.css';

PouchDB.plugin(PouchFind);
const db = new PouchDB('mydb-desktop')

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
    console.log(window.location) 
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

class LoginFrom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uname: 'qwe',
      upass: '',
      email: 'qwe',
      fname: '',
      lname: '',
      type: 'login',
      fetching: false
    }
  }

  _register = async () => {
    let data = await {
      uname: this.state.uname,
      upass: this.state.upass,
      email: this.state.email,
      fname: this.state.fname,
      lname: this.state.lname,
    }
    this.setState({fetching: true}, async () => {
      return new Promise((resolve, reject) => {
        fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(data)
        }).then(r => r.json())
        .then((res) => {
          if (res.status === 'registered') {
           this.setState({registered: true})
            resolve('ok')
          } else {
            reject(res)
          }
        })
      }).catch((e) => {
        this.setState({fetching: false})
        console.error(e)
      })
    })
  }

  _submit = () => {
    this.setState({fetching: true}, async () => {
      let data = await {uname: this.state.uname, upass: this.state.upass}
      return new Promise((resolve, reject) => {
        fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(data)
        }).then(r => r.json())
        .then((res) => {
          if (res.status === 'login') {
            localStorage.setItem('auth', res.auth)
            localStorage.setItem('uuid', res.uuid)
            resolve('ok')
          } else {
            reject(res)
          }
        })
      }).then((res) => {
        if (res === 'ok') window.location.replace('/')
      }).catch((e) => {
        this.setState({fetching: false})
        console.error(e)
      })
    })
  }

  _onChange = e => {
    this.setState({[e.target.name]:e.target.value})
  }

  render() {
    if (this.props.visible) {
      if (this.state.fetching) return <div></div>
      else return (
        <div className='login-form'>
          <div className='log-or-reg'>
            <h2 style={{fontWeight: this.state.type === 'login' ? '700' : '200'}} onClick={() => this.setState({type: 'login'})}>Log in&nbsp;</h2>
            <h2 style={{cursor: 'default'}}>or</h2>
            <h2 style={{fontWeight: this.state.type === 'register' ? '700' : '200'}} onClick={() => this.setState({type: 'register'})}>&nbsp;Register</h2>
          </div>
          <input type='text' value={this.state.uname} name='uname' onChange={this._onChange} placeholder='login' />
          <input type='password' value={this.state.upass} name='upass' onChange={this._onChange} placeholder='password' />
          
          {this.state.type === 'register' &&
            <div>
              <h3>Who are you?</h3>
              <input type='text' value={this.state.email} name='email' onChange={this._onChange} placeholder='email' />
              <input type='text' value={this.state.fname} name='fname' onChange={this._onChange} placeholder='first name' />
              <input type='text' value={this.state.lname} name='lname' onChange={this._onChange} placeholder='last name' />
            </div>
          }
          <p onClick={this._submit}>Submit</p>
        </div>
      )
    } else return null
  }
}

class UserPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      me: {}
    }
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    fetch('/user/'+this.props.uuid, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        auth: this.props.auth
      })
    }).then(r => r.json())
    .then(res => {
      if (res.status === 'ok') this.setState({...res.me})
      else if (res.rejection === 'logout' || res.error === 'no_permission') {
        localStorage.clear();
        window.location.reload('/');
      }
    })
    .catch(e => console.log(e))
  }

  _onChange = e => {
    this.setState({[e.target.name]:e.target.value})
  }

  render() {
    if (this.props.visible) {
      return (
        <div className='login-form'>
          <div className='user-panel'>
            <h3>Profile info</h3>
            <div className='settings-div'>
              <label>Login:</label>
              <input type='text' value={this.state.uname} name='uname' onChange={this._onChange} placeholder='last name' />
            </div>
            <div className='settings-div'>
              <label>First Name:</label>
              <input type='text' value={this.state.fname} name='fname' onChange={this._onChange} placeholder='last name' />
            </div>
            <div className='settings-div'>
              <label>Last Name:</label>
              <input type='text' value={this.state.lname} name='lname' onChange={this._onChange} placeholder='last name' />
            </div>
            <div className='settings-div'>
              <label>Email:</label>
              <input type='text' value={this.state.email} name='email' onChange={this._onChange} placeholder='last name' />
            </div>
           
          </div>
          <p onClick={this.props.logout}>Log Out</p>
        </div>
      )
    } else return null
  }
}

export default App;


// <script>
//   window.fbAsyncInit = function() {
//     FB.init({
//       appId      : '489195768245540',
//       cookie     : true,
//       xfbml      : true,
//       version    : 'v3.2'
//     });
      
//     FB.AppEvents.logPageView();   
      
//   };

//   (function(d, s, id){
//      var js, fjs = d.getElementsByTagName(s)[0];
//      if (d.getElementById(id)) {return;}
//      js = d.createElement(s); js.id = id;
//      js.src = "https://connect.facebook.net/en_US/sdk.js";
//      fjs.parentNode.insertBefore(js, fjs);
//    }(document, 'script', 'facebook-jssdk'));
// </script>

// FB.getLoginStatus(function(response) {
//   statusChangeCallback(response);
// });


//  AFTEBODY

// <div id="fb-root"></div>
// <script>(function(d, s, id) {
//   var js, fjs = d.getElementsByTagName(s)[0];
//   if (d.getElementById(id)) return;
//   js = d.createElement(s); js.id = id;
//   js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2&appId=489195768245540';
//   fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));</script>

//  PLUGIN

{/* <div class="fb-login-button" data-width="50" data-max-rows="1" data-size="small" data-button-type="login_with" data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="false"></div> */}