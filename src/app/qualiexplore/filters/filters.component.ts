/**
 * Copyright 2020
 * University of Bremen, Faculty of Production Engineering, Badgasteiner Straße 1, 28359 Bremen, Germany.
 * In collaboration with BIBA - Bremer Institut für Produktion und Logistik GmbH, Bremen, Germany.
 * Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, NgZone, AfterContentChecked, AfterViewInit} from '@angular/core';
import { FiltersService } from './filters.service';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { Filter } from './model/filter.model';
import { newFilter } from './model/filter.model';
import { FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service'
import { stringify } from 'querystring';


// import { apiService } from '../api.service';
// import { formDataModel } from './data.model';



@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.css'],
    providers: [FiltersService]
})

export class FiltersComponent implements OnInit, AfterContentChecked, AfterViewInit {
    filters: Filter[] = [];
    newFilters : newFilter[] = [];
    selections: number[] = [];
    //Modal variables
    closeResult: any = '';
    tasks:any = [];
    taskarr=[];
    valid = false;
    pageLoaded : boolean;

    allData : Object;
   
    editableObj: {
      id : number,
      category: string,
      tasks: [{
        id:number,
        name:string,
        checked:false,
      }]
    }
    postObj: {
      category: string,
      tasks: [{
        id:number,
        name:string,
        checked:false,
      }]
    }
   

   
    private selectionsSet: Set<number> = new Set();
      constructor(private service: FiltersService, private apiService:ApiService, private modalService: NgbModal, private fb: FormBuilder,private router: Router, private ref: ChangeDetectorRef) {
        this.editableObj = {
          id: null,
          category: null,
          tasks: [{
            id: null,
            name: null,
            checked: null
          }]
        };
        this.postObj = {
          
          category: null,
          tasks: [{
            id: null,
            name: null,
            checked: null
          }]
        }
    }
    @ViewChild('content', {static: true}) content: ElementRef;
    @ViewChild('editcontent', {static: true}) editcontent: ElementRef;
    
    filtersForm:FormGroup;
    editForm:FormGroup;
    isEdit = false;
  

    ngOnInit() {
        // Get previously selected Filters and Selection Array
        // this.showNewFilters();
     
        const previousFilterSelections = sessionStorage.getItem('currentFilters');
        const previousFilterSelection = sessionStorage.getItem('currentNewFilters');
        const previousSelectionsSet = sessionStorage.getItem('currentSelectionsSet');
        if (previousFilterSelection !== null && previousFilterSelections !== null && previousSelectionsSet !== null) {
            // if Previously interacted then use those values
            this.filters = JSON.parse(previousFilterSelections);
            this.newFilters = JSON.parse(previousFilterSelection);
            this.selections = JSON.parse(previousSelectionsSet);
            this.selectionsSet = new Set<number>(this.selections);
        } else {
            // call the API
            this.showFilters();
            this.showNewFilters();
        }
       
        
        
        //modal form
        this.filtersForm = new FormGroup({
            'category': new FormControl(null, Validators.required),
            // 'tasks': new FormArray([])
            'tasks': this.fb.array([this.fb.control('')])
          })

        this.getAll(); //get all filters data from json-server
        
    }

    ngAfterContentChecked() {

      this.ref.detectChanges();
    
  
    }
    ngAfterViewInit(){
      this.pageLoaded = true;
     
    }
    ngAfterViewChecked(){ 
        this.ref.detectChanges();
        
    }

    isEditFormValid(): boolean {
      if (this.pageLoaded) {
        return this.editForm.valid;
      } else {
        return false;
      }
    }
    isFiltersFormValid(): boolean {
      if (this.pageLoaded) {
        return this.filtersForm.valid;
      } else {
        return false;
      }
    }
    
    /**
     * API call to Filter Static JSON
     */
    // showFilters() {
    //     this.service.getQuestions().then((data: any) => {
    //         this.filters = data.categories;
    //     });
    // }
    async showFilters() {
      // this.service.getQuestions().then((data: any) => {
      //     this.filters = data.categories;
      // });
  
      let filtersObs: Observable<any>
      filtersObs = this.service.getQuestions()
      filtersObs.subscribe((data: any) => {
        this.filters = data.data.filters[0].categories
      })
    }

    showNewFilters(){
      this.apiService.getData().subscribe((res: any) => {
        this.newFilters = res;
        console.log("newFilters",this.newFilters);
        
      })
    }

    /**
     * Add the Selection to a Set if checked/ Remove the Selection from a Set if unchecked
     * @param id number
     * @param event Event Trigger from HTML Input Element
     */
    changeCheck(id: number, event: any) {
        (event.target.checked) ? this.selectionsSet.add(id) : this.selectionsSet.delete(id);
        this.selections = Array.from(this.selectionsSet);
    }
    // changeCheckNew(id: number, event: any) {
    //     (event.target.checked) ? this.selectionsSet.add(id) : this.selectionsSet.delete(id);
    //     this.selections = Array.from(this.selectionsSet);
    // }

    /**
     * Proceed to Step-2 : Factors
     * Store the present state of selected filters in sessionStorage
     */
    proceed() {
        // store the current filters to localStorage
        sessionStorage.setItem('currentFilters', JSON.stringify(this.filters));
        sessionStorage.setItem('currentNewFilters', JSON.stringify(this.newFilters));
        sessionStorage.setItem('currentSelectionsSet', JSON.stringify(this.selections));
        this.router.navigate(['qualiexplore/factors'], { queryParams: { ids: JSON.stringify(this.selections) } });

    }

    /**
     * Reset All Filters and previously stored Filters in `sessionStorage`
     */
    reset() {
        sessionStorage.clear();
        this.selections = [];
        this.selectionsSet.clear();
        this.showNewFilters();
        this.showFilters();
    }

    //Modal functions
    open(content) {
    
        this.modalService.open(content, {ariaLabelledBy: 'popUp', size:'lg', centered: true})
    }
      saveData(){
        const values = this.filtersForm.value;
        console.log(values);
        const cats = values.category;
        const taskArr = values.tasks.name;
        taskArr.forEach(element => {
          this.taskarr.push(element);
        });
        
      }
      onAddtask(){
        // const control = new FormControl(null, Validators.required);
        // const control = new FormControl(null,Validators.required);
        const control = this.fb.control('');
        this.formArr.push(control);
      }
      onEditAddtask(){
       
        this.editArr.push(this.fb.group({
          taskgroup: new FormControl("")
        }));
        
      }
      get formArr() {
        return this.filtersForm.get('tasks') as FormArray;
      }

      get editArr(){
        return this.editForm.get('tasks') as FormArray;
      }
     
      deleteFields(index:number){
        this.formArr.removeAt(index);
      }
      deleteEditFields(index:number){
        this.editArr.removeAt(index);
      }
      

      
      ////Post and Update form data Using JSON server - {Need To be updated by GraphQl server}

      postFormData(dataObj){
        this.valid = true;
        this.postObj.category = dataObj.category;
        let tasks = dataObj.tasks;
        // let d= new Date().getTime();
        const array = [1, 20, 40];
        // get random index value
        const randomIndex = Math.floor(Math.random() * array.length);
        // get random item
        let item = array[randomIndex];

      
        let tempArr:any = []
        for(let i = 0 ; i < dataObj.tasks.length; i++ ){
          
          tempArr.push({id:item + i, name:tasks[i], checked:false}); 
          
        }
        
        this.postObj.category = dataObj.category;
        this.postObj.tasks = tempArr;
        console.log(this.postObj);
        
        

          this.apiService.postData(this.postObj).subscribe((res:any)=>{
            console.log(res.id); ///take a look here
            this.getAll(); 
            alert(`New Feature Added Successfully!`);
          })  
          
          this.filtersForm.reset();
          while(this.formArr.length !== 1){
            this.formArr.removeAt(1)
          }
          let ref = document.getElementById('cancel');
          ref.click();      
      }

      //get All data from API
      getAll(){
        this.apiService.getData().subscribe((res) => {
          
            this.allData = res;
        })
      }
      // post form data with unique id

      // postFormData(dataObj){
      //   this.valid = true;
      //   console.log(dataObj);
      //   let dataModel = {
      //     categories: [
      //       {
      //       name: "Goal",
      //       labels: [
      //         {
      //         id: 1,
      //         name:"I want something",
      //         checked: false
      //         }]
      //     }]
      //   }
      //   let d= new Date().getTime();
      //   for(let item of dataModel.categories){
      //     item.name = dataObj.category
      //     for(let i=0; i< dataObj.tasks.length; i++){
      //       item.labels.push({
      //         id: d+i,
      //         name: dataObj.tasks[i],
      //         checked: false
      //       })
      //     }
      //   }
        
      //   this.service.postData(dataModel.categories).subscribe((res:any)=>{
      //       console.log(res); ///take a look here
      //       this.getAll(); 
      //       alert(`New Feature Added Successfully!`);
      //   })  
          
      //   this.filtersForm.reset();
      //   let ref = document.getElementById('cancel');
      //   ref.click();      
      // }


    //Crud operations on Filters Editable Form using Json-Server
    
      editFormData(data){
        //edit data here
        // this.initEditForm();
          this.isEdit = true;
          
          let category = '';
          let tasks = new FormArray([]);
          category = data.category;
          console.log("tasks:", data.tasks);

          

          for(let task of data.tasks){
                tasks.push(
                  new FormGroup({
                    'taskgroup' : new FormControl(task.name)
                  })
                );
              }
          this.editForm = new FormGroup({
              'category' : new FormControl(category),
              'tasks': tasks
          });
          this.editableObj.id = data.id;
          this.modalService.open(this.editcontent, {ariaLabelledBy: 'popUp', size:'lg', centered: true});
        
    }
      
    deleteData(data){
        if(confirm("Are you sure to delete it ?")){
          return this.apiService.deleteData(data).subscribe(()=>{
            this.getAll();
          })
      }
    }

    updateData(dataObj){

      console.log(dataObj);
      
      this.isEdit = !this.isEdit;
      let tasks = dataObj.tasks;
      let id = this.editableObj.id;
      let taskarr = this.editableObj.tasks;
      // let d= new Date().getTime();
      const array = [1, 20, 40];
      // get random index value
      const randomIndex = Math.floor(Math.random() * array.length);
      // get random item
      let item = array[randomIndex];


     
      
      let tempArr:any = []
      for(let i = 0 ; i < dataObj.tasks.length; i++ ){
        let mydata = tasks[i].taskgroup;
        tempArr.push({id:item + i, name:tasks[i].taskgroup, checked:false}); 
      }
      // console.log(tempArr);
      
      
      this.editableObj.category = dataObj.category;
      this.editableObj.tasks = tempArr;
      // console.log(this.editableObj);
      
      this.apiService.editData(this.editableObj, this.editableObj.id).subscribe(()=>{
        this.getAll();
      })
      let temp = document.getElementById('cancel');
      temp.click();
      alert("Data updated successfully");
    }

    
}
