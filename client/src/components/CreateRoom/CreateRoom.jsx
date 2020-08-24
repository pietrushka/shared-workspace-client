import React, {useReducer} from 'react'

import './CreateRoom.scss'

const createRoomReducer = (state, action) => {
  switch(action.type) {

    case 'create': { 
      return {
        ...state,
        isLoading: true,
        error: ''
      }
    }

    case 'success': {
      return {
        ...state,
        isLoading: false,
        isCreated: true
      }
    }

    case 'error': { 
      return { 
        ...state,
        isLoading: false,
      }
    }

    default:
      break
  }
  return state
}

const initialState = { 
  newRoomUrl: 'einn3i39hjkwrfj',
  isLoading: false,
  error: '',
  isCreated: false
}

const CreateRoom = ({history}) => {
  const [state, dispatch] = useReducer(createRoomReducer, initialState)

  const {newRoomUrl, isLoading, error, isCreated} = state

  const onSubmit = async (event) => {
    event.preventDefault()
    dispatch({ type: 'register'})
    try {
      dispatch({type: 'success'})
    } catch (error) {
      dispatch({type: 'error'})
    }
  }
  
  return (
    <form className='form' onSubmit={onSubmit}>
        
      <button className='btn' type='submit' disabled={isLoading}>
        {isLoading ? 'Loading' : 'Create'}
      </button>
    </form>
  )
}

export default CreateRoom