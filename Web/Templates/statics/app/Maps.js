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
  },
  nodes: {
    font: {
      size: 14,
      face: "Verdana",
    },
    shape: "dot"
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
      iconProps: { iconName: "GitGraph" },
      checked: true,
    },
    {
      key: "knowlegegraph",
      text: "Граф знаний",
      iconProps: { iconName: "GitGraph" },
      disabled: false,
    },
    {
      key: "spacy",
      text: "Spacy",
      iconProps: { iconName: "GitGraph" },
      disabled: false,
    },
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
  const [words, setWords] = React.useState([]);
  const [wordsDialog, setWordsDialog] = React.useState(false);
  const [relationMethod, setRelationMethod] = React.useState("basic");
  const [actionType, setActionType] = React.useState("build");

  React.useEffect(() => {
    document.title = "Sorge - Концепт карта";
    fetch("/maps/example", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((text) => {
        setText(text.value);
      });
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
      var _maps = [...maps];
      if (language == languages[2].key) {
        _maps[1].disabled = true;
        //_maps[2].disabled = true;
        setRelationMethod("basic");
      } else {
        delete _maps[1]["disabled"];
        delete _maps[2]["disabled"];
      }
      setMaps(_maps);
    }
  }, [language]);

  React.useEffect(() => {
    if (relationMethod != "") {
      var kw = keywords.map((i) => {
        if (relationMethod != "basic") {
          i.disabled = true;
        } else {
          delete i["disabled"];
        }
        return i;
      });
      setKeyWords(kw);
    }
  }, [relationMethod]);

  const build = () => {
    if (text.length > 0 && actionType != "") {
      setLoad(true);
      setEmpty();

      let _text = text.replace(/\s+/g, " ");

      fetch(`/maps/${actionType}`, {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: _text,
          method: method,
          relation: relationMethod,
          language: language,
        }),
      })
        .then((res) => res.json())
        .then((answer) => {
          if (answer.data) {
            setGraph({
              nodes: answer.data.nodes,
              edges: answer.data.edges,
            });

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
    setRelationMethod(o.key);

    if (o.key == "basic") {
      setActionType("build");
    } else {
      setActionType("knowlegegraph");
    }

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
    setWords([]);
  };

  const saveGraph = () => {
    var canvas = document.getElementsByTagName("canvas")[0];
    var dataURL = canvas.toDataURL("image/png");
    var newTab = window.open('about:blank', 'image from canvas');
    newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
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
            style={{ height: "100%", overflowY: "scroll", overflowX: "auto" }}
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
                          selectedKey={relationMethod}
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
