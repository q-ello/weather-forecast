import React, { ChangeEvent } from "react"
import st from './Input.module.scss'

interface IInput {
    value: string,
    placeholder: string,
    name: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
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