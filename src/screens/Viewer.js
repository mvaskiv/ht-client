import React, { Component } from 'react';

export default class Viewer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        watch: false,
        _id: this.props._id,
        trailer: false,
      }
    }
  
    render() {
      return (
          <div className={'note-view-item'}>
            {this.state.trailer && <Trailer id={this.props.details.yt_trailer_code} close={() => this.setState({trailer: false})} />}
            <div className='viewer-info'>
                <div className='viewer-poster-trailer'
                    onClick={() => this.setState({trailer: true})}>
                    <img src={'/posters/' + this.props.details.slug + '.jpg'} className='img-poster' alt=''/>
                    <div className='trailer-btn'>
                        <p>Watch Trailer</p>
                        <img src={require('../resources/img/play.png')} alt='' />
                    </div>
                </div>
              
              <div>
                {this.state.watch && 
                <video
                  ref={r => this.player = r}
                  className='video-player'
                  controls
                  controlsList="nodownload"
                  poster={'/covers/' + this.props.details.slug + '.jpwg'}
                  autoplay
                  on
                  src={'http://localhost:8000/stream/'+this.props.details.torrents[0].hash+'/'+this.props.details.slug} />
                }
                {!this.state.watch &&
                  <div className='mov-prev-cnt'>
                    <img className='mov-preview' src={'/covers/' + this.props.details.slug + '.jpg'} alt='' />
                    <img onClick={() => this.setState({watch: true})} className='mov-play' src={require('../resources/img/play.png')} alt='' />
                  </div>
                }
              </div>
              <p className='note-item-origin'>{this.props.details.synopsis}</p>
              <p className='note-item-header'>{this.props.details.title} <i style={{fontWeight: '100', fontSize: 16+'px', opacity: 0.7}}>({this.props.details.year})</i></p>
              <p className='movie-runtime'>Runtime: {this.props.details.runtime}m</p>
              <p className='movie-rating'>Rating: {this.props.details.rating}</p>
              <p className='note-item-text'>{this.props.details.genres.map((g,i) => {if (!this.props.details.genres[i+1]){return g} else {return g+', '}})}</p>
          </div>
        </div>
      )
    }
}

const Trailer = ({id, close}) => (
    <div className='trailer-viewer'>
        <div style={{width: 100 + '%', height: 100 + '%'}} onClick={close} />
        <iframe id="ytplayer" type="text/html" width="640" height="360"
            src={'https://www.youtube.com/embed/' + id +  '?autoplay=1&origin=http://example.com'}
            frameBorder="0"></iframe>
    </div>
)