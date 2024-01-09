import { useState } from 'react';
import PropTypes from 'prop-types';

const LoginForm = (props) => {
    const { handleLogin } = props;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            username,
            password,
        };
        if (handleLogin(user)) {
            setUsername('');
            setPassword('');
        }
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Log in to the Bloglist Application</legend>
                    <div className='formGroup'>
                        <label htmlFor='username'>Enter username:</label>
                        <input
                            type='text'
                            name='username'
                            id='username'
                            required
                            minLength={3}
                            value={username}
                            onChange={({ target }) => setUsername(target.value)}
                        />
                    </div>
                    <div className='formGroup'>
                        <label htmlFor='password'>Enter password:</label>
                        <input
                            type='password'
                            name='password'
                            id='password'
                            required
                            minLength={8}
                            value={password}
                            onChange={({ target }) => setPassword(target.value)}
                        />
                    </div>
                    <div>
                        <input id='btn-login' type='submit' value='Login' />
                    </div>
                </fieldset>
            </form>
        </div>
    );
};
LoginForm.propTypes = { handleLogin: PropTypes.func.isRequired };

export default LoginForm;
