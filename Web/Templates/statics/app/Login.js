import React, { Component } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button'; 
import { Persona, PersonaInitialsColor, PersonaSize } from '@fluentui/react/lib/Persona';
import { Stack } from '@fluentui/react/lib/Stack';
import { Icon } from '@fluentui/react/lib/Icon';
import { TextField } from '@fluentui/react/lib/TextField';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { initializeIcons } from '@fluentui/font-icons-mdl2';

initializeIcons();

const styles = {
    root: {
        maxWidth: 440,
        minWidth: 320,
        minHeight: 400,
        marginLeft: 'auto',
        marginRight: 'auto',
        boxShadow: '0 2px 6px rgb(0 0 0 / 20%)',
        backgroundColor: '#fff',
        width: 'calc(100% - 40px)',
        marginBottom: '28px',
        padding: '44px'
    }
}

export default function Login() {
    const culture = useParams().culture || 'ru';
    const history = useHistory();

    const login = () => {
        history.push('/')
    }

    return (
        <React.Fragment>
            <div className="main" style={{backgroundColor: '#eee'}}>
                <div className="middle">
                    <div className="outer">
                        <div style={styles.root} className="box">
                            <Stack tokens={{ childrenGap: 24 }}>
                                <Stack tokens={{ childrenGap: 12 }} horizontal style={{color: 'grey'}}>
                                    <Icon iconName="TFVCLogo" style={{fontSize: '32px'}} />
                                    <div class="ms-fontSize-28" style={{}}>Sorge</div>
                                </Stack>
                                <Stack tokens={{ childrenGap: 12 }} horizontal>
                                    <Persona secondaryText="" text="Администратор" size={PersonaSize.size40} />
                                </Stack>
                                <Stack tokens={{ childrenGap: 12 }}>
                                    <div class="ms-fontSize-24" style={{}}>Введите пароль</div>
                                    <TextField
                                        type="password"
                                        canRevealPassword
                                        revealPasswordAriaLabel="Show password"
                                        />
                                    <Checkbox label="Оставаться в системе" onChange={() => {}} />
                                </Stack>
                                <Stack horizontal style={{justifyContent: 'flex-end'}}>
                                    <PrimaryButton text="Войти" onClick={login} allowDisabledFocus disabled={false} checked={false} />
                                </Stack>
                            </Stack>
                        </div>  
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}