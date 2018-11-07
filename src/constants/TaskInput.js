import React, { Component } from 'react';
import PouchDB from 'pouchdb';

const db = new PouchDB('mydb-desktop')

export default class TaskInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tag: [],
            day: '',
            time: '',
            text: '',
        }
    }

    _addTask = async (text, due, tags, time) => {
        let date = await new Date();
        let dueDate = due === '' ? null :
        due === 'Tomorrow' ? date.getDate() + 1 :
            due === 'Today' ? date.getDate() : null;
        let hr = time ? time.getHours() ? time.getHours() : time.getHours() == 0 ? time.getHours() : -1 : -1;
        let min = time ? time.getMinutes() ? time.getMinutes() : time.getMinutes() == 0 ? time.getMinutes() : -1 : -1;
        db.put({
        '_id': date.getTime().toString(),
        'type': 'task', 'text': text,
        'hours': hr, 'minutes': min,
        'day': dueDate ? dueDate : null, 'date': date.getDate(), 'month': date.getMonth(),
        'due': dueDate, 'tag': tags,
        'completed': 0, 'reminder': null,
        'origin': 'Desktop' })
    }

    _submit = async () => {
        if (this.state.text) {
            this._addTask(this.state.text, this.state.day, this.state.tag.join(' ').toLowerCase(), this.state.time ? this._timeParse(this.state.time) : null).then(() => {
                this.setState({text: '', tag: [], time: '', day: ''});
            })
        }
      }

    _input = (e) => {
        this.setState({text: e.target.value});
        // this._tagManager();
        // this._timeManager();
        // this._dayManager();
        if (!e && this.state.tag) {
          this.setState({tag: []});
        }
    }

    _keyIn = (e) => {
        if (e.key === 'Enter') {
            this._submit();
        }
    }

    render() {
        let Taglist = TagsListFull.map((tag, i) => {
            if (!this.state.tag.join(' ').includes(tag.keyword)) {
              return (
                <div 
                    // onPress={() => this._tagManager(tag.keyword)} 
                    key={ i }>
                  <p className='tag'>#{tag.keyword}</p>
                </div>
              );
            } else {
              return null;
            }
          });
      
          let Tags = <p className='tags-place'>#SpaceForTags</p>;
        //   if (this.state.tag[0]) {
        //     // let tmp = this.state.tag;
        //     // if (this.state.day && !tmp.includes(this.state.day)) {tmp.push(this.state.day)}
        //     Tags = this.state.tag.map((tag, i) => {
        //       return <Text onPress={() => this._tagDelete(tag)} style={styles.tag} key={ i }>#{tag}</Text>
        //     })
        // }

        return (
 

        <div className='task-input-cnt'>
             
            {/* <div className='task-time'>
                <p
                 className='tag'
                  style={{paddingRight: 35, marginVertical: 3, color: this.state.time ? '#fff' : '#c41313', borderWidth: 1, borderColor: '#c41313', backgroundColor: this.state.time ? '#c41313' : '#fff'}}
                  >Time</p>
            </div> */}
            <input type='text'
                placeholder='Type it in'
                maxLength={60}
                name="text"
                value={this.state.text}
                onChange={this._input}
                onSubmit={this._submit}
                onKeyPress={this._keyIn}
                className='task-input-field' />
            <button
                onClick={this._submit}
                className='task-submit'>
                <p>add</p>    
            </button>
                {/* <RkButton
                    style={styles.submitBtn}
                    onPress={this._submit}
                    rkType='rounded'>
                    <Icon.MaterialIcons
                    name='add'
                    style={{
                        position: 'absolute',
                        color: '#fff',
                        top:5,
                        fontSize: 20,
                    }} />
                </RkButton> */}
                <div
                    className='tags-place'
                    style={{height: 10 + 'px', display: 'flex', width: 100 + '%', flexDirection: 'row'}}>
                    { Tags }
                    {/* {this.state.day && <Text style={[styles.tag, {color: '#c43131', backgroundColor: '#fff', paddingHorizontal: 0, marginHorizontal: 2}]}>{this.state.day}</Text>}
                    {this.state.time && <Text style={[styles.tag, {color: '#c43131', backgroundColor: '#fff', paddingHorizontal: 0, marginHorizontal: 2}]}>@{this.state.time}</Text>} */}
                </div>
                    {/* <LinearGradient start={[1,1]} end={[0,1]} locations={[0.4, 1]} style={{position: 'absolute', right: 50, top: 70, width: 25, height: 35, zIndex: 1205}} colors={['#fff', 'rgba(255,255,255,0)']} /> */}
                <div className='tag-Row' >
                    { Taglist }
                </div>
            </div>
        );
    }  
}

const TagsListFull = [
    {id: 0, name: 'Shopping', keyword: 'buy'},
    {id: 1, name: 'Calls', keyword: 'call'},
    {id: 2, name: 'Work', keyword: 'work'},
    {id: 3, name: 'Home', keyword: 'home'},
    {id: 4, name: 'Errands', keyword: 'misc'},
    {id: 5, name: 'Shared', keyword: 'shared'},
  ];
  