import React, { useState } from 'react'
import pressPlayImg from '../assets/press_play_icon.svg'

import JoinRoom from './JoinRoom'
import CreateRoom from './CreateRoom'

import './CreateJoinRoom.scss'
import ConsoleLayout from '../shared/ConsoleLayout'

const JoinMakeRoomPage = () => {
  const [currentTab, setCurrentTab] = useState('Join')

  const handleToggle = () => {
    if (currentTab === 'Join') {
      setCurrentTab('Create')
    } else {
      setCurrentTab('Join')
    }
  }

  return (
    <ConsoleLayout>
      <div className='form-container'>
        <p>Click to switch</p>
        <button onClick={handleToggle} className='form-container__toggle'>
          {currentTab}
        </button>

        <div className='image'>
          <img alt='join room illustration' src={pressPlayImg} />
        </div>

        {currentTab === 'Join' ? <JoinRoom /> : <CreateRoom />}
      </div>
    </ConsoleLayout>
  )
}

export default JoinMakeRoomPage
