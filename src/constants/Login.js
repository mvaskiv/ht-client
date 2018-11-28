import React, { Component } from 'react';

export default class LoginFrom extends Component {
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
  
    _ftOauth = async () => {
      window.location.replace('https://' + window.location.hostname + ':8443/auth/42')
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
            <p onClick={this._ftOauth}>42</p>
          </div>
        )
      } else return null
    }
}