import { Button as ButtonBt } from 'react-bootstrap';
import React from 'react';
import { ButtonVariant } from 'react-bootstrap/types';

export interface Callback {
  onSpecialKeyClicked(sendClicked: boolean): void

  onLetterClicked(letter: string): void
}

const Button = (props: { letter: string, variant: ButtonVariant, canSend: boolean, callback: Callback }) => <ButtonBt
  className={'rounded text-uppercase fw-bold flex-grow-1 flex-shrink-1 p-1 p-sm-2 shadow-none'}
  variant={props.variant}
  style={{
    height: '3.25rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    flexBasis: '0%'
  }}
  onClick={() => {
    const letter = props.letter.toUpperCase()
    if (['ENVIAR', 'BORRAR'].includes(letter)) {
      props.callback.onSpecialKeyClicked(letter == 'ENVIAR')
      return
    }

    if (!props.canSend) {
      return
    }

    props.callback.onLetterClicked(props.letter.toUpperCase())
  }}>{props.letter.toUpperCase()}
</ButtonBt>


export default Button
