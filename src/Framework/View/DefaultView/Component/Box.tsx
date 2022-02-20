import React from 'react';

const Box = (props: { letter?: string, color?: string } = {letter: '', color: 'gray'}) => <div
  className={'w-100 h-100 d-inline-flex justify-content-center align-items-center text-uppercase fw-bold user-select-none fs-2'}
  style={{
    backgroundColor: props.color,
    border: '2px solid #666',
  }}>&nbsp;{props.letter}&nbsp;</div>

export default Box
