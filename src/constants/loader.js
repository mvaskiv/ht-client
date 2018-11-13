import React from 'react';

export const PreLoader = () => (
    <div style={{position: 'absolute', height: '256px', width: '256px', top: 0, left: 0, bottom: 0, right: 0, margin: 'auto'}}>
        <img className='hypo-loader' src={require('../resources/img/Hypo.png')} style={{width: 256+'px', height: 256+'px'}} alt='' />
        <h3>Loading...</h3>
    </div>
)