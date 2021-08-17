import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { createTheme } from '@fluentui/react/lib/Styling';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { Spinner } from '@fluentui/react/lib/Spinner';
import { Pivot, PivotItem } from '@fluentui/react';
import { FontIcon } from '@fluentui/react/lib/Icon';
import { Text } from '@fluentui/react/lib/Text';

import { socket } from './IO'
import Header from './Header';
import DataFrame from './components/DataFrame';
import SettingsUrl from './components/SettingsUrl';
import YesNoDialog from './components/YesNoDialog';

initializeIcons();

const theme = createTheme({
    fonts: {
        medium: {
            fontFamily: 'Monaco, Menlo, Consolas',
            fontSize: '25px',
        },
    },
    empty: {
        fontSize: 50,
        height: 50,
        width: 50,
        margin: '0 25px',
        color: 'lightgray'
    }
});

const defaultTables = {
    data: [],
    cores: []
}

export default function Home() {
    const culture = useParams().culture || 'ru';
    const history = useHistory();

    const [openYnDialog, setYnDialogState] = React.useState(false)
    const [url, setUrl] = React.useState('');
    const [openSettingsUrl, setOpenSettingsUrl] = React.useState(false);
    const [settingUrl, setSettingsUrl] = React.useState({
        from: 327,
        to: 328,
        merge: false
    });
    const [spinnerText, setSpinerText] = React.useState(null);
    const [ready, setReady] = React.useState(false);
    const [tables, setTables] = React.useState(defaultTables);
    const [guids, setGuids] = React.useState([]);
    const [load, setLoad] = React.useState(false);

    React.useEffect(() => {
        socket.on('progress', io_progress);
    }, [])

    React.useState(() => {
        if (window.localStorage.getItem('tables')) {

            let storage_url = window.localStorage.getItem('url') || '';
            let storage_tables = JSON.parse(window.localStorage.getItem('tables'));

            try {
                let storage_guids = JSON.parse(window.localStorage.getItem('guids'));
                setGuids(storage_guids || []);
            }
            catch { }

            setUrl(storage_url);
            setTables(storage_tables || defaultTables);
        }
    }, [ready])

    React.useEffect(() => {
        if (url) {
            window.localStorage.setItem('tables', JSON.stringify(tables));
            window.localStorage.setItem('url', url);           
        }
    }, [tables])

    React.useEffect(() => {
        if (guids) {
            window.localStorage.setItem('guids', JSON.stringify(guids));
        }
    }, [guids])

    React.useState(() => {

    }, [settingUrl])

    const isFile = (link) => {
        let segment = link.substring(link.lastIndexOf('/') + 1).split('.');
        let extention = segment[segment.length - 1].toLowerCase();
        if (['pdf'].includes(extention)) {
            return true;
        }
        return false;
    }

    const changeUrl = (e, value) => {
        if (e) {
            setUrl(value);
        }
    }

    const openSettings = () => {
        setOpenSettingsUrl(true);
    }

    const get_table = () => {

        setYnDialogState(false);
        setSpinerText(null)

        if (url) {
            setLoad(true);
            setTables({
                data: [],
                cores: []
            });

            fetch('/api/get_tables', {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: url, settings: settingUrl })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.result) {

                        let Titems = []
                        data.result.map(table => {
                            try {
                                let keys = Object.keys(table[0]);
                                keys = keys.map(k => {
                                    return k.replace(/(\r\n|\n|\r)/gm, ' ').replace('/', ' ');
                                })

                                let columns = keys.map((k, index) => {
                                    return {
                                        key: `column${index}`,
                                        name: k,
                                        fieldName: k,
                                        minWidth: 100,
                                        maxWidth: 200,
                                        isRowHeader: true,
                                        isResizable: true,
                                        isSorted: index == 0,
                                        isSortedDescending: false,
                                        sortAscendingAriaLabel: 'Sorted A to Z',
                                        sortDescendingAriaLabel: 'Sorted Z to A',
                                        data: 'string',
                                        isPadded: true,
                                    }
                                });


                                let rows = table.map((row, index) => {

                                    let Nrow = {}
                                    Nrow.key = index;

                                    row.key = function (n) {
                                        return this[Object.keys(this)[n]];
                                    }

                                    for (let k = 0; k < keys.length; k++) {
                                        let value = row.key(k)
                                        Nrow[`${keys[k]}`] = value
                                    }

                                    return Nrow
                                });

                                Titems.push({
                                    columns: columns,
                                    rows: rows
                                });
                            }
                            catch (e) {
                                console.error(e)
                            }
                        });

                        setTables({
                            data: Titems,
                            cores: data.cores
                        });
                        setGuids(data.guids);
                        setLoad(false);
                    }
                })
                .catch((err) => {
                    setTables({
                        data: [],
                        cores: []
                    });
                    setLoad(false);
                })
        }
    }

    const io_progress = (data) => {
        setSpinerText(data.description)
    }


    return (
        <React.Fragment>
            <Header setReady={setReady} />
            {
                ready && (
                    <div className="main" style={{ bottom: '0px', height: 'calc(100% - 56px)', backgroundColor: '#faf9f8', position: 'relative' }}>
                        <div class="ms-Grid" dir="ltr" style={{ height: '100%', overflowY: 'scroll', overflowX: 'auto' }}>
                            <div class="ms-Grid-row" style={{ height: '100%' }}>
                                <div class="ms-Grid-col ms-sm2 ms-md2ms-lg2"></div>
                                <div class="ms-Grid-col ms-sm8 ms-md8 ms-lg8" style={{ height: '100%', backgroundColor: '#fff', }}>
                                    <Stack tokens={{ childrenGap: 10 }}>
                                        <div style={{ padding: '0px 32px', height: '100%', marginTop: 12 }}>
                                            <header style={{ padding: '12px 0px', minHeight: 50, boxSizing: 'border-box' }} className="row">
                                                <h1 className="h1">Парсер</h1>
                                            </header>
                                        </div>
                                        <div style={{ padding: '12px', boxSizing: 'border-box' }}>
                                            <Stack horizontal tokens={{ childrenGap: 10 }} style={{ justifyContent: 'center' }}>
                                                <SearchBox
                                                    placeholder="Поиск таблиц на сайте"
                                                    styles={{ root: { width: 600 } }}
                                                    iconProps={{
                                                        iconName: 'Link'
                                                    }}
                                                    onChange={changeUrl}
                                                    clearButtonProps={{
                                                        iconProps: {
                                                            iconName: "Settings"
                                                        },
                                                        disabled: !isFile(url)
                                                    }}
                                                    onClear={openSettings}
                                                    value={url} />
                                                <PrimaryButton
                                                    disabled={load == true}
                                                    text="Найти"
                                                    onClick={e => setYnDialogState(true)}
                                                    allowDisabledFocus
                                                    checked={false} />
                                            </Stack>
                                            <Stack tokens={{ childrenGap: 24 }} style={{ marginTop: 24 }} horizontal={false}>
                                                {
                                                    tables.data.length == 0 && load == false && (
                                                        <>
                                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '150px' }}>
                                                                <Stack tokens={{ childrenGap: 24 }} style={{ marginTop: 24 }} horizontal={false}>
                                                                    <FontIcon aria-label="Compass" iconName="ProductRelease" style={theme.empty} />
                                                                    <Text variant={'medium'} nowrap block style={{ textAlign: 'center', color: 'lightgray' }}>
                                                                        Нет данных
                                                                    </Text>
                                                                </Stack>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                                {
                                                    load == true && (
                                                        <>
                                                            <Spinner
                                                                label={spinnerText || 'Извелечение данных...'}
                                                                styles={{ root: { paddingTop: '25px' } }} />
                                                        </>
                                                    )
                                                }
                                                {
                                                    tables.data.length > 0 && (
                                                        <Pivot
                                                            aria-label="Basic Pivot Example"
                                                            overflowBehavior={'menu'}
                                                            styles={{
                                                                root: {
                                                                    display: 'flex', justifyContent: 'center', padding: '0 200px'
                                                                }
                                                            }}>
                                                            {
                                                                tables.data.map((table, index) => {
                                                                    return (
                                                                        <PivotItem headerText={`Таблица #${index + 1}`}>
                                                                            <div>
                                                                                <DataFrame table={table} index={index} core={tables.cores[index]} />
                                                                            </div>
                                                                        </PivotItem>

                                                                    )
                                                                })
                                                            }
                                                        </Pivot>
                                                    )
                                                }
                                            </Stack>
                                        </div>
                                    </Stack>
                                </div>
                                <div class="ms-Grid-col ms-sm2 ms-md2 ms-lg2"></div>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                openSettingsUrl == true && (
                    <SettingsUrl
                        settings={settingUrl}
                        toggle={setOpenSettingsUrl}
                        change={setSettingsUrl}
                        hidden={!openSettingsUrl} />
                )
            }
            {
                openYnDialog == true && (
                    <YesNoDialog
                        title={`Sorge`}
                        subtext={`Выполнить поиск таблиц?`}
                        toggle={setYnDialogState}
                        yes={get_table}
                        hidden={!openYnDialog} />
                )
            }
        </React.Fragment>
    )
}