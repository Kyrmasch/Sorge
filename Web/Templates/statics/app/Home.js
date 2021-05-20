import React, { Component } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import { Icon } from '@fluentui/react/lib/Icon';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { Breadcrumb } from '@fluentui/react/lib/Breadcrumb';
import Header from './Header'

initializeIcons();

export default function Home() {
    const culture = useParams().culture || 'ru';
    const history = useHistory();

    const start = () => {
        window.location.href = '/api/logout';
    }

    return (
        <React.Fragment>
            <Header />
            <div className="main" style={{ bottom: '0px', height: 'calc(100% - 54px)', backgroundColor: '#faf9f8' }}>

            </div>
        </React.Fragment>
    )
}