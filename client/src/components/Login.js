import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Login = () => {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [userName, setUserName] = useState('');

    //receives information needed on component load

    useEffect(() => {
        const getRoot = async () => {
            const res = await axios.get('http://localhost:8079/', {withCredentials: true})
            const username = res.data.user;
            setUserName(username);
        }
        getRoot();
    }, [])

    const handleUsernameChange = (newValue) => {
        setUsernameInput(newValue);
    }

    const handlePasswordChange = (newValue) => {
        setPasswordInput(newValue);
    }

    const loginUser = async () => {
        const res = await axios.post('http://localhost:8079/login',
            {
                username: usernameInput,
                password: passwordInput
            }, { withCredentials: true })
        console.log(res);
        const username = res.data.user;
        setUserName(username);
    }

    return (
        <div>
            <br />
                Login
            <br />
            <div>
                <label>Username</label>
                <input type="text" value={usernameInput} onChange={(e) => handleUsernameChange(e.target.value)} />
            </div>
            <div>
                <label>Password</label>
                <input type="password" value={passwordInput} onChange={(e) => handlePasswordChange(e.target.value)} />
            </div>
            <button onClick={loginUser}>Log in</button>
            <div>The user is {userName}</div>
        </div>
    );
};

export default Login;