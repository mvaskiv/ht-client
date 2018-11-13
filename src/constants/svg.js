import React, { Component } from 'react';

export const IconBack = ({onClick, style}) => (
    <svg
        onClick={onClick}
        className='icon-back'
        style={{opacity: style >= 0 ? '1' : '0'}}
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
)