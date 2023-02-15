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
import {graphqlApiService} from '../graphqlApi.service'
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Subscription } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { environment } from 'src/environments/environment'
import { ActivatedRoute } from '@angular/router';
// import { apiService } from '../api.service';
// import { formDataModel } from './data.model';

declare global {
  interface Window {
      WebChat:any;
  }
}


@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.css'],
    providers: [FiltersService]
})

export class FiltersComponent implements OnInit, AfterContentChecked, AfterViewInit, OnDestroy {
    filters: Filter[] = [];
    newFilters : newFilter[] | any = [];
    selections: number[] = [];
    //Modal variables
    closeResult: any = '';
    tasks:any = [];
    taskarr=[];
    valid = false;
    pageLoaded : boolean;
    
    allData : Object;

    subscription : Subscription;

    websocketUrl = environment.socketUrlApi;
   
    // editableObj: {
    //   id : string,
    //   category: string,
    //   tasks: [{
    //     id:string,
    //     name:string,
    //     checked:false,
    //   }]
    // }
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
   
    // Testing Graphql Data

    graphData : any;
    allFiltersInfo = [];



   
    private selectionsSet: Set<number> = new Set();
      constructor(private service: FiltersService, private apiService:ApiService, private modalService: NgbModal, private fb: FormBuilder,private router: Router, private ref: ChangeDetectorRef, private authService: AuthService, private graphqlApi: graphqlApiService, private eref : ElementRef, private route: ActivatedRoute) {
        // this.editableObj = {
        //   id: null,
        //   category: null,
        //   tasks: [{
        //     id: null,
        //     name: null,
        //     checked: null
        //   }]
        // };
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

   ///////
   isAuthenticated = false
   user: string = null
   updateButton = false
  
   private subscriptions: Subscription[] = [];

   private rasaChatScript: HTMLScriptElement;


    ngOnInit() {
        // Get previously selected Filters and Selection Array
        this.authService.autoLogin(); 

        // QualiExplore bot widget.
       
        this.chatWidget();





       

        // Graphql API call
        
        // this.newFilters = this.allFiltersInfo
        // console.log(this.newFilters);
        
        
        
        // Important !!
        // Authentication service should be enabled later
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

        // this.updateButton = true
        const previousFilterSelections = sessionStorage.getItem('currentFilters');
        const previousFilterSelection = sessionStorage.getItem('currentNewFilters');
        const previousSelectionsSet = sessionStorage.getItem('currentSelectionsSet');
        if (previousFilterSelection !== null && previousFilterSelections !== null && previousSelectionsSet !== null) {
            // if Previously interacted then use those values
            this.filters = JSON.parse(previousFilterSelections);
            this.newFilters = JSON.parse(previousFilterSelection);
            // this.allFiltersInfo = JSON.parse(previousFilterSelection)
            this.selections = JSON.parse(previousSelectionsSet);
            this.selectionsSet = new Set<number>(this.selections);
        } else {
            // call the API
            // this.showFilters(); // this one from mongodb
            this.showNewFilters();
            console.log("check");
            
        }
        
        
        //modal form
        this.filtersForm = new FormGroup({
            'category': new FormControl(null, Validators.required),
            // 'tasks': new FormArray([])
            'tasks': this.fb.array([this.fb.control('')])
          })

        // get all filtergroups and statements from neo4j graph

        this.get_all_filters()

   
     
    }

    ngAfterContentChecked() {

      // this.ref.detectChanges();
    
  
    }
    ngAfterViewInit(){

    }
    ngAfterViewChecked(){ 
        // this.ref.detectChanges();
        
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
    
    chatWidget(){

      this.rasaChatScript = document.createElement('script');
      this.rasaChatScript.src = 'https://unpkg.com/@rasahq/rasa-chat';
      this.rasaChatScript.type = 'application/javascript';
      document.head.appendChild(this.rasaChatScript);
      
    }

    // this rasaBot is replaced by chatwidget
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
    //         initPayload : "/filters",
    //         customData: { language: "en" },
    //         socketPath: "/socket.io/",
    //         socketUrl: "http://localhost:5005",
    //         title:"Welcome",
    //         params: {"storage": "session"},
    //         inputTextFieldHint: "Type your message here.."
           
    //         // add other props here
    //       },
    //       null
    //     );
    //   }),
    //   t.insertBefore(e, t.firstChild);
    // }

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
    // async showFilters() {
    //   // this.service.getQuestions().then((data: any) => {
    //   //     this.filters = data.categories;
    //   // });
  
    //   let filtersObs: Observable<any>
    //   filtersObs = this.service.getQuestions()
    //   filtersObs.subscribe((data: any) => {
    //     console.log(data);
        
    //     this.filters = data.data.filters[0].categories
    //   })
    // }

    showNewFilters(){
      // this.apiService.getData().subscribe((res: any) => {
      //   this.newFilters = res;
      //   console.log("newFilters",this.newFilters);
      // })
      //this.newFilters = this.allFiltersInfo
      this.newFilters = this.allFiltersInfo
      console.log("SNF FUNCTION",this.newFilters);


      ///
      
      
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
        // store the current filters to localStorage
        // sessionStorage.setItem('currentFilters', JSON.stringify(this.filters));
        sessionStorage.setItem('currentNewFilters', JSON.stringify(this.newFilters));

        sessionStorage.setItem('currentSelectionsSet', JSON.stringify(this.selections));
        //for rasa
        // this.router.navigate(['qualiexplore/factors'], { queryParams: { ids: JSON.stringify(this.selections) } }).then(() => {
        //   window.location.reload();
        // });
        this.router.navigate(['qualiexplore/factors'], { queryParams: { ids: JSON.stringify(this.selections) } })

    }

    /**
     * Reset All Filters and previously stored Filters in `sessionStorage`
     */
    reset() {
        sessionStorage.clear();
        this.selections = [];
        this.selectionsSet.clear();
        // this.showNewFilters();

        // this.get_all_filters();

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
        // // console.log(this.allFiltersInfo);
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

      }
      

      
      ////Post and Update form data Using JSON server - {Need To be updated by GraphQl server}
      // nedded for new filter Group creation
    //   postFormData(dataObj){
    //     const { category, tasks } = dataObj;
    //     const filterGroupId = uuid()
    //     // console.log(filterGroupId);
        
    //     this.subscriptions.push(this.graphqlApi.createFilterGroups(category,filterGroupId).subscribe(res => {
    //       console.log(res);
    //       // this.get_all_filters();
    //     }))

    //     for (const statement of tasks) {
    //       const filterStatementId = uuid()
    //       console.log(filterStatementId);
    //       console.log(filterGroupId);
          
    //       this.subscriptions.push(this.graphqlApi.createFilterStatementsForNewGroup(statement, filterStatementId, filterGroupId).subscribe(res => {
    //         console.log("Statement Creation Res:",res);
    //         this.get_all_filters();
    //       }))
          
    //     }
    //     this.filtersForm.reset();
    //     while(this.formArr.length !== 1){
    //         this.formArr.removeAt(1)
    //     }
    //     let ref = document.getElementById('cancel');
    //     ref.click();      
    // }

    // new version of POST FORM

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
      let ref = document.getElementById('cancel');
      ref.click();
    }

      //get All data from JSON SERVER
      // getAll(){
      //   this.apiService.getData().subscribe((res) => {
          
      //       this.allData = res;
      //       // this.newFilters = this.allData;
      //       // this.newFilters = res;
            
      //   })
      // }

      /// get all filters data from graph
       get_all_filters(){
        
        this.allFiltersInfo  = []
        this.subscriptions.push(this.graphqlApi.getFilterStatements().subscribe((res:any) => {
          // console.log(res);
            res.data.filterGroups.forEach(filterGroup => {
            // console.log(filterGroup);
            const groupName = filterGroup.name;
            const existingGroup = this.allFiltersInfo.find(f => f.name === groupName);
            if (existingGroup) {
                filterGroup.filterStatementsBelongsTo.forEach(filterStatement => {
                    existingGroup.tasks.push({id : filterStatement.id, name : filterStatement.text, checked:false });
                });
            } else {
                let tasks = [];
                filterGroup.filterStatementsBelongsTo.forEach(filterStatement => {
                    tasks.push({id : filterStatement.id, name : filterStatement.text, checked:false });
                });
                this.allFiltersInfo.push({ id:filterGroup.id, category: groupName, tasks: tasks });
            }
           }
          );
          
          this.newFilters = this.allFiltersInfo
        }));
      }



    //Crud operations on Filters Editable Form using Graphql Api
    
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
    }


  //   updateData(dataObj){
  //     // console.log("DataObj Form value:",dataObj);
  //     // console.log("EditableObj:",this.editableObj);
  //     this.editableObj.category = dataObj.category

  //     console.log("Editable Obj tasks value:",this.editableObj.tasks);
  //     console.log("DataObj tasks value:",dataObj.tasks);
      
  //     this.subscriptions.push(this.graphqlApi.updateFilterGroup(this.editableObj).subscribe((res) => {
  //       console.log(res);
  //       // this.allFiltersInfo = []
  //       // this.get_all_filters()
  //     }))
      
  //     this.subscriptions.push(this.graphqlApi.updateOrCreateFilterStatements(this.editableObj, dataObj).subscribe( res => {
  //       console.log(res)
  //       this.get_all_filters()
  //     }))
  // }

  // new version of updating data

  async updateData(dataObj){
    try {
      this.editableObj.category = dataObj.category;
  
      const updateFilterGroupResult = await this.graphqlApi.updateFilterGroup(this.editableObj).toPromise();
      console.log(updateFilterGroupResult);
  
      const updateOrCreateFilterStatementsResult = await this.graphqlApi.updateOrCreateFilterStatements(this.editableObj, dataObj).toPromise();
      console.log(updateOrCreateFilterStatementsResult);
      this.get_all_filters();
    } catch (error) {
      console.error(error);
    }
  }
  
    
}
