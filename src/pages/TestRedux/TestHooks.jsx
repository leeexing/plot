import React, {useEffect, useReducer} from 'react'

function reducer (state, action) {
  switch (action.type) {
    case 'TICK':
      let newState = {
        ...state,
        count: state.count + action.data
      }
      return newState

      default:
        return state
  }
}

function TestHooks () {
  const [state, dispatch] = useReducer(reducer, {count: 0, step: 0})
  const {count, step} = state
  console.log(state)

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({type: 'TICK', data: 1})
    }, 1000)
    return () => clearInterval(timer)
  }, [dispatch])

  return (
    <div>
      <h1>Test</h1>
      <p>{count} - {step}</p>
    </div>
  )
}

export default TestHooks
