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

const keywords = [
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
];

const languages = [
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
  edges: {
    color: "#0078d4",
    smooth: {
      type: "continuous",
    },
    arrows: {
      to: { enabled: false, scaleFactor: 1, type: "arrow" },
      middle: { enabled: false, scaleFactor: 1, type: "arrow" },
      from: { enabled: false, scaleFactor: 1, type: "arrow" },
    },
  },
  nodes: {
    font: {
      size: 14,
      face: "Verdana",
    },
    shape: "dot",
  },
  interaction: {
    hideEdgesOnDrag: true,
    tooltipDelay: 200,
    keyboard: true,
    navigationButtons: true,
  },
};

export default function Maps() {
  const culture = useParams().culture || "ru";
  const history = useHistory();

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

  const handleChangeText = (value) => {
    value = value.replace(/\s+/g, " ");
    setText(value);
  };

  const handleBuildMap = () => {
    if (text.length > 0) {
      setLoad(true);
      setGraph({
        nodes: [],
        edges: [],
      });
      setWords([]);

      fetch("/maps/build", {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          method: method,
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

  const select_method = (e, o) => {
    setMethod(o.key);
    setGraph({
      nodes: [],
      edges: [],
    });
    setWords([]);
  };

  const select_lang = (e, o) => {
    setLanguage(o.key);
    if (o.key == "kazakh") {
      setMethod("tfidf");
    }
  };

  return (
    <React.Fragment>
      <Header setReady={setReady} />
      {ready && (
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
                          root: { width: "100%" },
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
                          onChange={select_lang}
                        />
                      </Stack.Item>
                      <Stack.Item>
                        <ChoiceGroup
                          label="Метод извлечения ключевых слов"
                          defaultSelectedKey="rake"
                          selectedKey={method}
                          options={keywords}
                          onChange={select_method}
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
                          text="Построить карту"
                          onClick={() => handleBuildMap()}
                          allowDisabledFocus
                          disabled={text.length == 0 || load}
                          checked={false}
                        />
                      </Stack.Item>
                      <Stack.Item>
                        <DefaultButton
                          styles={{
                            root: {
                              width: 195,
                            },
                          }}
                          text="Ключевые слова"
                          onClick={() => setWordsDialog(true)}
                          allowDisabledFocus
                          disabled={words.length == 0 || load}
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
                      <Graph
                        id="graph"
                        graph={graph}
                        options={optionsMap}
                        style={{
                          height: "600px",
                          backgroundColor: "#f9f9f9",
                          margin: "24px 0px",
                          backgroundImage:
                            "linear-gradient(#ffffff .4rem, transparent .4rem), linear-gradient(90deg, #ffffff .4rem, transparent .4rem)",
                          backgroundSize: "5rem 5rem",
                        }}
                      />
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
    </React.Fragment>
  );
}
