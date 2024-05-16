import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal , NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements  OnInit {
  users: any[];
  modalClosed = false;
  // username: string;
  // role: string;
  // password: string;
  // editingUser: any;
  editUserID : string;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  private apiURL = environment.userManagementApi 

  createUserForm = this.fb.group({
    UserName:['', Validators.required],
    Password:['', Validators.required],
  })

  editingForm = this.fb.group({
    UserName: ['', Validators.required],
    Password: ['', Validators.required]
  });

  modalRef: NgbModalRef | null = null;
  @ViewChild('editcontent') editContent: any; 
  constructor(private http: HttpClient, private router:Router, private modalService:NgbModal, private fb: FormBuilder) { }

  ngOnInit(): void {
     this.fetchUsers();
  }

  fetchUsers(): void {
    this.http.get<any[]>(this.apiURL)
      .subscribe(
        users => {
        // console.log(this.users)
        this.users = users;
      },
      error => {
        console.error("Error fetching User:", error);
      });
   
  }

  createUser(newUser): void {
    // const newUser = {
    //   username: this.username,
    //   role: this.role,
    //   password: this.password
    // };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json' // Set Content-Type header to application/json
    });

    this.http.post(this.apiURL, newUser, {headers})
      .subscribe(() => {
        console.log('User created successfully');
        this.fetchUsers(); // Refresh user list after creation
      },error => {
        console.error('Error Creating user:', error);
      });
    
  }

  updateUser(id:string): void {
    const updatedUser = {
      username: this.editingForm.value.UserName,
      password: this.editingForm.value.Password
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json' // Set Content-Type header to application/json
    });


    this.http.put(`${this.apiURL}/${id}`, updatedUser, {headers})
      .subscribe(() => {
        console.log('User updated successfully');
        this.fetchUsers(); // Refresh user list after update
        // this.editingUser = null; // Reset editing user
      }, error => {
        console.error('Error Updating user:', error);
      });
  }

  deleteUser(id: string): void {
    if(confirm("Are you sure you want to delete this user?")){
      this.http.delete(`${this.apiURL}/${id}`)
      .subscribe(
        () => {
          alert('User deleted successfully');
          this.fetchUsers(); // Refresh user list after deletion
        },
        error => {
          console.error('Error deleting user:', error);
        }
      );
    }
    
  }

  open(content: any) {
    
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'popUp', size:'lg', centered: true})
    this.modalClosed = false;
  }

  get UserName(){
    return this.createUserForm.get('UserName')
  }
  

  get Password(){
    return this.createUserForm.get('Password')
  }

  onSubmit(){
    const newUser = {
      username: this.UserName.value,
      password: this.Password.value
    }
    try{
      this.createUser(newUser);
      alert('User Created Successfully')
    }catch{
      console.log('User Creation Error!')
    }
    if (this.modalRef) {
      this.modalRef.dismiss();
    }
  }

  onBack(){
    this.router.navigate(['./qualiexplore/start'])
  }

  editUserForm(user){
    // Assuming 'user' is an object containing existing user data
    this.editingForm.patchValue({
      UserName: user.username,
      Password: user.password
    });

    this.editUserID=user._id
    this.open(this.editContent);
  }

  onEditSubmit(){
    try{
      this.updateUser(this.editUserID)
      alert('Data Updated Successfully')
    }
    catch{
      console.log("Error on updating data!")
    }
    if (this.modalRef) {
      this.modalRef.dismiss();
    }
  }

  
  // Method to transform password
  hidePassword(password: string): string {
    const maxDisplayLength = 20;
    return password ? '•'.repeat(Math.min(password.length, maxDisplayLength)) : ''; // Replace each character with a dot, limiting to maximum 10 characters
  }

}
