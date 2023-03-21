import "./style.css";
import { UI } from "@peasy-lib/peasy-ui";
import { v4 as uuidv4 } from "uuid";

//#region peasyUI
const model = {
  dialogJSON: <any>{},
  datastr: ``,
  downloadLink: null,
  uploadLink: <any>null,
  branches: <any>[],
  currentTree: "N/A",
  currentBranch: "N/A",
  currentEntry: "N/A",
  isNewBranchDisabled: true,
  isEntrySelected: false,
  selectedEntry: 0,
  selectedOption: 0,
  isNewEntryDisabled: true,
  isExportDisabled: true,
  treeCollapsed: false,
  selectedBranch: "0",
  branchSelected: false,
  selectedCondition: true,
  selectedContent: false,
  modalIsVisible: false,
  modalType: <"title" | "entry" | "entryflag" | "entryoption" | "branch" | "condition">"title",
  modalTitle: "Modal Title",
  modalInputElement: undefined,
  modelInput: "",
  isBlurred: false,
  get getIsModalDropDown() {
    return model.modalType == "entry";
  },
  get getSelectedEntryData() {
    return model.branches[model.selectedBranch].content[model.selectedEntry];
  },
  get getIsSomethingSelected() {
    return this.branches.some((b: any) => {
      return b.UI.branchSelected || b.UI.conditionsSelected || b.UI.contentSelected;
    });
  },
  get isContentSelected() {
    return this.selectedContent;
  },
  get isConditionSelected() {
    return this.selectedCondition;
  },
  get isBranchSelected() {
    return this.branchSelected;
  },
  get getCaretRotation() {
    if (!this.treeCollapsed) return "";
    else return "dd_rotated";
  },
  get blurString() {
    if (this.isBlurred) return " blur";
    else return "";
  },
  get getTree() {
    if (this.currentTree == "N/A") return false;
    else return true;
  },
  get getBranches() {
    return this.branches;
  },
  get getCurrentBranch() {
    return this.currentBranch;
  },
  get getConditions() {
    return this.branches[this.selectedBranch].conditions;
  },
  get getContent() {
    return this.branches[this.selectedBranch].content;
  },

  toggleFlag: (_event: any, model: any, element: any, _attribute: any, object: any) => {
    const myKey = (element as HTMLElement).getAttribute("data-key");
    const bIndex = object.$parent.$model.currentBranch.split("-")[1];

    if (object.$parent.$model.branches[bIndex].conditions[<string>myKey])
      object.$parent.$model.branches[bIndex].conditions[<string>myKey] = false;
    else object.$parent.$model.branches[bIndex].conditions[<string>myKey] = true;
  },
  addCondition: (_event: any, model: any) => {
    model.modalTitle = "Enter Condition Title";
    model.modalType = "condition";
    model.isBlurred = true;
    model.modalInput = "";
    model.modalIsVisible = true;
    //have to wait for a peasy render prior to doing next step
    setTimeout(() => {
      (model.modalInputElement as HTMLElement).focus();
    }, 250);
  },
  addContent: (_event: any, model: any) => {
    model.modalTitle = "Enter Entry Type";
    model.modalType = "entry";
    model.isBlurred = true;
    model.modalInput = "";
    model.modalIsVisible = true;
    //have to wait for a peasy render prior to doing next step
    setTimeout(() => {
      (model.modalInputElement as HTMLElement).focus();
    }, 250);
  },
  chooseConditions: (_event: any, model: any, element: any) => {
    unselectALL();
    const bIndex = model.currentBranch.split("-")[1];
    model.branches[bIndex].UI.conditionsSelected = true;
    model.selectedContent = false;
    model.selectedCondition = true;
    model.branchSelected = false;
  },
  chooseContent: (_event: any, model: any, element: any) => {
    unselectALL();
    const bIndex = model.currentBranch.split("-")[1];
    model.branches[bIndex].UI.contentSelected = true;
    model.selectedContent = true;
    model.selectedCondition = false;
    model.branchSelected = false;
  },
  contentClicked: (_event: any, model: any, _element: HTMLElement, _attribute: any, object: any) => {
    if (model.branch.UI.contentCollapsed) model.branch.UI.contentCollapsed = false;
    else model.branch.UI.contentCollapsed = true;
    unselectALL();
    object.$parent.$model.selectedContent = true;
    object.$parent.$model.selectedCondition = false;
    object.$parent.$model.branchSelected = false;
    model.branch.UI.contentSelected = true;
  },
  conditionClicked: (_event: any, model: any, element: HTMLElement, _attribute: any, object: any) => {
    if (model.branch.UI.condistionsCollapsed) model.branch.UI.condistionsCollapsed = false;
    else model.branch.UI.condistionsCollapsed = true;
    unselectALL();
    object.$parent.$model.selectedContent = false;
    object.$parent.$model.selectedCondition = true;
    object.$parent.$model.branchSelected = false;
    model.branch.UI.conditionsSelected = true;
    console.log(element.getAttribute("data-branch"));
    console.log(model);
    object.$parent.$model.currentBranch = `Branch-${model.branch.id}`;
    object.$parent.$model.selectedBranch = model.branch.id;
  },
  branchClicked: (_event: any, model: any, _element: HTMLElement, _attribute: any, object: any) => {
    if (model.branch.UI.branchCollapsed) model.branch.UI.branchCollapsed = false;
    else model.branch.UI.branchCollapsed = true;
    unselectALL();
    object.$parent.$model.selectedContent = false;
    object.$parent.$model.selectedCondition = false;
    object.$parent.$model.branchSelected = true;

    model.branch.UI.branchSelected = true;
    object.$parent.$model.currentBranch = `Branch-${model.branch.id}`;
    object.$parent.$model.selectedBranch = model.branch.id;
  },
  treeClicked: (_event: any, model: any) => {
    if (model.treeCollapsed) {
      model.treeCollapsed = false;
    } else {
      model.treeCollapsed = true;
    }
  },
  back: (_event: any, model: any, _element: HTMLElement, _attribute: any, _object: any) => {
    console.log(model);
    model.selectedContent = false;
    model.selectedCondition = false;
    model.branchSelected = true;
  },
  selectEntry: (_event: any, model: any, element: HTMLElement, _attribute: any, object: any) => {
    object.$parent.$model.isEntrySelected = true;
    console.log(element.getAttribute("data-index"));

    object.$parent.$model.selectedEntry = element.getAttribute("data-index");
  },
  toggleEntryView: (_event: any, model: any, _element: HTMLElement, _attribute: any, object: any) => {
    console.log(object);
    object.$model.isEntrySelected = false;
  },
  addContentEntryFlag: (_event: any, model: any, _element: HTMLElement, _attribute: any, object: any) => {
    model.modalTitle = "Enter Flag Name";
    model.modalType = "entryflag";
    model.isBlurred = true;
    model.modalInput = "";
    model.modalIsVisible = true;
    //have to wait for a peasy render prior to doing next step
    setTimeout(() => {
      (model.modalInputElement as HTMLElement).focus();
    }, 250);
  },
  addContentEntryOption: (_event: any, model: any, _element: HTMLElement, _attribute: any, object: any) => {
    model.modalTitle = "Enter Option Message";
    model.modalType = "entryoption";
    model.isBlurred = true;
    model.modalInput = "";
    model.modalIsVisible = true;
    //have to wait for a peasy render prior to doing next step
    setTimeout(() => {
      (model.modalInputElement as HTMLElement).focus();
    }, 250);
  },
  addOptionFlag: (_event: any, model: any, _element: HTMLElement, _attribute: any, object: any) => {
    console.log(object);
    object.$parent.$model.selectedOption = model.option.$index;
    object.$parent.$model.modalTitle = "Enter Option Message";
    object.$parent.$model.modalType = "entryoptionflag";
    object.$parent.$model.isBlurred = true;
    object.$parent.$model.modalInput = "";
    object.$parent.$model.modalIsVisible = true;
    //have to wait for a peasy render prior to doing next step
    setTimeout(() => {
      (object.$parent.$model.modalInputElement as HTMLElement).focus();
    }, 250);
  },
  toggleOptionFlag: (_event: any, model: any, _element: HTMLElement, _attribute: any, _object: any) => {
    if (model.flag.entry) model.flag.entry = false;
    else model.flag.entry = true;
  },
  newTree: (_event: any, model: any) => newTree(model),
  editTree: () => editTree(),
  newBranch: () => newBranch(),
  exportJSON: () => exportJSON(),
  modalSubmit: (_event: any, model: any) => modalSubmit(model),
  processJSON: (event: any, _model: any, _element: HTMLElement, _attribute: any, _object: any) => {
    event.preventDefault = true;
    let fr = new FileReader();
    fr.onload = () => {
      if (fr.result) {
        model.isNewBranchDisabled = false;
        model.isExportDisabled = false;

        model.currentTree = event.target.files[0].name.split(".")[0];
        const outputstring: string = <string>fr.result;
        const outputobject: object = JSON.parse(outputstring);

        Object.keys(outputobject).forEach((key: any) => {
          const conditions: string[] = outputobject[key as keyof typeof outputobject]["conditions"];
          let conditionArray: any = [];

          if (conditions) {
            Object.keys(conditions).forEach((condition: any) => {
              conditionArray.push({
                id: condition,
                entry: conditions[condition],
                toggle: (_event: any, model: any) => {
                  if (model.condition.entry) model.condition.entry = false;
                  else model.condition.entry = true;
                },
              });
            });

            const content: string[] = outputobject[key as keyof typeof outputobject]["content"];
            let contentArray: any = [];

            content.forEach((cont: any, index: number) => {
              contentArray.push({
                id: uuidv4(),
              });
              Object.keys(cont).forEach((k: any) => {
                contentArray[index][k] = cont[k];
              });
            });

            model.branches.push({
              id: key,
              UI: {
                branchSelected: false,
                branchCollapsed: true,
                condistionsCollapsed: true,
                conditionsSelected: false,
                contentCollapsed: true,
                contentSelected: false,
                get getBranchSelected() {
                  if (!this.branchSelected) return "";
                  else return " isSelected";
                },
                get getCaretRotation() {
                  if (this.branchCollapsed) return "";
                  else return " dd_rotated";
                },

                get getConditionCaretRotation() {
                  if (!this.condistionsCollapsed) return "";
                  else return " dd_rotated";
                },
                get getConditionSelected() {
                  if (!this.conditionsSelected) return "";
                  else return " isSelected";
                },

                get getContentCaretRotation() {
                  if (!this.contentCollapsed) return "";
                  else return " dd_rotated";
                },
                get getContentSelected() {
                  if (!this.contentSelected) return "";
                  else return " isSelected";
                },
              },
              conditions: [...conditionArray],
              content: [...contentArray],
            });
          }
        });
      }
    };
    fr.readAsText(event.target.files[0]);
  },
};
const template = `
<div class="App">
<div class="maincontent \${blurString}">
  
    <div class="Header">
        <div class="HeaderTitle"> Dialog Config Tool -> JSON output</div>
        <div class="HeaderButtons">
          <button class="buttons" \${click@=>newTree}>New Tree</button>
          <button class="buttons" \${click@=>editTree}>Edit Tree</button>
          <button class="buttons" \${disabled<=>isNewBranchDisabled} \${click@=>newBranch}>New Branch</button>
          <button class="buttons" \${disabled<=>isExportDisabled} \${click@=>exportJSON}>Export JSON</button>
          <a \${==>downloadLink} style="display:none"  download="\${currentTree}.json"></a>
          <input \${==>uploadLink} \${change@=>processJSON} type="file"  accept=".json" style="display:none"/>
        </div>
    </div>

    <div class="Current">
          <div class="currentEntry">
            <span class="currentText">Current Tree</span>
            <span class="currentText"> > </span>
            <span class="currentText">\${currentTree}</span>
          </div>
          <div class="currentEntry">
            <span class="currentText">Current Branch</span>
            <span class="currentText"> > </span>
            <span class="currentText">\${currentBranch}</span>
          </div>
         
    </div>

    <div class="TreeView">
        <span class="TV_title">Dialog Tree View</span>
        <div class="TV_content">
            <div class="TV_tree"  \${===getTree}>
                <div \${click@=>treeClicked}>
                  <div class="dropdown \${getCaretRotation}"></div>
                  <span>\${currentTree}</span>
                </div>
                  <div \${===treeCollapsed}">
                    <div class="TV_branches" \${branch<=*branches}  >
                        <div class="TV_branchTitle \${branch.UI.getBranchSelected}" \${click@=>branchClicked} data-index="branch_\${branch.$index}">
                            <div class="dropdown \${branch.UI.getCaretRotation} \${branch.UI.getBranchSelected}"></div>
                            <div class="TV_entries">Branch - \${branch.id}</div>
                        </div>
                        <div \${!==branch.UI.branchCollapsed}>
                            <div class="TV_conditions  ">
                            <div class="condition \${branch.UI.getConditionSelected}" \${click@=>conditionClicked} data-branch="\${branch.$index}">
                                <div class="dropdown \${branch.UI.getConditionCaretRotation} \${branch.UI.getConditionSelected}"></div>
                                <div>Conditions:</div>
                            </div>  
                            <div \${===branch.UI.condistionsCollapsed}>
                                <div class="condition bump"\${condition<=*branch.getConditions:id}>-\${condition.id} : \${condition.entry}</div>
                            </div>
                            
                            </div>
                            <div class="TV_entrycontent">
                            <div class="condition \${branch.UI.getContentSelected}" \${click@=>contentClicked}>
                                <div class="dropdown \${branch.UI.getContentSelected} \${branch.UI.getContentCaretRotation}"></div>
                                <div>Content:</div>
                            </div> 
                            <div \${===branch.UI.contentCollapsed}>
                              <div class="condition bump"\${content<=*getContent:id}>Index: \${content.$index}  Entry:    \${content.type}</div>
                            </div>
                        </div>
                        </div>
                        
                    </div>                  
                  </div>
            </div>
        </div>
    </div>

    <div class="Content">
      <div class="CT_flex" style="position: relative; width: 100%; height: 100%;"  \${===getIsSomethingSelected}>
          <div class="CT_Title">
              \${getCurrentBranch}
          </div>

          <div class="CT_Branches"  \${===branchSelected}>
            <a class="CT_Link" href="#" \${click@=>chooseConditions}>Conditions</a>
            <a class="CT_Link" href="#" \${click@=>chooseContent}>Content</a>
          </div>
          
          <div  class="CT_Conditions" \${===isConditionSelected}>
            <span class="CT_Title">Conditions</span>
            <div class="CT_Cond_inner">
              <a href="#" class="CT_Link" \${click@=>addCondition}>Add Condition</a>
              <div class="CT_Entries">
                <div class="CT_Entry"\${condition<=*getConditions:id}>
                    <div>\${condition.id}</div>
                    <span>:</span>
                    <div style="font-style: italic">\${condition.entry}</div>
                    <a href="#" class="CT_Link smallLink" \${click@=>condition.toggle} data-key="\${condition.id}" >Toggle Flag</a>
              </div>
              </div>
              </div>
              <a href="#" class="CT_Link smallLink" \${click@=>back}">Back</a>
          </div>

          <div  class="CT_Content" \${===isContentSelected}>
            <span class="CT_Title">Content</span>
            <div class="CT_Cond_inner">
               <a href="#" class="CT_Link" \${click@=>addContent} \${!==isEntrySelected} >Add Action Entry</a>
               <div \${!==isEntrySelected}>
                  <div class="CT_Entry" \${entry<=*getContent:id}>
                    <a href="#" \${click@=>selectEntry} data-index="\${entry.$index}"> Index:  \${entry.$index}</a>
                    <span>:</span>
                    <div>Type:   \${entry.type}</div>
                  </div>
               </div>
               
                  <div style="width: 95%;" \${===isEntrySelected}>
                      <a href="#" class="CT_Link smallLink" \${click@=>toggleEntryView}">Back</a>
                      <div class="CT_Entry_Config">
                          <div style="width:100%; display: flex; justify-content: space-between;"><span>Index: \${getSelectedEntryData.$index}</span><span>                    UUID: \${getSelectedEntryData.id} </span></div>
                          <div><span>Type: </span> 
                          <select name="type">
                            <option \${'left'==> getSelectedEntryData.type}>left</option>
                            <option \${'right'==> getSelectedEntryData.type}>right</option>
                            <option \${'basic'==> getSelectedEntryData.type}>basic</option>
                            <option \${'left_interact'==> getSelectedEntryData.type}>left_interact</option>
                            <option \${'right_interact'==> getSelectedEntryData.type}>right_interact</option>
                          </select>
                          </div>

                          <div><span>Speed: </span><input type="number" \${value<=>getSelectedEntryData.speed}/></div>
                          <div><span>Message: </span><input type="text" \${value<=>getSelectedEntryData.message}/></div>
                          <div><span>Avatar: </span><input type="text" \${value<=>getSelectedEntryData.avatar}/></div>
                          <div><span>End: </span><input type="checkbox" \${value<=>getSelectedEntryData.end}/></div>
                          <div><span>Flags   </span><a href="#" \${click@=>addContentEntryFlag}>Add Flag</a></div>
                          <div \${flag<=*getSelectedEntryData.flags} >\${flag.id}:\${flag.entry}: <a href="#" \${click@=>flag.toggle}>Toggle</a>   </div>
                          <div><span>Options   </span><a href="#" \${click@=>addContentEntryOption}>Add Option</a></div>
                          <div class="CT_options" \${option<=*getSelectedEntryData.options} ><span class="bump">\${option.message} </span>
                            <a href="#" \${click@=>addOptionFlag}>Add Flag</a>
                            <div class="CT_option_flags" \${flag<=*option.flags}> \${flag.id} : \${flag.entry} <a href="#" \${click@=>toggleOptionFlag} data-index="\${flag.$index}">Toggle</a></div>
                          </div>
                          
                      </div>
                  </div>
              </div>
              <a href="#" class="CT_Link smallLink" \${click@=>back}">Back</a>
            </div>
          </div>
    </div>
    
</div>

    <div class="modal" \${===modalIsVisible}>
        <div class="modalblur"></div>  
        <div class="modalcontainer">
            <div style="width: 100%; height: 100%; position: relative;">
              <div class="modalTitle">\${modalTitle}</div>
              <input \${!==getIsModalDropDown}  class="modalInput" type="text" \${==>modalInputElement} \${value<=>modalInput} required pattern="^[\\w\\-. ]+$"/>
              <select class="modalInput" \${===getIsModalDropDown} name="type"  >
                  <option \${'left'==> modalInput}>left</option>
                  <option \${'right'==> modalInput}>right</option>
                  <option \${'basic'==> modalInput}>basic</option>
                  <option \${'left_interact'==> modalInput}>left_interact</option>
                  <option \${'right_interact'==> modalInput}>right_interact</option>
              </select>
              <button class="buttons modalButtons" \${click@=>modalSubmit}>Submit</button>
            </div>
        </div>
    </div>
</div>
`;

//<input type="text" \${value<=>getSelectedEntryData.type}/>

UI.create(document.body, template, model);
UI.initialize(100 / 6);
//#endregion peasyUI

//#region userFuncs
function newTree(model: any) {
  //setup modal
  model.modalTitle = "Enter Dialog Tree Name";
  model.modalType = "title";
  model.isBlurred = true;
  model.modalInput = "";
  model.modalIsVisible = true;
  //have to wait for a peasy render prior to doing next step
  setTimeout(() => {
    (model.modalInputElement as HTMLElement).focus();
  }, 250);
}
function editTree() {
  (model.uploadLink as HTMLInputElement).click();
}

function newBranch() {
  unselectALL();
  const newID = model.branches.length;
  const newBranch = {
    id: newID,
    UI: {
      branchSelected: true,
      branchCollapsed: true,
      condistionsCollapsed: true,
      conditionsSelected: false,
      contentCollapsed: true,
      contentSelected: false,
      get getBranchSelected() {
        if (!this.branchSelected) return "";
        else return " isSelected";
      },
      get getCaretRotation() {
        if (this.branchCollapsed) return "";
        else return " dd_rotated";
      },

      get getConditionCaretRotation() {
        if (!this.condistionsCollapsed) return "";
        else return " dd_rotated";
      },
      get getConditionSelected() {
        if (!this.conditionsSelected) return "";
        else return " isSelected";
      },

      get getContentCaretRotation() {
        if (!this.contentCollapsed) return "";
        else return " dd_rotated";
      },
      get getContentSelected() {
        if (!this.contentSelected) return "";
        else return " isSelected";
      },
    },
    conditions: [],
    content: [],
    get getConditions() {
      return this.conditions;
    },
  };
  model.branches.push(newBranch);
  model.currentBranch = `Branch-${newID}`;
  model.branchSelected = true;
  model.selectedContent = false;
  model.selectedCondition = false;
  model.selectedBranch = newID;
}

function exportJSON() {
  //build json object
  model.dialogJSON = {};
  model.branches.forEach(
    (branch: { id: string; conditions: Array<{ id: string; entry: boolean }>; content: Array<object> }) => {
      //console.log(branch);
      let cond: any = {};
      let cont: any = [];
      branch.conditions.forEach((c: { id: string; entry: boolean }) => {
        cond[c.id] = c.entry;
      });
      //console.log("cond:", cond);

      branch.content.forEach((c: any, index: number) => {
        //console.log(c);
        cont.push({});
        Object.keys(c).forEach((k: any) => {
          if (k != "id") cont[index][k] = c[k];
        });
      });
      //console.log("cont:", cont);

      model.dialogJSON[branch.id as keyof typeof model.dialogJSON] = {
        conditions: cond,
        content: cont,
      };

      console.log(model.dialogJSON);
    }
  );

  const blob = new Blob([JSON.stringify(model.dialogJSON)], { type: "text/json" });
  if (model.downloadLink) {
    (model.downloadLink as HTMLAnchorElement).href = URL.createObjectURL(blob);
    (model.downloadLink as HTMLAnchorElement).click();
  }
}

function modalSubmit(model: any) {
  //validate input
  if (model.modalInput == "") return;

  //frame out different modal types
  switch (model.modalType) {
    case "title":
      {
        model.modalIsVisible = false;
        model.isBlurred = false;
        model.isNewBranchDisabled = false;
        model.isExportDisabled = false;
        model.currentTree = model.modalInput;
      }
      break;
    case "entry":
      {
        const newType = model.modalInput;
        let bIndex = model.selectedBranch;
        model.branches[bIndex].content.push({
          id: uuidv4(),
          type: newType,
          speed: 0,
          message: "",
          avatar: "",
          end: false,
          flags: [],
          options: [],
        });
        model.modalIsVisible = false;
        model.isBlurred = false;
      }
      break;

    case "entryflag":
      //grab input info
      {
        const newFlag = model.modalInput;
        //insert data into branch.condition object
        let bIndex = model.selectedBranch;
        let cIndex = model.selectedEntry;
        console.log(model.branches[bIndex].content[cIndex]);

        model.branches[bIndex].content[cIndex].flags.push({
          id: newFlag,
          entry: false,
          toggle: (_event: any, model: any) => {
            if (model.flag.entry) model.flag.entry = false;
            else model.flag.entry = true;
          },
        });
        model.modalIsVisible = false;
        model.isBlurred = false;
        console.log(model.branches[bIndex].content[cIndex].flags);
      }

      break;
    case "entryoption":
      //grab input info
      {
        const newMessage = model.modalInput;
        //insert data into branch.condition object
        let bIndex = model.selectedBranch;
        let cIndex = model.selectedEntry;
        console.log(model.branches[bIndex].content[cIndex]);

        model.branches[bIndex].content[cIndex].options.push({
          message: newMessage,
          flags: [],
          addFlag: (_event: any, model: any) => {
            console.log(model);
          },
        });
        model.modalIsVisible = false;
        model.isBlurred = false;
        console.log(model.branches[bIndex].content[cIndex].options);
      }

      break;
    case "entryoptionflag":
      //grab input info
      {
        const newFlag = model.modalInput;
        //insert data into branch.condition object
        let bIndex = model.selectedBranch;
        let cIndex = model.selectedEntry;
        let oIndex = model.selectedOption;
        console.log(model.branches[bIndex].content[cIndex]);

        model.branches[bIndex].content[cIndex].options[oIndex].flags.push({
          id: newFlag,
          entry: false,
          toggle: (_event: any, model: any) => {
            if (model.flag.entry) model.flag.entry = false;
            else model.flag.entry = true;
          },
        });
        model.modalIsVisible = false;
        model.isBlurred = false;
        console.log(model.branches[bIndex].content[cIndex].flags);
      }
      break;
    case "condition":
      //grab input info
      {
        const newFlag = model.modalInput;
        //insert data into branch.condition object
        let bIndex = model.selectedBranch;
        model.branches[bIndex].conditions.push({
          id: newFlag,
          entry: false,
          toggle: (_event: any, model: any) => {
            if (model.condition.entry) model.condition.entry = false;
            else model.condition.entry = true;
          },
        });
        model.modalIsVisible = false;
        model.isBlurred = false;
      }
      break;
  }
}
const unselectALL = () => {
  model.branches.forEach((branch: any) => {
    branch.UI.branchSelected = false;
    branch.UI.conditionsSelected = false;
    branch.UI.contentSelected = false;
  });
};

//#endregion userFuncs
