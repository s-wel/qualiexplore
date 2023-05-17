import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-audit-advisor',
  templateUrl: './audit-advisor.component.html',
  styleUrls: ['./audit-advisor.component.css']
})
export class AuditAdvisorComponent implements OnInit {

  websocketUrl = environment.auditUrlApi;

  constructor(private router: Router, private authService:AuthService) { }

  
  private rasaChatScript: HTMLScriptElement;

  ngOnInit(): void {
    this.authService.autoLogin();
    // Adult Advisor Assistant     
    this.auditWidget()
  }

  ngOnDestroy() {
    // console.log("Ondestroy Called :");
    setTimeout(() => {
      const chatWidgetContainer = document.querySelector('#rasa-chat-widget-container');
      if (chatWidgetContainer) {
        chatWidgetContainer.remove();
      }
    }, 100);
  
}

  auditWidget(){

    this.rasaChatScript = document.createElement('script');
    this.rasaChatScript.src = 'https://unpkg.com/@rasahq/rasa-chat';
    this.rasaChatScript.type = 'application/javascript';
    document.head.appendChild(this.rasaChatScript);
    
  }
  onBack():void{
    let selections = sessionStorage.getItem('currentSelectionsSet');
    let arrayOfSelections = JSON.parse(selections);
    if(arrayOfSelections){
      this.router.navigate(['qualiexplore/factors'], { queryParams: { ids: JSON.stringify(arrayOfSelections) } });
    }
    else{
      this.router.navigate(['qualiexplore/start']);
    }
    
  }

}
