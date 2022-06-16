import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // This api services is only for mock backend "Json-Server" ; GraphQl server will replace this mock backend API 

    constructor(private http: HttpClient) { }

  //JSON-SERVER API for Filters Data
    postData(data: any){
      return this.http.post("http://localhost:3000/filters", data);
    }
    getData(){
        return this.http.get("http://localhost:3000/filters"); 
    }
    deleteData(data){
        return this.http.delete("http://localhost:3000/filters/"+data.id);
        
    }
    editData(data:any, id : number){
      return this.http.put("http://localhost:3000/filters/"+id, data);
      
    }

  //JSON-SERVER API for editable Factors Data using NgxTreeDnd
    getEditableFactorsData(){
      return this.http.get("http://localhost:3000/editableFactors"); 
    }
    postEditableFactorsData(data: any){
      return this.http.post("http://localhost:3000/factors", data);
    }

}
