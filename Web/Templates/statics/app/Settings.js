import React, { Component } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';

export default function Settings() {
    const culture = useParams().culture || 'ru';
    const history = useHistory();

    const end = () => {
        history.push('/')
    }

    return (
        <React.Fragment>
            <div className="main">
                <div className="middle">
                    <div className="outer">
                        <div style={{textAlign: 'center'}} class="ms-fontSize-68">Settings Sorge</div>
                        <div style={{textAlign: 'center'}} class="ms-fontSize-68">
                            <PrimaryButton text="Назад" onClick={end} allowDisabledFocus disabled={false} checked={false} />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}