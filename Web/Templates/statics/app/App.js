import React, { Component } from 'react';
import { Route } from 'react-router';
import wss from 'socket.io-client';
import Home from './Home'
import Login from './Login';
import Settings from './Settings';

const io = wss(`https://sorge.ektu.kz`, {
    path: '/socket.io'
});

export default function App() {
    return (
        <React.Fragment>
            <Route exact path='/' component={Home} io={io} />
            <Route exact path='/parser' component={Home} io={io} />
            <Route exact path='/login' component={Login} io={io} />
            <Route exact path='/settings' component={Settings} />
        </React.Fragment>
    );
}
