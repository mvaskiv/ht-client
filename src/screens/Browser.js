import React, { Component } from 'react';
import { PreLoader } from '../constants/loader';
import Viewer from './Viewer';
import Pages from '../reusable/pages';
import Poster from '../constants/Poster';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
import { IconBack } from '../constants/svg';
PouchDB.plugin(PouchFind);
const db = new PouchDB('mydb-desktop')

const top_sort = [
  {
    'v': 'Top Rated',
    's': 'rating'
  },
  {
    'v': 'Recents',
    's': 'date_added'
  },
  {
    'v': 'Most Liked',
    's': 'like_count'
  },
]

export default class Browser extends Component {
    constructor() {
      super();
      this.state = {
        dataSource: [],
        view: -1,
        search: '',
        new: false,
        loaded: false,
        sort_v: 'hypotube',
        sort: 'rating',
        page: 1,
        context: false,
      }
      this._bootsrapAsync();
    }


    componentDidMount() {
      document.addEventListener('contextmenu', this._handleContextMenu);
      document.addEventListener('click', this._handleClick);
    }

    componentWillReceiveProps() {
      // if (this.props.goto.page !== this.state.sort || this.props.goto.id !== this.state.page) {
      //   this._getUpdate()
      //   console.log('qwe')
      // }
    }

    _handleClick = (e) => {
      if (e.target !== this.context) {
        this.setState({context: false});
      }
    }

    _handleContextMenu = async (e) => {
      await e.preventDefault()
      // console.log(e.target.className)
      if (typeof e.target.className === 'string' && e.target.className.match(/(movie-list-ol)|(note-list-item)/)) {
        const left = window.innerHeight - e.clientX > 320 ? e.clientX + 5 : e.clientX - 175;
        const top = (e.clientY - this.tasks.offsetTop) + this.tasks.scrollTop;
        this.setState({context: {x: top, y: left}});
        
      }
    }

    _bootsrapAsync = async () => {
      const sections = [
        'rating',
        'date_added',
        'like_count'
      ]
      let path = await window.location.pathname.split('/')
      if (sections.some(s => s === path[1])) {
        let goto = {
          page: path[1],
          id: typeof parseInt(path[2]) === 'number' ? parseInt(path[2]) : 0,
        }
        this.setState({sort: goto.page, page: goto.id}, () => this._getUpdate(goto))
      } else {
        this._getUpdate();
      }
      this.setState({uuid: localStorage.getItem('uuid')});
    }
  
    _getUpdate = async (q) => {
      let sort = await q ? q.page : this.state.sort;
      let page = await q ? q.id || 0 : this.state.page;
      fetch('/movies-cache/'+sort+'/'+page, {
        method: 'GET',
        Accept: 'application/json',
      })
      .then(response => response.json())
      .then(res => {
        this.setState({dataSource: res})
      })
      .catch(err => console.error('Caught error: ', err))    
    }

    _view = async (id) => {
        await this.setState({view: id}, () => {
            this.forceUpdate();
        })
    }

    _resetView = () => {
      this.setState({view: -1})
    }

    _gotoPage = i => {
      // let id = i + this.state.sort
      this.setState({page: i, dataSource: []}, () => this._getUpdate())
    }
  
    _onChange = (e) => {
        this.setState({search: e.target.value});
    }

    render() {
      let Movies;
      if (this.state.dataSource[0]) {
        Movies = this.state.dataSource.map((note, i) => {
            return (
              <Poster details={ note } search={ this.state.search } _view={ this._view } view={ this.state.view } key={ i } num={ i } />
            )
        })
      }
      
      return (
        <div className='notes-cnt'>
          <div className='notes-header'>
            <img src={require('../resources/img/Hypo.png')} alt='' className='hypo-menu' style={{left: this.state.view >= 0 ? -42+'px' : 10+'px'}} />
            <IconBack onClick={this._resetView} style={this.state.view} />
            <h1 style={{paddingLeft: '15px'}}>{this.state.view >= 0 ? 'Back': this.state.sort_v}</h1>
            {top_sort.map((s,i) => {
              // if (s.v !== this.state.sort_v)
              return <h2 key={ i } onClick={() => {
                // window.location.replace(`/${s.s}/1`)
                this.setState({sort: s.s, sort_v: s.v, page: 1, dataSource: []}, () => this._getUpdate())
              }} >{ s.v }</h2>
            })}
            <input className='notes-search' onChange={this._onChange} value={ this.state.search } type='search' placeholder='Search' />
          </div>
          {this.state.view >= 0 && <Viewer details={this.state.dataSource[this.state.view]} />}
            {!Movies ? 
                <PreLoader />
            :
                <div className='notes-list' ref={r => this.tasks = r} >
                  <ContextMenu visible={this.state.context} x={this.state.context.x} y={this.state.context.y} />
                  { Movies }
                </div>
            }
          <Pages current={this.state.page} goto={this._gotoPage} />
        </div>
      )
  }
}

class ContextMenu extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.visible) {
      return (
        <div className='context-menu'
          ref={e => this.context = e}
          style={{top:this.props.x,left:this.props.y}}>
          <p className='context-menu-item' onClick={this._mark} style={{color: '#c41313'}}>close</p>
          <VerticalSeparator color='#ccc' />
          <p className='context-menu-item' onClick={this._edit}>info</p>
          <VerticalSeparator color='#ccc' />
          <p className='context-menu-item delete' onClick={this._delete}>like</p>
        </div>
      )
    } else return null
  }
}

const VerticalSeparator = (props) => (
  <div style={{
    width: 1+'px',
    height: 100+'%',
    backgroundColor: props.color,
  }} />
)