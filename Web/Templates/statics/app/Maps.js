import React, { Component } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import Header from './Header'
import { TextField } from '@fluentui/react/lib/TextField';
import { Spinner } from '@fluentui/react/lib/Spinner';

const defaultText = "Концептуальная карта — это разновидность схемы, где наглядно представлены связи между концепциями и идеями. " +  
                    "В большинстве случаев идеи (или «концепты») отображаются в виде блоков или кругов (которые также называют «узлами»). " + 
                    "Они располагаются в порядке иерархии и соединяются между собой при помощи линий и стрелок (которые также называют «связями»). " + 
                    "Эти линии сопровождаются пометками со связующими словами и фразами, которые поясняют, как именно концепции сопряжены между собой."

export default function Maps() {
    const culture = useParams().culture || 'ru';
    const history = useHistory();

    const [ready, setReady] = React.useState(false);
    const [text, setText] = React.useState(defaultText);
    const [load, setLoad] = React.useState(false);

    const end = () => {
        history.push('/')
    }

    const handleChangeText = (value) => {
        value = value.replace(/\s+/g, " ");
        setText(value);
    }

    const handleBuildMap = () => {
        if (text.length > 0) {
            setLoad(true);
            fetch('/maps/build', {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: text })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setLoad(false)
            })
            .catch(err => {
                setLoad(false);
            })
        }
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
                                                <h1 className="h1">Концепт карта</h1>
                                            </header>
                                        </div>
                                        <div style={{ padding: '12px', boxSizing: 'border-box', padding: '0 24px' }}>
                                            <Stack horizontal tokens={{ childrenGap: 10 }} style={{ justifyContent: 'center' }}>
                                                <TextField label="Текст для обработки" multiline rows={11} 
                                                    styles={{
                                                        root: { width: '100%' }
                                                    }}
                                                    required
                                                    value={text}
                                                    readOnly={load}
                                                    onChange={(e) => handleChangeText(e.target.value)}
                                                />
                                            </Stack>
                                            <Stack tokens={{ childrenGap: 24 }} style={{ marginTop: 24 }} horizontal={false}>
                                                <PrimaryButton
                                                    styles={{
                                                        root: {
                                                            width: 200
                                                        }
                                                    }}
                                                    text="Построить карту"
                                                    onClick={() => handleBuildMap()}
                                                    allowDisabledFocus
                                                    disabled={text.length == 0 || load}
                                                    checked={false} />
                                            </Stack>
                                            {
                                                load == true && (
                                                    <>
                                                        <Spinner
                                                            label={'Построение...'}
                                                            styles={{ root: { paddingTop: '25px' } }} />
                                                    </>
                                                )
                                            }
                                        </div>
                                    </Stack>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </React.Fragment>
    )
}