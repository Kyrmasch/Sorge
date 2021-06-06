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
    const [core, setCore] = React.useState(props.core);
    const [selection, setSelection] = React.useState(new Selection(
        {
            onSelectionChanged: () => {
                setSelection({
                    selectionDetails: _getSelectionDetails(),
                });
            },
        })
    );

    const wiki = (value) => {
        if (value) {
            fetch('/api/wiki_pages', {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ word: value })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data.pages)
            })
        }
    }

    const _getKey = (item) => {
        return item.key
    }

    const _onItemInvoked = (item) => {

    }

    const _getSelectionDetails = () => {
        const selectionCount = selection.getSelectedCount();
    }

    const _renderItemColumn = (item, index, column) =>  {
        const fieldContent = item[column.fieldName];
        let isCore = false;
        if (core != undefined) {
            if (`${column.fieldName}` == `${core}`) {
                isCore = true
            }
        }

        return isCore == false ? <span>{fieldContent}</span> : <b className="core_column" onClick={() => wiki(fieldContent)}>{fieldContent}</b>;
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
                onRenderItemColumn={_renderItemColumn}
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