import React, { Component, ReactNode } from "react";
import { hot } from "react-hot-loader/root";
import wordsLib from '../../Data/wordslib.json'
import { Col, Container, Row as RowBt, Button as ButtonBt } from 'react-bootstrap';

const TODAY_WORD = wordsLib[Math.floor(Math.random()*wordsLib.length)]

class DefaultView extends Component {
  state = {
    words: [[], [], [], [], []],
    sent: [],
    solved: false
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

    if (sendOrDelete === '^') {

      if (words[currentIndex].length !== 5) {
        return
      }

      this.setState((prevState) => {
        // @ts-ignore
        const sent = prevState.sent

        const proposed = words[currentIndex].join('')

        if (!wordsLib.includes(proposed)) {
          alert('La palabra no está en el diccionario')
          return prevState
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
    const {words, sent, solved} = this.state

    const Button = (props: { letter: string, variant: string }) => <ButtonBt
      variant={props.variant}
      style={{
        height: '3.25rem',
        border: '1px solid #000'
      }}
      onClick={() => {
        const letter = props.letter.toUpperCase()
        if(['^', '<--'].includes(letter)){
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

    const Row = (props: { row: string[] }) => <RowBt>
      {props.row.map(
        (letter) => {
          let variant = 'dark'
          if (!['^', '<--'].includes(letter) && this.isLetterSent(letter.toUpperCase())) {
            if (!TODAY_WORD.includes(letter.toUpperCase())) {
              variant = 'light'
            }
          }

          return <Col style={{margin: 0.5, padding: 0}} className={'d-grid'}><Button key={letter} letter={letter} variant={variant}/></Col>
        }
      )}
    </RowBt>

    const Box = (props: { letter?: string, color?: string } = {letter: '', color: 'gray'}) => <div style={{
      display: 'inline-block',
      width: '3.25rem',
      height: '3.25rem',
      marginLeft: '0.1rem',
      marginRight: '0.1rem',
      backgroundColor: props.color,
      border: '1px solid #333',
      textAlign: 'center',
      fontSize: '2rem',
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

    const Mesh = (props: { elements: unknown[][] }) => <>{props.elements.map((row, index) => <div key={index}
      style={{display: 'table', margin: '0.5rem auto'}}>{row}</div>)}</>

    return <Container style={{height: '100vh'}}>
      {/*<h4 style={{margin: '1rem auto', width: '100%', textAlign: 'center'}}>{TODAY_WORD}</h4>*/}
      {(sent.length === 5 && sent[4] !== TODAY_WORD) && (<RowBt>
        <Col className={'text-center mb-3'}>
          <span>La palabra era: <b><a href={`https://dle.rae.es/${TODAY_WORD}`} target={'_blank'}>{TODAY_WORD}</a></b></span>
        </Col>
      </RowBt>)}

      {solved && (<RowBt>
        <Col className={'text-center mb-3'}>
          <a href={`https://dle.rae.es/${TODAY_WORD}`} target={'_blank'}>{TODAY_WORD}</a>
        </Col>
      </RowBt>)}

      <RowBt className={'mb-3'}>
        <Col>
          <Mesh elements={mesh}/>
        </Col>
      </RowBt>

      <Row row={['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']}/>
      <Row row={['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ']}/>
      <Row row={['^', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '<--']}/>
    </Container>
  }
}

export default hot(DefaultView);
