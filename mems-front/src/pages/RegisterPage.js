import React from 'react'

import {
    Redirect
} from "react-router-dom"



class RegisterPage extends React.Component {
    #isMounted = false

    constructor(props) {
        super(props)

        this.state = {
            login: '',
            password: '',
            passwordRepeat: ''
        }
    }

    componentDidMount() {
        this.#isMounted = true
    }

    componentWillUnmount() {
        this.#isMounted = false
    }

    handleChange = event => {
        const target = event.target
        const name   = target.name
        const value  = target.value
        this.setState({ [name]: value })
    }

    handleSubmit = async event => {
        event.preventDefault()

        try {
            const response = await fetch('/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login: this.state.login,
                    password: this.state.password,
                    passwordRepeat: this.state.passwordRepeat
                })
            })

            const data = await response.json()
            if (data.user) {
                this.props.handleLogin(data.user)
            }

            if (this.#isMounted) {
                this.setState({
                    login: '',
                    password: '',
                    passwordRepeat: ''
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    render() {
        return (
            this.props.user ?
                <Redirect to="/" />
                :
                <main>
                    <form onSubmit={this.handleSubmit} autoComplete="off">
                        <label htmlFor="login">Login</label><br />
                        <input type="text" id="login" name="login" onChange={this.handleChange} value={this.state.login} autoComplete="off" /><br />
                        <label htmlFor="password">Password</label><br />
                        <input type="password" id="password" name="password" onChange={this.handleChange} value={this.state.password} autoComplete="new-password" /><br />
                        <label htmlFor="passwordRepeat">Repeat Password</label><br />
                        <input type="password" id="passwordRepeat" name="passwordRepeat" onChange={this.handleChange} value={this.state.passwordRepeat} autoComplete="new-password" /><br />
                        <input type="submit" value="Register" />
                    </form>
                </main>
        )
    }
}

export default RegisterPage
