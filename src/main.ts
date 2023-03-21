import "./style.css";
import { UI } from "@peasy-lib/peasy-ui";
import { v4 as uuidv4 } from "uuid";

//#region peasyUI
const model = {
  //state discrete UI values for Peasy-UI
  dialogJSON: <any>{}, // the exported JSON object
  downloadLink: null, //anchor tag element binding
  uploadLink: <any>null, //file input tag element binding
  branches: <any>[], //array of all data used for application
  currentTree: "N/A", //filename used for the UI and for saving file
  currentBranch: "N/A", //current Branch UI binding
  isNewBranchDisabled: true, //button disable attributes whn app starts
  isEntrySelected: false, //used to show details in content panel, its a flag that renders content
  selectedEntry: 0, //index value for which entry to show as content
  selectedOption: 0, //same, index value, which option to toggle
  isExportDisabled: true, //button disable attributes whn app starts
  treeCollapsed: false, //controls if treeview 'tree' is collapsed or not
  selectedBranch: "0", //index for which branch in treeview is selected
  branchSelected: false, //boolean flag that controls if content rendered
  selectedCondition: true, //boolean flag that controls if content rendered
  selectedContent: false, //boolean flag that controls if content rendered
  modalIsVisible: false, //boolean flag that controls if content rendered
  modalType: <string>"title", //setting this string changes how/what happens with modal
  modalTitle: "Modal Title", //UI content of the modal title, changes depending on what you're doing
  modalInputElement: undefined, //div element that's bound
  modelInput: "", //input feild that is bound and read for what the user input is
  isBlurred: false, //boolean flag for changing the css properties of the main window

  // Peasy-UI data GETTERS
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

  //*************************************** */
  //Peasy-UI Event callbacks
  //*************************************** */

  toggleFlag: (_event: any, model: any, element: any, _attribute: any, object: any) => {
    const myKey = (element as HTMLElement).getAttribute("data-key");
    const bIndex = object.$parent.$model.currentBranch.split("-")[1];

    if (object.$parent.$model.branches[bIndex].conditions[<string>myKey])
      object.$parent.$model.branches[bIndex].conditions[<string>myKey] = false;
    else object.$parent.$model.branches[bIndex].conditions[<string>myKey] = true;
  },
  /**
   * peasy callback
   * sets up input modal params and shows modal
   */
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
  /**
   * peasy callback
   * sets up input modal params and shows modal
   */
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
  /**
   * peasy callback
   * modifies UI parames of specific branch to
   * show selected condition highlighted
   */
  chooseConditions: (_event: any, model: any) => {
    unselectALL();
    const bIndex = model.currentBranch.split("-")[1];
    model.branches[bIndex].UI.conditionsSelected = true;
    model.selectedContent = false;
    model.selectedCondition = true;
    model.branchSelected = false;
  },
  /**
   * peasy callback
   * modifies UI parames of specific branch to
   * show selected content highlighted
   */
  chooseContent: (_event: any, model: any) => {
    unselectALL();
    const bIndex = model.currentBranch.split("-")[1];
    model.branches[bIndex].UI.contentSelected = true;
    model.selectedContent = true;
    model.selectedCondition = false;
    model.branchSelected = false;
  },
  /**
   * peasy callback
   * modifies UI parames of specific branch to
   * show selected content highlighted
   * AAAAAND toggles dropdown
   */
  contentClicked: (_event: any, model: any, _element: HTMLElement, _attribute: any, object: any) => {
    if (model.branch.UI.contentCollapsed) model.branch.UI.contentCollapsed = false;
    else model.branch.UI.contentCollapsed = true;
    unselectALL();
    object.$parent.$model.selectedContent = true;
    object.$parent.$model.selectedCondition = false;
    object.$parent.$model.branchSelected = false;
    model.branch.UI.contentSelected = true;
  },
  /**
   * peasy callback
   * modifies UI parames of specific branch to
   * show selected condition highlighted
   * AAAAAND toggles dropdown
   */
  conditionClicked: (_event: any, model: any, _element: HTMLElement, _attribute: any, object: any) => {
    if (model.branch.UI.condistionsCollapsed) model.branch.UI.condistionsCollapsed = false;
    else model.branch.UI.condistionsCollapsed = true;
    unselectALL();
    object.$parent.$model.selectedContent = false;
    object.$parent.$model.selectedCondition = true;
    object.$parent.$model.branchSelected = false;
    model.branch.UI.conditionsSelected = true;
    object.$parent.$model.currentBranch = `Branch-${model.branch.id}`;
    object.$parent.$model.selectedBranch = model.branch.id;
  },
  /**
   * peasy callback
   * modifies UI parames of specific branch to
   * show selected branch highlighted
   * AAAAAND toggles dropdown
   */
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
  /**
   * peasy callback
   * toggles dropdown for the tree
   */
  treeClicked: (_event: any, model: any) => {
    if (model.treeCollapsed) {
      model.treeCollapsed = false;
    } else {
      model.treeCollapsed = true;
    }
  },
  /**
   * peasy callback
   * when in the content panel a back link is clicked
   * modifies the UI display properties
   */
  back: (_event: any, model: any, _element: HTMLElement, _attribute: any, _object: any) => {
    model.selectedContent = false;
    model.selectedCondition = false;
    model.branchSelected = true;
  },

  /**
   * peasy callback
   * sets the content panel's display properties
   * to show the correct entry details
   */
  selectEntry: (_event: any, _model: any, element: HTMLElement, _attribute: any, object: any) => {
    object.$parent.$model.isEntrySelected = true;
    object.$parent.$model.selectedEntry = element.getAttribute("data-index");
  },
  /**
   * peasy callback
   * sets the content panel's display properties
   * toggling the entry display
   * which is triggered by the back link for that data entry
   */
  toggleEntryView: (_event: any, _model: any, _element: HTMLElement, _attribute: any, object: any) => {
    object.$model.isEntrySelected = false;
  },
  /**
   * peasy callback
   * sets the content panel's display properties
   * to show the correct entry details
   */
  addContentEntryFlag: (_event: any, model: any, _element: HTMLElement, _attribute: any) => {
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
  /**
   * peasy callback
   * sets up input modal params and shows modal
   */
  addContentEntryOption: (_event: any, model: any, _element: HTMLElement, _attribute: any) => {
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
  /**
   * peasy callback
   * sets up input modal params and shows modal
   */
  addOptionFlag: (_event: any, model: any, _element: HTMLElement, _attribute: any, object: any) => {
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
  /**
   * peasy callback
   * toggles the true/false setting for the option Story Flag
   */
  toggleOptionFlag: (_event: any, model: any, _element: HTMLElement, _attribute: any, _object: any) => {
    if (model.flag.entry) model.flag.entry = false;
    else model.flag.entry = true;
  },
  /**
   * peasy callback
   * remote calls to user functions below
   * felt like a good idea at that time
   */
  newTree: (_event: any, model: any) => newTree(model),
  editTree: () => editTree(),
  newBranch: () => newBranch(),
  exportJSON: () => exportJSON(),
  modalSubmit: (_event: any, model: any) => modalSubmit(model),
  /**
   * peasy callback
   * triggered by the edit tree button
   * opens file dialoge and if json file selected, reads it in
   * PROBABLY should have some json file validation added, but
   * hey... live a little
   */
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
                toggle: (_event: any, model: any) => (model.condition.entry = !model.condition.entry),
              });
            });

            const content: string[] = outputobject[key as keyof typeof outputobject]["content"];
            let contentArray: any = [];

            content.forEach((cont: any, index: number) => {
              contentArray.push({
                id: uuidv4(),
              });
              Object.keys(cont).forEach((k: any) => (contentArray[index][k] = cont[k]));
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

//************************************ */
//Peasy-UI injected HTML
//************************************ */
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

/**
 * newTree
 * sets up the input modal settings and moves focus to it after it renders
 * @param model UI object data passed to function
 */

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

/**
 * editTree
 * initiates the file open dialoge which is bound
 * to the uploadLink property of data model
 * @param model UI object data passed to function
 */

function editTree() {
  (model.uploadLink as HTMLInputElement).click();
}

/**
 * newBranch
 * inserts a blank branch object into the
 * branches property, then configures the selection
 * properties for the UI
 */

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

/**
 * exportJSON
 * loops through branches property and builds up the
 * JSON object that gets handed over to the
 * download link which is an anchor tag in the DOM
 */
function exportJSON() {
  //build json object
  model.dialogJSON = {};
  model.branches.forEach(
    (branch: { id: string; conditions: Array<{ id: string; entry: boolean }>; content: Array<object> }) => {
      let cond: any = {};
      let cont: any = [];
      branch.conditions.forEach((c: { id: string; entry: boolean }) => {
        cond[c.id] = c.entry;
      });

      branch.content.forEach((c: any, index: number) => {
        cont.push({});
        Object.keys(c).forEach((k: any) => {
          if (k != "id") cont[index][k] = c[k];
        });
      });

      model.dialogJSON[branch.id as keyof typeof model.dialogJSON] = {
        conditions: cond,
        content: cont,
      };
    }
  );

  //pass download data into the anchor tag in the DOM
  const blob = new Blob([JSON.stringify(model.dialogJSON)], { type: "text/json" });
  if (model.downloadLink) {
    (model.downloadLink as HTMLAnchorElement).href = URL.createObjectURL(blob);
    (model.downloadLink as HTMLAnchorElement).click();
  }
}

/**
 * modalSubmit
 * This is where some magic happens
 * depending on the modal type, you can manipulate the properties of the modal
 * instead of making a bunch of different modals
 * This event is triggered off the submit button click of the modal
 * @param model - this is the state modal data
 *
 */

function modalSubmit(model: any) {
  //validate input
  if (model.modalInput == "") return;

  //frame out different modal types
  switch (model.modalType) {
    /**
     * When your simply creating the new JSON file name
     */
    case "title":
      {
        model.modalIsVisible = false;
        model.isBlurred = false;
        model.isNewBranchDisabled = false;
        model.isExportDisabled = false;
        model.currentTree = model.modalInput;
      }
      break;
    /**
     * when you have an open branch, and your adding a new content entry
     * into it
     * in the UI model, peasy iterates best when each object has a unique ID
     * so for the UI data, there's a uuid4 for the id, but this isn't carried
     * on when outputting the json data
     */
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

    /**
     * when you have a dialog entry that sets story flags
     * you can specify the flags value and ID, this occurs
     * when you click the add flag link
     */
    case "entryflag":
      //grab input info
      {
        const newFlag = model.modalInput;
        //insert data into branch.condition object
        let bIndex = model.selectedBranch;
        let cIndex = model.selectedEntry;

        model.branches[bIndex].content[cIndex].flags.push({
          id: newFlag,
          entry: false,
          toggle: (_event: any, model: any) => (model.flag.entry = !model.flag.entry),
        });
        model.modalIsVisible = false;
        model.isBlurred = false;
      }

      break;
    /**
     * when you have a dialog entry that sets up for chosen options
     * that the user can select in the game... choice 1, choice 2
     * this is how you enter the choice data
     * this data happens when you click the add Option link
     */
    case "entryoption":
      //grab input info
      {
        const newMessage = model.modalInput;
        //insert data into branch.condition object
        let bIndex = model.selectedBranch;
        let cIndex = model.selectedEntry;
        model.branches[bIndex].content[cIndex].options.push({ message: newMessage, flags: [] });
        model.modalIsVisible = false;
        model.isBlurred = false;
      }

      break;
    /**
     * so... the results of the choices the user makes depends on the storyflags and
     * values you define here, reached by clicking the add flag link UNDER each option
     */
    case "entryoptionflag":
      //grab input info
      {
        const newFlag = model.modalInput;
        //insert data into branch.condition object
        let bIndex = model.selectedBranch;
        let cIndex = model.selectedEntry;
        let oIndex = model.selectedOption;
        model.branches[bIndex].content[cIndex].options[oIndex].flags.push({
          id: newFlag,
          entry: false,
          toggle: (_event: any, model: any) => (model.flag.entry = !model.flag.entry),
        });
        model.modalIsVisible = false;
        model.isBlurred = false;
      }
      break;
    /**
     * when you click add condition, which defines the tested set of Story Flags which guides the narration
     * process in the game, reached by clicking the add condition link
     */
    case "condition":
      //grab input info
      {
        const newFlag = model.modalInput;
        //insert data into branch.condition object
        let bIndex = model.selectedBranch;
        model.branches[bIndex].conditions.push({
          id: newFlag,
          entry: false,
          toggle: (_event: any, model: any) => (model.condition.entry = !model.condition.entry),
        });
        model.modalIsVisible = false;
        model.isBlurred = false;
      }
      break;
  }
}

/**
 * unselectAll, loops through all the UI data configurations
 * and sets them all to a know state, used prior to setting the new
 * state for the UI
 */
const unselectALL = () => {
  model.branches.forEach((branch: any) => {
    branch.UI.branchSelected = false;
    branch.UI.conditionsSelected = false;
    branch.UI.contentSelected = false;
  });
};

//#endregion userFuncs
