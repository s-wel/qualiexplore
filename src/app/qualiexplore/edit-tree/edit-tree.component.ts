import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { graphqlApiService } from '../graphqlApi.service';
import { FormControl, FormGroup } from '@angular/forms';
import { v4 as uuid } from 'uuid';


@Component({
  selector: 'app-edit-tree',
  templateUrl: './edit-tree.component.html',
  styleUrls: ['./edit-tree.component.css']
})

export class EditTreeComponent implements OnInit, OnDestroy, AfterViewInit {

 
  
  websocketUrl = environment.socketUrlApi;
  item : any;
  editForm:FormGroup;
  addForm:FormGroup;
  cycleForm: FormGroup;

  @ViewChild('newItemInput', { static: true }) newItemInput: ElementRef;


  constructor(private route: ActivatedRoute,private router: Router, private graphqlApi: graphqlApiService, private location: Location,  private authService: AuthService,
  private modalService : NgbModal) {}


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
      // console.log("Item ::",this.item);
    } )
  }

  ngAfterViewInit() {
    // console.log("Afterview", this.newItemInput.nativeElement);
    
    // this.newItemInput.nativeElement.focus();
  }

  ngOnDestroy() {

      console.log("Ondestroy Called :");
      setTimeout(() => {
        const chatWidgetContainer = document.querySelector('#rasa-chat-widget-container');
        if (chatWidgetContainer) {
          chatWidgetContainer.remove();
        }
      }, 100);

      this.subscriptions.forEach(sub => sub.unsubscribe());
    
  }


    
  chatWidget(){

    this.rasaChatScript = document.createElement('script');
    this.rasaChatScript.src = 'https://unpkg.com/@rasahq/rasa-chat';
    this.rasaChatScript.type = 'application/javascript';
    document.head.appendChild(this.rasaChatScript);
    
  }

  // For Manual TreeVieew 
  togglePhase(phase) {
    phase.expanded = !phase.expanded;
  }
  
  toggleCharacteristic(characteristic) {
    characteristic.expanded = !characteristic.expanded;
  }

   
  open(content,id, name) {
    this.modalService.open(content, {ariaLabelledBy: 'popUp', size:'lg', centered: true})  
    this.editForm = new FormGroup({
      'name' : new FormControl(name),
     
      'id' : new FormControl(id),
      
    }); 

  }

  openAddModal(addContent,id, name) {
    this.modalService.open(addContent, {ariaLabelledBy: 'popUp', size:'lg', centered: true})  
    this.addForm = new FormGroup({
      'name' : new FormControl(name),
      'newItem': new FormControl(""),
      'id' : new FormControl(id),
    }); 

  }

 openAddCycleModal(addCycle){
  this.modalService.open(addCycle, {ariaLabelledBy: 'popUp', size:'lg', centered: true})
  this.cycleForm = new FormGroup({
    'name': new FormControl(""),
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
    console.log(data.id, data.name);
    let lcIds: any = await this.getLcIds()
    let qcIds:any = await this.getQcIds();
    let qfIds:any = await this.getQfIds();

    if(lcIds.includes(data.id)){
      console.log("This is a LC");
      this.subscriptions.push(this.graphqlApi.updateLCname(data.id, data.name).subscribe((res:any) => {
        console.log(res);
        this.getAllData();
          
      }))
    }

    if(qcIds.includes(data.id)){
      console.log("This is a QC");
      this.subscriptions.push(this.graphqlApi.updateQCname(data.id, data.name).subscribe((res:any) => {
        console.log(res);
        this.getAllData();
          
      }))
    }

    if(qfIds.includes(data.id)){
      console.log("This is a QF");
      this.subscriptions.push(this.graphqlApi.updateQFname(data.id, data.name).subscribe((res:any) => {
        console.log(res);
        this.getAllData();
          
      }))
    }

    let ref = document.getElementById('cancel');
    ref.click();
 
  }

  addNewLifeCycle(data){
    // let uuID = uuid();
    this.subscriptions.push(this.graphqlApi.createLC(data.name).subscribe((res:any) => {
      console.log(res);
      this.getAllData();
      
    }))

    let ref = document.getElementById('cancel');
    ref.click();

  }

  async addItem(data){
    console.log(data.id, data.name,  data.newItem);
    
    let lcIds: any = await this.getLcIds()
    let qcIds:any = await this.getQcIds();
    // let qfIds:any = await this.getQfIds();
    const description ="Update the description";

    const source = "Update the source";
    if(lcIds.includes(data.id)){
      console.log("This is a LC");
      // let uuID = uuid();
      this.subscriptions.push(this.graphqlApi.createQC(description, data.newItem, data.id).subscribe((res:any) => {
          console.log(res);
          this.getAllData();
      }))
    }

    if(qcIds.includes(data.id)){
      console.log("This is a QC");
      // let uuID = uuid();
      this.subscriptions.push(this.graphqlApi.createQF(description, data.newItem, source, data.id).subscribe((res:any) => {
          console.log(res);
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
        console.log("This is a LC");
        this.subscriptions.push(this.graphqlApi.deleteLC(id).subscribe((res:any) => {
            console.log(res);
            this.getAllData();
        }))
      }
  
      if(qcIds.includes(id)){
        console.log("This is a QC");
        this.subscriptions.push(this.graphqlApi.deleteQC(id).subscribe((res:any) => {
            console.log(res);
            this.getAllData();
        }))
      }
  
      if(qfIds.includes(id)){
        console.log("This is a QF");
        this.subscriptions.push(this.graphqlApi.deleteQF(id).subscribe((res:any) => {
            console.log(res);
            this.getAllData();
        }))
      }

    }



  }

    ///Save and Back 

    onBack():void{
      // this.location.back();
      let selections = sessionStorage.getItem('currentSelectionsSet');
      let arrayOfSelections = JSON.parse(selections);
      this.router.navigate(['qualiexplore/factors'], { queryParams: { ids: JSON.stringify(arrayOfSelections) } });
    }

}
