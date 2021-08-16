import React, { Component } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import Header from './Header'
import { TextField } from '@fluentui/react/lib/TextField';
import { Spinner } from '@fluentui/react/lib/Spinner';
import Graph from 'react-graph-vis';

const defaultText = "Концептуальная карта — это разновидность схемы, где наглядно представлены связи между концепциями и идеями. " +
    "В большинстве случаев идеи (или «концепты») отображаются в виде блоков или кругов (которые также называют «узлами»). " +
    "Они располагаются в порядке иерархии и соединяются между собой при помощи линий и стрелок (которые также называют «связями»). " +
    "Эти линии сопровождаются пометками со связующими словами и фразами, которые поясняют, как именно концепции сопряжены между собой."

var optionsMap = {
    physics: true,
    edges: {
        color: '#0078d4',
        smooth: {
            type: 'continuous'
        },
        arrows: {
            to: { enabled: false, scaleFactor: 1, type: 'arrow' },
            middle: { enabled: false, scaleFactor: 1, type: 'arrow' },
            from: { enabled: false, scaleFactor: 1, type: 'arrow' }
        },
    },
    nodes: {
        font: {
            size: 20,
            face: '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif'
        },
        shape: 'dot'
    },
    interaction: {
        hideEdgesOnDrag: true,
        tooltipDelay: 200,
        keyboard: true,
        navigationButtons: true
    },
};

export default function Maps() {
    const culture = useParams().culture || 'ru';
    const history = useHistory();

    const [ready, setReady] = React.useState(false);
    const [text, setText] = React.useState(defaultText);
    const [load, setLoad] = React.useState(false);
    const [graph, setGraph] = React.useState({
        nodes: [],
        edges: []
    })

    React.useEffect(() => {
        document.title = 'Sorge - Концепт карта'
    }, [])

    const end = () => {
        history.push('/')
    }

    const handleChangeText = (value) => {
        value = value.replace(/\s+/g, " ");
        setText(value);
    }

    const onLanguageDetect = (lang) => {
        for (l in lang.languages) {
            console.log(l.language, l.percentage)
        }
    }

    const handleBuildMap = () => {
        if (text.length > 0) {
            setLoad(true);
            setGraph({
                nodes: [],
                edges: []
            });

            fetch('/maps/build', {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: text })
            })
                .then(res => res.json())
                .then(answer => {
                    if (answer.data) {
                        setGraph(answer.data);
                    }
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
                                                <TextField label="Текст для обработки" multiline rows={5}
                                                    styles={{
                                                        root: { width: '100%' }
                                                    }}
                                                    required
                                                    value={text}
                                                    readOnly={load}
                                                    description={`${text.length} символов`}
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
                                            {
                                                graph.nodes.length > 0 && (
                                                    <Graph
                                                        graph={graph}
                                                        options={optionsMap}
                                                        style={{ 
                                                            height: "500px", 
                                                            border: "dotted 1px rgb(0, 120, 212)", 
                                                            backgroundColor: "#f9f9f9",
                                                            margin: '24px 0px' 
                                                        }} />
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