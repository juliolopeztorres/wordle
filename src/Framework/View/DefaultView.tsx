import React, { Component, ReactNode } from "react";
import { hot } from "react-hot-loader/root";
import wordsLib from '../../Data/wordslib.json'
import { Container, Button as ButtonBt, Toast, ToastContainer, Alert } from 'react-bootstrap';

const TODAY_WORD = wordsLib[Math.floor(Math.random()*wordsLib.length)]

class DefaultView extends Component {
  state = {
    words: [[], [], [], [], []],
    sent: [],
    solved: false,
    show: false
  }

  // @ts-ignore
  constructor(props) {
    super(props);
  }

  getCurrentIndex() {
    const {sent} = this.state

    const currentIndex = sent.length

    if (currentIndex === 5) {
      throw new Error('No more rows to be filled')
    }

    return currentIndex
  }

  onLetterClicked(letter: string) {
    let currentIndex = this.getCurrentIndex()

    if(currentIndex === -1) {
      console.error('No se ha calculado bien el índice')
      return
    }

    this.setState((prevState) => {
      // @ts-ignore
      let currentWords = prevState.words
      currentWords[currentIndex].push(letter)
      return {
        ...prevState,
        words: currentWords
      }
    })
  }

  onSpecialKeyClicked(sendOrDelete: string) {
    const {words, solved} = this.state

    if (solved) {
      return
     }

    let currentIndex = -1
    try {
      currentIndex = this.getCurrentIndex()
    } catch (e) {
      return
    }

    if (sendOrDelete === 'ENVIAR') {

      if (words[currentIndex].length !== 5) {
        return
      }

      this.setState((prevState) => {
        // @ts-ignore
        const sent = prevState.sent

        const proposed = words[currentIndex].join('')

        if (!wordsLib.includes(proposed)) {
          return {
            ...prevState,
            show: true
          }
        }

        // @ts-ignore
        sent.push(proposed)

        return {
          ...prevState,
          sent: sent,
          solved: proposed === TODAY_WORD
        }
      })

      return
    }

    if(currentIndex === -1) {
      return
    }

    if (words[currentIndex].length === 0) {
      return
    }

    this.setState((prevState) => {

      words[currentIndex].pop()
      return {
        ...prevState,
        words: words
      }
    })
  }

  canSendLetter() {
    const {words, solved} = this.state

    if (solved) {
      return false
    }

    if (words[this.getCurrentIndex()].length === 5) {
      console.log('No se puede mandar más letras. ENVIAR')
      return false
    }

    return true
  }

  isLetterSent(letter: string) {
    const {sent} = this.state

    for (const letterSent of sent) {
      // @ts-ignore
      if (letterSent.includes(letter)) {
        return true
      }
    }

    return false
  }

  render(): ReactNode {
    const {words, sent, solved, show} = this.state

    const Button = (props: { letter: string, variant: string }) => <ButtonBt
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
          this.onSpecialKeyClicked(letter)
          return
        }

        let canSend = false

        try {
          canSend = this.canSendLetter()
        } catch (e) {
          return
        }

        if (!canSend) {
          return
        }

        this.onLetterClicked(props.letter.toUpperCase())
      }}>{props.letter.toUpperCase()}
    </ButtonBt>

    const Row = (props: { row: string[] }) => <div className={'d-flex gap-1'}>
      {props.row.map(
        (letter) => {
          let variant = 'dark'
          if (!['ENVIAR', 'BORRAR'].includes(letter) && this.isLetterSent(letter.toUpperCase())) {
            if (!TODAY_WORD.includes(letter.toUpperCase())) {
              variant = 'light'
            }
          }

          return <Button key={letter} letter={letter} variant={variant}/>
        }
      )}
    </div>

    const Box = (props: { letter?: string, color?: string } = {letter: '', color: 'gray'}) => <div
      className={'w-100 h-100 d-inline-flex justify-content-center align-items-center text-uppercase fw-bold user-select-none fs-2'}
      style={{
        backgroundColor: props.color,
        border: '2px solid #666',
    }}>&nbsp;{props.letter}&nbsp;</div>

    let mesh = []
    let row = []
    let rowWord = []
    let color = ''
    for (let i = 0; i < 5; i++) {
      row = []
      rowWord = words[i]
      for (let j = 0; j < 5; j++) {
        color = 'gray'

        if(sent[i]) {
          if (rowWord[j] === TODAY_WORD[j]) {
            color = 'green'
          } else if (TODAY_WORD.includes(rowWord[j])) {
            color = 'darksalmon'
          } else {
            color = 'black'
          }
        }

        row[j] = <Box key={`${i}${j}`} letter={rowWord[j] ?? ''} color={color}/>
      }

      mesh.push(row)
    }

    const Mesh = (props: { elements: unknown[][] }) => <>{props.elements.map((row, index) => <div
      key={index}
      className={'d-grid gap-1 w-100'}
      style={{
        gridTemplateColumns: 'repeat(5,minmax(0,1fr))',
      }}>
      {row}</div>)}</>

    return <Container className={'d-flex flex-column w-100 lg px-2'} style={{height: '100vh'}}>
      <ToastContainer position={'top-center'} style={{zIndex: 1}}>
        <Toast className="d-inline-block" bg={'dark'} delay={1500} onClose={
          () => this.setState((prevState) => {
            return {
              ...prevState,
              show: false
            }
          })
        } show={show} autohide>
          <Toast.Header>
            <strong className="me-auto">Ups ¯\_(ツ)_/¯</strong>
          </Toast.Header>
          <Toast.Body>La palabra no está en el diccionario</Toast.Body>
        </Toast>
      </ToastContainer>

      {/*<h4 style={{margin: '1rem auto', width: '100%', textAlign: 'center'}}>{TODAY_WORD}</h4>*/}
      {(sent.length === 5 && sent[4] !== TODAY_WORD) && (<Alert variant={'dark'} className={'text-center'}>
        La palabra era: <b><a href={`https://dle.rae.es/${TODAY_WORD}`} target={'_blank'}>{TODAY_WORD}</a></b>
      </Alert>)}

      {solved && (<Alert variant={'dark'} className={'text-center'}>
        <a href={`https://dle.rae.es/${TODAY_WORD}`} target={'_blank'}>{TODAY_WORD}</a>
      </Alert>)}

      <main className={'d-flex flex-fill justify-content-center align-items-center'}>
        <div
          className={'d-grid position-relative gap-1 p-3 w-100 h-100'}
          style={{
            gridTemplateRows: 'repeat(6,minmax(0,1fr))',
            boxSizing: 'border-box',
            maxWidth: '350px',
            maxHeight: '420px',
        }}
        >
          <Mesh elements={mesh}/>
        </div>
      </main>

      <div className={'d-flex flex-column pb-2 gap-2 pb-md-5 w-100'}>
        <Row row={['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']}/>
        <Row row={['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ']}/>
        <Row row={['enviar', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'borrar']}/>
      </div>
    </Container>
  }
}

export default hot(DefaultView);
