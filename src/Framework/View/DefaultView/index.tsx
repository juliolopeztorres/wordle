import React, { useState } from "react";
import { hot } from "react-hot-loader/root";
import wordsLib from '../../../Data/wordslib.json'
import { Container } from 'react-bootstrap';

import Box from './Component/Box';
import Mesh from './Component/Mesh';
import Keyboard from './Component/Keyboard';
import FinishResult from './Component/FinishResult';
import Alert from './Component/Alert';

const TODAY_WORD = wordsLib[Math.floor(Math.random() * wordsLib.length)]

const DefaultView = () => {
  const [sent, setSent] = useState<string[]>([])
  const [words, setWords] = useState<string[][]>([[], [], [], [], []])
  const [solved, setSolved] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)

  const getMesh = () => {
    let mesh = []
    let row = []
    let rowWord = []
    let color = ''

    for (let i = 0; i < 5; i++) {
      row = []
      rowWord = words[i]
      for (let j = 0; j < 5; j++) {
        color = 'gray'

        if (sent[i]) {
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

    return mesh
  }

  const getCurrentIndex = () => {
    const currentIndex = sent.length

    if (currentIndex === 5) {
      throw new Error('No more rows to be filled')
    }

    return currentIndex
  }

  const canSendLetter = () => {
    if (solved) {
      return false
    }

    if (words[getCurrentIndex()].length === 5) {
      console.log('No se puede mandar más letras. ENVIAR')
      return false
    }

    return true
  }

  const isLetterSent = (letter: string) => {
    for (const letterSent of sent) {
      // @ts-ignore
      if (letterSent.includes(letter)) {
        return true
      }
    }

    return false
  }

  const onLetterClicked = (letter: string) => {
    let currentIndex = getCurrentIndex()

    if (currentIndex === -1) {
      console.error('No se ha calculado bien el índice')
      return
    }

    let currentWords = [...words]
    currentWords[currentIndex].push(letter)

    setWords(currentWords)
  }

  const onSpecialKeyClicked = (sendOrDelete: string) => {
    if (solved) {
      return
    }

    let currentIndex = -1
    try {
      currentIndex = getCurrentIndex()
    } catch (e) {
      return
    }

    if (sendOrDelete === 'ENVIAR') {
      if (words[currentIndex].length !== 5) {
        return
      }

      const proposed = words[currentIndex].join('')

      if (!wordsLib.includes(proposed)) {
        setShow(true)
        return
      }

      setSent([...sent, proposed])
      setSolved(proposed === TODAY_WORD)
      return
    }

    if (currentIndex === -1) {
      return
    }

    if (words[currentIndex].length === 0) {
      return
    }

    let currentWords = [...words]
    currentWords[currentIndex].pop()

    setWords(currentWords)
  }

  let canSend = false
  try {
    canSend = canSendLetter()
  } catch (e) {
  }

  return <Container className={'d-flex flex-column w-100 lg px-2'} style={{height: '100vh'}}>
    <Alert show={show} onCloseCallback={() => setShow(false)}/>
    <FinishResult word={TODAY_WORD} solved={solved} noMoreTries={(sent.length === 5 && sent[4] !== TODAY_WORD)}/>
    <Mesh elements={getMesh()}/>
    <Keyboard canSend={canSend} word={TODAY_WORD} callback={{isLetterSent, onLetterClicked, onSpecialKeyClicked}}/>
  </Container>
}

export default hot(DefaultView);
