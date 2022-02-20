import Button from './Button';
import React from 'react';
import {Callback as ButtonCallback} from './Button';

export interface Callback extends ButtonCallback{
  isLetterSent(letter: string): boolean
}

const Row = (props: { row: string[], canSend: boolean, word: string, callback: Callback }) => <div className={'d-flex gap-1'}>
  {props.row.map(
    (letter) => {
      let variant = 'dark'
      if (!['ENVIAR', 'BORRAR'].includes(letter) && props.callback.isLetterSent(letter.toUpperCase())) {
        if (!props.word.includes(letter.toUpperCase())) {
          variant = 'light'
        }
      }

      return <Button key={letter} letter={letter} variant={variant} canSend={props.canSend} callback={props.callback}/>
    }
  )}
</div>

export default Row
