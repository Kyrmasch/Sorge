import React from 'react';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { createTheme } from '@fluentui/react/lib/Styling';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { ContextualMenu } from '@fluentui/react/lib/ContextualMenu';
import { DetailsList, DetailsListLayoutMode, Selection, SelectionMode } from '@fluentui/react/lib/DetailsList';
import { ActivityItem, Icon } from '@fluentui/react';
import { Spinner } from '@fluentui/react/lib/Spinner';


initializeIcons();

const theme = createTheme({
    fonts: {
        medium: {
            fontFamily: 'Monaco, Menlo, Consolas',
            fontSize: '25px',
        },
    },
    nameText: {
        fontWeight: 'bold',
    },
    exampleRoot: {
        marginTop: '20px',
    }
});

const dialogContentProps = {
    type: DialogType.normal,
    title: '',
    subText: '',
};

const modalPropsStyles = { main: { maxWidth: 450 } };

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
    const [wikiDialog, setWikiDialog] = React.useState(true);
    const [wikiContent, setWikiContent] = React.useState(dialogContentProps);
    const [wikiData, setWikiData] = React.useState([]);
    const [wikiLoad, setWikiLoad] = React.useState(false);
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

    const wiki = (value) => {
        if (value) {
            setWikiLoad(true);
            setWikiDialog(false);
            setWikiData([]);
            let content = dialogContentProps;
            content.title = value
            content.subText = ''
            setWikiContent(content);  

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
                    let content = dialogContentProps;
                    content.title = value
                    content.subText = data.info
                    setWikiContent(content);                   

                    let list = data.pages.map((p, index) => {
                        return {
                            key: index,
                            activityDescription: [
                              <span key={1} style={{ fontWeight: 'bold'}}>
                                {p}
                              </span>,
                              <span key={2}>{}</span>,
                            ],
                            activityIcon: <Icon iconName={'PageLink'} />,
                            isCompact: true,
                          }
                    })
                    setWikiData(list || [])
                    setWikiLoad(false);
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

    const _renderItemColumn = (item, index, column) => {
        const fieldContent = item[column.fieldName];
        let isCore = false;
        if (core != undefined) {
            if (`${column.fieldName}` == `${core}`) {
                isCore = true
            }
        }

        return isCore == false ? <span>{fieldContent}</span> : <b className="core_column" onClick={() => wiki(fieldContent)}>{fieldContent}</b>;
    }

    const toggleHideDialog = () => {
        setWikiDialog(!wikiDialog)
    }

    return (
        <>
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

            <Dialog
                hidden={wikiDialog}
                onDismiss={toggleHideDialog}
                dialogContentProps={wikiContent}
                modalProps={modalProps}
                >
                {
                    wikiLoad == true && (
                        <>
                            <Spinner label="Wiki поиск ..." />
                        </>
                    )
                }
                {
                    wikiData.map(w => {
                        return(
                            <ActivityItem {...(w)} key={w.key} className={theme.exampleRoot} />
                        )
                    })
                }
                <DialogFooter>
                    <PrimaryButton onClick={toggleHideDialog} text="Закрыть" />
                </DialogFooter>
            </Dialog>
        </>
    )
}