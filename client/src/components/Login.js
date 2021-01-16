import axios from 'axios';
import React, { useState, useEffect } from 'react';
import rootAddress from './../configuration/proxy';

const Login = () => {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [userName, setUserName] = useState('');

    //receives information needed on component load

    useEffect(() => {
        const getRoot = async () => {
            const res = await axios.get(`${rootAddress}/`)
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
        const user = {
            username: usernameInput,
            password: passwordInput
        }
        
        const res = await fetch(`${rootAddress}/login`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        });
        const parsedRes = await JSON.parse(res);
        setUserName(parsedRes);

        // const res = await axios.post(`${rootAddress}/login`,     // axios implementation
        //     {
        //         username: usernameInput,
        //         password: passwordInput
        //     })
        // console.log(res);
        // const username = res.data.user;
        // setUserName(username);
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
