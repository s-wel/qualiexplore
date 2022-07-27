/**
 * Copyright 2020
 * University of Bremen, Faculty of Production Engineering, Badgasteiner Straße 1, 28359 Bremen, Germany.
 * In collaboration with BIBA - Bremer Institut für Produktion und Logistik GmbH, Bremen, Germany.
 * Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *      http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

 import { Component, OnInit } from '@angular/core';
 import { ActivatedRoute, Router } from '@angular/router';
 import { FactorsService } from './factors.service';
 import { ApiService } from '../api.service';
 import { TreeviewConfig, TreeviewItem, TreeItem } from 'ngx-treeview';
 import { Location } from '@angular/common';
 import { Filter } from '../filters/model/filter.model';
 import { newFilter } from '../filters/model/filter.model';
 import { FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
 import { AuthService } from '../auth/auth.service'
 import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
 import { Observable } from 'rxjs'
 
 @Component({
     selector: 'app-factors',
     templateUrl: './factors.component.html',
     styleUrls: ['./factors.component.css'],
     providers: [FactorsService]
 })
 
 export class FactorsComponent implements OnInit {
     config = TreeviewConfig.create({
         hasAllCheckBox: false,
         hasFilter: false,
         hasCollapseExpand: false,
         decoupleChildFromParent: false,
         maxHeight: 750
     });
     item : any;
     items: TreeviewItem[];
     value: any;
     valueName = '';
     selectedFactor: TreeItem;
     selected: number[] = [];
     totalHighlightedFactors = 0;
     totalResolvedFactors = 0;
     proceedButtonDisabled = false;
     selectedFilterDetails = [];
     collapseSelectedFilters = true;

     ///
   

     //form
     editForm:FormGroup;
     allData : any;
     allTasks = [];

     ///
     isAuthenticated = false
     user: string = null
     updateButton = false
 
     constructor(
       private service: FactorsService,
       private route: ActivatedRoute,
       private router: Router,
       private modalService : NgbModal,
       private apiService : ApiService,
       private authService: AuthService,
       private location : Location
       ) {
     }
 
     ngOnInit() {
         
         this.authService.autoLogin();
         ////
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

        /////

      
         this.route.queryParams.subscribe(params => {
            //  console.log(params);
          
             this.selected = JSON.parse(params.ids);
            //  console.log(this.selected);
             
 
             // Display Logic to show selected filters from Step - 1
             // as opposed to IDs
             this.selected.forEach((id) => {
                const currentFiltersFromStep1: newFilter[] = JSON.parse(
                  sessionStorage.getItem('currentNewFilters'),
                )
                currentFiltersFromStep1.forEach((filter) => {
                  filter.tasks.forEach((label) => {
                    if (label.id === id) {
                      this.selectedFilterDetails.push({
                        name: label.name,
                        parent: filter.category,
                      })
                    }
                  })
                })
              })
            //   let factorsObs: Observable<any>;
            //   factorsObs = this.service.getFactors()
            //   factorsObs.subscribe((data: any) => {
            //     console.log("FactorsData:", data.data.factors[0])
            //     const data1 = JSON.parse(JSON.stringify(data))
            //     this.items = this.parseTree([new TreeviewItem(data1.data.factors[0])])
            //     this.countHighlightedFactors(this.items)
            //   })
              //////////////////
              this.apiService.getFactorsData().subscribe((res) => {                
                    this.item = res[0];
                    // console.log(this.item);
                    this.items = this.parseTree([new TreeviewItem(this.item)]);
                    this.countHighlightedFactors(this.items);
               });

              //  this.service.getFactors()
              //  .then((items: any) => {
              //      console.log(items);
                
              //      this.items = this.parseTree([new TreeviewItem(items)]);
              //      this.countHighlightedFactors(this.items);
              //  });
         });

        //get all the filters from json-server

        this.apiService.getData().subscribe(res => {
            this.allData = res;
            
            for(let elem of this.allData){
                for(let item of elem.tasks){
                    // console.log(item);
                    
                    this.allTasks.push(item); //item.name
                }  
            }
              
            
         })
     }
 
     /**
      * Selected Factor information
      * @param item selected factor from the ngx-treeview
      */
     select(item: TreeItem) {
         // console.log(item);

        this.selectedFactor = item;
        //  console.log(item);
        //  console.log(this.selectedFactor.text);
        //  console.log(this.selectedFactor.checked);
        this.proceedButtonDisabled = false;
     }
 
     /**
      * When user presses the Proceed button in the Card (right-side)
      * @param selectedFactor The selected factor from `select`
      */
     markRead(selectedFactor: TreeItem) {
         selectedFactor.checked = true;
         if (selectedFactor.value.highlighted) {
             if (this.totalResolvedFactors >= this.totalHighlightedFactors) { 
                 // If user clicks factors other than Highlighted Factors
                 // show the progress to be 100%
                 this.totalResolvedFactors = this.totalHighlightedFactors;
             } else {
                 this.totalResolvedFactors++;
             }
         }
     }
 
     /**
      * RegEx check if the link string is a URL or DOI
      * @param link selected factor's array of string under `sources` key
      */
     isUrl(link: string): boolean {
         const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
             '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
             '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
             '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
             '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
             '(\\#[-a-z\\d_]*)?$', 'i');
         // console.log(pattern.test(link));
         return !!pattern.test(link);
     }
 
     /**
      * Recursive Function to calculate Highlighted factors based on IDs from Step-1
      * @param factors incoming information for ngx-treeview
      */
     countHighlightedFactors(factors: TreeviewItem[]) {
         factors.forEach(factor => {
            // if(factor.value === undefined){
            //     Object.assign(factor, {checked : false}, {value : {label_ids : [1,2,3,4], source:["https://www.sltinfo.com/the-semantic-problem/"], description:"This problem is a problem of linguistic processing. It relates to the issue of how spoken utterances are understood and, in particular, how we derive meaning from combinations of speech sounds"}});
            //     // console.log(factor)
            //     // return factor;
            //  }
             if (factor.value !== null) {
                 if (factor.value.highlighted) {
                     this.totalHighlightedFactors++;
                 }
             }
            
             if (factor.children !== undefined) {
                 this.countHighlightedFactors(factor.children);
             }
         });
     }
 
     /**
      * Recursion Function to highlight relevant factors based on IDs from Step-1
      * @param factors Response from API. Recursive JSON
      */
      // parseTree(factors: TreeviewItem[]): TreeviewItem[] {
      //   factors.forEach((factor: TreeviewItem) => {
      //     if (factor.value !== null && factor.value.labelIds !== undefined) {
      //       const labels: number[] = factor.value.labelIds
      //       labels.forEach((label) => {
      //         if (this.selected.findIndex((l) => l === label) > -1) {
      //           factor.value.highlighted = true
      //           factor.value.class = 'fas fa-flag'
      //         }
      //       })
      //     }
      //     if (factor.children !== undefined) {
      //       this.parseTree(factor.children)
      //     }
      //   })
      //   return factors
      // }
      parseTree(factors: TreeviewItem[]): TreeviewItem[] {
        factors.forEach((factor: TreeviewItem) => {
            // if(factor.value === undefined){
                
            //     return factor;
                
            // }
            // //////
            if(factor.value === undefined){

                const array = [60,70,80,90,21,41];
                // get random index value
                const randomIndex = Math.floor(Math.random() * array.length);

                let emp = []
                let i = 1;
                while(i<=6){
                    emp.push(array[randomIndex] + i);
                    i++;
                }
                // console.log("emp arr:", emp);
                Object.assign(factor, {checked : false}, {value : {label_ids : emp , source:["https://www.sltinfo.com/the-semantic-problem/"], description:"This problem is a problem of linguistic processing. It relates to the issue of how spoken utterances are understood and, in particular, how we derive meaning from combinations of speech sounds"}});
                console.log(factor)
                // return factor;
            }
             ////
            if (factor.value !== null && factor.value.label_ids !== undefined) {
                const labels: number[] = factor.value.label_ids;
                labels.forEach(label => {
                    if (this.selected.findIndex(l => l === label) > -1) {
                        factor.value.highlighted = true;
                        factor.value.class = 'fas fa-flag';
                    }
                });
            }
           
            if (factor.children !== undefined) {
                this.parseTree(factor.children);
            }
        });
        return factors;
    }
     
    //Navigate back to Step-1 if new filters needed
    
     backToStep1() {
         sessionStorage.clear(); // for clear
         this.router.navigate(['qualiexplore/filters']);
     }

    
    //Navigate to the editable tree to create new child

     onEditTree(){
        this.router.navigate(['qualiexplore/edit'])
     }

     //Open Modal Service

     open(content) {
        this.modalService.open(content, {ariaLabelledBy: 'popUp', size:'lg', centered: true})
        let description = '';
        let source = '';
        let list = [];
        if(this.selectedFactor !== undefined){
             description = this.selectedFactor.value.description;
            for(let elem of this.selectedFactor.value.source){
                source = elem;   
            }
        }
        // if(this.selectedFactor === undefined){
        //      description = '';
        //      source = '';
        // }

        this.editForm = new FormGroup({
            'description' : new FormControl(description),
            'source': new FormControl(source)
        });  
          
     }
     //update form Data
     updateData(data){
        console.log(data);
        ///update logic goes here
        let ref = document.getElementById('cancel');
        ref.click();
     }
     
 }
 