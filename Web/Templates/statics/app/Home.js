import React, { Component } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import { Icon } from '@fluentui/react/lib/Icon';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { Breadcrumb } from '@fluentui/react/lib/Breadcrumb';

initializeIcons();

export default function Home() {
    const culture = useParams().culture || 'ru';
    const history = useHistory();
    const [crum, setCrum] = React.useState([{
        text: 'Files', key: 'Files'
    },
    { text: 'Files1', key: 'Files1' },
    {
        text: 'Files2', key: 'Files2'
    },
    {
        text: 'Files3', key: 'Files3'
    },
    {
        text: 'Files4', key: 'Files4'
    }])

    const start = () => {
        window.location.href = '/api/logout';
    }

    return (
        <React.Fragment>
            <header style={{ width: '100%', height: '54px' }}>
                <div className="header">
                    <div className="ms-Grid" dir="ltr">
                        <div class="ms-Grid-row">
                            <div class="ms-Grid-col ms-sm7 ms-md8 ms-lg9">
                                <Stack horizontal tokens={{ childrenGap: 12 }}>
                                    <div className="logo box noselect">
                                        <Icon iconName="TFVCLogo" style={{ fontSize: '28px', lineHeight: '34px' }} />
                                        <div class="ms-fontSize-24" style={{ lineHeight: '30px' }}>Sorge</div>
                                    </div>
                                    <div className="pipe">
                                        <Breadcrumb
                                            style={{ margin: '9px' }}
                                            items={crum}
                                            maxDisplayedItems={10}
                                            ariaLabel="Breadcrumb with items rendered as buttons"
                                            overflowAriaLabel="More links"
                                        />
                                    </div>
                                </Stack>
                            </div>
                            <div class="ms-Grid-col ms-sm5 ms-md4 ms-lg3" style={{ justifyContent: 'flex-end', display: 'flex' }}>
                                <Stack horizontal tokens={{ childrenGap: 12 }}>
                                    <div className="logo" style={{ paddingTop: '12px' }}>
                                        <DefaultButton text="Выйти" onClick={start} allowDisabledFocus disabled={false} checked={false} />
                                    </div>
                                </Stack>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className="main" style={{ bottom: '0px', height: 'calc(100% - 54px)' }}>

            </div>
        </React.Fragment>
    )
}