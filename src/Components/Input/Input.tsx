import React, { ChangeEvent, useState } from "react"
import st from './Input.module.scss'

interface IInput {
    location: string,
    placeholder: string,
    name: string,
    onChange: (value: string) => void
}

export const Input: React.FunctionComponent<IInput> = ({ location, placeholder, name, onChange }) => {

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        onChange(e.target.value)
    }

    return (
        <input
            value={location}
            placeholder={placeholder}
            name={name}
            type="text"
            onChange={handleChange}
            className={st.input}
        />
    )
}