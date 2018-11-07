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
        </header>
        <div className="App-header">
          <div className='notes'>
            <Browser />
          </div>
        </div>
      </div>
    );
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
