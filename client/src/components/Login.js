import axios from 'axios';
import React, { useState, useEffect } from 'react';
import rootAddress from './../configuration/proxy';

const Login = () => {
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [userName, setUserName] = useState('');

    const handleEmailChange = (newValue) => {
        setEmailInput(newValue);
    }

    const handlePasswordChange = (newValue) => {
        setPasswordInput(newValue);
    }

    const loginUser = async () => {
        const requestBody = {
            email: emailInput,
            password: passwordInput
        }
        
        const res = await fetch(`${rootAddress}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(requestBody)
        });

        if (res.status === 200)
        {
            const payload = await res.json();

            localStorage.setItem('bearer-token', payload.token);
        }
        else
        {
            // TODO: Add better error handling towards the user.
            console.error(`Not good ${res}`);    
        }
    }

    return (
        <div>
            <br />
                Login
            <br />
            <div>
                <label>Email</label>
                <input type="text" value={emailInput} onChange={(e) => handleEmailChange(e.target.value)} />
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
