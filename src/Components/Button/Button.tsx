import React from "react"
import st from './Button.module.scss'

interface IButton {
    children: React.ReactNode
    onClick: () => void
}

export const Button: React.FunctionComponent<IButton> = ({ children, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={st.button}
        >
            {children}
        </button>
    )
}