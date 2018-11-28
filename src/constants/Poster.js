import React, { Component } from 'react';

export default class Poster extends Component {
    constructor(props) {
      super(props)
      this.state = {
        loaded: false
      }
    }
  
    _loader = () => {
      if (this.img.complete) this.setState({loaded: true})
      else setTimeout(this._loader, 350)
    }
  
    render() {
      const props   = this.props;
      let search    = new RegExp(props.search, 'i');

      if (!props.search || (props.search
        && (props.details.title.match(search)))) {
        return (
          <div
              className='note-list-item'
              onClick={() => props._view(props.num)}>
              <div className={'movie-list-ol ' + props.num}>
                <img src={require('../resources/img/play.png')} alt='' />
              </div>
              <img ref={r => this.img = r} src={`https://cors-anywhere.herokuapp.com/${props.details.medium_cover_image}`} onLoad={ this._loader } className='img-poster' alt=''/>
              <img src={require('../resources/img/placeholder.jpg')} className='img-poster' style={{display: this.state.loaded ? 'none' : 'block'}} alt=''/>
              <p className='note-item-header'>{props.details.title}</p>
              <p className='movie-list-year'>{props.details.year}</p>
              <p className='note-item-text'>{props.details.genres[0] && props.details.genres.map((g,i) => {
                if (!props.details.genres[i+1]){return g} else {return g+', '}
              })}</p>
          </div>
        )
      } else {
        return null
      } 
    }
  }