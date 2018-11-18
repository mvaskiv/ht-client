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
      // await this._getUpdate();
      // let id = await this.state.page + this.state.sort
      await this._getUpdate();
      this.setState({uuid: localStorage.getItem('uuid')});
    }
  

    // _getLocal = () => {
    //   let selector = {
    //     'page': this.state.page,
    //     'sort': this.state.sort,
    //   }
    //   db.createIndex({
    //     index: {fields: ['page']},
    //   })
    //   db.find({
    //     selector: selector,
    //     sort: ['_id'],
    //   }).then((res) => {
    //     console.log(res.docs)
    //     // this.setState({ dataSource: res.docs }, () => {
    //     //   this.setState({loaded: true}, () => this.forceUpdate())
    //     // })
    //   });
    // }

    // _localUpdate = (id) => {
    //   console.log('local update ' + id)
    //   db.get(id.toString()).then(async (doc) => {
    //     console.log(doc)
    //     await this.setState({dataSource: doc.items})
    //     // this._getUpdate();
    //   })
    //   .then(() => this.forceUpdate())
    //   .catch((err) => {
    //     if (err.status === 404) {
    //       console.log('local update 404')
    //       this.setState({dataSource: []})
    //       this._getUpdate(1);
    //     }
    //   })
    // }

    // _localAdd = async (page) => {
    //   console.log('local add')
    //   let doc = {}
    //   let id = this.state.page + this.state.sort
    //   doc._id = id.toString()
    //   doc.page = this.state.page
    //   doc.sort = this.state.sort
    //   doc.items = page
    //   db.put(doc).catch(err => {
    //     console.log('local add error', err)
    //     if (err.status === 409) {
    //       // this._getUpdate()
    //     }
    //   })
    //   .catch(err => {
    //     doc._id = id.toString()
    //     doc.page = this.state.page
    //     doc.sort = this.state.sort
    //     doc.items = page
    //     db.put(doc)
    //     .then(() => {
    //       setTimeout(() => this.forceUpdate(), 200)
    //     }).catch(err => {
    //       console.log('local add error', err)
    //       if (err.status === 409) {
    //         this._getUpdate()
    //       }
    //     })
    //   })
    // }

    _getUpdate = async (q) => {
      console.log('get update')
      let sort = await this.state.sort;
      fetch('/movies/'+sort+'/'+this.state.page, {
        method: 'GET',
        Accept: 'application/json',
      })
      .then(response => response.json())
      .then(res => {
        console.log(res)
        this.setState({dataSource: res})
        // this._localAdd(res).then(() => {
        //   if (q === 1) this._localUpdate(this.state.page + this.state.sort)
        // })
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
              return <h2 key={ i } onClick={() => this.setState({sort: s.s, sort_v: s.v, dataSource: []}, () => this._getUpdate())} >{ s.v }</h2>
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