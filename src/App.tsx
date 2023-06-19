import React, { ChangeEvent, useState } from 'react';
import { Button } from './Components/Button/Button';
import { ReactComponent as MyLocation } from './svg/my-location.svg'
import { Input } from './Components/Input/Input';
import { ReactComponent as Search } from './svg/search.svg';
import { Switch } from '@mui/material';
import { Info } from './Components/Info/Info';
import './App.scss'


function App() {
  const [location, setLocation] = useState('')
  const [myLocation, setMyLocation] = useState(null)
  const key: string = '15b2d054d4dbe628721a971c7b939228'
  const [props, setProps] = useState({})
  const [isCurrent, setIsCurrent] = useState(true)

  const getMyLocation = (): void => {
    const success: PositionCallback = (pos: GeolocationPosition): void => {
      const coords = pos.coords
      const url: string = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${key}&lang=ru`

      fetch(url)
        .then(response => {
          return response.json()
        })
        .then(data => {
          setLocation(data.name)
          setMyLocation(data.name)
        })
        .catch(() => {
          setProps({
            alert: ['error', 'Произошла ошибка в получении геоданных']
          })
        })
    }

    const error: PositionErrorCallback = (error: GeolocationPositionError): void => {
      setProps({
        alert: ['warning', 'Мы не можем показать Вам прогноз погоды таким способом: у нас нет разрешения на доступ к Вашим геоданным']
      })
    }

    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
    })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setLocation(e.target.value)
  }

  const getInfo = (): void => {
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
              location: location,
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
              location: location,
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
      <div className='search_form'>
        <Button
          onClick={getMyLocation}
        >
          <MyLocation />
        </Button>
        <Input
          value={location}
          placeholder='Enter a city'
          name='location'
          onChange={handleChange}
        />
        <Button
          onClick={getInfo}
        >
          {myLocation === location ? 'Получить прогноз погоды в Вашем городе' : `Получить прогноз погоды в данном городе`}
          <Search className='search_svg'/>
        </Button>
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
