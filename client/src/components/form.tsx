import { useEffect, useState } from 'react'
import { getInitialState, toggleLight } from '../services/lightService'

interface State {
  red: boolean
  green: boolean
}

const getLabelText = (state: boolean) => state ? 'encendido' : 'apagado'
const getButtonText = (state: boolean) => state ? 'Apagar' : 'Encender'

export function Form() {
  const [red, setRed] = useState(false)
  const [green, setGreen] = useState(false)

  const toggleRedLed = () => {
    toggleLight(red, 'red').then(
      res => {
        console.log(res);
        setRed(c => !c)
      }
    )
  }

  const toggleGreenLed = () => {
    toggleLight(green, 'green').then(
      () => {
        setGreen((c) => !c)
      }
    )
  }

  useEffect(()=> {
    getInitialState().then(
      (state: State) => {
        setRed(!state.red)
        setGreen(!state.green)
      }
    )
  }, [])

  return (
    <div className="main-container">
      <div className="led-container">
        <span className='red'></span>
        <label>Led Rojo {getLabelText(red)}</label>
        <button onClick={toggleRedLed} className={red ? 'isOn' : ''}>{getButtonText(red)}</button>
      </div>
      <div className="led-container">
        <span className='green'></span>
        <label>Led Verde {getLabelText(green)}</label>
        <button onClick={toggleGreenLed} className={green ? 'isOn' : ''}>{getButtonText(green)}</button>
      </div>
    </div>
  );
}
