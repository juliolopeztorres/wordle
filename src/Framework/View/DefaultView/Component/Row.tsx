import Button from './Button';
import React from 'react';
import { Callback as ButtonCallback } from './Button';
import { ButtonVariant } from 'react-bootstrap/types';

export interface Callback extends ButtonCallback {
  isLetterSent(letter: string): boolean

  isLetterInTodayWord(letter: string): boolean
}

const Row = (props: { row: string[], canSend: boolean, callback: Callback }) => <div className={'d-flex gap-1'}>
  {props.row.map(
    (letter) => {
      let variant: ButtonVariant = 'dark'
      if (!['enviar', 'borrar'].includes(letter) && props.callback.isLetterSent(letter.toUpperCase())) {
        if (props.callback.isLetterInTodayWord(letter.toUpperCase())) {
          variant = 'warning'
        } else {
          variant = 'light'
        }
      }

      return <Button key={letter} letter={letter} variant={variant} canSend={props.canSend} callback={props.callback}/>
    }
  )}
</div>

export default Row
