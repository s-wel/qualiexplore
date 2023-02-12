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
//  import { ApiService } from '../api.service';
 import { TreeviewConfig, TreeviewItem, TreeItem } from 'ngx-treeview';
 import { Location } from '@angular/common';
 import { Filter } from '../filters/model/filter.model';
 import { newFilter } from '../filters/model/filter.model';
 import { FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
 import { AuthService } from '../auth/auth.service'
 import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
 import { Observable, Subscription } from 'rxjs'
 import {graphqlApiService} from '../graphqlApi.service'
 
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

     ///
   

     //form
     editForm:FormGroup;
     allData : any;
     allFS : any
     allTasks = [];

     ///
     isAuthenticated = false
     user: string = null
     updateButton = false

     // interfaces

    
     
     constructor(
       private service: FactorsService,
       private route: ActivatedRoute,
       private router: Router,
       private modalService : NgbModal,
    //    private apiService : ApiService,
       private authService: AuthService,
       private location : Location,
       private graphqlApi: graphqlApiService
       ) {
    // Treeview Manual Approach
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
         
        // TODO enbale when user connection is ready
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
        // // For now using the admin Mode
        // this.updateButton = true
        // /////


         this.route.queryParams.subscribe(params => {
            //  console.log(params);
          
             this.selected = JSON.parse(params.ids);
             console.log("SELECTED IDS :",this.selected);
             console.log("CNF :",sessionStorage.getItem('currentNewFilters'));
             
 
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

              console.log("SF DETAILS :", this.selectedFilterDetails);
              
              ///mongodb///
            //   let factorsObs: Observable<any>;
            //   factorsObs = this.service.getFactors()
            //   factorsObs.subscribe((data: any) => {
            //     console.log("FactorsData:", data.data.factors[0])
            //     const data1 = JSON.parse(JSON.stringify(data))
            //     this.items = this.parseTree([new TreeviewItem(data1.data.factors[0])])
            //     this.countHighlightedFactors(this.items)
            //   })
              ////////////json server//////
            //   this.apiService.getFactorsData().subscribe((res) => {                
            //         this.item = res[0];
            //         // console.log(this.item);
                    
            //         this.items = this.parseTree([new TreeviewItem(this.item)]);
            //         this.countHighlightedFactors(this.items);

            //    });

            //  this.service.getFactors()
              //  .then((items: any) => {
              //      console.log(items);
                
              //      this.items = this.parseTree([new TreeviewItem(items)]);
              //      this.countHighlightedFactors(this.items);
              //  });

            ////graphql-neo4j///
            this.getAllData()

            

        //     this.subscriptions.push(this.graphqlApi.getLifeCyclePhases().subscribe((res:any) => {      
        //         console.log(res);
                
        //         let data = res.data;
        //         // converting response as ngx-treeview json format
        //         const convertToNewFormat = (obj: any): any => {
        //             const result: any = {};
                  
        //             if (obj.name) result.text = obj.name;
        //             if (obj.id) result.id = obj.id;

        //             // console.log(obj.name, obj.id);
                  
        //             if (obj.qualityCharacteristicsContributesTo) {
        //               result.children = [];
        //               obj.qualityCharacteristicsContributesTo.forEach((item: any) => {
        //                 result.children.push(convertToNewFormat(item));
        //               });
        //             }

                 

        //             if (obj.qualityFactorsContributesTo) {
        //               result.children = [];
        //               obj.qualityFactorsContributesTo.forEach((item: any) => {
        //                 result.children.push(convertToNewFormat(item));
        //               });
        //             }


        //             result.value = {};

        //             if (obj.description) result.value = { description: obj.description, source: []};
        //             if (obj.sources) result.value.source = [obj.sources];        
        //             if (obj.id) result.value.id = obj.id;
        //             return result;
        //           };

        //           const result: any = {"text": "Platform information quality",  "children": []};

        //           data.lifeCyclePhases.forEach((item: any) => {
        //             const converted = convertToNewFormat(item);
        //             // console.log("Converted :", converted);
        //             result.children.push(converted)
        //           });
               
        //         let item = result
        //         console.log("Check The converted Json:", item);
        //         this.items = this.parseTree([new TreeviewItem(item)])
        //         this.countHighlightedFactors(this.items);
                
               
        //         /// expanding all childs for manual treeview
        //         // for (const phase of this.item) {
        //         //     phase.expanded = true;
        //         //     for (const characteristic of phase.qualityCharacteristicsContributesTo) {
        //         //       characteristic.expanded = true;
        //         //     }
        //         // }
                          
        //         // this.item = lifeCycleData;
        //         // console.log("this.item",this.item);
                
        //         // this.items = this.parseTree([new TreeviewItem(res.data.lifeCyclePhases)]);
        //         // console.log(this.items);
                
        //         // this.countHighlightedFactors(this.items);

        //    }));


          
         });

        //get all the filters from json-server

        // this.apiService.getData().subscribe(res => {
        //     this.allData = res;
            
        //     for(let elem of this.allData){
        //         for(let item of elem.tasks){
        //             // console.log(item);
                    
        //             this.allTasks.push(item); //item.name
        //         }  
        //     }
              
            
        //  })

        //get all filter statements from graphql

        this.subscriptions.push(this.graphqlApi.getAllFilterStatementswithID().subscribe((res:any) =>{
            this.allFS = res.data.filterStatements
        }))

       
    
         
      
     }

     /// graphql test

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
                if (obj.label_ids) {
                    result.value.label_ids = obj.label_ids;
                }


                if (obj.sources) {
                    result.value.source = [obj.sources]
                }
                else {
                    result.value.source = []
                };        

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

            // console.log("Check The converted Json:", this.item);
            this.items = this.parseTree([new TreeviewItem(this.item)])
            // console.log("After Parsing :",this.items);
            this.countHighlightedFactors(this.items);
            
           
            /// expanding all childs for manual treeview
            // for (const phase of this.item) {
            //     phase.expanded = true;
            //     for (const characteristic of phase.qualityCharacteristicsContributesTo) {
            //       characteristic.expanded = true;
            //     }
            // }
                      
            // this.item = lifeCycleData;
            // console.log("this.item",this.item);
            
            // this.items = this.parseTree([new TreeviewItem(res.data.lifeCyclePhases)]);
            // console.log(this.items);
            
            // this.countHighlightedFactors(this.items);

       }));
    }

     selection(item){
        console.log(item.name, item.id);
        
     }

     changeCheck(id: number, event: any) {
        //array to int conversion of selectedFactor
        // let num = +this.selectedFactor.value.label_ids.join("");
        console.log("Label Ids ",this.selectedFactor.value.label_ids);
        // console.log(num);
        if(this.selectedFactor.value.label_ids.length != 0){
            for(let i in this.selectedFactor.value.label_ids){
                let num = this.selectedFactor.value.label_ids[i]; 
                this.selectionsSet.add(num);
            } 
        }
       
        // this.selectionsSet.add(num);
        console.log('Event:',typeof(event.target.id));
        
        (event.target.checked) ? this.selectionsSet.add(id) : this.selectionsSet.delete(id);

        if(event.target.checked != true){
            for(let i in this.selectedFactor.value.label_ids){
                let numb = this.selectedFactor.value.label_ids[i]; 
                if(numb === +event.target.id){
                    this.selectedFactor.value.label_ids.splice(i,1);
                    this.selectionsSet.delete(numb);
                }
            }
            
        }

    
        this.selections = Array.from(this.selectionsSet);
        console.log("Selections:",this.selections);
        console.log("SelectedFactor:",this.selectedFactor.value.label_ids);
        
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
        if(this.updateButton){
            sessionStorage.clear()
        }
         //sessionStorage.clear(); // for clear
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
        let id = ''
        let list = [];
        console.log("Form Open :",this.selectedFactor);
        
        if(this.selectedFactor !== undefined){
            description = this.selectedFactor.value.description;
            id = this.selectedFactor.value.id;
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
            'source': new FormControl(source),
            'id' : new FormControl(id),
        });  
          
     }
     ////

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
    // qcids
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
      
        // console.log("form data :", data);
        // console.log(this.item);
        
        let selectionsArray = []
        console.log("Selections Working :",typeof(this.selections));
        selectionsArray = Object.values(this.selections)
        
        // clear esisting values of label_ids

        // this.subscriptions.push(this.graphqlApi.clearLabelIds(data.id).subscribe((res: any) => {
        //     console.log(res);
        // }))

        // update the label Ids using selection Ids
        this.subscriptions.push(this.graphqlApi.updateQFlabelIds(selectionsArray, data.id).subscribe((res:any)=> {
            // console.log(this.item);
            console.log(res);
        }))

        

        let qcIds:any = await this.getQcIds();
        // console.log("qcIds:", qcIds);
        let qfIds:any = await this.getQfIds();
        // console.log("qfIds:", qfIds);
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
        
        window.location.reload()
        ///update logic goes here
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
 