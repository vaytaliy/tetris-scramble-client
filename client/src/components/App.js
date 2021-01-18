import axios from 'axios'; // might want to use axios for all requests later [TBD]
import React, {useState} from 'react';
import Registration from './Registration';
import Login from './Login';
import join from '../game/online/publicRoom';

// Root container for every other component/ component group.
//If you can - group components within one to avoid this component to become
//too lengty and too detailed

const App = () => {   
    return (
        <div>
            <button onClick={join}>Test connect</button>   
            <Registration />
            <Login />
        </div>
    );
};

export default App;