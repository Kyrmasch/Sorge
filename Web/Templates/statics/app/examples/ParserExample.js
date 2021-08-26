import React from 'react';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { ContextualMenu } from '@fluentui/react/lib/ContextualMenu';
import { ActivityItem, Icon, Link, mergeStyleSets } from '@fluentui/react';

const classNames = mergeStyleSets({
    exampleRoot: {
      marginTop: '20px',
    },
    nameText: {
      fontWeight: 'bold',
    },
  });

const urls = [
    {
        type: 'PDF',
        url: 'https://ecsocman.hse.ru/data/2010/05/26/1212617593/Doklad-Pages-001-392-posle-obreza-170x240mm.pdf',
        title: 'ГЕОЭКОНОМИКА И КОНКУРЕНТОСПОСОБНОСТЬ РОССИИ'
    },
    {
        type: 'FileHTML',
        url: 'https://aviapoisk.kz/raspisanie/aeroporta/ustkamenogorsk',
        title: 'Расписание вылетов и прилетов Усть-Каменогорска'
    },
    {
        type: 'FileHTML',
        url: 'https://www.gks.ru/bgd/regl/b09_47/IssWWW.exe/Stg/2-13.htm',
        title: 'ПРОИЗВОДСТВО МОЛОКА В КРЕСТЬЯНСКИХ (фермерских) ХОЗЯЙСТВАХ'
    },
    {
        type: 'FileImage',
        url: 'http://exploringafrica.matrix.msu.edu/wp-content/uploads/2015/06/Economic-data-table-pt.-1.png',
        title: 'Пример изображения'
    },
    {
        type: 'FileImage',
        url: 'https://cf.ppt-online.org/files/slide/d/dgbFzC08V4m5usoPBvipOU2ZjRYWLcktDHflaq/slide-1.jpg',
        title: 'Основные технико-экономические показатели'
    }
]

export default function ParserExample(props) {
    const toggleStateEvent = props.toggle;
    const selectEvent = props.select;

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
        title: "Примеры",
        subText: "Ссылки для тестирования парсера",
    };

    const modalPropsStyles = { main: { maxWidth: '600px !important' } };

    const [activityItemExamples, setActivityItemExamples] = React.useState([]);

    React.useEffect(() => {
        let items = urls.map((e, index) => {
            return {
                key: index + 1,
                activityDescription: [
                  <Link
                    key={1}
                    className={classNames.nameText}
                    onClick={() => {
                        select(e.url);;
                    }}
                  >
                    {e.title}
                  </Link>,
                ],
                activityIcon: <Icon iconName={e.type} />,
                comments: [
                  <span key={index + 1}>{e.url}</span>,
                  <Link
                    key={2}
                    className={classNames.nameText}
                    onClick={() => {
                        select(e.url);
                    }}>
                  </Link>
                ],
                timeStamp: e.type,
              }
        });

        setActivityItemExamples(items);

    }, []);

    const select = (url) => {
        selectEvent(true, url);
        toggleStateEvent(false);
    }

    return (
        <>
            {
                activityItemExamples.length > 0 && (
                    <Dialog
                        hidden={false}
                        onDismiss={toggleStateEvent}
                        dialogContentProps={dialogContentProps}
                        styles={{
                            main: {
                                maxWidth: '600px !important'
                            }
                        }}
                        modalProps={modalProps}>
                        <div>
                            {
                                activityItemExamples.map((item) => {
                                    return <ActivityItem {...item} key={item.key} className={classNames.exampleRoot} />
                                })
                            }
                        </div>
                        <DialogFooter>
                            <DefaultButton onClick={toggleStateEvent} text="Закрыть" />
                        </DialogFooter>
                    </Dialog>
                )
            }           
        </>
    )
}