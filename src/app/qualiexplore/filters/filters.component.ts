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

import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, NgZone, AfterContentChecked, AfterViewInit, ViewChildren, QueryList, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { Filter } from './model/filter.model';
import { newFilter } from './model/filter.model';
import { FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service'
import { stringify } from 'querystring';
import { map } from 'rxjs/operators';
import {graphqlApiService} from '../graphqlApi.service'
import { Subscription } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { environment } from 'src/environments/environment'
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.css'],
    providers: []
})

export class FiltersComponent implements OnInit, OnDestroy {
    filters: Filter[] = [];
    newFilters : newFilter[] | any = [];
    selections: number[] = [];
    closeResult: any = '';
    tasks:any = [];
    taskarr=[];
    valid = false;
    pageLoaded : boolean;
    
    allData : Object;

    subscription : Subscription;

    websocketUrl = environment.socketUrlApi;
   
    editableObj: {
      id : string,
      category: string,
      tasks:any[]
    }

    postObj: {
      category: string,
      tasks: [{
        id:number,
        name:string,
        checked:false,
      }]
    }
   
    graphData : any;
    allFiltersInfo = [];

    private selectionsSet: Set<number> = new Set();
    constructor(private modalService: NgbModal, private fb: FormBuilder,private router: Router, private ref: ChangeDetectorRef, private authService: AuthService, private graphqlApi: graphqlApiService, private eref : ElementRef, private route: ActivatedRoute) {

        this.editableObj = {
          id: "",
          category: "",
          tasks: []
        }

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
   @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
   filtersForm:FormGroup;
   editForm:FormGroup;
   isEdit = false;

   isAuthenticated = false
   user: string = null
   updateButton = false
  
   private subscriptions: Subscription[] = [];

   private rasaChatScript: HTMLScriptElement;


   async ngOnInit() {
      
        this.authService.autoLogin(); 

        // QualiExplore bot widget.
       
        this.chatWidget();
    
        this.authService.user.subscribe((user) => {
          this.isAuthenticated = !!user
        })
    
        const userData = JSON.parse(localStorage.getItem('userData'))
        this.user = userData?.username
        if (this.user == 'admin' && this.isAuthenticated) {
          this.updateButton = true
        } else {
          this.updateButton = false
        }

        const previousFilterSelection = sessionStorage.getItem('currentNewFilters');
        console.log("prev Filters :", previousFilterSelection);
        
        const previousSelectionsSet = sessionStorage.getItem('currentSelectionsSet');
        console.log("prev sset :", previousSelectionsSet);
        if (previousFilterSelection !== null && previousSelectionsSet !== null) {
     
            this.selections = JSON.parse(previousSelectionsSet);
            this.selectionsSet = new Set<number>(this.selections);
        }
        
        
        
        //modal filters form
        this.filtersForm = new FormGroup({
            'category': new FormControl(null, Validators.required),
            'tasks': this.fb.array([this.fb.control('')])
          })


        try {
          await this.get_all_filters()
          this.markPrevFilterStatements()
        } catch (error) {
          console.error(error);
        }
       
      
    }

    ngOnDestroy(){
      console.log("Ondestroy Called :");
      setTimeout(() => {
        const chatWidgetContainer = document.querySelector('#rasa-chat-widget-container');
        if (chatWidgetContainer) {
          chatWidgetContainer.remove();
        }
      }, 100);
      
      this.subscriptions.forEach(sub => sub.unsubscribe());
      sessionStorage.removeItem('chat_session')
    }

    markPrevFilterStatements(){
      this.route.queryParams.pipe(
        map(params => params['ids'] ? JSON.parse(params['ids']) : [])
        ).subscribe(ids => {
          console.log("ids :", ids);
          console.log("check :", this.allFiltersInfo);
          this.allFiltersInfo.forEach(filter => {
            filter.tasks.forEach(task => {
              console.log("task :", task);
              
              if (ids.includes(task.id)) {
                task.checked = true;
              }
            });
          });
        })
    }

    chatWidget(){
      this.rasaChatScript = document.createElement('script');
      this.rasaChatScript.src = 'https://unpkg.com/@rasahq/rasa-chat';
      this.rasaChatScript.type = 'application/javascript';
      document.head.appendChild(this.rasaChatScript);
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
    

    showNewFilters(){
   
      this.newFilters = this.allFiltersInfo
      console.log("SNF FUNCTION",this.newFilters);
    
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

    /**
     * Proceed to Step-2 : Factors
     * Store the present state of selected filters in sessionStorage
     */
    proceed() {

        sessionStorage.setItem('currentNewFilters', JSON.stringify(this.newFilters));

        sessionStorage.setItem('currentSelectionsSet', JSON.stringify(this.selections));
     
        this.router.navigate(['qualiexplore/factors'], { queryParams: { ids: JSON.stringify(this.selections) } })

    }

    /**
     * Reset All Filters and previously stored Filters in `sessionStorage`
     */
    reset() {
        sessionStorage.clear();
        this.selections = [];
        this.selectionsSet.clear();
        // this.showNewFilters()
        this.checkboxes.forEach((element) => {
          element.nativeElement.checked = false;
        });
    }

    //Modal functions
    open(content) {
    
        this.modalService.open(content, {ariaLabelledBy: 'popUp', size:'lg', centered: true})
    }
    saveData(){
        const values = this.filtersForm.value;
        console.log("Filtersform Value",values);
        const cats = values.category;
        const taskArr = values.tasks.name;
        taskArr.forEach(element => {
          this.taskarr.push(element);
        });
        
    }
    onAddtask(){
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
        // console.log(this.allFiltersInfo);
        // console.log("All tasks :",this.editableObj.tasks);
        if(this.editableObj.tasks[index]){
       
          let dltId = this.editableObj.tasks[index].id;
          this.subscriptions.push(this.graphqlApi.deleteFilterStatement(dltId).subscribe((res)=>{
            console.log(res);
            this.get_all_filters()
          }))
          // console.log("Deleted ID :", dlt_id)
          
        }
        this.editArr.removeAt(index);
        this.reset()
      }
      

    async postFormData(dataObj) {
      const { category, tasks } = dataObj;
      const filterGroupId = uuid();
      
      try {
          const res = await this.graphqlApi.createFilterGroups(category, filterGroupId).toPromise();
          console.log(res);
      } 
      catch (err) {
          console.error(err);
      }
      
      for (const statement of tasks) {
          const filterStatementId = uuid();
          try {
            const res = await this.graphqlApi.createFilterStatementsForNewGroup(statement, filterStatementId, filterGroupId).toPromise();
            console.log("Statement Creation Res:", res);
            this.get_all_filters();
            } 
          catch (err) {
                console.error(err);
            }
      }
      
      this.filtersForm.reset();
      while(this.formArr.length !== 1){
              this.formArr.removeAt(1)
          }

      
      this.reset()

      let ref = document.getElementById('cancel');
      ref.click();
    }



      /// get all filters data from graph
      async get_all_filters(){
        try {
          this.allFiltersInfo = [];
          const res: any = await this.graphqlApi.getFilterStatements().toPromise();
          res.data.filterGroups.forEach(filterGroup => {
            const groupName = filterGroup.name;
            const existingGroup = this.allFiltersInfo.find(f => f.name === groupName);
            if (existingGroup) {
              filterGroup.filterStatementsBelongsTo.forEach(filterStatement => {
                existingGroup.tasks.push({ id: filterStatement.id, name: filterStatement.text, checked: false });
              });
            } else {
              let tasks = [];
              filterGroup.filterStatementsBelongsTo.forEach(filterStatement => {
                tasks.push({ id: filterStatement.id, name: filterStatement.text, checked: false });
              });
              this.allFiltersInfo.push({ id: filterGroup.id, category: groupName, tasks: tasks });
            }
          });
          this.newFilters = this.allFiltersInfo;
        } catch (error) {
          console.log(error);
        }

      }



    // crud operations on Filters Editable Form using graphql API
      editFormData(data){
   
          // console.log("To edit :",data);
          // console.log("To edit id :", data.id);
          
        
          this.isEdit = true;
          
          let category = '';
          let tasks = new FormArray([]);
          category = data.category;
          // console.log("tasks:", data.tasks);

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
          
          console.log(data);
         
         
          this.editableObj = Object.assign({},data)
          console.log("After assigning data:",this.editableObj);
          
          this.modalService.open(this.editcontent, {ariaLabelledBy: 'popUp', size:'lg', centered: true});
        
    }
      

    deleteData(data){
      // console.log(data);
        if(confirm("Are you sure to delete it ?")){
          this.subscriptions.push(this.graphqlApi.deleteFilterGroups(data.id).subscribe(res => {
            console.log(res);
            this.get_all_filters()
          }))
        }
        this.reset()
    }






  async updateData(dataObj){
    try {
      this.editableObj.category = dataObj.category;
  
      const updateFilterGroupResult = await this.graphqlApi.updateFilterGroup(this.editableObj).toPromise();
      console.log(updateFilterGroupResult);
  
      const updateOrCreateFilterStatementsResult = await this.graphqlApi.updateOrCreateFilterStatements(this.editableObj, dataObj).toPromise();
      console.log(updateOrCreateFilterStatementsResult);
      this.get_all_filters();
    } 
    catch (error) {
      console.error(error);
    }

    this.reset()

    let ref = document.getElementById('cancel');
    ref.click();
  }
  
    
}
