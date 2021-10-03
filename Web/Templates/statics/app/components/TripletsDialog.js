import React from 'react';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { ContextualMenu } from '@fluentui/react/lib/ContextualMenu';
import { Stack } from "@fluentui/react/lib/Stack";

initializeIcons();

export default function TripletsDialog(props) {
    const toggleState = props.toggle;

    const modalProps = React.useMemo(
        () => ({
            isBlocking: true,
            styles: modalPropsStyles,
            dragOptions: {
                moveMenuItemText: 'Move',
                closeMenuItemText: 'Close',
                menu: ContextualMenu,
            },
        }),
        [true],
    );

    const dialogContentProps = {
        type: DialogType.largeHeader,
        title: props.title,
        subText: props.subtext,
    };

    const modalPropsStyles = { main: { maxWidth: 750 } };
    const [graph, setGraph] = React.useState(props.graph || {
        nodes: [],
        edges: []
    });
    const [matchers, setMatchers] = React.useState(props.matchers || []);

    React.useEffect(() => {
        
    }, []);

    return (
        <>
            <Dialog
                hidden={false}
                onDismiss={() => toggleState(false)}
                dialogContentProps={dialogContentProps}
                styles={{
                    main: {
                        maxWidth: '750px !important'
                    },
                }}
                modalProps={modalProps}>
                <div style={{minWidth: '600px', maxWidth: '700px'}}>
                    {
                        graph.edges.map((m, index) => {
                            let l = graph.nodes.filter(x => x.id == m.from)[0].label;
                            let r = graph.nodes.filter(x => x.id == m.to)[0].label;
                            let matcher = matchers[index];
                            return (
                                <Stack
                                    tokens={{ childrenGap: 24 }}
                                    style={{ padding: '6px 12px ', borderTop: 'dotted 1px grey' }}
                                    horizontal={true}
                                    >
                                    <Stack.Item styles={{
                                        root: {
                                            width: '34%'
                                        }
                                    }}>
                                        <div className="ms-fontSize-16">{l}</div>
                                        <div className="ms-fontSize-12" style={{
                                            color: 'rgb(0, 120, 212)'
                                        }}>{matcher[0]}</div>
                                    </Stack.Item>
                                    <Stack.Item styles={{
                                        root: {
                                            width: '22%'
                                        }
                                    }}>
                                        <div className="ms-fontSize-16">{m.label}</div>    
                                        <div className="ms-fontSize-12" style={{
                                            color: 'rgb(0, 120, 212)'
                                        }}>{'VERB+'}</div>
                                    </Stack.Item>
                                    <Stack.Item styles={{
                                        root: {
                                            width: '34%'
                                        }
                                    }}>
                                        <div className="ms-fontSize-16">{r}</div>   
                                        <div className="ms-fontSize-12"style={{
                                            color: 'rgb(0, 120, 212)'
                                        }}>{matcher[1]}</div> 
                                    </Stack.Item>
                                </Stack>
                            )
                        })
                    }
                </div>
                <DialogFooter>
                    <DefaultButton onClick={() => toggleState(false)} text="Закрыть" />
                </DialogFooter>
            </Dialog>
        </>
    )
}