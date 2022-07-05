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
        url: 'https://www.hse.ru/data/2010/05/25/1216899390/Doklad.pdf',
        title: 'ГЕОЭКОНОМИКА И КОНКУРЕНТОСПОСОБНОСТЬ РОССИИ'
    },
    {
        type: 'FileHTML',
        url: 'https://poezdato.net/raspisanie-po-stancyi/kazahstan/poezda/',
        title: 'Расписание поездов КТЖ'
    },
    {
        type: 'FileHTML',
        url: 'https://bilet.railways.kz/post/schedule',
        title: 'Перечень пассажирских поездов'
    },
    {
        type: 'FileImage',
        url: 'https://uchet.kz/news/%D0%91%D0%B5%D0%B7%D1%8B%D0%BC%D1%8F%D0%BD%D0%BD%D1%8B%D0%B9hhh.png',
        title: 'Валовый-внутренний продукт'
    },
    {
        type: 'FileImage',
        url: 'https://cf.ppt-online.org/files/slide/d/dgbFzC08V4m5usoPBvipOU2ZjRYWLcktDHflaq/slide-1.jpg',
        title: 'Основные технико-экономические показатели'
    },
    {
        type: 'FileImage',
        url: 'https://uchitel.pro/wp-content/uploads/2017/09/%D0%B2%D0%B0%D0%B6%D0%BD%D0%B5%D0%B9%D1%88%D0%B8%D0%B5-%D1%80%D0%B5%D0%BA%D0%B8.jpg',
        title: 'Важнейший реки'
    },
    {
        type: 'PDF',
        url: 'http://www.riverbp.net/%D0%9D%D0%B0%D1%86%20%D0%B4%D0%BE%D0%BA%D0%BB%D0%B0%D0%B4%20%D0%BE%20%D1%81%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D0%B8%20%D0%BE%D0%BA%D1%80%20%D1%81%D1%80%D0%B5%D0%B4%D1%8B%20%D0%B2%D0%BE%D0%B4%D0%BD%D1%8B%D0%B5%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D1%8B.pdf',
        title: 'Забор воды из природных источников по регионам Республики Казахстан'
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
                        select(e.url, index);;
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

    const select = (url, index) => {
        selectEvent(true, url, index);
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
                                maxWidth: '750px !important'
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