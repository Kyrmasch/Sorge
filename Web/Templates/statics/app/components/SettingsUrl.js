import React from 'react';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { createTheme } from '@fluentui/react/lib/Styling';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { ContextualMenu } from '@fluentui/react/lib/ContextualMenu';
import { SpinButton, Stack } from '@fluentui/react';
import { Toggle } from '@fluentui/react/lib/Toggle';


initializeIcons();

const theme = createTheme({

});



export default function SettingsUrl(props) {
    const toggleState = props.toggle;
    const [hidden, setHidden] = React.useState(props.hidden);
    const [from, setFrom] = React.useState(props.settings.from || 0);
    const [to, setTo] = React.useState(props.settings.to || 0);
    const [merge, setMerge] = React.useState(props.settings.merge || false);

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
        type: DialogType.normal,
        title: 'Настройки для ссылки',
        subText: '',
    };

    const modalPropsStyles = { main: { maxWidth: 450 } };
    const stackTokens = { childrenGap: 20 };
    const iconProps = { iconName: 'IncreaseIndentLegacy' };
    const styles = { spinButtonWrapper: { width: 75 }, labelWrapper: { width: 150 } };

    React.useEffect(() => {
        
    }, []);

    const changeFrom = React.useCallback((event, newValue) => {
        if (newValue !== undefined) {
            setFrom(newValue);
        }
    }, []);

    const changeTo = React.useCallback((event, newValue) => {
        if (newValue !== undefined) {
            setTo(newValue);
        }
    }, []);

    const mergetToOne = (e, checked) => {
        setMerge(checked);
    }

    const set = () => {
        props.change({
            from,
            to,
            merge
        });
        toggleState();
    }

    return (
        <>
            <Dialog
                hidden={hidden}
                onDismiss={toggleState}
                dialogContentProps={dialogContentProps}
                modalProps={modalProps}>
                <div style={{ minHeight: 60 }}>
                    <Stack tokens={stackTokens}>
                        <SpinButton
                            label="Начать с    "
                            iconProps={iconProps}
                            defaultValue="0"
                            min={0}
                            max={1000}
                            step={1}
                            onChange={changeFrom}
                            value={from}
                            styles={styles}
                        />
                        <SpinButton
                            label="Закончить на"
                            iconProps={iconProps}
                            styles={{
                                labelWrapper: {
                                    width: 150
                                }
                            }}
                            defaultValue="0"
                            min={0}
                            max={1000}
                            step={1}
                            onChange={changeTo}
                            value={to}
                            styles={styles}
                        />
                        <Toggle 
                            label="Объединить в одну" 
                            inlineLabel
                            styles={{
                                label: {
                                    width: 150
                                }
                            }}
                            onText="Да" 
                            offText="Нет" 
                            checked={merge}
                            onChange={mergetToOne} />
                    </Stack>
                </div>
                <DialogFooter>
                    <DefaultButton onClick={(e) => set()} text="Применить" />
                    <PrimaryButton onClick={toggleState} text="Закрыть" />
                </DialogFooter>
            </Dialog>
        </>
    )
}