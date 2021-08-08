import React from 'react'
import Moment from 'react-moment'
class MainPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            content: '',
            messages: []
        }
    }

    async componentDidMount() {
        try {
            const response = await fetch('/messages')
            const data = await response.json()
            this.setState({
                messages: data
            })
        } catch (error) {
            console.error(error)
        }
    }

    handleChange = event => {
        const target = event.target
        const name   = target.name
        const value  = target.value
        this.setState({ [name]: value })
    }

    handleMessageChange = event => {
        const target = event.target
        const id     = parseInt(target.name)

        this.setState({
            messages: this.state.messages.map(message => {
                return message.id !== id ? message : { ...message, content: target.value }
            })
        })
    }

    handleMessageSubmit = async event => {
        event.preventDefault()

        try {
            const response = await fetch('/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: this.state.content
                })
            })

            const data = await response.json()
            if (data.message) {
                this.setState({
                    content: '',
                    messages: [...this.state.messages, data.message]
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    handleEditSaveSubmit = async (event, id) => {
        event.preventDefault()

        const message = this.state.messages.find(message => message.id === id)
        if (!message.isBeingEdited) {
            this.setState({
                messages: this.state.messages.map(message => {
                    return message.id !== id ? message : { ...message, isBeingEdited: true, prevContent: message.content }
                })
            })
        } else {
            try {
                
                const response = await fetch(`/messages/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        content: message.content
                    })
                })
                if (response.status === 200) {
                    this.setState({
                        messages: this.state.messages.map(message => {
                            return message.id !== id ? message : { ...message, isBeingEdited: false }
                        })
                    })
                }
            } catch (error) {
                console.error(error)
            }
        }
    }

    handleDeleteCancelSubmit = async (event, id) => {
        event.preventDefault()

        const message = this.state.messages.find(message => message.id === id)
        if (!message.isBeingEdited) {
            try {
                const response = await fetch(`/messages/${id}`, { method: 'DELETE' })
                if (response.status === 204) {
                    this.setState({
                        messages: this.state.messages.filter(message => {
                            return message.id !== id
                        })
                    })
                }
            } catch (error) {
                console.error(error)
            }
        } else {
            this.setState({
                messages: this.state.messages.map(message => {
                    return message.id !== id ? message : { ...message, isBeingEdited: false, content: message.prevContent }
                })
            })
        }
    }

    render() {
        const user = this.props.user
        return (
            <main className="container">
            
                {user &&
                    <form onSubmit={this.handleMessageSubmit}>
                        <label htmlFor="message">What’s on your mind?</label><br />
                        <input type="text" name="content" id="message" onChange={this.handleChange} value={this.state.content} />
                        <input type="submit" value="Buzz" />
                    </form>
                }
                    {
                    this.state.messages.map(message => {
                        const showEditDelete = user && (user.admin || user.login === message.user.login)

                        return <div key={message.id}>
                            <p><strong>{message.user.login}</strong></p>
                            {message.isBeingEdited ?
                                <><input type="text" name={message.id} onChange={this.handleMessageChange} value={message.content} /><br /></>
                                :
                                <p>{message.content}</p>
                            }
                            <Moment format="l">{message.createdAt}</Moment>
                            {showEditDelete &&
                                <>
                                    <form onSubmit={event => { this.handleEditSaveSubmit(event, message.id) }}>
                                        <input type="submit" value={message.isBeingEdited ? 'Save' : 'Edit' } />
                                    </form>
                                    <form onSubmit={event => { this.handleDeleteCancelSubmit(event, message.id) }}>
                                        <input type="submit" value={message.isBeingEdited ? 'Cancel' : 'Delete' }  />
                                    </form>
                                </>
                            }
                        </div>
                    })
                }
            </main>
        )
    }
}

export default MainPage
