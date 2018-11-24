import React, { Component } from 'react';

export default class Poster extends Component {
    constructor(props) {
      super(props)
      this.state = {
        loading: 1,
        hash: Date.now()
      }
      this._loader()
    }
  
    _loader = () => {
      if (this.state.loading) setTimeout(this._loader, 250)
      else this.forceUpdate();
    }
  
    render() {
      const props   = this.props;
      let search    = new RegExp(props.search, 'i');
      let loaded    = 1;
      const poster  = '/posters/' + props.details.slug + '.jpg'
      if (!props.search || (props.search
          && (props.details.title.match(search)))) {
       
          return (
            <div
                className='note-list-item'
                onClick={() => props._view(props.num)}>
                <div className='movie-list-ol'>
                  <img src={require('../resources/img/play.png')} alt='' />
                </div>
                <img src={`https://cors-anywhere.herokuapp.com/${props.details.medium_cover_image}`} className='img-poster' alt=''/>
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