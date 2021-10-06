import React from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import { Icon } from '@fluentui/react/lib/Icon';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { Breadcrumb } from '@fluentui/react/lib/Breadcrumb';
import { Pivot, PivotItem } from '@fluentui/react/lib/Pivot';
import { Label } from '@fluentui/react/lib/Label';
import { Persona, PersonaInitialsColor, PersonaSize } from '@fluentui/react/lib/Persona';

initializeIcons();

export default function Header(props) {
    const culture = useParams().culture || 'ru';
    const history = useHistory();
    const location = useLocation();

    const [tabs, setTabs] = React.useState([]);
    const [system, setSystem] = React.useState('sorge');
    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        fetch('/api/get_tabs', {
            method: 'get',
        })
        .then(res => res.json())
        .then(data => {
            setTabs(data.tabs);     
            setSystem(data.system);
            if ('' == location.pathname.replace('/', ''))
            {
                history.push(`/${data.tabs[0].code}`)     
            }

            props.setReady(true);
        })
    }, [])

    React.useEffect(() => {
        if (tabs.length > 0) {
            let path = location.pathname.replace('/', '');
            let tab = tabs.filter(x => x.code == path);
            if (tab.length == 1) {
                setCurrent(tab[0].itemKey)
            }
        }
    }, [tabs]);

    const onChange = (tab, e) => {
        console.log(tab.props.code);

        switch (tab.props.code) {
            case 'api': {
                window.open(`https://sorge.ektu.kz/api?url=/api/${system}.json`, '_blank').focus();  
                break;
            }
            case 'prodigy': {
                window.open(`https://sorge.ektu.kz:444`, '_blank').focus();
                break;
            }
            case 'prodigy_api': {
                window.open(`https://sorge.ektu.kz:444/docs`, '_blank').focus(); 
                break;
            }
            default: {
                setCurrent(tab.props.itemKey);
                history.push(`/${tab.props.code}`)
                break;
            }
        }
    }

    const onSignOut = () => {
        window.location.href = '/api/logout';
    }

    return (
        <header style={{ width: '100%', height: '54px', borderBottom: 'solid 1px #E6EDF3' }}>
            <div className="header" style={{}}>
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
                                        styles={{ link: { height: 54 } }}
                                        selectedKey={current}
                                        onLinkClick={onChange}>
                                        {
                                            tabs.map(tab => {
                                                return (
                                                    <PivotItem
                                                        headerText={tab.text}
                                                        code={tab.code}
                                                        itemKey={tab.itemKey}
                                                        onChange={e => onChange(tab.code)}
                                                        styles={{}}>
                                                    </PivotItem>
                                                )
                                            })
                                        }
                                        {/* <PivotItem
                                            headerText={"Sorge Api"}
                                            code={"api"}
                                            itemKey={"swagger"}
                                            styles={{}}>
                                        </PivotItem> */}
                                    </Pivot>
                                </div>
                            </Stack>
                        </div>
                        <div class="ms-Grid-col ms-sm5 ms-md4 ms-lg3" style={{ justifyContent: 'flex-end', display: 'flex' }}>
                            <Stack horizontal tokens={{ childrenGap: 12 }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: 54 }}>
                                {
                                    false == false && (
                                        <Persona size={PersonaSize.size40} text="Администратор" initialsColor={PersonaInitialsColor.lightBlue} />
                                    )
                                }                              
                                <DefaultButton text="Выйти" onClick={onSignOut} allowDisabledFocus disabled={false} checked={false} />
                            </Stack>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}