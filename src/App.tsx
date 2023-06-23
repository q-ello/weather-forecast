import { useState } from 'react';
import { Switch } from '@mui/material';
import { IInfo, Info } from './Components/Info/Info';
import './App.scss'
import { SearchForm } from './Components/SearchForm/SearchForm';


function App() {
  console.log('App render')
  const key: string = '15b2d054d4dbe628721a971c7b939228'
  const [props, setProps] = useState<IInfo>({})
  const [isCurrent, setIsCurrent] = useState<boolean>(true)

  const handleGeolocationError = (props: IInfo) => {
    setProps(props)
  }
  

  const getInfo = (location: string): void => {
    if (!location) {
      setProps({
        alert: ['warning', 'Мы не можем дать Вам прогноз погоды, если нам неизвестно место']
      })
      return
    }
    let url: string
    if (isCurrent) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${location.trim()}&appid=${key}&lang=ru&units=metric`
    } else {
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${location.trim()}&appid=${key}&lang=ru&units=metric`
    }
    fetch(url)
      .then((response: Response) => {
        return response.json()
      })
      .then((data: any) => {
        if (+data.cod !== 200) {
          setProps({
            alert: ['error', `${data.message}`]
          })
        }
        else {
          if (isCurrent) {
            setProps({
              temp: [[data.main.temp]],
              description: [data.weather[0].description],
              icon: [[`http://openweathermap.org/img/w/${data.weather[0].icon}.png`]],
              pressure: data.main.pressure,
              humidity: data.main.humidity,
              wind: data.wind.speed,
              sunrise: new Date(+data.sys.sunrise * 1000),
              sunset: new Date(+data.sys.sunset * 1000),
              isCurrent: isCurrent,
              location: data.name,
              date: new Date(+data.dt * 1000)
            })
          }
          else {
            const time: string[][] = [[], [], [], [], []]
            const icon: string[][] = [[], [], [], [], []]
            const temp: number[][] = [[], [], [], [], []]
            const description: string[][] = [[], [], [], [], []]
            data.list.forEach((item: any, index: number) => {
              time[Math.floor(index / 8)].push(item.dt_txt)
              icon[Math.floor(index / 8)].push(`http://openweathermap.org/img/w/${item.weather[0].icon}.png`)
              temp[Math.floor(index / 8)].push(item.main.temp)
              description[Math.floor(index / 8)].push(item.weather[0].description)
            })
            setProps({
              time: time,
              icon: icon,
              isCurrent: isCurrent,
              temp: temp,
              location: data.city.name,
            })
          }
        }
      })
      .catch(error => {
        setProps({
          alert: ['error', `${error.message}`]
        })
      })

  }

  const handleSwitchChange = (): void => {
    setIsCurrent(!isCurrent)
  }

  return (
    <div className='container'>
      <div className='form'>
        <SearchForm
          handleError={handleGeolocationError}
          getInfo={getInfo}
          APIkey={key}
        />
        <div className='switch'>
        <span className='switch_span'>Текущая погода</span>
        <Switch onChange={handleSwitchChange}/>
        <span className='switch_span'>Погода на пять дней</span>
        </div>
      </div>
      <Info {...props} />
    </div>
  );
}

export default App;
