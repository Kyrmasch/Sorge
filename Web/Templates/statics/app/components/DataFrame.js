import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { createTheme } from '@fluentui/react/lib/Styling';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import { Separator } from '@fluentui/react/lib/Separator';
import { Spinner } from '@fluentui/react/lib/Spinner';
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';
import { DetailsList, DetailsListLayoutMode, Selection, SelectionMode } from '@fluentui/react/lib/DetailsList';


initializeIcons();

const theme = createTheme({
    fonts: {
        medium: {
            fontFamily: 'Monaco, Menlo, Consolas',
            fontSize: '25px',
        },
    },
});


export default function DataFrame(props) {
    const [table, setTable] = React.useState(props.table);
    const [index, setIndex] = React.useState(props.index);
    const [selection, setSelection] = React.useState(new Selection(
        {
            onSelectionChanged: () => {
                setSelection({
                    selectionDetails: _getSelectionDetails(),
                });
            },
        })
    );

    const _getKey = (item) => {
        return item.key
    }

    const _onItemInvoked = (item) => {

    }

    const _getSelectionDetails = () => {
        const selectionCount = selection.getSelectedCount();

        switch (selectionCount) {
            case 0:
                return 'No items selected';
            case 1:
                return '1 item selected: ' + (selection.getSelection()[0]).name;
            default:
                return `${selectionCount} items selected`;
        }
    }
    return (
        <MarqueeSelection selection={selection}>
            <DetailsList
                items={table.rows}
                compact={false}
                columns={table.columns}
                selectionMode={SelectionMode.multiple}
                getKey={_getKey}
                setKey="multiple"
                selection={selection}
                selectionPreservedOnEmptyClick={true}
                layoutMode={DetailsListLayoutMode.justified}
                isHeaderVisible={true}
                enterModalSelectionOnTouch={true}
                ariaLabelForSelectionColumn="Toggle selection"
                ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                checkButtonAriaLabel="select row"
                onItemInvoked={_onItemInvoked}
            />
        </MarqueeSelection>
    )
}