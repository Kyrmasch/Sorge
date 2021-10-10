import React, { Component } from "react";
import { useParams, useHistory } from "react-router-dom";
import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import Header from "./Header";
import { TextField } from "@fluentui/react/lib/TextField";
import { Spinner } from "@fluentui/react/lib/Spinner";
import Graph from "react-graph-vis";
import { ChoiceGroup } from "@fluentui/react/lib/ChoiceGroup";
import KeyWordsDialog from "./components/KeyWordsDialog";
import "vis-network/dist/vis-network";
import { CommandBar } from '@fluentui/react/lib/CommandBar';
import { isMobile } from 'react-device-detect';
import { MessageBar } from '@fluentui/react/lib/MessageBar';
import { Toggle } from '@fluentui/react/lib/Toggle';
import TripletsDialog from './components/TripletsDialog';

var languages = [
  {
    key: "russian",
    text: "Русский",
    iconProps: { iconName: "LocaleLanguage" },
    checked: true,
  },
  {
    key: "english",
    text: "English",
    iconProps: { iconName: "LocaleLanguage" },
    disabled: false,
  },
  {
    key: "kazakh",
    text: "Қазақша",
    iconProps: { iconName: "LocaleLanguage" },
    disabled: false,
  },
];

var optionsMap = {
  locale: 'ru',
  physics: true,
  autoResize: true,
  edges: {
    color: "#0078d4",
    font: {
      size: 10,
    },
    arrows: {
      to: { enabled: true, scaleFactor: 1, type: "arrow" },
      from: { enabled: false, scaleFactor: 1, type: "arrow" },
    },
    smooth: {
      type: "dynamic",
      forceDirection: "none"
    },
    shadow: true
  },
  nodes: {
    font: {
      size: 14,
      face: "Verdana",
    },
    shape: "dot",
    shadow: true
  },
  interaction: {
    hideEdgesOnDrag: true,
    tooltipDelay: 200,
    keyboard: false,
    navigationButtons: true,
  },
};

export default function Maps() {
  const culture = useParams().culture || "ru";
  const history = useHistory();
  const [maps, setMaps] = React.useState([
    {
      key: "basic",
      text: "Базовый",
      action: 'build',
      iconProps: { iconName: "GitGraph" },
      checked: true,
    },
    {
      key: "spacy",
      text: "Spacy",
      action: 'knowlegegraph',
      iconProps: { iconName: "GitGraph" },
      disabled: false,
    },
    {
      key: "bert",
      text: "Bert",
      action: 'knowlegegraph',
      iconProps: { iconName: "GitGraph" },
      disabled: false,
    }
  ]);

  const [keywords, setKeyWords] = React.useState([
    {
      key: "rake",
      text: "Rake",
      iconProps: { iconName: "Quantity" },
      checked: true,
    },
    {
      key: "tfidf",
      text: "TF iDF",
      iconProps: { iconName: "Quantity" },
      disabled: false,
    },
  ]);

  const [graphcommands, setGraphCommands] = React.useState([
    {
      key: 'entities',
      text: 'Сущности',
      iconProps: { iconName: 'LookupEntities' },
      split: true,
      onClick: () => setWordsDialog(true),
    },
    {
      key: 'patterns',
      text: 'Анализ связей',
      iconProps: { iconName: 'ThumbnailViewMirrored' },
      split: true,
      onClick: () => analizePatterns(),
    },
    {
      key: 'save',
      text: 'Сохранить',
      iconProps: { iconName: 'Save' },
      onClick: () => saveGraph(),
    }
  ])

  const [method, setMethod] = React.useState("rake");
  const [language, setLanguage] = React.useState("russian");
  const [ready, setReady] = React.useState(false);
  const [text, setText] = React.useState("");
  const [load, setLoad] = React.useState(false);
  const [graph, setGraph] = React.useState({
    nodes: [],
    edges: [],
  });
  const [matchers, setMatchers] = React.useState([]);
  const [words, setWords] = React.useState([]);
  const [wordsDialog, setWordsDialog] = React.useState(false);
  const [relationMethod, setRelationMethod] = React.useState(maps[1]);
  const [isDemo, setIsDemo] = React.useState(true);
  const [analize, setAnalize] = React.useState(false);

  React.useEffect(() => {
    document.title = "Sorge - Концепт карта";
    getDemoText(language);
  }, []);

  React.useEffect(() => {
    if (graph.nodes.length > 0) {
      let vis = document.getElementsByClassName("vis-network");
      if (vis.length > 0) {
        vis[0].scrollIntoView();
      }
    }
  }, [graph]);

  React.useEffect(() => {
    if (text != "") {
      fetch("/maps/detect", {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
        }),
      })
        .then((res) => res.json())
        .then((lang) => {
          setLanguage(lang.value);
        });
    }
  }, [text]);

  React.useEffect(() => {
    if (language != "" && maps) {
      let $maps = [...maps];
      if (language == languages[2].key) {
        $maps[2].disabled = true;
        setRelationMethod(maps[1]);
      } 
      else {
        delete $maps[2]["disabled"];
      }

      if (isDemo) {
        getDemoText(language);
      }

      setMaps($maps);
    }
  }, [language]);

  React.useEffect(() => {
    if (relationMethod) {
      var $keywords = keywords.map((i) => {
        if (relationMethod.key != "basic") {
          i.disabled = true;
        } 
        else {
          delete i["disabled"];
        }
        return i;
      });
      setKeyWords($keywords);

      var $graphcommants = [...graphcommands]
      if (relationMethod.key != "spacy") {
        $graphcommants[1].disabled = true;
      } 
      else {
        delete $graphcommants[1]["disabled"];
      }
      setGraphCommands($graphcommants);
      
    }
  }, [relationMethod]);

  const getDemoText = (lang) => {
    fetch("/maps/example", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: lang
      }),
    })
      .then((res) => res.json())
      .then((text) => {
        setText(text.value);
      });
  }

  const build = () => {
    if (text.length > 0) {
      setLoad(true);
      setEmpty();

      let _text = text.replace(/\s+/g, " ");

      fetch(`/maps/${relationMethod.action}`, {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: _text,
          method: method,
          relation: relationMethod.key,
          language: language,
          sa: 'geo'
        }),
      })
        .then((res) => res.json())
        .then((answer) => {
          if (answer.data) {
            setGraph({
              nodes: answer.data.nodes,
              edges: answer.data.edges,
            });
            setMatchers(answer.data.matchers);
            setWords(answer.data.words);
          }
          setLoad(false);
        })
        .catch((err) => {
          setLoad(false);
        });
    }
  };

  const handleChangeText = (value) => {
    setText(value);
  };

  const handleSelectMethod = (e, o) => {
    setMethod(o.key);
    setEmpty();
  };

  const handleSelectMap = (e, o) => {
    setRelationMethod(o);
    setEmpty();
  };

  const handleSelectLang = (e, o) => {
    setLanguage(o.key);
  };

  const setEmpty = () => {
    setGraph({
      nodes: [],
      edges: [],
    });
    setMatchers([]);
    setWords([]);
  };

  const saveGraph = () => {
    var canvas = document.getElementsByTagName("canvas")[0];
    var dataURL = canvas.toDataURL("image/png");
    var newTab = window.open('about:blank', 'image from canvas');
    newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
  }

  const analizePatterns = () => {
    setAnalize(true);
  }

  const handleDemoChange = (e, v) => {
    setIsDemo(v);
  }

  return (
    <React.Fragment>
      <Header setReady={setReady} />
      {ready && !isMobile && (
        <div
          className="main"
          style={{
            bottom: "0px",
            height: "calc(100% - 56px)",
            backgroundColor: "#faf9f8",
            position: "relative",
          }}
        >
          <div
            class="ms-Grid"
            dir="ltr"
            style={{ height: "calc(100vh - 55px)", overflowY: "scroll", overflowX: "auto" }}
          >
            <div class="ms-Grid-row" style={{ height: "100%" }}>
              <div class="ms-Grid-col ms-sm2 ms-md2ms-lg2"></div>
              <div
                class="ms-Grid-col ms-sm8 ms-md8 ms-lg8"
                style={{
                  minHeight: "100%",
                  backgroundColor: "#fff",
                  height: "max-content",
                }}
              >
                <Stack tokens={{ childrenGap: 10 }}>
                  <div
                    style={{
                      padding: "0px 32px",
                      height: "100%",
                      marginTop: 12,
                    }}
                  >
                    <header
                      style={{
                        padding: "12px 0px",
                        minHeight: 50,
                        boxSizing: "border-box",
                      }}
                      className="row"
                    >
                      <h1 className="h1">Концепт карта</h1>
                    </header>
                  </div>
                  <div
                    style={{
                      padding: "12px",
                      boxSizing: "border-box",
                      padding: "0 24px",
                    }}
                  >
                    <Stack
                      horizontal
                      tokens={{ childrenGap: 10 }}
                      style={{ justifyContent: "center" }}
                    >
                      <TextField
                        label="Текст для обработки"
                        multiline
                        rows={5}
                        styles={{
                          root: {
                            width: "100%",
                            borderColor: "rgb(107, 148, 184)",
                          },
                          fieldGroup: {
                            borderColor: "rgb(107, 148, 184)",
                          },
                        }}
                        required
                        value={text}
                        readOnly={load}
                        description={`${text.length} символов`}
                        onChange={(e) => handleChangeText(e.target.value)}
                      />
                    </Stack>
                    <Stack
                      tokens={{ childrenGap: 24 }}
                      style={{ marginTop: 12 }}
                      horizontal={true}>
                        <Toggle label="Использовать демонстративный текст при переключении языка" checked={isDemo} inlineLabel onChange={handleDemoChange} />
                    </Stack>
                    <Stack
                      tokens={{ childrenGap: 24 }}
                      style={{ marginTop: 12 }}
                      horizontal={true}
                    >
                      <Stack.Item>
                        <ChoiceGroup
                          label="Язык текста"
                          defaultSelectedKey="russian"
                          selectedKey={language}
                          options={languages}
                          onChange={handleSelectLang}
                        />
                      </Stack.Item>
                      <Stack.Item>
                        <ChoiceGroup
                          label="Способ построения карты"
                          defaultSelectedKey="rake"
                          selectedKey={relationMethod.key}
                          options={maps}
                          onChange={handleSelectMap}
                        />
                      </Stack.Item>
                      <Stack.Item>
                        <ChoiceGroup
                          label="Метод извлечения ключевых слов"
                          defaultSelectedKey="rake"
                          selectedKey={method}
                          options={keywords}
                          onChange={handleSelectMethod}
                        />
                      </Stack.Item>
                    </Stack>
                    <Stack
                      tokens={{ childrenGap: 24 }}
                      style={{ marginTop: 24 }}
                      horizontal={true}
                    >
                      <Stack.Item>
                        <PrimaryButton
                          styles={{
                            root: {
                              width: 292,
                            },
                          }}
                          text="Построить"
                          onClick={() => build()}
                          allowDisabledFocus
                          disabled={text.length == 0 || load}
                          checked={false}
                        />
                      </Stack.Item>
                    </Stack>
                    {load == true && (
                      <>
                        <Spinner
                          label={"Построение..."}
                          styles={{ root: { paddingTop: "125px" } }}
                        />
                      </>
                    )}
                    {graph.nodes.length > 0 && (
                      <>
                        <CommandBar
                          items={graphcommands}
                          styles={{
                            root: {
                              marginTop: '24px',
                              paddingLeft: '6px',
                              borderTop: '1px solid rgb(107, 148, 184)',
                              paddingTop: '8px'
                            }
                          }}
                        />
                        <Graph
                          id="graph"
                          graph={graph}
                          options={optionsMap}
                          style={{
                            height: "600px",
                            backgroundColor: "rgb(243, 242, 241)",
                            margin: "24px 0px",
                            marginTop: '0px',
                            backgroundImage:
                              "linear-gradient(white .4rem, transparent .4rem), linear-gradient(90deg, white .4rem, transparent .4rem)",
                            backgroundSize: "5rem 5rem",
                          }}
                        />
                      </>
                    )}
                    {wordsDialog == true && (
                      <KeyWordsDialog
                        title={`Ключевые слова`}
                        subtext={``}
                        words={words}
                        toggle={setWordsDialog}
                      ></KeyWordsDialog>
                    )}
                    {
                      analize && (
                        <TripletsDialog toggle={setAnalize} 
                                        graph={graph} 
                                        matchers = {matchers} 
                                        title={'Анализ связей'} 
                                        subtext = {'Используемые шаблоны для сущностей'}/>
                      )
                    } 
                  </div>
                </Stack>
              </div>
            </div>
          </div>    
        </div>
      )}
      {
        ready && isMobile && (
          <>
            <MessageBar>
              Недоступен для мобильной версии.
            </MessageBar>
          </>
        )
      }
    </React.Fragment>
  );
}
