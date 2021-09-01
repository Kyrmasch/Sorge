import React from 'react';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { ContextualMenu } from '@fluentui/react/lib/ContextualMenu';
import { DetailsList, DetailsListLayoutMode, Selection, SelectionMode } from '@fluentui/react/lib/DetailsList';

initializeIcons();

const columns = [
    {
        key: 'word',
        name: 'Слово',
        fieldName: 'word',
        minWidth: 150,
        maxWidth: 350,
        isRowHeader: true,
        isResizable: true,
        isSorted: false,
        isSortedDescending: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        data: 'string',
        isPadded: true,
    },
    {
        key: 'score',
        name: 'Score',
        fieldName: 'score',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        data: 'number',
        isPadded: true,
    }
]

export default function KeyWordsDialog(props) {
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

    const modalPropsStyles = { main: { maxWidth: 550 } };
    const [words, setWords] = React.useState(props.words);
    const [rows, setRows] = React.useState([]);
    const [selection, setSelection] = React.useState(new Selection(
        {
            onSelectionChanged: () => {
                setSelection({
                    selectionDetails: _getSelectionDetails(),
                });
            },
        })
    );

    React.useEffect(() => {
        let rows = props.words.map((item, index) => {
            let row = {}
            row.key         = index;
            row['word']     = item[1];
            row['score']    = Math.round((item[0] + Number.EPSILON) * 100) / 100;
            return row;
        });
        setRows(rows.filter(x => x.score > 0).sort(compare));
    }, []);

    const compare = (a, b) => {
        if ( a.score < b.score ){
          return 1;
        }
        if ( a.score > b.score ){
          return -1;
        }
        return 0;
    }

    const _getSelectionDetails = () => {
        const selectionCount = selection.getSelectedCount();
    }

    const _columnHeaderClick = (e, column) => {
        
    }

    const _getKey = (item) => {
        return item.key
    }

    const _renderItemColumn = (item, index, column) => {
        const fieldContent = item[column.fieldName];
        return <span>{fieldContent}</span> 
    }

    const _onItemInvoked = (item) => {

    }

    return (
        <>
            <Dialog
                hidden={false}
                onDismiss={toggleState}
                dialogContentProps={dialogContentProps}
                styles={{
                    main: {
                        maxWidth: '750px !important'
                    }
                }}
                modalProps={modalProps}>
                    <DetailsList
                        items={rows}
                        compact={true}
                        columns={columns}
                        onColumnHeaderClick={_columnHeaderClick}
                        selectionMode={SelectionMode.multiple}
                        getKey={_getKey}
                        setKey="multiple"
                        selection={selection}
                        selectionPreservedOnEmptyClick={false}
                        onRenderItemColumn={_renderItemColumn}
                        layoutMode={DetailsListLayoutMode.justified}
                        isHeaderVisible={true}
                        enterModalSelectionOnTouch={true}
                        ariaLabelForSelectionColumn="Toggle selection"
                        ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                        checkButtonAriaLabel="select row"
                        onItemInvoked={_onItemInvoked}
                    />
                <DialogFooter>
                    <DefaultButton onClick={toggleState} text="Закрыть" />
                </DialogFooter>
            </Dialog>
        </>
    )
}