import React, { useEffect } from 'react'


function Refresh(props) {

  useEffect(() => {
    props.history.go(-1)
  }, [])

  return <div></div>
}

export default Refresh
