import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn : 'root'
})

///This file does not require so far 

export class EditTreeService {

    constructor(private http: HttpClient, private apollo: Apollo) { }

    // async getFactors() {
    //     try {
    //         const response = await this.http.get('./assets/json/edit-tree.json').toPromise(); 
    //         return response;
    //     } catch (err) {
    //         return console.log(err);
    //     }
    // }
    getEditableFactors() {

    ///Test with graphql but do not work

        const editableFactorsQuery = gql`
        query {editableFactors{
            id
            checked
            childrens {
              id
              checked
              name
              value {
                description
              }
              childrens {
                id
                checked
                name
                value {
                  description
                }
                childrens {
                  id
                  checked
                  name
                  value {
                    labelIds
                    source
                    description
                  }
                }
              }
            }
            name
            value {
              description
            }
          }}`;

        return this.apollo
            .watchQuery({
                query: editableFactorsQuery
            }).valueChanges;
    }
}
