import React, { Component } from 'react';
import QRCode from 'qrcode.react';

export const QR = (props) => (
    <div className='barcode'>
        <QRCode value={props.uuid} bgColor='#fafafa' />
    </div>
)
