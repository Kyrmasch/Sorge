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
import { CommandBar } from "@fluentui/react/lib/CommandBar";
import { isMobile } from "react-device-detect";
import { MessageBar } from "@fluentui/react/lib/MessageBar";
import { Toggle } from "@fluentui/react/lib/Toggle";
import TripletsDialog from "./components/TripletsDialog";
import { Dropdown, DropdownMenuItemType } from "@fluentui/react/lib/Dropdown";
import { TeachingBubble } from '@fluentui/react/lib/TeachingBubble';
import { useBoolean, useId } from '@fluentui/react-hooks';
import { Slider } from "@fluentui/react/lib/Slider";

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
  locale: "ru",
  physics: {
    enabled: true,
    maxVelocity: 10,
    solver: 'repulsion',
    stabilization: {
      enabled: false
    },
    repulsion: {
      centralGravity: 0.1
    }
  },
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
      forceDirection: "none",
    },
    shadow: true,
  },
  nodes: {
    font: {
      size: 14,
      face: "Verdana",
    },
    shape: "dot",
    shadow: true,
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
  const graphSliderId = useId('sliderTarget');

  const [maps, setMaps] = React.useState([
    {
      key: "basic",
      text: "Базовый",
      action: "build",
      iconProps: { iconName: "GitGraph" },
      checked: true,
    },
    {
      key: "spacy",
      text: "Spacy",
      action: "knowlegegraph",
      iconProps: { iconName: "GitGraph" },
      disabled: false,
    },
    {
      key: "bert",
      text: "Bert",
      action: "knowlegegraph",
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

  const [graphCommands, setGraphCommands] = React.useState([
    {
      key: "entities",
      text: "Сущности",
      iconProps: { iconName: "LookupEntities" },
      split: true,
      onClick: () => setWordsDialog(true),
    },
    {
      key: "patterns",
      text: "Анализ связей",
      iconProps: { iconName: "ThumbnailViewMirrored" },
      split: true,
      onClick: () => analizePatterns(),
    },
    {
      key: "save",
      text: "Сохранить",
      iconProps: { iconName: "Save" },
      onClick: () => saveGraph(),
    },
  ]);
  const [grapthFar, setGraphFar] = React.useState([
    {
      id: graphSliderId,
      key: 'edge_streng',
      text: 'Сила связи',
      ariaLabel: 'Сила связи',
      iconOnly: true,
      iconProps: { iconName: 'BranchFork2' },
      onClick: () => setGraphSliderShow(true),
    }
  ]);
  const [graphSliderShow, setGraphSliderShow] = React.useState(false);
  const [graphEdgeLimit, setGraphEdgeLimit] = React.useState(0.2);

  const [bertModels, setBertModels] = React.useState([]);
  const [selectedModel, setSelectedModel] = React.useState(null);

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

  const [useTransformers, setUseTransformers] = React.useState(true);

  React.useEffect(() => {
    document.title = "Sorge - Концепт карта";
    getDemoText(language);
    getModels();
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
      } else {
        delete $maps[2]["disabled"];
      }

      if (isDemo) {
        getDemoText(language);
      }

      setMaps($maps);
      setSelectedModel(null);
    }
  }, [language]);

  React.useEffect(() => {
    if (relationMethod) {
      var $keywords = keywords.map((i) => {
        if (relationMethod.key != "basic") {
          i.disabled = true;
        } else {
          delete i["disabled"];
        }
        return i;
      });
      setKeyWords($keywords);

      var $graphcommants = [...graphCommands];
      if (relationMethod.key == "basic") {
        $graphcommants[1].disabled = true;
      } else {
        delete $graphcommants[1]["disabled"];
      }
      setGraphCommands($graphcommants);
      setSelectedModel(null);
    }
  }, [relationMethod]);

  const getModels = () => {
    fetch("/maps/get_models", {
      method: "get",
    })
      .then((res) => res.json())
      .then((options) => {
        let items = options.map((i) => {
          if (i.ishead == true) {
            return { key: i.key, text: i.text, itemType: DropdownMenuItemType.Header, language: i.language }
          }
          if (i.isdeliver == true) {
            return { key: i.key, text: '-', itemType: DropdownMenuItemType.Divider, language: i.language }
          }
          return { key: i.key, text: i.text, language: i.language }
        })
        setBertModels(items);
      });
  };

  const getDemoText = (lang) => {
    fetch("/maps/example", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: lang,
      }),
    })
      .then((res) => res.json())
      .then((text) => {
        setText(text.value);
      });
  };

  const build = () => {
    if (text.length > 0) {
      setLoad(true);
      setEmpty();

      let _text = text.replace(/\s+/g, " ");
      let _model = selectedModel
      if (_model) {
        _model = _model.replace('{0}', (useTransformers == true ? 'gpu' : 'cpu'))
      }

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
          sa: _model,
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
    var newTab = window.open("about:blank", "image from canvas");
    newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
  };

  const analizePatterns = () => {
    setAnalize(true);
  };

  const handleDemoChange = (e, v) => {
    setIsDemo(v);
  };

  const handleTransormersChange = (e, v) => {
    setUseTransformers(v);
  };

  const handleSelectModel = (e, o) => {
    setSelectedModel(bertModels[o].key);
  };

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
            style={{
              height: "calc(100vh - 55px)",
              overflowY: "scroll",
              overflowX: "auto",
            }}
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
                      <Toggle
                        label="Использовать демонстративный текст при переключении языка"
                        checked={isDemo}
                        inlineLabel
                        onChange={handleDemoChange}
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
                        {
                          ['basic', 'spacy'].includes(relationMethod.key) && (
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
                          )
                        }
                        {
                          ['bert'].includes(relationMethod.key) && (
                            <Stack
                              tokens={{ childrenGap: 24 }}
                              horizontal={true}
                            >
                              <Stack.Item>
                                <Stack tokens={{ childrenGap: 24 }} horizontal={false}>
                                  <Stack.Item>
                                    <Dropdown
                                      required={true}
                                      placeholder="Выберите модель"
                                      label="Обученные модели"
                                      options={bertModels.filter(x => x.language == language)}
                                      styles={{
                                        dropdown: {
                                          width: 292
                                        }
                                      }}
                                      onChanged={handleSelectModel}
                                    />
                                  </Stack.Item>
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
                                      disabled={text.length == 0 || load || selectedModel == null}
                                      checked={false}
                                    />
                                  </Stack.Item>
                                </Stack>
                              </Stack.Item>
                              <Stack.Item>
                                <Stack tokens={{ childrenGap: 24 }} horizontal={false}>
                                  <Stack.Item>
                                    <Toggle
                                      styles={{
                                        root: {
                                          marginTop: '28px'
                                        }
                                      }}
                                      label="С трансформерами"
                                      checked={useTransformers}
                                      inlineLabel
                                      onChange={handleTransormersChange}
                                    />
                                  </Stack.Item>
                                </Stack>
                              </Stack.Item>
                            </Stack>
                          )
                        }
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
                          items={graphCommands}
                          farItems={relationMethod.key == "bert" ? grapthFar : []}
                          styles={{
                            root: {
                              marginTop: "24px",
                              paddingLeft: "6px",
                              borderTop: "1px solid rgb(107, 148, 184)",
                              paddingTop: "8px",
                            },
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
                            marginTop: "0px",
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
                    {analize && (
                      <TripletsDialog
                        toggle={setAnalize}
                        graph={graph}
                        matchers={matchers}
                        title={"Анализ связей"}
                        subtext={
                          relationMethod.key == "bert"
                            ? "Сила связи между сущностями"
                            : "Используемые шаблоны для сущностей"
                        }
                      />
                    )}
                    {graphSliderShow && (
                      <TeachingBubble
                        target={`#${graphSliderId}`}
                        primaryButtonProps={
                          {
                            children: 'Применить',
                            onClick: () => { }
                          }
                        }
                        secondaryButtonProps={
                          {
                            children: 'Сбросить',
                            onClick: () => { }
                          }
                        }
                        onDismiss={() => setGraphSliderShow(false)}
                        headline="Настроить порог связи между сущностями"
                      >
                        <Slider
                          styles={{
                            titleLabel: {
                              color: 'white'
                            },
                            activeSection: {
                              background: 'rgb(78, 173, 245)',
                              ":hover": {
                                background: 'rgb(78, 173, 245) !important'
                              },
                              ":active": {
                                background: 'rgb(78, 173, 245) !important'
                              }
                            },
                            valueLabel: {
                              color: 'white'
                            },
                          }}
                          label="Значение"
                          min={0}
                          max={1}
                          step={0.1}
                          value={graphEdgeLimit}
                          defaultValue={graphEdgeLimit}
                          onChange={(e) => setGraphEdgeLimit(e)}
                          showValue
                          snapToStep />
                      </TeachingBubble>
                    )}
                  </div>
                </Stack>
              </div>
            </div>
          </div>
        </div>
      )}
      {ready && isMobile && (
        <>
          <MessageBar>Недоступен для мобильной версии.</MessageBar>
        </>
      )}
    </React.Fragment>
  );
}
