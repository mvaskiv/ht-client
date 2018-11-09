import React, { Component } from 'react';
import { PreLoader } from '../constants/loader';
import PouchDB from 'pouchdb';
import { request } from 'https';
const db = new PouchDB('mydb-desktop')

const Poster = (props) => {
  let search = new RegExp(props.search, 'i');  
  // const poster = 'https://cors-anywhere.herokuapp.com/' + props.details.medium_cover_image
  const poster = '/posters/' + props.details.slug + '.jpg'
  // console.log(poster)
  
  if (!props.search || (props.search
      && (props.details.title.match(search)))) {
    return (
      <div
        // style={{backgroundImage: `url(${props.details.medium_cover_image})`}}
          className={props.view === props.details.id ? 'note-view-item' : 'note-list-item'}
          onClick={() => props._view(props.num)}>
          {/* <div className='blur' style={{backgroundImage: `url(${props.details.medium_cover_image})`}} /> */}
          <img src={poster} className='img-poster' alt=''/>
          {/* <img className='mov-preview' src={props.details.background_image} alt='' /> */}
          {/* <img className='mov-play' src={require('../resources/img/play.png')} alt='' /> */}
          {/* <p className='note-item-origin'>{props.details.synopsis}</p> */}
          <p className='note-item-header'>{props.details.title}</p>
          <p className='note-item-text'>{props.details.genres[0] && props.details.genres.map((g,i) => {if (!props.details.genres[i+1]){return g} else {return g+', '}})}</p>
      </div>
    )
  } else {
    return null
  } 
}

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
  // {
  //   'v': 'Most Viewed',
  //   's': 'download_count'
  // }
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
        sort: 'rating'
      }
      this._bootsrapAsync();
    }

    _bootsrapAsync = async () => {
      await this._getUpdate();
      this.setState({uuid: localStorage.getItem('uuid')});
    }
  
    _getUpdate = async () => {
      let sort = await this.state.sort;
      fetch('/movies/'+sort+'/1', {
        method: 'GET',
        Accept: 'application/json',
      })
      .then(response => response.json())
      .then(res => {
        console.log(res);
        this.setState({dataSource: res});
      })
      .catch(err => console.error('Caught error: ', err))
    }

    _view = async (id) => {
        await this.setState({view: id}, () => {
            this.forceUpdate();
        })
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
          <svg
          onClick={() => this.setState({view: -1})}
          className='icon-back'
          style={{opacity: this.state.view >= 0 ? '1' : '0'}}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          x="0px"
          y="0px"
          fill='#c41313'
          viewBox="0 0 100 125"
          xmlSpace="preserve"><g>
          <path d="M60.9,29.6c-0.8-0.8-2-0.8-2.8,0l-19,19c-0.8,0.8-0.8,2,0,2.8l19,19c0.4,0.4,0.9,0.6,1.4,0.6s1-0.2,1.4-0.6   c0.8-0.8,0.8-2,0-2.8L43.3,50l17.6-17.6C61.7,31.6,61.7,30.4,60.9,29.6z"/>
          </g></svg>
          <h1 style={{paddingLeft: '15px'}}>{this.state.view >= 0 ? 'Back': this.state.sort_v}</h1>
          {top_sort.map((s,i) => {
            if (s.v !== this.state.sort_v) return <h2 key={ i } onClick={() => this.setState({sort: s.s, sort_v: s.v, dataSource: []}, () => this._getUpdate())} >{ s.v }</h2>
          })}
          {/* <h2>Recents</h2>
          <h2>Most Liked</h2>
          <h2>Most Viewed</h2> */}
          <input className='notes-search' onChange={this._onChange} value={ this.state.search } type='search' placeholder='Search' />
        </div>
         {this.state.view >= 0 && <Viewer details={this.state.dataSource[this.state.view]} />}
          {!Movies ? 
              <PreLoader />
          :
              <div className='notes-list' >
                { Movies }
              </div>
          }
      </div>
    )
  }
}

class Viewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      watch: false,
      _id: this.props._id
    }
  }

  componentWillMount() {
    console.log(this.props)
  }

  // componentWillUnmount() {
  //   fetch('http://localhost:8000/stream/'+this.props.details.torrents[0].hash+'/done', {
  //       method: 'GET'
  //     })
  // }

  render() {
    const poster = 'https://cors-anywhere.herokuapp.com/' + this.props.details.medium_cover_image
    return (
     
        <div className={'note-view-item'}>
             <div className='viewer-info'>
            {/* <div className='blur' style={{backgroundImage: `url(${props.details.medium_cover_image})`}} /> */}
            <img src={poster} className='img-poster' alt=''/>
            <div>
              {this.state.watch && <video
                ref={r => this.player = r}
                className='video-player'
                controls
                controlsList="nodownload"
                on
                autoPlay
                src={'http://localhost:8000/stream/'+this.props.details.torrents[0].hash+'/'+this.props.details.slug} />}
              {!this.state.watch &&
                <div className='mov-prev-cnt'>
                  <img className='mov-preview' src={this.props.details.background_image} alt='' />
                  <img onClick={() => this.setState({watch: true})} className='mov-play' src={require('../resources/img/play.png')} alt='' />
                </div>
              }
            </div>
            
            <p className='note-item-origin'>{this.props.details.synopsis}</p>
            <p className='note-item-header'>{this.props.details.title}</p>
            <p className='note-item-text'>{this.props.details.genres.map((g,i) => {if (!this.props.details.genres[i+1]){return g} else {return g+', '}})}</p>
        </div>
      </div>
    )
  }
}