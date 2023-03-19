import "./style.css";
import { UI } from "@peasy-lib/peasy-ui";

//#region types
type OptionData = {
  message: string;
  flags: ConditionData;
};

type ConditionData = Record<"string", boolean>;

type ContentData = {
  type: "basic" | "left" | "right" | "left_interact" | "right_interact";
  speed?: number;
  message?: string;
  avatar?: string;
  end?: boolean;
  flags?: ConditionData;
  options?: OptionData;
};

type EntryData = {
  id: string;
  conditions: ConditionData;
  content: Array<ContentData>;
};
type BranchData = {
  entry: Array<EntryData>;
};

//#endregion types

//#region peasyUI
const model = {
  dialogJSON: ``,
  branches: <any>[],
  currentTree: "N/A",
  currentBranch: "N/A",
  currentEntry: "N/A",
  isNewBranchDisabled: true,
  isNewEntryDisabled: true,
  isExportDisabled: true,
  treeCollapsed: false,
  selectedBranch: "0",
  branchSelected: false,
  selectedCondition: true,
  selectedContent: false,
  modalIsVisible: false,
  modalType: <"title" | "entry" | "branch" | "condition">"title",
  modalTitle: "Modal Title",
  modalInputElement: undefined,
  modelInput: "",
  isBlurred: false,
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
  get getConditions() {
    const conds = Object.keys(this.branches[this.selectedBranch].conditions);
    const newArray = <any>[];
    conds.forEach((k: any, i: number) => {
      newArray.push({ id: k, entry: this.branches[this.selectedBranch].conditions[k] });
      console.log({ id: k, entry: this.branches[this.selectedBranch].conditions[k] });
    });

    return newArray;
  },
  get getContent() {
    const conds = Object.keys(this.branches[this.selectedBranch].content);
    const newArray = <any>[];
    conds.forEach((k: any, i: number) => {
      newArray.push({
        type: this.branches[this.selectedBranch].content[k].id,
        entry: this.branches[this.selectedBranch].content[k].type,
      });
    });
    return newArray;
  },

  toggleFlag: (_event: any, model: any, element: any, _attribute: any, object: any) => {
    const myKey = (element as HTMLElement).getAttribute("data-key");
    const bIndex = object.$parent.$model.currentBranch.split("-")[1];
    console.log(model);

    if (object.$parent.$model.branches[bIndex].conditions[<string>myKey])
      object.$parent.$model.branches[bIndex].conditions[<string>myKey] = false;
    else object.$parent.$model.branches[bIndex].conditions[<string>myKey] = true;

    console.log("key: ", myKey);
    console.log("bIndex: ", bIndex);
    console.log("key: ", object.$parent.$model);
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
    }, 1000);
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
  conditionClicked: (_event: any, model: any, _element: HTMLElement, _attribute: any, object: any) => {
    if (model.branch.UI.condistionsCollapsed) model.branch.UI.condistionsCollapsed = false;
    else model.branch.UI.condistionsCollapsed = true;
    unselectALL();
    object.$parent.$model.selectedContent = false;
    object.$parent.$model.selectedCondition = true;
    object.$parent.$model.branchSelected = false;
    model.branch.UI.conditionsSelected = true;
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
  },
  treeClicked: (_event: any, model: any) => {
    if (model.treeCollapsed) {
      model.treeCollapsed = false;
    } else {
      model.treeCollapsed = true;
    }
  },
  newTree: (_event: any, model: any) => newTree(model),
  editTree: () => editTree(),
  newBranch: () => newBranch(),
  newEntry: () => newEntry(),
  exportJSON: () => exportJSON(),
  modalSubmit: (_event: any, model: any) => modalSubmit(model),
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
          <button class="buttons" \${disabled<=>isNewEntryDisabled} \${click@=>newEntry}>New Entry</button>
          <button class="buttons" \${disabled<=>isExportDisabled} \${click@=>exportJSON}>Export JSON</button>
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
          <div class="currentEntry">
            <span class="currentText">Current Entry</span>
            <span class="currentText"> > </span>
            <span class="currentText">\${currentEntry}</span>
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
                            <div class="condition \${branch.UI.getConditionSelected}" \${click@=>conditionClicked}>
                                <div class="dropdown \${branch.UI.getConditionCaretRotation} \${branch.UI.getConditionSelected}"></div>
                                <div>Conditions:</div>
                            </div>  
                            <div \${===branch.UI.condistionsCollapsed}>
                                <div class="condition bump"\${condition<=*getConditions:id}>-\${condition.id} : \${condition.entry}</div>
                            </div>
                            
                            </div>
                            <div class="TV_entrycontent">
                            <div class="condition \${branch.UI.getContentSelected}" \${click@=>contentClicked}>
                                <div class="dropdown \${branch.UI.getContentSelected} \${branch.UI.getContentCaretRotation}"></div>
                                <div>Content:</div>
                            </div> 
                            <div \${===branch.UI.contentCollapsed}>
                              <div class="condition bump"\${content<=*getContent:entry}>  Entry:    \${content.type}</div>
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
              \${currentBranch}
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
                    <a href="#" class="CT_Link smallLink" \${click@=>toggleFlag} data-key="\${condition.id}" >Toggle Flag</a>
              </div>
              </div>
  
            </div>
          </div>

          <div  class="CT_Content" \${===isContentSelected}>
            content date
          </div>
      </div>
    </div>
    
</div>




    <div class="modal" \${===modalIsVisible}>
        <div class="modalblur"></div>  
        <div class="modalcontainer">
            <div style="width: 100%; height: 100%; position: relative;">
              <div class="modalTitle">\${modalTitle}</div>
              <input class="modalInput" type="text" \${==>modalInputElement} \${value<=>modalInput} required pattern="^[\\w\\-. ]+$"/>
              <button class="buttons modalButtons" \${click@=>modalSubmit}>Submit</button>
            </div>
        </div>
    </div>
</div>
`;

/* */
UI.create(document.body, template, model);
UI.initialize(100 / 6);

/* model.branches.push({
  id: "0",
  UI: {
    get getCaretRotation() {
      if (this.branchCollapsed) return "";
      else return " dd_rotated";
    },
    branchSelected: false,
    branchCollapsed: true,
    get getConditionCaretRotation() {
      if (!this.condistionsCollapsed) return "";
      else return " dd_rotated";
    },
    get getConditionSelected() {
      if (!this.conditionsSelected) return "";
      else return " isSelected";
    },
    condistionsCollapsed: true,
    conditionsSelected: false,
    get getContentCaretRotation() {
      if (!this.contentCollapsed) return "";
      else return " dd_rotated";
    },
    get getContentSelected() {
      if (!this.contentSelected) return "";
      else return " isSelected";
    },
    contentCollapsed: true,
    contentSelected: false,
  },
  conditions: { threat: false, meek: false, deaf: false, angry: false },
  content: [
    {
      id: "0",
      type: "left",
      speed: 40,
      message: "Get out of my way, ... PUNK!",
      avatar: "./src/assets/images/npc2_avatar.png",
    },
    {
      id: "1",
      type: "right",
      speed: 80,
      message: "...",
      avatar: "./src/assets/images/hero_avatar.png",
      end: true,
      flags: { threat: true },
    },
  ], 
}); /* 
model.branches.push({
  id: "1",
  conditions: { threat: true, meek: false, deaf: false, angry: false },
  content: [
    {
      type: "left",
      speed: 40,
      message: "Get out of my way, ... PUNK!",
      avatar: "./src/assets/images/npc2_avatar.png",
    },
    {
      type: "right",
      speed: 80,
      message: "...",
      avatar: "./src/assets/images/hero_avatar.png",
      end: true,
      flags: { threat: true },
    },
  ],
}); */

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
  }, 1000);
}
function editTree() {}
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
    conditions: {},
    content: [],
  };
  model.branches.push(newBranch);
  model.currentBranch = `Branch-${newID}`;
  model.branchSelected = true;
  model.selectedContent = false;
  model.selectedCondition = false;
}
function newEntry() {}
function exportJSON() {}
function modalSubmit(model: any) {
  //validate input
  if (model.modalInput == "") return;

  //frame out different modal types
  switch (model.modalType) {
    case "title":
      model.modalIsVisible = false;
      model.isBlurred = false;
      model.isNewBranchDisabled = false;
      model.isNewEntryDisabled = false;
      model.isExportDisabled = false;
      model.currentTree = model.modalInput;
      break;
    case "entry":
      break;
    case "condition":
      //grab input info
      const newFlag = model.modalInput;
      //insert data into branch.condition object
      const bIndex = model.currentBranch.split("-")[1];
      model.branches[bIndex].conditions[newFlag] = false;
      console.log(model.branches[bIndex].conditions);

      model.modalIsVisible = false;
      model.isBlurred = false;
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
