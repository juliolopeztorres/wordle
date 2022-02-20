import Row, { Callback as RowCallback } from './Row';
import React from 'react';

const Keyboard = (props: {canSend: boolean, word: string, callback: RowCallback}) => <div className={'d-flex flex-column pb-2 gap-2 pb-md-5 w-100'}>
  <Row row={['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']} canSend={props.canSend} word={props.word} callback={props.callback}/>
  <Row row={['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ']} canSend={props.canSend} word={props.word} callback={props.callback}/>
  <Row row={['enviar', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'borrar']} canSend={props.canSend} word={props.word} callback={props.callback}/>
</div>

export default Keyboard
