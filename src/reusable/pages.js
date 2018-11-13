import React, { Component } from 'react';
import propTypes from 'prop-types';

export default class Pages extends Component {
    constructor(props) {
      super(props);
      this.state = {
  
      }
    }

    _pageNumbers = () => {
        let disp = [
            this.props.current - 2,
            this.props.current - 1,
            this.props.current,
            this.props.current + 1,
            this.props.current + 2,
        ]
        return disp.map((p, i) => {
            if (p > 0 && p < this.props.max) {
                return <p key={ i } className={this.props.current === p ? 'active' : ''} onClick={() => this.props.goto(parseInt(p))}>{p}</p>
            } else return null            
        })
    }
  
    render() {
        const Dots = ({onClick}) => <p onClick={onClick}>...</p>
        return (
            <div className='pages'>
                { this.props.current - 2 > 0 && <Dots onClick={() => this.props.goto(1)} />}
                { this._pageNumbers() }
                { this.props.current + 2 < this.props.max && <Dots />}
            </div>
        )
    }
  }
  
  Pages.propTypes = {
    current: propTypes.number,
    max: propTypes.number,
    goto: propTypes.func
  }
  
  Pages.defaultProps = {
    current: 1,
    max: 99,
    goto: () => null
  }

