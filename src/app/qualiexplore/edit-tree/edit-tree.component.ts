import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { graphqlApiService } from '../graphqlApi.service';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';



@Component({
  selector: 'app-edit-tree',
  templateUrl: './edit-tree.component.html',
  styleUrls: ['./edit-tree.component.css']
})

export class EditTreeComponent implements OnInit, OnDestroy {

 
  
  websocketUrl = environment.socketUrlApi;
  item : any;
  editForm:UntypedFormGroup;
  addForm:UntypedFormGroup;
  cycleForm: UntypedFormGroup;

  @ViewChild('newItemInput', { static: true }) newItemInput: ElementRef;


  constructor(private route: ActivatedRoute,private router: Router, private graphqlApi: graphqlApiService, private authService: AuthService,
  private modalService : NgbModal, private cdr: ChangeDetectorRef) {}


  private rasaChatScript: HTMLScriptElement;
  private subscriptions: Subscription[] = [];
  ngOnInit() {

      this.authService.autoLogin();
      // Qualiexplore bot widget      
      this.chatWidget()
      this.getAllData()
      
  }

  getAllData(){
    this.graphqlApi.getLifeCyclePhases().subscribe((res:any) => {
      this.item = res.data.lifeCyclePhases;
      
      this.item.forEach(phase => {
        phase.expanded = true;
  
        phase.qualityCharacteristicsContributesTo.forEach(characteristic => {
          characteristic.expanded = true;
  
          characteristic.qualityFactorsContributesTo.forEach(factor => {
            factor.expanded = true;
          });
        });
      });
   
      // console.log("Item ::",this.item);
    })
  }

  ngOnDestroy() {

      setTimeout(() => {
        const chatWidgetContainer = document.querySelector('#rasa-chat-widget-container');
        if (chatWidgetContainer) {
          chatWidgetContainer.remove();
        }
      }, 100);

      this.subscriptions.forEach(sub => sub.unsubscribe());
    
  }


    
  chatWidget(){
    const userData = JSON.parse(localStorage.getItem('userData'))
    const username = userData.username
    // To implement conversation ID
    // console.log(userData.username);
    // const chatData = JSON.parse(localStorage.getItem('chat_session'))
    // console.log(chatData)
    // console.log(chatData.session_id);
    // const conID = `${username}-${chatData.session_id}` 

    // console.log("Passing ID :",conID)

    //
    this.rasaChatScript = document.createElement('script');
    this.rasaChatScript.src = 'https://unpkg.com/@rasahq/rasa-chat';
    this.rasaChatScript.type = 'application/javascript';
    document.head.appendChild(this.rasaChatScript);
    
  }

  // For Manual TreeVieew 

  togglePhase(phase) {

    // console.log(phase);
  
    phase.expanded = !phase.expanded;
    this.cdr.detectChanges();
  }
  
  toggleCharacteristic(characteristic) {
    characteristic.expanded = !characteristic.expanded;
    this.cdr.detectChanges();
  }

   
  open(content,id, name) {
    this.modalService.open(content, {ariaLabelledBy: 'popUp', size:'lg', centered: true})  
    this.editForm = new UntypedFormGroup({
      'name' : new UntypedFormControl(name),
     
      'id' : new UntypedFormControl(id),
      
    }); 

  }

  openAddModal(addContent,id, name) {
    this.modalService.open(addContent, {ariaLabelledBy: 'popUp', size:'lg', centered: true})  
    this.addForm = new UntypedFormGroup({
      'name' : new UntypedFormControl(name),
      'newItem': new UntypedFormControl(""),
      'id' : new UntypedFormControl(id),
    }); 

  }

 openAddCycleModal(addCycle){
  this.modalService.open(addCycle, {ariaLabelledBy: 'popUp', size:'lg', centered: true})
  this.cycleForm = new UntypedFormGroup({
    'name': new UntypedFormControl(""),
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


async updateName(data){
    // console.log(data.id, data.name);
    let lcIds: any = await this.getLcIds()
    let qcIds:any = await this.getQcIds();
    let qfIds:any = await this.getQfIds();

    if(lcIds.includes(data.id)){
      // console.log("This is a LC");
      this.subscriptions.push(this.graphqlApi.updateLCname(data.id, data.name).subscribe((res:any) => {
        // console.log(res);
        this.getAllData();
          
      }))
    }

    if(qcIds.includes(data.id)){
      // console.log("This is a QC");
      this.subscriptions.push(this.graphqlApi.updateQCname(data.id, data.name).subscribe((res:any) => {
        // console.log(res);
        this.getAllData();
          
      }))
    }

    if(qfIds.includes(data.id)){
      // console.log("This is a QF");
      this.subscriptions.push(this.graphqlApi.updateQFname(data.id, data.name).subscribe((res:any) => {
        // console.log(res);
        this.getAllData();
          
      }))
    }

    let ref = document.getElementById('cancel');
    ref.click();
 
  }

  addNewLifeCycle(data){
    const description ="Update the description";
    this.subscriptions.push(this.graphqlApi.createLC(data.name, description).subscribe((res:any) => {
      // console.log(res);
      this.getAllData();
      
    }))

    let ref = document.getElementById('cancel');
    ref.click();

  }

  async addItem(data){
    // console.log(data.id, data.name,  data.newItem);
    let lcIds: any = await this.getLcIds()
    let qcIds:any = await this.getQcIds();
    // let qfIds:any = await this.getQfIds();
    const description ="Update the description";
    const source = "Update the source";
    if(lcIds.includes(data.id)){
      // let uuID = uuid();
      this.subscriptions.push(this.graphqlApi.createQC(description, data.newItem, data.id).subscribe((res:any) => {
          // console.log(res);
          this.getAllData();
      }))
    }

    if(qcIds.includes(data.id)){
      // console.log("This is a QC");
      // let uuID = uuid();
      this.subscriptions.push(this.graphqlApi.createQF(description, data.newItem, source, data.id).subscribe((res:any) => {
          // console.log(res);
          this.getAllData();
      }))
    }

    let ref = document.getElementById('cancel');
    ref.click();

  }

  async deleteItem(id){

    let lcIds: any = await this.getLcIds()
    let qcIds:any = await this.getQcIds();
    let qfIds:any = await this.getQfIds();

    if(confirm("Are you sure to delete it ?")){

      if(lcIds.includes(id)){
        // console.log("This is a LC");
        this.subscriptions.push(this.graphqlApi.deleteLC(id).subscribe((res:any) => {
            // console.log(res);
            this.getAllData();
        }))
      }
  
      if(qcIds.includes(id)){
        // console.log("This is a QC");
        this.subscriptions.push(this.graphqlApi.deleteQC(id).subscribe((res:any) => {
            // console.log(res);
            this.getAllData();
        }))
      }
  
      if(qfIds.includes(id)){
        // console.log("This is a QF");
        this.subscriptions.push(this.graphqlApi.deleteQF(id).subscribe((res:any) => {
            // console.log(res);
            this.getAllData();
        }))
      }

    }



  }

    // Save and Back 

    onBack():void{
      let selections = sessionStorage.getItem('currentSelectionsSet');
      let arrayOfSelections = JSON.parse(selections);
      this.router.navigate(['qualiexplore/factors'], { queryParams: { ids: JSON.stringify(arrayOfSelections) } });
    }

}
