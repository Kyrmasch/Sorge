import React from 'react';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { ContextualMenu } from '@fluentui/react/lib/ContextualMenu';


initializeIcons();

export default function YesNoDialog(props) {
    const yes = props.yes;
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
        type: DialogType.normal,
        title: props.title,
        subText: props.subtext,
    };

    const modalPropsStyles = { main: { maxWidth: 450 } };

    React.useEffect(() => {

    }, []);

    return (
        <>
            <Dialog
                hidden={false}
                onDismiss={toggleState}
                dialogContentProps={dialogContentProps}
                modalProps={modalProps}>
                <DialogFooter>
                    <PrimaryButton onClick={yes} text="Да" />
                    <DefaultButton onClick={toggleState} text="Нет" />
                </DialogFooter>
            </Dialog>
        </>
    )
}