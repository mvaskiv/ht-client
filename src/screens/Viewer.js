import React, { Component } from 'react';

export default class Viewer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        watch: false,
        trailer: false,
        resolution: this.props.details.torrents[0].quality,
        url: 'http://localhost:8000/stream/'+this.props.details.torrents[0].hash+'/'+this.props.details.slug,
        omdbURL: 'http://www.omdbapi.com/?apikey=3b816127&i='+this.props.details.imdb_code,
        omdbINFO: false,
      }
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
      .then(res => this.setState({omdbINFO: res}))
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
                      src={this.state.url} />
                  : <div className='mov-prev-cnt'>
                      <img className='mov-preview' src={`https://cors-anywhere.herokuapp.com/${this.props.details.background_image}`} alt='' />
                      <img onClick={() => this.setState({watch: true})} className='mov-play' src={require('../resources/img/play.png')} alt='' />
                    </div>
                }
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