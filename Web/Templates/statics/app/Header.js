import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import { Icon } from '@fluentui/react/lib/Icon';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { Breadcrumb } from '@fluentui/react/lib/Breadcrumb';
import { Pivot, PivotItem } from '@fluentui/react/lib/Pivot';
import { Label } from '@fluentui/react/lib/Label';

initializeIcons();

export default function Header() {
    const culture = useParams().culture || 'ru';
    const history = useHistory();

    const [tabs, setTabs] = React.useState([
        {
            text: 'Парсер', key: 'parser'
        },
        { 
            text: 'Настройки', key: 'settings' 
        }
    ]
    )

    const onChange = (tab, e) => {
        history.push(`/${tab.props.code}`)
    }

    return (
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
                                    
                                    <Pivot 
                                        aria-label="Basic Pivot Example" 
                                        styles={{ link: { height: 54 }}} 
                                        onLinkClick={onChange}>
                                        {
                                            tabs.map(tab => {
                                                return (
                                                    <PivotItem 
                                                        headerText={tab.text} 
                                                        code={tab.key}
                                                        onChange={e => onChange(tab.key)} 
                                                        styles={{ }}>
                                                    </PivotItem>
                                                )
                                            })
                                        }
                                    </Pivot>
                                </div>
                            </Stack>
                        </div>
                        <div class="ms-Grid-col ms-sm5 ms-md4 ms-lg3" style={{ justifyContent: 'flex-end', display: 'flex' }}>
                            <Stack horizontal tokens={{ childrenGap: 12 }}>
                                <div className="logo" style={{ paddingTop: '12px' }}>
                                    <DefaultButton text="Выйти" onClick={onChange} allowDisabledFocus disabled={false} checked={false} />
                                </div>
                            </Stack>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}