import axios from 'axios';
import React, { useState } from 'react';
import rootAddress from './../configuration/proxy';

const Registration = () => {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    const handleUsernameChange = (newValue) => {
        setUsernameInput(newValue);
    }

    const handlePasswordChange = (newValue) => {
        setPasswordInput(newValue);
    }

    const sendRegisterUserForm = async () => {
        const user = {
            username: usernameInput,
            password: passwordInput
        }
        
        const res = await fetch(`${rootAddress}/register`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(user),
        });
        const parsedRes = await res.json();
        console.log(parsedRes);
        
        
        // const res = await axios.post(`${rootAddress}/register`,          //axios implementation
        //     {
        //         username: usernameInput,
        //         password: passwordInput
        //     });
        // console.log(res);
    }

    return (
        <div>
            <br />
                Registration
            <br />
            <div>
                <label>Username</label>
                <input type="text" value={usernameInput} onChange={(e) => handleUsernameChange(e.target.value)} />
            </div>
            <div>
                <label>Password</label>
                <input type="password" value={passwordInput} onChange={(e) => handlePasswordChange(e.target.value)} />
            </div>
            <button onClick={sendRegisterUserForm}>Submit</button>
        </div>
    );
};

export default Registration;
