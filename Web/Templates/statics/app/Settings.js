import React, { Component } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import Header from './Header'

export default function Settings() {
    const culture = useParams().culture || 'ru';
    const history = useHistory();

    const end = () => {
        history.push('/')
    }

    return (
        <React.Fragment>
            <Header />
            <div className="main" style={{ bottom: '0px', height: 'calc(100% - 54px)', backgroundColor: '#faf9f8', position: 'relative' }}>
                <div style={{ padding: '0px 32px', height: '100%'}}>
                    <header style={{ padding: '52px 0px', minHeight: 136 }} className="row">
                        <h1 className="h1">Настройки</h1>
                    </header>
                </div>
            </div>
        </React.Fragment>
    )
}