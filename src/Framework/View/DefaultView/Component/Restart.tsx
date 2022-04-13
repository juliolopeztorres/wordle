import { Button, Col, Row } from 'react-bootstrap';
import React from 'react';

export interface Callback {
  playAgain(): void
}

const Restart = (props: { show: boolean, callback: Callback }) => {
  return <>
    {props.show && (<Row style={{marginBottom: '1.25rem'}}>
      <Col style={{textAlign: 'right'}}>
        <Button variant="light" className={'shadow-none'} size={'sm'}
                onClick={() => props.callback.playAgain()}>Reiniciar</Button>
      </Col>
    </Row>)}
  </>
}

export default Restart
