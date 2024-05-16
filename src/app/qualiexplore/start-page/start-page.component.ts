import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})
export class StartPageComponent implements OnInit {

  constructor(private router:Router) { }

  user : string;
  chatID : string;

  updateButton = false;

  ngOnInit(): void {
    
    const userData = JSON.parse(localStorage.getItem('userData'))
    const chatData = JSON.parse(localStorage.getItem('chat_session'))
    this.user = userData?.username

    if(userData.isAdmin === true){
      this.updateButton = true;
    }else{
      this.updateButton = false;
    }
    // To implement conversation ID
    // const sessionID = chatData.session_id
    // this.chatID = `${this.user}-${sessionID}`

    // sessionStorage.setItem('chatID', this.chatID);

    // console.log(userData.username, chatData.session_id);
  
  }


  // To implement conversation ID
  // onAuditBot(){
  //   this.router.navigate(['./qualiexplore/audit'],  { queryParams: { chatId: this.chatID } })
  // }

  // onFilterPage(){
  //   this.router.navigate(['./qualiexplore/filters'], { queryParams: { chatId: this.chatID } })
  // }

  onAuditBot(){
    this.router.navigate(['./qualiexplore/audit'])
  }

  onFilterPage(){
    this.router.navigate(['./qualiexplore/filters'])
  }

  onUserManagement(){
    this.router.navigate(['./qualiexplore/user-management']);
  }

}
