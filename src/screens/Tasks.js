import React, { Component } from 'react';
import PouchDB from 'pouchdb';
import Input from '../constants/TaskInput';
import { PreLoader } from '../constants/loader';
const db = new PouchDB('mydb-desktop')

const Task = (props) => {
  let text = props.details.text;
  function _input(e) {
    console.log(e)
    text = e.target.value;
  }
  return (
    <div
      id={props.details._id}
      onContextMenu={() => props._view(props.view === props.details._id ? '' : props.details._id)}
      className='task-list-item'
      style={{boxShadow: props.view === props.details._id ? '0 0 15px #cacaca' : 'none'}}
      >
        <svg
        className='icon-done'
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        x="0px"
        y="0px"
        fill='#c41313'
        viewBox="0 0 100 125"
        xmlSpace="preserve"><g>
        <polygon points="85.4,30.2 81.1,26 39.4,67.7 18.9,47.2 14.6,51.4 39.4,76.2  "/>        
        </g></svg>
        <p className='task-item-origin'>{props.details.origin}</p>
        {props.edit === props.details._id ? 
          <input autoFocus={true} type='text' name='text' onChange={_input} className='task-item-text edit' value={text} />
        :
          <p className='task-item-text'>{text}</p>
        }
    </div>
  );
}

class TaskEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: this.props.details.text,
      expanded: false,
    }
  }

  _expand = (e) => {
    if (e.target !== this.checkmark) {
      this.setState({expanded: !this.state.expanded})
    }
  }

 _input = (e) => {
   this.setState({text: e.target.value})
  }

  _update = async () => {
    db.get(this.props.details._id).then(async (doc) => {
      doc.text = await this.state.text;
      db.put(doc);
      this.props._edit(0)
    })
  }

  _done = () => {
    db.get(this.props.details._id).then(async (doc) => {
      doc.completed = await doc.completed ? 0 : 1;
      db.put(doc);
    })
  }
  
  render() {
    return (
      <div
        onClick={this._expand}
        id={this.props.details._id}
        onContextMenu={() => this.props._view(this.props.view === this.props.details._id ? '' : this.props.details._id)}
        className='task-list-item'
        style={{boxShadow: this.props.view === this.props.details._id | this.props.edit === this.props.details._id ? '0 0 15px #cacaca' : 'none',
                height: this.state.expanded ? 'auto' : 45+'px',
                whiteSpace: this.state.expanded ? 'normal' : 'nowrap'}}
          >
          <svg
          ref={r => this.checkmark = r}
          onClick={this._done}
          className={this.props.details.completed ? 'icon-done-compl' : 'icon-done'} 
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          x="0px"
          y="0px"
          fill='#c41313'
          viewBox="0 0 100 125"
          xmlSpace="preserve"><g>
          <polygon points="85.4,30.2 81.1,26 39.4,67.7 18.9,47.2 14.6,51.4 39.4,76.2  "/>        
          </g></svg>
          <p className='task-item-origin'>{this.props.details.origin}</p>
          {this.props.edit === this.props.details._id ? 
            <input autoFocus={true} type='text' name='text' onBlur={this._update} onChange={this._input} className='task-item-text edit' value={this.state.text} />
          :
            <p className={this.props.details.completed ? 'task-item-text compl' : 'task-item-text'}>{this.state.text}</p>
          }
      </div>
    );
  }
}

export default class Tasks extends Component {
    constructor() {
      super();
      this.state = {
        today: '',
        uuid: '',
        dataSource: [],
        view: '',
        context: false,
        loaded: false,
        tag: '',
        edit: '',
      }
      this._bootsrapAsync();
    }
  
    _sortTasks(stash, today) {
      let today_t = [];
      let tomor = [];
      let rest = [];
      stash.map(e => {
        if (e.due === today) {
          today_t.push(e);
        } else if (e.due === today + 1) {
          tomor.push(e);
        } else {
          rest.push(e);
        }
      })
      return(today_t.concat(tomor.concat(rest)));
    }

    componentDidMount() {
      document.addEventListener('contextmenu', this._handleContextMenu);
      document.addEventListener('click', this._handleClick);
    }

    _handleClick = (e) => {
      if (e.target !== this.context) {
        this.setState({context: false, view: ''});
      }
    }

    _handleContextMenu = async (e) => {
      await e.preventDefault()
      // console.log(e.target.className)
      if (typeof e.target.className === 'string' && e.target.className.match(/(task-list)|(task-item)/)) {
        const left = 400 - e.clientX > 190 ? e.clientX + 5 : e.clientX - 195;
        const top = (e.clientY - this.tasks.offsetTop) + this.tasks.scrollTop;
        this.setState({context: {x: top, y: left}});
        
      }
    }
  
    _getUpdate = async () => {
      // await this.setState({loaded: false})
      let selector = await this.state.tag ? {
        'type': 'task',
        'tag': {$regex: '.*' + this.state.tag + '.*'},
        'completed': 0,
      } : {
        'type': 'task',
        'completed': 0,
      }
      db.createIndex({
        index: {fields: ['type']},
      })
      db.find({
        selector: selector,
        sort: ['_id'],
      }).then((res) => {
        this.setState({ dataSource: this._sortTasks(res.docs.reverse(), new Date().getDate()) }, () => {
          this.setState({loaded: true}, () => this.forceUpdate())
        })
      });
    }

    _viewList = async (id) => {
      await this.setState({tag: id}, () => {
        this._getUpdate();
      })
    }

    _view = (id) => {
      this.setState({view: id}, () => {
        this.forceUpdate()
      })
    }
  
    _bootsrapAsync = async () => {
      await this._getUpdate();
      this.setState({uuid: localStorage.getItem('uuid')});
    }
  
    _addTask = () => {
      let date = new Date(),
          text = 'qwe ' + date.getSeconds(),
          hr = -1,
          min = -1,
          dueDate = null,
          tags = null;
      db.put({
        '_id': date.getTime().toString(),
        'type': 'task', 'text': text,
        'hours': hr, 'minutes': min,
        'day': dueDate ? dueDate : null, 'date': date.getDate(), 'month': date.getMonth(),
        'due': dueDate, 'tag': tags,
        'completed': 0, 'reminder': null })
          .then(() => this._getUpdate())
    }

    _mark = () => {
      
    }

    _edit = (i) => {
      if (i === 0) {
        this.setState({edit: ''})
      } else {
        this.setState({edit: this.state.view})
      }
    }

    _delete = () => {
      db.get(this.state.view).then(doc => {
        return db.remove(doc)
      })
    }
    
    render() {
        let Tasks;
        if (this.state.dataSource[0]) {
        Tasks = this.state.dataSource.map((task, i) => {
            if (this.state.edit === task._id) {
              return <TaskEdit details={ task } edit={ this.state.edit } _edit={ this._edit } key={ i } view={ this.state.view } _view={ this._view } />
            } else {
              return (
                <Task details={ task } edit={ this.state.edit } key={ i } view={ this.state.view } _view={ this._view } />
              )
            }
        })
        }

        return (
        <div>
          <div>
            <Input />
          </div>
          <div className='tasks-list' ref={r => this.tasks = r}>
            {this.state.context &&
              <div className='context-menu'
                ref={e => this.context = e}
                style={{top:this.state.context.x,left:this.state.context.y}}>
                <p className='context-menu-item' onClick={this._mark}>mark</p>
                <VerticalSeparator color='#ddd' />
                <p className='context-menu-item' onClick={this._edit}>edit</p>
                <VerticalSeparator color='#ddd' />
                <p className='context-menu-item delete' onClick={this._delete} style={{color: '#c41313'}}>delete</p>
            </div> }
            {!this.state.loaded ? 
              <PreLoader />
            :
              Tasks
            }
          </div>
        </div>
        )
    }
}

const VerticalSeparator = (props) => (
  <div style={{
    width: 1+'px',
    height: 100+'%',
    backgroundColor: props.color,
  }} />
)