import { Button as ButtonBt } from 'react-bootstrap';
import React from 'react';

export interface Callback {
  onSpecialKeyClicked(letter: string): void

  onLetterClicked(letter: string): void
}

const Button = (props: { letter: string, variant: string, canSend: boolean, callback: Callback }) => <ButtonBt
  className={'rounded text-uppercase fw-bold flex-grow-1 flex-shrink-1 p-1 p-sm-2'}
  variant={props.variant}
  style={{
    height: '3.25rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    flexBasis: '0%'
  }}
  onClick={() => {
    const letter = props.letter.toUpperCase()
    if(['ENVIAR', 'BORRAR'].includes(letter)){
      props.callback.onSpecialKeyClicked(letter)
      return
    }

    if (!props.canSend) {
      return
    }

    props.callback.onLetterClicked(props.letter.toUpperCase())
  }}>{props.letter.toUpperCase()}
</ButtonBt>


export default Button
