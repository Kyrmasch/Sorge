import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { createTheme } from '@fluentui/react/lib/Styling';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { Separator } from '@fluentui/react/lib/Separator';
import { Spinner } from '@fluentui/react/lib/Spinner';
import { Label } from '@fluentui/react/lib/Label';
import { DetailsList, DetailsListLayoutMode, SelectionMode } from '@fluentui/react/lib/DetailsList';

import Header from './Header'

initializeIcons();

const theme = createTheme({
    fonts: {
        medium: {
            fontFamily: 'Monaco, Menlo, Consolas',
            fontSize: '25px',
        },
    },
});

//https://www.bagsurb.ru/about/journal/svezhiy-nomer/Krasulina.pdf
//https://ecsocman.hse.ru/data/2010/05/26/1212617593/Doklad-Pages-001-392-posle-obreza-170x240mm.pdf

export default function Home() {
    const culture = useParams().culture || 'ru';
    const history = useHistory();

    const [url, setUrl] = React.useState('https://ecsocman.hse.ru/data/2010/05/26/1212617593/Doklad-Pages-001-392-posle-obreza-170x240mm.pdf'); //https://aktau-airport.kz/ru/flights/
    const [tables, setTables] = React.useState([]);
    const [load, setLoad] = React.useState(false);

    const start = () => {
        window.location.href = '/api/logout';
    }

    const getByKey = (arr,key) => (arr.find(x => Object.keys(x)[0] === key) || {})[key]

    const get_table = (url) => {
        if (url) {
            setLoad(true);
            fetch('/api/get_tables', {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: url })
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

                                    row.key = function(n) {
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
                            catch(e) {
                                console.error(e)
                            }
                        });
                        setTables(Titems);
                        setLoad(false);
                    }
                })
                .catch((err) => {
                    setTables([]);
                    setLoad(false);
                })
        }
    }

    const _getKey = (item) => {
        return item.key
    }

    const _onItemInvoked = (item) => {

    }

    return (
        <React.Fragment>
            <Header />
            <div className="main" style={{ bottom: '0px', height: 'calc(100% - 54px)', backgroundColor: '#faf9f8', position: 'relative' }}>
                <div class="ms-Grid" dir="ltr">
                    <div class="ms-Grid-row">
                        <div class="ms-Grid-col ms-sm3 ms-md3 ms-lg3"></div>
                        <div class="ms-Grid-col ms-sm6 ms-md6 ms-lg6">
                            <Stack tokens={{ childrenGap: 10 }}>
                                <div style={{ padding: '0px 32px', height: '100%' }}>
                                    <header style={{ padding: '52px 0px', minHeight: 136, boxSizing: 'border-box' }} className="row">
                                        <h1 className="h1">Парсер</h1>
                                    </header>
                                </div>
                                <div style={{backgroundColor: '#fff', padding: '28px', boxSizing: 'border-box'}} className={tables.length > 0 ? 'ms-depth-4' : ''}>
                                    <Stack horizontal tokens={{ childrenGap: 10 }} style={{justifyContent: 'center'}}>
                                        <SearchBox
                                            placeholder="Поиск таблиц на сайте"
                                            styles={{ root: { width: 600} }}
                                            onChange={e => setUrl(e.target.value)}
                                            value={url} />
                                        <PrimaryButton
                                            disabled={false}
                                            text="Найти"
                                            onClick={e => get_table(url)}
                                            allowDisabledFocus
                                            checked={false} />
                                    </Stack>
                                    <Stack tokens={{ childrenGap: 24 }} style={{ marginTop: 24 }} horizontal={false}>
                                        {
                                            load == true && (
                                                <>
                                                    <Spinner label="Пару секунд..." />
                                                </>
                                            )
                                        }
                                        {
                                            tables.length > 0 && (
                                                <>
                                                    {
                                                        tables.map((table, index) => {
                                                            return (
                                                                <div>
                                                                    <Separator theme={theme}>{`Таблица #${index}`}</Separator>
                                                                    <DetailsList
                                                                        items={table.rows}
                                                                        compact={true}
                                                                        columns={table.columns}
                                                                        selectionMode={SelectionMode.none}
                                                                        getKey={_getKey}
                                                                        setKey="none"
                                                                        layoutMode={DetailsListLayoutMode.justified}
                                                                        isHeaderVisible={true}
                                                                        onItemInvoked={_onItemInvoked}
                                                                    />
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </>
                                            )
                                        }
                                    </Stack>
                                </div>
                            </Stack>
                        </div>
                        <div class="ms-Grid-col ms-sm3 ms-md3 ms-lg3"></div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}