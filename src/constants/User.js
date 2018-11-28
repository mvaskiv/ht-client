import React, { Component } from 'react';

export default class UserPanel extends Component {
    constructor(props) {
      super(props)
      this.state = {
        me: {},
        edit: false,
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
        if (res.status === 'ok') this.setState({me: res.me})
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
            { this.state.edit
                ? <EditInfo details={ this.state.me } _onChange={ this._onChange } _edit={() => this.setState({edit: !this.state.edit})}/> 
                : <DisplayInfo details={ this.state.me } _edit={() => this.setState({edit: !this.state.edit})} />
            }
            <p onClick={this.state.edit ? this._editUInfo : this.props.logout}>{this.state.edit ? 'save' : 'Log Out'}</p>
          </div>
        )
      } else return null
    }
}

const DisplayInfo = (props) => (
    <div className='user-panel'>
        <p className='u-panel-tl' onClick={ props._edit }>Edit</p>
        <p className='u-info'>login: {props.details.uname}</p>
        <p className='u-info'>name: {props.details.fname}</p>
        <p className='u-info'>surname: {props.details.lname}</p>
        <p className='u-info'>email: {props.details.email}</p>
    </div>
)

const EditPass = (props) => (
    <div className='user-panel'>

    </div>
)

const EditInfo = (props) => (
    <div className='user-panel'>
        <h3>Profile info</h3>
        <p className='u-panel-tl' onClick={ props._edit }>Back</p>
        <div className='settings-div'>
            <label>Login:</label>
            <input type='text' value={props.details.uname} name='uname' onChange={props._onChange} placeholder='last name' />
        </div>
        <div className='settings-div'>
            <label>First Name:</label>
            <input type='text' value={props.details.fname} name='fname' onChange={props._onChange} placeholder='last name' />
        </div>
        <div className='settings-div'>
            <label>Last Name:</label>
            <input type='text' value={props.details.lname} name='lname' onChange={props._onChange} placeholder='last name' />
        </div>
        <div className='settings-div'>
            <label>Email:</label>
            <input type='text' value={props.details.email} name='email' onChange={props._onChange} placeholder='last name' />
        </div>
  </div>
)