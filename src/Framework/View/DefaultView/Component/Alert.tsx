import { Toast, ToastContainer } from 'react-bootstrap';
import React from 'react';

const Alert = (props: {show: boolean, onCloseCallback: () => void}) => <ToastContainer position={'top-center'} style={{zIndex: 1}}>
  <Toast className="d-inline-block" bg={'dark'} delay={1500} onClose={props.onCloseCallback} show={props.show} autohide>
    <Toast.Header>
      <strong className="me-auto">Ups ¯\_(ツ)_/¯</strong>
    </Toast.Header>
    <Toast.Body>La palabra no está en el diccionario</Toast.Body>
  </Toast>
</ToastContainer>

export default Alert
