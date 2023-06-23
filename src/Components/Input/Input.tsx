import React, { ChangeEvent } from "react"
import st from './Input.module.scss'

interface IInput {
    placeholder: string,
    name: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    value: string,
}

export const Input: React.FunctionComponent<IInput> = ({ value, placeholder, name, onChange }) => {
    return (
        <input
            value={value}
            placeholder={placeholder}
            name={name}
            type="text"
            onChange={onChange}
            className={st.input}
        />
    )
}