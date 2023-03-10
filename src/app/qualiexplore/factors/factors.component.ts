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
 import { TreeviewConfig, TreeviewItem, TreeItem } from 'ngx-treeview';
 import { Location } from '@angular/common';
 import { Filter } from '../filters/model/filter.model';
 import { newFilter } from '../filters/model/filter.model';
 import { FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
 import { AuthService } from '../auth/auth.service'
 import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
 import { Observable, Subscription } from 'rxjs'
 import {graphqlApiService} from '../graphqlApi.service'
 import { concatMap } from 'rxjs/operators';
 
 
 @Component({
     selector: 'app-factors',
     templateUrl: './factors.component.html',
     styleUrls: ['./factors.component.css'],
     providers: []
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
     factorsData = [];
     value: any;
     valueName = '';
     selectedFactor: TreeItem;
     selected: number[] = [];
     totalHighlightedFactors = 0;
     totalResolvedFactors = 0;
     proceedButtonDisabled = false;
     selectedFilterDetails = [];
     collapseSelectedFilters = true;
     selections : number[] = [];
     private selectionsSet: Set<number> = new Set();

     editForm:FormGroup;
     allData : any;
     allFS : any
     allTasks = [];

     isAuthenticated = false
     user: string = null
     updateButton = false

     isCheckboxChanged = false;

     
     constructor(private route: ActivatedRoute, private router: Router, private modalService : NgbModal, private authService: AuthService, private location : Location, private graphqlApi: graphqlApiService) {
    // Treeview Manual Approach -- maybe used later on ther page
    //     interface Data {
    //         lifeCyclePhases: LifeCyclePhase[];
    //       }
          
    //       interface LifeCyclePhase {
    //         name: string;
    //         id: string;
    //         qualityCharacteristicsContributesTo: QualityCharacteristic[];
    //       }
          
    //       interface QualityCharacteristic {
    //         name: string;
    //         id: string;
    //         description: string;
    //         qualityFactorsContributesTo: QualityFactor[];
    //       }
          
    //       interface QualityFactor {
    //         name: string;
    //         id: string;
    //         description: string;
    //       }

    }
    
     private subscriptions: Subscription[] = [];
     ngOnInit() {
         
    
         this.authService.autoLogin();

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
   


         this.route.queryParams.subscribe(params => {
          
          
             this.selected = JSON.parse(params.ids);
             console.log("SELECTED IDS :",this.selected);
             console.log("CNF :",sessionStorage.getItem('currentNewFilters'));
             
 
             // Display Logic to show selected filters from Step - 1
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

            // console.log("SF DETAILS :", this.selectedFilterDetails);
       
            this.getAllData()
          
         });

        //get all filter statements from graphql

        this.subscriptions.push(this.graphqlApi.getAllFilterStatementswithID().subscribe((res:any) =>{
            this.allFS = res.data.filterStatements
        }))
      
    }


    ngOnDestroy(){
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    // get all tree data 

    getAllData(){
        this.subscriptions.push(this.graphqlApi.getLifeCyclePhases().subscribe((res:any) => {      
            console.log(res);
            
            let data = res.data;
            // converting response as ngx-treeview json format
            const convertToNewFormat = (obj: any): any => {
                const result: any = {};
              
                if (obj.name) result.text = obj.name;
                if (obj.id) {
                    result.id = obj.id;
                    result.checked = false;
                }

                // console.log(obj.name, obj.id);
              
                if (obj.qualityCharacteristicsContributesTo) {
                    result.children = [];
                    obj.qualityCharacteristicsContributesTo.forEach((item: any) => {
                        result.children.push(convertToNewFormat(item));
                    });
                }

             

                if (obj.qualityFactorsContributesTo) {
                    result.children = [];
                    obj.qualityFactorsContributesTo.forEach((item: any) => {
                        result.children.push(convertToNewFormat(item));
                    });
                }


                result.value = {};

                if (obj.description) result.value.description = obj.description;
                if (obj.relevantForFilterStatements){
                    let ids = []
                    // console.log("RFS :",obj.relevantForFilterStatements);
                    for (const elem of obj.relevantForFilterStatements) {
                        console.log("Check :",elem.text);
                        
                        ids.push(elem.id)
                    }
                    // console.log("Label_IDS :", ids);
                    result.value.label_ids = ids 
                }
            
           

                if (obj.sources) {
                    result.value.source = [obj.sources]
                }
                // else {
                //     result.value.source = []
                // };        

                if (obj.id) result.value.id = obj.id;
                return result;
              };

              const result: any = {"text": "Platform information quality",  "children": []};

              data.lifeCyclePhases.forEach((item: any) => {
                const converted = convertToNewFormat(item);
                // console.log("Converted :", converted);
                result.children.push(converted)
              });
           
            this.item = result

            console.log("Check The converted Json:", this.item);
            this.items = this.parseTree([new TreeviewItem(this.item)])
            this.countHighlightedFactors(this.items);


       }));
    }

     selection(item){
        console.log(item.name, item.id);
        
     }

    changeCheck(id: number, event: any) {
        console.log("Label Ids ",this.selectedFactor.value.label_ids);
        this.isCheckboxChanged = true;
        this.selectionsSet.clear();
    
        // Add checked checkboxes to the selections set
        for(let i in this.selectedFactor.value.label_ids){
            let num = this.selectedFactor.value.label_ids[i]; 
            this.selectionsSet.add(num);
        }
        if(event.target.checked) {
            this.selectionsSet.add(id);
        } else {
            this.selectionsSet.delete(id);
        }
    
        // Update label_ids array based on the selections set
        this.selectedFactor.value.label_ids = [];
        if (this.selectionsSet.size > 0) {
            this.selectedFactor.value.label_ids = Array.from(this.selectionsSet);
        }
        
        // console.log("Selections:",this.selections);
        // console.log("SelectedFactor:",this.selectedFactor.value.label_ids);
    }

     ///
 
     /**
      * Selected Factor information
      * @param item selected factor from the ngx-treeview
      */
    //  select(item: TreeItem) {
     select(item) {
         // console.log(item);
         console.log("Item : ",item);
         this.selectedFactor = item
         console.log('Selected Factor:',this.selectedFactor);
         if(this.selectedFactor.value.highlighted == undefined){
            this.proceedButtonDisabled = true
         }else{
            this.proceedButtonDisabled = false
         }
         //console.log("select :",this.selectedFactor.value.highlighted);
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
      parseTree(factors: TreeviewItem[]): TreeviewItem[] {
        
        factors.forEach((factor: TreeviewItem) => {
            
            if(factor.value === undefined){

                Object.assign(factor, {checked : false}, {value : {label_ids : [] , source:["Please update the source"], description:" Please update the description"}});
                console.log(factor)
               
            }
             ////
            if (factor.value !== null && factor.value.label_ids !== undefined) {
                const labels: number[] = factor.value.label_ids;
                console.log("label_ids :", labels);
                console.log("Selected Ids:", this.selected);
                
                
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
        let selections = sessionStorage.getItem('currentSelectionsSet');
        let arrayOfSelections = JSON.parse(selections);
        this.router.navigate(['qualiexplore/filters'], { queryParams: { ids: JSON.stringify(arrayOfSelections) } });
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
        let id:any;
        let list = [];
        console.log("Form Open :",this.selectedFactor);
        
        // if(this.selectedFactor !== undefined){
        //     description = this.selectedFactor.value.description;
        //     id = this.selectedFactor.value.id;
        //     for(let elem of this.selectedFactor.value.source){
        //         source = elem;
                
        //     }
        // }
        if(this.selectedFactor){
            id = this.selectedFactor.value.id
        }

        if(this.selectedFactor.value.description){
            description = this.selectedFactor.value.description
        }

        if(this.selectedFactor.value.source){
            for(let elem of this.selectedFactor.value.source){
                source = elem;   
            }
        }

        this.editForm = new FormGroup({
            'description' : new FormControl(description),
            'source': new FormControl(source),
            'id' : new FormControl(id),
        });  
          
     }


     //update factors
    parseFactors(factors) {
        factors.forEach((factor) => {
            
            console.log(factor);
            console.log(this.selectedFactor);
            
        
            if(factor.text == this.selectedFactor.text){

        
                Object.assign(factor, {checked : false}, {value : {label_ids : this.selections , source:[this.editForm.value.source], description:this.editForm.value.description}});
                // console.log(factor)
                // return factor;
            }
        
           
            if (factor.children !== undefined) {
                this.parseFactors(factor.children);
            }
        });
        return factors;
    }

    getLcIds() {
        return new Promise((resolve, reject) => {
          let lcIds = [];
      
          this.subscriptions.push(this.graphqlApi.getAllLCids().subscribe((res: any) => {
            let arr = res.data.lifeCyclePhases;
            arr.map(elem => lcIds.push(elem.id));
            resolve(lcIds);
          }));
        });
    }

    getQcIds() {
        return new Promise((resolve, reject) => {
          let qcIds = [];
      
          this.subscriptions.push(this.graphqlApi.getAllQCids().subscribe((res: any) => {
            let arr = res.data.qualityCharacteristics;
            arr.map(elem => qcIds.push(elem.id));
            resolve(qcIds);
          }));
        });
    }

    getQfIds() {
        return new Promise((resolve, reject) => {
          let qfIds = [];
      
          this.subscriptions.push(this.graphqlApi.getAllQFids().subscribe((res: any) => {
            let arr = res.data.qualityFactors;
            arr.map(elem => qfIds.push(elem.id));
            resolve(qfIds);
          }));
        });
    }

     //update form Data
    async updateData(data){
    

        let selectionsArray = this.selectedFactor.value.label_ids
        
        if(selectionsArray != null){
            this.subscriptions.push(this.graphqlApi.clearLabelIds(data.id)
            .pipe(
                concatMap(() => this.graphqlApi.updateQFlabelIds(selectionsArray, data.id))
            )
            .subscribe((res:any)=> {
                console.log("Check 2 :",res);
                // window.location.reload()
            }));
        }
       
        
        let lcIds:any = await this.getLcIds();
        let qcIds:any = await this.getQcIds();
        // console.log("qcIds:", qcIds);
        let qfIds:any = await this.getQfIds();
        // console.log("qfIds:", qfIds);

        if(lcIds.includes(data.id)){
            this.subscriptions.push(this.graphqlApi.updateLCdescription(data.id, data.description).subscribe((res:any) => {
                let description = res.data.updateLifeCyclePhases.lifeCyclePhases[0].description;
                // console.log(description);
                this.selectedFactor.value.description = description;
            }))
            // window.location.reload()
            
        }

        if(qcIds.includes(data.id)){
            
            this.subscriptions.push(this.graphqlApi.updateQCdescription(data.id, data.description).subscribe((res:any) => {
                let description = res.data.updateQualityCharacteristics.qualityCharacteristics[0].description;
                // console.log(description);
                this.selectedFactor.value.description = description;
            }))
            // window.location.reload()
            
        }
   
        if(qfIds.includes(data.id)){
            this.subscriptions.push(this.graphqlApi.updateQFsourceDescription(data.id, data.description, data.source).subscribe((res:any) => {
                let description = res.data.updateQualityFactors.qualityFactors[0].description;
                let source = res.data.updateQualityFactors.qualityFactors[0].sources;
                // console.log(description);
                this.selectedFactor.value.description = description;
                if(source == null){
                    this.selectedFactor.value.source = []
                }
                this.selectedFactor.value.source =[source];
            }))
        }
        
        alert('Data Updated Successfully');

        let ref = document.getElementById('cancel');
        ref.click();
     }
    
    // For Manual TreeVieew 
    //  togglePhase(phase) {
    //     phase.expanded = !phase.expanded;
    //   }
      
    //   toggleCharacteristic(characteristic) {
    //     characteristic.expanded = !characteristic.expanded;
    //   }
 }
 