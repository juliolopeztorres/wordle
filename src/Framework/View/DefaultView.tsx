import React, { Component, ReactNode } from "react";
import { hot } from "react-hot-loader/root";
import wordsLib from '../../Data/wordslib.json';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import BackspaceIcon from '@mui/icons-material/Backspace';
import SendIcon from '@mui/icons-material/Send';
import ReplaySharpIcon from '@mui/icons-material/ReplaySharp';
import Alert from '@mui/material/Alert';

const TODAY_WORD = wordsLib[Math.floor(Math.random()*wordsLib.length)]

class DefaultView extends Component {
  state = {
    words: [[], [], [], [], []],
    sent: [],
    solved: false,
    notValidWord: false
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
    const {words, solved} = this.state;
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
        return;
      }
      this.setState((prevState) => {
        // @ts-ignore
        const sent = prevState.sent;

        const proposed = words[currentIndex].join('')

        if (!wordsLib.includes(proposed)) {
          return {
            ...prevState,
            notValidWord: true
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
      return;
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
        words: words,
        notValidWord: false
      }
    })
  }

  clearCurrentWord() {
    const {words} = this.state;
    if (words[this.getCurrentIndex()].length === 5) {
      this.setState((prevState) => {
        words[this.getCurrentIndex()] = [];
        return {
          ...prevState,
          words: words,
          notValidWord: false
        }
      })
    }
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
    const {words, sent, notValidWord, solved} = this.state

    const KeyboardButton = (props: { letter: string, disabled: boolean }) => <Button
      variant="outlined"
      disableRipple
      className={props.disabled ? "disabled" : ""}
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
      disableRipple
      onClick={() => {
          this.onSpecialKeyClicked('ENVIAR');
          return
      }}>
      <SendIcon />
    </Button>

    const DeleteButton = () => <Button
      variant="outlined"
      onClick={() => {
        this.onSpecialKeyClicked('BORRAR');
        return
      }}>
      <BackspaceIcon />
    </Button>

    const Row = (props: { row: string[] }) => <div className="row">
      {props.row.map(
        (letter) => {
          let disabled = false;
          if (!['Enviar', 'Borrar'].includes(letter) && this.isLetterSent(letter.toUpperCase())) {
            if (!TODAY_WORD.includes(letter.toUpperCase())) {
              disabled = true
            }
          }

          if(letter.includes('Enviar')) {
            return <SendButton key={'Enviar'}/>
          }

          if(letter.includes('Borrar')) {
            return <DeleteButton key={'Borrar'}/>
          }

          return <KeyboardButton key={letter} letter={letter} disabled={disabled}/>
        }
      )}
    </div>

    const Box = (props: { letter?: string, color?: string } = {letter: '', color: 'primary'}) => {
      return <Button
        className={`board__word__letter  ${props.color}`}
        variant="outlined"
        disabled>
      {props.letter}</Button>
    }

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

      <div className="board">
        <Mesh elements={mesh}/>
      </div>
      <div className="info">
        {notValidWord && 
        <Alert 
        action={
          <IconButton color="primary" aria-label="limpiar palabra" component="span"
            onClick={this.clearCurrentWord.bind(this)}>
            <ClearAllIcon />
          </IconButton>
        }
        severity="warning">
          La palabra no está en el diccionario
        </Alert>}
        { solved &&
        <Alert 
        action={
          <IconButton color="primary" aria-label="reiniciar" component="span"
            onClick={() => {window.location.reload();}}>
            <ReplaySharpIcon sx={{ fontSize: 20 }} />
          </IconButton>
        }
        severity="success">
          Enhorabuena, ha acertado la palabra
        </Alert>}
        {sent.length === 5 && !solved && 
        <Alert 
        action={
          <IconButton color="primary" aria-label="reiniciar" component="span"
            onClick={() => {window.location.reload();}}>
            <ReplaySharpIcon sx={{ fontSize: 20 }} />
          </IconButton>
        }
        severity="error">
          La palabra era: <b>{TODAY_WORD}</b>
        </Alert>}
      </div>
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
