import { Button } from '../Button/Button';
import { ReactComponent as MyLocation } from '../../svg/my-location.svg'
import { Input } from '../Input/Input';
import { ReactComponent as Search } from '../../svg/search.svg';
import { ChangeEvent, FunctionComponent, useState } from 'react';
import st from './SearchForm.module.scss'
import { IInfo } from '../Info/Info';

interface ISearchForm {
    getInfo: (location: string) => void,
    handleError: (props: IInfo) => void,
    APIkey: string
}

export const SearchForm: FunctionComponent<ISearchForm> = ({ getInfo, handleError, APIkey }) => {
    const [value, setValue] = useState<string>('')
    const [myLocation, setMyLocation] = useState<string>('')

    const getMyLocation = (): void => {
        const success: PositionCallback = (pos: GeolocationPosition): void => {
            const coords = pos.coords
            const url: string = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${APIkey}&lang=ru`

            fetch(url)
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    setMyLocation(data.name)
                    setValue(data.name)
                })
                .catch(() => {
                    handleError({
                        alert: ['error', 'Произошла ошибка в получении геоданных']
                    })
                })
        }

        const error: PositionErrorCallback = (): void => {
            handleError({
                alert: ['warning', 'Мы не можем показать Вам прогноз погоды таким способом: у нас нет разрешения на доступ к Вашим геоданным']
            })
        }

        navigator.geolocation.getCurrentPosition(success, error, {
            enableHighAccuracy: true,
        })
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setValue(e.target.value)
    }

    const handleInfoClick = () => {
        getInfo(value)
    }

    return (
        <div className={st.search_form}>
            <Button
                onClick={getMyLocation}
            >
                <MyLocation />
            </Button>
            <Input
                onChange={handleChange}
                value={value}
                placeholder='Enter a city'
                name='location'
            />
            <Button
                onClick={handleInfoClick}
            >
                {value && myLocation === value ? 'Получить прогноз погоды в Вашем городе' : `Получить прогноз погоды в данном городе`}
                <Search className={st.search_svg} />
            </Button>
        </div>
    )
}