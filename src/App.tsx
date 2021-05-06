import React, {useEffect, useState} from 'react';
import './App.css';

function App() {

  const [showControl, setShowControl] = useState(true)
  const [lastActivityEpoch, setLastActivityEpoch] = useState((new Date()).getTime())
  const [lastRestEpoch, setLastRestEpoch] = useState(0)
  const [totalInactiveEpoch, setTotalInactiveEpoch] = useState(0)

  const mouseMoveHandler = (_: any)=>{
    setShowControl(true)
    setLastActivityEpoch((new Date()).getTime())
    if (lastRestEpoch!==0){
      const currentTime = (new Date()).getTime()
      setTotalInactiveEpoch(totalInactiveEpoch + (currentTime - lastRestEpoch))
      setLastRestEpoch(0)
    }
  }

  const mouseStopChecker = ()=>{
    const currentTime = (new Date()).getTime()
    const inactiveEpoch = (currentTime - lastActivityEpoch)
    if (inactiveEpoch>5000){
      setShowControl(false)
      if (lastRestEpoch === 0){
        setLastRestEpoch(currentTime)
      }
    }
  }

  useEffect(()=>{
    const controlTimeout = setTimeout(()=>{
      setShowControl(false)
    }, 5000)
    const checkerInterval = setInterval(mouseStopChecker, 1000)
    return ()=>{
      clearInterval(checkerInterval)
      clearTimeout(controlTimeout)
    }
  })

  const platform = (['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'].includes(window.navigator.platform))?"Mac": "Windows"

  const control = <div className={(showControl)?"Control":"Control hide"}>
    Press {(platform==="Mac")?"^⌘F": "F11"} to enter fullscreen
  </div>

  const restTimeHour = Math.floor(totalInactiveEpoch/(60*60*1000))
  const restTimeMinutes = Math.floor((totalInactiveEpoch/(60*1000))%60)
  const restTimeSeconds = Math.floor((totalInactiveEpoch/1000)%(60))

  const restCounter = (totalInactiveEpoch > 60000)?<div className={(showControl)?"RestCounter":"RestCounter hide"}>
    At rest for {restTimeHour} H : {restTimeMinutes} M : {restTimeSeconds} S
  </div>:null

  const getAppButton = <a className={(showControl)?"GetAppButton":"GetAppButton hide"}
                          href={"https://github.com/wattanit/blankout/releases/tag/desktop-0.1"}
                          target={"_blank"}
  >
    Get Desktop App
  </a>

  return (
    <div className="App"
         onMouseMove={mouseMoveHandler}
    >
      {getAppButton}
      {restCounter}
      {control}
    </div>
  );
}

export default App;
