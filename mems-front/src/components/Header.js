import { Link } from 'react-router-dom'

function Header({ user, handleLogin }) {
    const onSubmit = async event => {
        event.preventDefault()

        try {
            const response = await fetch('/session', {
                method: 'DELETE'
            })

            handleLogin(null)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <header>
            <nav className="navbar navbar-dark bg-primary">
            <Link className="tittle" to="/">mems</Link>
                <h1>mems</h1>
            {!user ?
                <div className="btn-group">
                    <li><Link className="btn" to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                </div>
                :
                <form onSubmit={onSubmit}>
                    <input type="submit" value={`Logout @${user.login}`} />
                </form>
            }
            </nav>
        </header>
    )
}

export default Header
