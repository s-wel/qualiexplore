import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditTreeService } from './edit-tree.service';
import { Location } from '@angular/common';
import { ApiService } from '../api.service';
import { editableTree } from './model/edit-tree.model';
import { AuthService } from '../auth/auth.service'
import { Observable } from 'rxjs'
import { TYPED_NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { Key } from 'protractor';

@Component({
  selector: 'app-edit-tree',
  templateUrl: './edit-tree.component.html',
  styleUrls: ['./edit-tree.component.css']
})
export class EditTreeComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute,
    private router: Router, private service : EditTreeService, private apiService : ApiService, private location: Location,  private authService: AuthService, ) { 
      this.editableTree = {
        id: null,
        name: null,
        checked: false,
        childrens: []
      }
  }
  myTree = [
    {
      name: 'Platform Information Quality',
      id: 1,
      childrens: [
        {
          name: 'Errors',
          id: 2,
          childrens: []
        },
        {
          name: 'trios',
          id: 3,
          childrens: [
            {
              name: 'Brios',
              id: 4,
              childrens:[]
            }
         ]
        },
      ]
    }
  ];
  factorsData: any; //treeData
  selected: number[] = []
  editableTree : {
    id: string;
    name: string,
    checked: boolean,
    childrens: []
  };
  currentEvent: string = 'start do something';
  dndconfig = {
    showActionButtons: true,
    showAddButtons: true,
    showRenameButtons: true,
    showDeleteButtons: true,
    showRootActionButtons: false, // set false to hide root action buttons.
    enableExpandButtons: true,
    enableDragging: true,
    rootTitle: '',
    validationText: 'Enter valid text',
    // minCharacterLength: 6,
    setItemsAsLinks: false,
    setFontSize: 16,
    setIconSize: 13
  };
  ngOnInit() {
      this.authService.autoLogin();
      // this.rasaBot();

      //get editable Tree factors data from JSON-Server watch db.json file

      this.apiService.getEditData().subscribe(res => {
        this.factorsData = res;
      })

  }

  ngOnDestroy() {
    
    // console.log('destroy', this.rasaBot);
    
    
  }

  // rasaBot(){
    
  //   let e = document.createElement("script"),
  //   t = document.head || document.getElementsByTagName("head")[0];
  //   (e.src =
  //   "https://cdn.jsdelivr.net/npm/rasa-webchat@1.0.1/lib/index.js"),
  //   // Replace 1.x.x with the version that you want
  //   (e.async = !0),
  //   (e.onload = () => {
  //     window.WebChat.default(
  //       {
  //         initPayload : "/edit_tree",
  //         customData: { language: "en" },
  //         socketPath: "/socket.io/",
  //         socketUrl: "http://localhost:5005",
  //         title:"EditTree Bot",
  //         onSocketEvent : {
  //           'bot_uttered': () => console.log('the bot said something'),
  //           'connect': () => console.log('connection established'),
  //           'disconnect': () => console.log('Disconnect'),
  //         },
  //         // add other props here
  //       },
  //       null
  //     );
  //   }),
    
  //   t.insertBefore(e, t.firstChild);
  //   // localStorage.clear();

  //   // localStorage.clear();
    
  // }




   //////ngxTreeDnd functions

      onClick(){
          console.log("Clicked")
      }
      onSelectedChange(event){
        console.log("onselected Change");
        
          console.log(event);
      }
      onFilterChange(event){
        
          console.log(event.value);
      }

      onDragStart(event) {
              console.log(event);
      }
      onDrop(event) {
          console.log(event);
      }
      onAllowDrop(event) {
          this.currentEvent = 'on allow drop';
      }
      onDragEnter(event) {
          this.currentEvent = 'on drag enter';
      }
      onDragLeave(event) {
          this.currentEvent = 'on drag leave';
      }
      onAddItem(event) {
              this.currentEvent = 'on add item';
              // console.log(event);
    
              //   console.log(event.parent)
              // console.log(event.element.id);

      }
      onStartRenameItem(event) {
          this.currentEvent = 'on start edit item';
      }
      onFinishRenameItem(event) {
        //////send updated data from here///////
          // console.log('on finish edit item');
          console.log(this.myTree);
          // console.log("Event",event);
          // console.log("new Tree:",this.factorsData);
      
      }
      onStartDeleteItem(event) {
          console.log('start delete');
          
      }
      onFinishDeleteItem(event) {
          console.log('finish delete');
          
      }
      onCancelDeleteItem(event) {
          console.log('cancel delete');
          
      }

    ////ngxTreeDnd functions end
   

    ///Save and Back 

    onBack():void{
      // this.location.back();
      let selections = sessionStorage.getItem('currentSelectionsSet');
      let arrayOfSelections = JSON.parse(selections);
      // for rasa
      // this.router.navigate(['qualiexplore/factors'], { queryParams: { ids: JSON.stringify(arrayOfSelections) } }).then(() => {
      //   window.location.reload();
      // });
      this.router.navigate(['qualiexplore/factors'], { queryParams: { ids: JSON.stringify(arrayOfSelections) } });
  
    }
    onSave(){
      
      // this.apiService.deleteEditData(1).subscribe(res =>{
      //   console.log(res);
      // })
      
      console.log(this.factorsData[0]);
      
      this.apiService.updateEditData(this.factorsData[0], this.factorsData[0].id).subscribe((res) =>
        console.log(res)   
      )


      const str = JSON.stringify(this.factorsData[0]);

      const replaceName = str.replace(/name/g, "text" );
      const replaceChildrens = replaceName.replace(/childrens/g, "children");
      const factorsObj = JSON.parse(replaceChildrens);

      this.apiService.updateFactorsData(factorsObj, factorsObj.id).subscribe((res) =>
        console.log(res)   
      )

      // console.log(factorsObj);

      alert("Data Saved Successfully!!");
      
   
    }


}
