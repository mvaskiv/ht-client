import React, { Component } from 'react';

export default class Viewer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        watch: false,
        trailer: false,
        resolution: this.props.details.torrents[0].quality,
        url: 'http://localhost:8000/stream/'+this.props.details.torrents[0].hash+'/'+this.props.details.slug
      }
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
                <div className='viewer-poster-trailer'>
                    <img src={'/posters/' + this.props.details.slug + '.jpg'} className='img-poster' alt=''/>
                    <div className='trailer-btn'
                      onClick={() => this.setState({trailer: true})}>
                        <p>Watch Trailer</p>
                        <img src={require('../resources/img/play.png')} alt='' />
                    </div>
                </div>
              
              <div>
                {this.state.watch
                  ? <video
                      ref={r => this.player = r}
                      className='video-player'
                      controls
                      autoPlay
                      controlsList="nodownload"
                      poster={'/covers/' + this.props.details.slug + '.jpg'}
                      src={this.state.url} />
                  : <div className='mov-prev-cnt'>
                      <img className='mov-preview' src={'/covers/' + this.props.details.slug + '.jpg'} alt='' />
                      <img onClick={() => this.setState({watch: true})} className='mov-play' src={require('../resources/img/play.png')} alt='' />
                    </div>
                }
              </div>
              
              <div className='video-resolutions'>
                { sources }
              </div>
              <p className='note-item-origin'>{this.props.details.synopsis}</p>
              <p className='note-item-header'>{this.props.details.title} <i style={{fontWeight: '100', fontSize: 16+'px', opacity: 0.7}}>({this.props.details.year})</i></p>
              <p className='movie-runtime'>Runtime: {this.props.details.runtime}m</p>
              <p className='movie-rating' onClick={this._videoResolution}>Rating: {this.props.details.rating}</p>
              <p className='note-item-text'>{this.props.details.genres.map((g,i) => {if (!this.props.details.genres[i+1]){return g} else {return g+', '}})}</p>
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