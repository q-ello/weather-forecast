import React from 'react'
import { Alert } from '@mui/material'
import st from './Info.module.scss'

interface IInfo {
    temp?: number[][],
    description?: string[][],
    icon?: string[][],
    pressure?: number,
    humidity?: number,
    wind?: number,
    sunrise?: Date,
    sunset?: Date,
    alert?: ['warning' | 'error', string],
    isCurrent?: boolean
    time?: string[][],
    location?: string,
    date?: Date
}

export const Info: React.FunctionComponent<IInfo> = ({ temp, date, time, description, icon, pressure, humidity, wind, sunrise, sunset, alert, isCurrent, location }) => {
    return (
        <div className={st.info}>
            {alert && <Alert severity={alert[0]}>{alert[1]}</Alert>}

            <div className={st.head}>
                {location && <h1 className={st.location}>{location}</h1>}
                {date && <h4>{date.toLocaleDateString()}</h4>}
            </div>
            {isCurrent
                ? <div className={st.current}>
                    {temp && <span className={st.current_temp}>{temp[0][0].toFixed(1)}&#8451;</span>}
                    <div className={st.current_right_bar}>
                        <div className={st.current_weather}>
                            {description && description}
                            {icon && <img src={icon[0][0]} alt={description ? description[0][0] : ''} />}
                        </div>
                        {pressure && <span className={st.span}>Давление: {pressure}мм </span>}
                        {humidity && <span className={st.span}>Влажность: {humidity}%</span>}
                        {wind && <span className={st.span}>Скорость ветра: {wind}м/с</span>}
                        {sunrise && <span className={st.span}>Время рассвета: {sunrise.toLocaleTimeString()}</span>}
                        {sunset && <span className={st.span}>Время заката: {sunset.toLocaleTimeString()}</span>}
                    </div>
                </div>
                : time && <div className={st.daily}> 
                    {time.map((day, index) => (
                        <div key={index} className={st.daily_day}>
                            <h3 className={st.daily_date}>{day[0].slice(0, 10)}</h3>
                            {day.map((timestamp, ind) => (
                                <div key={ind} className={st.daily_hour}>
                                    <span className={[st.daily_span, st.daily_timestamp].join(' ')}>{timestamp.slice(10)}</span>
                                    {temp && <span className={st.daily_span}>{temp[index][ind].toFixed(1)}&#8451;</span>}
                                    {icon && <img className={st.daily_icon} src={icon[index][ind]} alt={description ? description[index][ind] : ''}/>}
                                </div>
                            ))}
                        </div>
                    ))}
                    </div>
            }
        </div >
    )
}