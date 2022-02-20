import React from 'react';

const Mesh = (props: { elements: unknown[][] }) => <main
  className={'d-flex flex-fill justify-content-center align-items-center'}>
  <div
    className={'d-grid position-relative gap-1 p-3 w-100 h-100'}
    style={{
      gridTemplateRows: 'repeat(6,minmax(0,1fr))',
      boxSizing: 'border-box',
      maxWidth: '350px',
      maxHeight: '420px',
    }}>
    {props.elements.map((row, index) => <div
      key={index}
      className={'d-grid gap-1 w-100'}
      style={{
        gridTemplateColumns: 'repeat(5,minmax(0,1fr))',
      }}>
      {row}</div>)}
  </div>
</main>

export default Mesh
