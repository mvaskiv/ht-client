import React, { Component } from 'react';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
import { Today } from './constants/Today';
// import { QR } from './constants/QR';
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
      uuid: localStorage.getItem('uuid')
    }
    // this._bootstrapAsync();
  }
  
  _dbSync = (uuid) => {
    // const remoteDB = new PouchDB('https://mneme-app.herokuapp.com/db/' + uuid)
    // db.sync(remoteDB, {
    //   live: true,
    //   retry: true
    // })
    // db.changes({
    //   since: 'now',
    //   live: true,
    //   include_docs: true
    // }).on('change', () => this.tasks._getUpdate())
    // .on('error', function (err) {
    //   console.error(err);
    // });
  }

  _bootstrapAsync = async () => {
    localStorage.setItem('uuid', '2ce029af-4452-493e-9f06-98d2a4e46675')
    // let uuid = await localStorage.getItem('uuid');
    // console.log(uuid)
    // if (!uuid) {
    //   fetch('https://mneme-app.herokuapp.com/init', {
    //     method: 'GET',
    //     Accept: 'application/json',
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //   })
    //   .then((response) => response.json())
    //   .then((res) => {
    //     if (res.uuid) {
    //       localStorage.setItem('uuid', res.uuid)
    //       this._dbSync(res.uuid)
    //     }
    //   })
    // } else {
    //   this._dbSync(uuid.toString())
    // }
  }

  render() {
    return (
      <div className="App">
        <header className='titleBar'>
          <p>HypoTube</p>
          <p className='login-btn' onClick={() => this.setState({form: !this.state.form})}>Log in / Register</p>
        </header>
        <div className="App-header">
          <div className='notes'>
            <LoginFrom visible={this.state.form} />
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
      uname: '',
      upass: '',
      email: '',
      fname: '',
      lname: '',
      type: 'login',
      fetching: false
    }
  }

  _submit = n => {
    this.setState({fetching: true}, () => {

    })
  }

  _onChange = e => {
    this.setState({[e.target.name]:e.target.value})
  }

  render() {
    if (this.props.visible) {
      return (
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
          <p>Submit</p>
        </div>
      )
    } else return null
  }
}

// const TasksFooter = (props) => {
//   return (
//     <div className='tasks-footer'>
//        <QR uuid={props.uuid} />
//     </div>
//   )
// }

export default App;
