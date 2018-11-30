import React, { Component } from 'react';

export default class Viewer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        watch: false,
        trailer: false,
        resolution: this.props.details.torrents[0].quality,
        url: 'http://localhost:8000/stream/'+this.props.details.torrents[0].hash+'/'+this.props.details.slug+'/'+this.props.details.imdb_code,
        omdbURL: 'http://www.omdbapi.com/?apikey=3b816127&i='+this.props.details.imdb_code,
        omdbINFO: false,
        sub: null,
        comments: false,
        likes: 0,
        comText: '',
        uuid: localStorage.getItem('uuid')
      }
      this._subtitles()
      this._comments()
      this._likes()
    }

    _comments = async () => {
      await fetch('/comments/'+this.props.details.id, {
        method: 'GET',
        origin: 'Hypotube',
        headers: {
          Accept: 'application/json'
        }
      })
      .then(r => r.json())
      .then(res => {
        console.log(res)
        if (res.empty) return 
        else this.setState({comments: res})
      })
      .catch(console.error)
    }

    _likes = async () => {
      await fetch('/likes/'+this.props.details.id, {
        method: 'GET',
        origin: 'Hypotube',
        headers: {
          Accept: 'application/json'
        }
      })
      .then(r => r.json())
      .then(res => {
        if (res.empty) return
        else this.setState({likes: res.length})
      })
      .catch(console.error)
    }

    _postLike = async () => {
      await fetch('/likes/insert', {
        method: 'POST',
        origin: 'Hypotube',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: this.state.uuid,
          movie: this.props.details.id,
          like: true
        })
      })
      .then(r => r.json())
      .then(res => {
        console.log(res)
        if (res.error) alert('Error, please try again later')
        else this._likes()
      })
      .catch(console.error)
    }
  
    _postComment = () => {
      if (this.state.comText) {
        fetch('/comments/insert', {
          method: 'POST',
          origin: 'Hypotube',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user: this.state.uuid,
            movie: this.props.details.id,
            comment: this.state.comText
          })
        })
        .then(r => r.json())
        .then(res => {
          if (res.error) alert('Error, please try again later')
          else this.setState({comText: ''}, this._comments )
        })
        .catch(console.error)
      }
    }

    _subtitles = async () => {
      await fetch('/sub/'+this.props.details.imdb_code, {
        method: 'GET',
        origin: 'Hypotube',
        headers: {
          Accept: 'application/json'
        }
      })
      .then(r => r.json())
      .then(res => this.setState({sub: res.sub}))
      .catch(console.error)
    }

    _omdbAPI = async () => {
      await fetch(this.state.omdbURL, {
        method: 'GET',
        origin: 'Hypotube',
        headers: {
          Accept: 'application/json'
        }
      })
      .then(r => r.json())
      .then(res => {
        console.log(res)
        this.setState({omdbINFO: res})
      })
      console.log(this.state.omdbINFO)
    }

    _videoResolution = (link) => {
     this.setState({url: link})
    }
  
    render() {
      let sources = this.props.details.torrents.map((t, i) => {
        if (i < 3) return (
          <div className='resolution-button' key={ i } onClick={() => {
            this.setState({resolution: t.quality})
            this._videoResolution('http://localhost:8000/stream/'+t.hash+'/'+this.props.details.slug)}
          }><p style={{color: this.state.resolution === t.quality ? '#fff' : '#bbb'}}>{t.quality}</p></div>
        )
        else return null
      })


      let Comments = this.state.comments ? this.state.comments.map((c, i) => {
        return (
          <div className='comment' key={ i }>
            <p className='com-u'>{ c.user } wrote:</p>
            <p className='com-t'>{ c.comment }</p>
          </div>
        )
      }) : null;
      

      return (
        <div className={'note-view-item'}>
          {this.state.trailer && <Trailer id={this.props.details.yt_trailer_code} close={() => this.setState({trailer: false})} />}
            <div className='viewer-info'>
              <div className='y-info'>
                <div className='viewer-poster-trailer'>
                  <img src={`https://cors-anywhere.herokuapp.com/${this.props.details.medium_cover_image}`} className='img-poster' alt=''/>
                  <div className='trailer-btn'
                    onClick={() => this.setState({trailer: true})}>
                      <p>Watch Trailer</p>
                      <img src={require('../resources/img/play.png')} alt='' />
                    </div>
                  </div>
                  <p className='note-item-origin'>{this.props.details.synopsis}</p>
                  <p className='note-item-header'>{this.props.details.title} <i style={{fontWeight: '100', fontSize: 16+'px', opacity: 0.7}}>({this.props.details.year})</i></p>
                  <p className='movie-runtime'>Runtime: {this.props.details.runtime}m</p>
                  <p className='movie-rating' onClick={this._videoResolution}>Rating: {this.props.details.rating}</p>
                  <p className='note-item-text'>{this.props.details.genres.map((g,i) => {if (!this.props.details.genres[i+1]){return g} else {return g+', '}})}</p>
                  
                  <div className='video-resolutions'>
                    { sources }
                  </div>
                </div>

              <div className='y-info'>
                {this.state.watch
                  ? <video
                      ref={r => this.player = r}
                      className='video-player'
                      controls
                      autoPlay
                      controlsList="nodownload"
                      poster={`https://cors-anywhere.herokuapp.com/${this.props.details.background_image}`}
                      >
                      <source type="video/mp4" src={this.state.url} />
                      <track label="English" kind="subtitles" srcLang="en" src={this.state.sub} default />
                    </video>
                  : <div className='mov-prev-cnt'>
                      <img className='mov-preview' src={`https://cors-anywhere.herokuapp.com/${this.props.details.background_image}`} alt='' />
                      <img onClick={() => this.setState({watch: true})} className='mov-play' src={require('../resources/img/play.png')} alt='' />
                    </div>
                }
              </div>

              <div className='likes-com'>
                <img className='like' onClick={ this._postLike } src={require('../resources/img/like.png')} alt='' />
                <p className='likes'>{ this.state.likes } Likes</p>
                
                <div className='comments'>
                  <input placeholder='type it in here' ref={ r => this.input = r } type='text' name='comText' onChange={(e) => this.setState({comText: e.target.value})} value={this.state.comText} />
                  <p className='com-send' onClick={ this._postComment }>submit</p>
                  { this.state.comments
                    ? Comments 
                    : <p>No comments yet</p> 
                  }
                </div>
              </div>
              
              {/* <div className='imdb-info'>
                <p className='imdb-rating'>IMDB: {this.state.omdbINFO.imdbRating} <i>({this.state.omdbINFO.imdbVotes} Votes)</i></p>
                <p className='movie-director'>Director: {this.state.omdbINFO.Director}</p>
                <p className='movie-cast'>Cast: {this.state.omdbINFO.Actors}</p>
                <p className='movie-country'>Country: {this.state.omdbINFO.Country}</p>
                <p className='movie-rated'>Rated: {this.state.omdbINFO.Rated}</p>
                <p className='movie-awards'>Awars: {this.state.omdbINFO.Awards || 'None'}</p>
              </div> */}
          </div>
        </div>
      )
    }
}

const Trailer = ({id, close}) => (
  <div className='trailer-viewer'>
      <div style={{width: 100 + '%', height: 100 + '%'}} onClick={close} />
      <iframe id="ytplayer" type="text/html" width="640" height="360" title='traier'
          src={'https://www.youtube.com/embed/' + id +  '?autoplay=1&origin=http://example.com'}
          frameBorder="0"></iframe>
  </div>
)