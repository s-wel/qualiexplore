import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditTreeService } from './edit-tree.service';
import { Location } from '@angular/common';
import { ApiService } from '../api.service';
import { editableTree } from './model/edit-tree.model';
import { AuthService } from '../auth/auth.service'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-edit-tree',
  templateUrl: './edit-tree.component.html',
  styleUrls: ['./edit-tree.component.css']
})
export class EditTreeComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router, private service : EditTreeService, private apiService : ApiService, private location: Location,  private authService: AuthService, ) { 
      this.editableTree = {
        id: null,
        name: null,
        checked: false,
        childrens: []
      }
  }
  // myTree = [
  //   {
  //     name: 'Platform Information Quality',
  //     id: 1,
  //     childrens: [
  //       {
  //         name: 'Errors',
  //         id: 2,
  //         childrens: []
  //       }
  //     ]
  //   }
  // ];
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
      

  //get editable Tree factors data from JSON-Server watch db.json file

      this.apiService.getEditableFactorsData().subscribe(res => {
        this.factorsData = res;
        
      })

  }


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
          console.log('on finish edit item');
          console.log(event);
          // for(let elem of this.myTree){

          //    if(elem.name === event.parent.name){
          //       elem.childrens.push({name:event.element.name, id: event.element.id, childrens:[]});
          //    }
          //    if(elem.childrens.length!==0){
          //      for(let item of elem.childrens){
          //         console.log(item);
          //      }
          //    }
          
          // }
        
        
        
        //  event.parent.childrens.push(event.element);
          console.log(event.parent.childrens);

        //  for(let item of event.parent.childrens){
        //       console.log(item);
          
        // }
        // this.editableTree.id = event.element.id;
    
          // console.log(event.element.name);
          // this.editableTree.name = event.element.name;
          // this.editableTree.id = event.element.id;
      
          
          // console.log(event);

          // this.apiService.postFactorsData(this.editableTree).subscribe((res) =>{
          //   console.log(res);
          // })

          
          
        
          
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

    onBack(){
      this.location.back();
    }
    onSave(){
      //   for(let elem of this.myTree){
      //       this.apiService.postdummyTree(elem).subscribe((res) =>{
      //         console.log(res);
      //     }) 
      // }

      // this.apiService.getdummyTree().subscribe((item:any) => {
      //     console.log(item);})
      console.log("Save Data");
     
    }

}
