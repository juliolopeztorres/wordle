import { Alert } from 'react-bootstrap';
import React from 'react';

const FinishResult = (props: {word: string, solved: boolean, noMoreTries: boolean}) => {
  const Link = () => <a href={`https://dle.rae.es/${props.word}`} target={'_blank'}>{props.word}</a>

  return <>
    {/*<h4 style={{margin: '1rem auto', width: '100%', textAlign: 'center'}}>{props.word}</h4>*/}

    {(props.solved || props.noMoreTries) && (<Alert variant={'dark'} className={'text-center'}>
      {props.solved && (<Link/>)}
      {props.noMoreTries && (<>La palabra era: <b><Link/></b></>)}
      </Alert>)}
  </>
}

export default FinishResult
