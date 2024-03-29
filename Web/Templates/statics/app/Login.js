import React, { Component } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Persona, PersonaInitialsColor, PersonaSize } from '@fluentui/react/lib/Persona';
import { Stack } from '@fluentui/react/lib/Stack';
import { Icon } from '@fluentui/react/lib/Icon';
import { TextField } from '@fluentui/react/lib/TextField';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
// import * as THREE from "three";
// import NET from 'vanta/dist/vanta.net.min';

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
    const [password, setPassword] = React.useState('');
    const [remember, setRemember] = React.useState(false);
    const [error, setError] = React.useState('');

    const [vantaEffect, setVantaEffect] = React.useState(0)
    const __globe = React.useRef(null)

    React.useEffect(() => {    
        
        // if (!vantaEffect) {
        //     setVantaEffect(NET({
        //         el: __globe.current,
        //         THREE: THREE,
        //         mouseControls: true,
        //         touchControls: true,
        //         gyroControls: false,
        //         minHeight: 200.00,
        //         minWidth: 200.00,
        //         scale: 1.00,
        //         scaleMobile: 1.00,
        //         color: 0x3b99f0,
        //         backgroundColor: 0xfaf9f8
        //     }));
        // }
        // return () => {
        //   if (vantaEffect) vantaEffect.destroy()
        // }
        
    }, [vantaEffect]);

    const login = () => {
        fetch('/api/login', {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login: 'admin', password: password, remember: remember })
        })
            .then(res => {
                switch (res.status) {
                    case 200: {
                        return res.json()
                    }
                    default:
                        return res.text();
                }
                
            })
            .then(data => {
                if (typeof data === 'string' || data instanceof String) {
                    setError(data);
                }
                else if (data.result == true) {
                    history.push('/');
                }
            })
            .catch((err, m) => {
                console.log(err, m);
            });
    }

    const onKeyPress = (key) => {
        if (key == 13) {
            login();
        }
    }

    return (
        <React.Fragment>
            <div className="main" ref={__globe} style={{ backgroundColor: '#faf9f8' }}>
                <div className="middle">
                    <div className="outer">
                        <div style={styles.root} className="box ms-motion-scaleDownIn login-form">
                            <Stack tokens={{ childrenGap: 24 }}>
                                <Stack tokens={{ childrenGap: 12 }} horizontal style={{ color: 'grey' }}>
                                    <Icon iconName="TFVCLogo" style={{ fontSize: '32px' }} />
                                    <div class="ms-fontSize-28" style={{}}>Sorge</div>
                                </Stack>
                                <Stack tokens={{ childrenGap: 12 }} horizontal>
                                    <Persona secondaryText="Username: admin" text="Администратор" size={PersonaSize.size40} initialsColor={PersonaInitialsColor.lightBlue}/>
                                </Stack>
                                <Stack tokens={{ childrenGap: 12 }}>
                                    <div class="ms-fontSize-24" style={{}}>Введите пароль</div>
                                    <TextField
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        canRevealPassword
                                        errorMessage={error}
                                        onKeyDown={e => onKeyPress(e.keyCode)}
                                        revealPasswordAriaLabel="Show password"
                                    />
                                    <Checkbox
                                        label="Оставаться в системе"
                                        checked={remember}
                                        onChange={e => setRemember(e.target.value)}
                                    />
                                </Stack>
                                <Stack horizontal style={{ justifyContent: 'flex-end' }}>
                                    <PrimaryButton disabled={false} text="Войти" onClick={login} allowDisabledFocus checked={false} />
                                </Stack>
                            </Stack>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}