/**
 * Copyright 2020
 * University of Bremen, Faculty of Production Engineering, Badgasteiner Straße 1, 28359 Bremen, Germany.
 * In collaboration with BIBA - Bremer Institut für Produktion und Logistik GmbH, Bremen, Germany.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo, gql } from 'apollo-angular';

@Injectable( {providedIn : 'root'})

export class FactorsService {

    constructor(private http: HttpClient,  private apollo: Apollo) { }

    // async getFactors() {
    //     try {
    //         const response = await this.http.get('./assets/json/factors.json').toPromise();
    //         return response;
    //     } catch (err) {
    //         return console.log(err);
    //     }
    // }
    getFactors() {
        const factorsQuery = gql`
        query {factors{
            checked
            children {
              checked
              text
              value {
                description
              }
              children {
                checked
                text
                value {
                  description
                }
                children {
                  checked
                  text
                  value {
                    labelIds
                    source
                    description
                  }
                }
              }
            }
            text
            value {
              description
            }
          }}`;

        return this.apollo
            .watchQuery({
                query: factorsQuery
            }).valueChanges;
            
    }

}
