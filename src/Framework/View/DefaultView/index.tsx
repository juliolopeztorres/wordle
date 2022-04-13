import React, { useState } from "react";
import { hot } from "react-hot-loader/root";
import wordsLib from '../../../Data/wordslib.json'
import { Container } from 'react-bootstrap';

import Box from './Component/Box';
import Mesh from './Component/Mesh';
import Keyboard from './Component/Keyboard';
import FinishResult from './Component/FinishResult';
import Alert from './Component/Alert';
import Restart from './Component/Restart';

let TODAY_WORD = wordsLib[Math.floor(Math.random() * wordsLib.length)]

const DefaultView = () => {
  const [sentWords, setSentWords] = useState<string[]>([])
  const [lettersArray, setLettersArray] = useState<string[][]>([[], [], [], [], []])
  const [solved, setSolved] = useState<boolean>(false)
  const [showAlert, setShowAlertAlert] = useState<boolean>(false)

  const getMesh = () => {
    let mesh = []
    let row = []
    let letters = []
    let color = ''

    for (let i = 0; i < 5; i++) {
      row = []
      letters = lettersArray[i]
      for (let j = 0; j < 5; j++) {

        color = 'gray'
        if (sentWords[i]) {
          color = 'black'
          if (letters[j] === TODAY_WORD[j]) {
            color = 'green'
          } else if (TODAY_WORD.includes(letters[j])) {
            color = '#ffbf44'
          }
        }

        row[j] = <Box key={`${i}${j}`} letter={letters[j] ?? ''} color={color}/>
      }

      mesh.push(row)
    }

    return mesh
  }

  const getCurrentTryRow = () => {
    return sentWords.length
  }

  const canSendLetter = () => {
    try {
      return !solved && lettersArray[getCurrentTryRow()].length !== 5
    } catch {
      return false
    }
  }

  const isLetterSent = (letter: string) => {
    for (const sentWord of sentWords) {
      if (sentWord.includes(letter)) {
        return true
      }
    }

    return false
  }

  const onLetterClicked = (letter: string) => {
    let currentTryRow = getCurrentTryRow()

    let currentLettersArray = [...lettersArray]
    currentLettersArray[currentTryRow].push(letter)

    setLettersArray(currentLettersArray)
  }

  const onSpecialKeyClicked = (sendClicked: boolean) => {
    const currentIndex = getCurrentTryRow()
    if (solved || currentIndex > 4) {
      return
    }

    if (sendClicked) {
      if (canSendLetter()) {
        return
      }

      const proposed = lettersArray[currentIndex].join('')

      if (!wordsLib.includes(proposed)) {
        setShowAlertAlert(true)
        return
      }

      setSentWords([...sentWords, proposed])
      setSolved(proposed === TODAY_WORD)
      return
    }

    if (lettersArray[currentIndex].length === 0) {
      return
    }

    let currentWords = [...lettersArray]
    currentWords[currentIndex].pop()

    setLettersArray(currentWords)
  }

  const isLetterInTodayWord = (letter: string): boolean => {
    return TODAY_WORD.includes(letter)
  }

  const playAgain = () => {
    setSentWords([])
    setLettersArray([[], [], [], [], []])
    setSolved(false)

    TODAY_WORD = wordsLib[Math.floor(Math.random() * wordsLib.length)]
  }

  return <Container className={'d-flex flex-column w-100 lg px-2'} style={{height: '100vh'}}>
    <Alert show={showAlert} onCloseCallback={() => setShowAlertAlert(false)}/>
    <Restart show={!solved && sentWords.length !== 5} callback={{playAgain}}/>
    <FinishResult
      word={TODAY_WORD}
      solved={solved}
      noMoreTries={(sentWords.length === 5 && sentWords[4] !== TODAY_WORD)}
      callback={{playAgain}}
    />
    <Mesh elements={getMesh()}/>
    <Keyboard
      canSend={canSendLetter()}
      callback={{isLetterSent, isLetterInTodayWord, onLetterClicked, onSpecialKeyClicked}}/>
  </Container>
}

export default hot(DefaultView);
