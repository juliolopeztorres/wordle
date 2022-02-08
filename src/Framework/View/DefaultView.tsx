import React, { Component, ReactNode } from "react";
import { hot } from "react-hot-loader/root";
import wordsLib from '../../Data/wordslib.json'
import Button from '@material-ui/core/Button';

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

    if (sendOrDelete === 'ENVIAR') {

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

    const KeyboardButton = (props: { letter: string, color: string }) => <Button
      variant="outlined"
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
    </Button>

    const SendButton = () => <Button
      variant="outlined"
      onClick={() => {
          this.onSpecialKeyClicked('ENVIAR');
          return
      }}>
      <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
        <path d="M15.5 4.4C9.5 7.2 6.8 10 4.1 16 .5 23.9 2.2 34.3 8.3 40.9 11.6 44.5 19.8 48 25 48c5.2 0 13.4-3.5 16.7-7.1 3.4-3.7 6.3-11 6.3-15.9 0-5.2-3.5-13.4-7.1-16.7C37.2 4.9 29.9 2 25 2c-2.7 0-6.5 1-9.5 2.4zM31 16.5c2.9 3 5.1 5.8 4.7 6.2-.4.4-2.8-1.3-5.2-3.7L26 14.6v12.2c0 7.5-.4 12.2-1 12.2s-1-4.7-1-12.2V14.6L19.5 19c-2.4 2.4-4.8 4.1-5.2 3.7C13.7 22 23.7 11 25 11c.3 0 3 2.5 6 5.5z"/>
      </svg>
    </Button>

    const DeleteButton = () => <Button
      variant="outlined"
      onClick={() => {
        this.onSpecialKeyClicked('BORRAR');
        return
      }}>
      <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
        <path d="M4.8 9.2C.8 14.6.7 14.8 4 19.5l3.1 4.6 10.7-.3 10.7-.3v-17l-10.6-.3-10.6-.3-2.5 3.3zm10.4 2.5c1.7 1.5 1.9 1.5 3.8-.2 2.6-2.4 3.9-1.1 1.5 1.5-1.7 1.9-1.7 2.1 0 4 2.4 2.6 1.1 3.9-1.5 1.5-1.9-1.7-2.1-1.7-4 0-2.6 2.4-3.9 1.1-1.5-1.5 1.7-1.9 1.7-2.1.2-3.8-3-3.3-1.8-4.5 1.5-1.5z"/>
      </svg>
    </Button>

    const Row = (props: { row: string[] }) => <div className="row">
      {props.row.map(
        (letter) => {
          let color = 'darkgray'
          if (!['Enviar', 'Borrar'].includes(letter) && this.isLetterSent(letter.toUpperCase())) {
            if (!TODAY_WORD.includes(letter.toUpperCase())) {
              color = 'white'
            }
          }

          if(letter.includes('Enviar')) {
            return <SendButton/>
          }

          if(letter.includes('Borrar')) {
            return <DeleteButton/>
          }

          return <KeyboardButton key={letter} letter={letter} color={color}></KeyboardButton>
        }
      )}
    </div>

    const Box = (props: { letter?: string, color?: string } = {letter: '', color: 'gray'}) => <Button
      className={`board__word__letter  ${props.color}`}
      variant="outlined"
      disabled>&nbsp;{props.letter}&nbsp;</Button>

    let mesh = []
    let row = []
    let rowWord = []
    let color = ''
    for (let i = 0; i < 5; i++) {
      row = []
      rowWord = words[i]
      for (let j = 0; j < 5; j++) {
        color = 'primary'

        if(sent[i]) {
          if (rowWord[j] === TODAY_WORD[j]) {
            color = 'success'
          } else if (TODAY_WORD.includes(rowWord[j])) {
            color = 'warn'
          } else {
            color = 'error'
          }
        }

        row[j] = <Box key={`${i}${j}`} letter={rowWord[j] ?? ''} color={color}/>
      }

      mesh.push(row)
    }

    const Mesh = (props: { elements: unknown[][] }) => <>{props.elements.map((row, index) => <div key={index}
      className="board__word">{row}</div>)}</>

    return <React.Fragment>
      {(sent.length === 5 && sent[4] !== TODAY_WORD) && (<div style={{margin: '1rem auto', width: '100%', textAlign: 'center'}}>
        <p>La palabra era: <b><a href={`https://dle.rae.es/${TODAY_WORD}`} target={'_blank'}>{TODAY_WORD}</a></b></p>
      </div>)}

      {solved && (<div style={{margin: '1rem auto', width: '100%', textAlign: 'center'}}>
        <a href={`https://dle.rae.es/${TODAY_WORD}`} target={'_blank'}>{TODAY_WORD}</a>
      </div>)}

      {/*<h4 style={{margin: '1rem auto', width: '100%', textAlign: 'center'}}>{TODAY_WORD}</h4>*/}
      <div className="board">
        <Mesh elements={mesh}/>
      </div>
      &nbsp;
      <div className="keyboard">
        <Row row={['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']}/>
        <Row row={['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ']}/>
        <Row row={['Enviar', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Borrar']}/>
      </div>
      &nbsp;
      {/*<div style={{margin: '1rem auto', width: '100%', textAlign: 'center'}}>*/}
      {/*  {sent.length > 0 && sent.map((word) => <p>{word}</p>)}*/}
      {/*</div>*/}

    </React.Fragment>
  }
}

export default hot(DefaultView);
