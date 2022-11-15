/**
 * Copyright 2020
 * University of Bremen, Faculty of Production Engineering, Badgasteiner Straße 1, 28359 Bremen, Germany.
 * In collaboration with BIBA - Bremer Institut für Produktion und Logistik GmbH, Bremen, Germany.
 * Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
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
import { Apollo, gql } from 'apollo-angular'
import { Filter } from './model/filter.model'
import { Subject } from 'rxjs'
import { map } from 'rxjs/operators';

@Injectable()
export class FiltersService {
  constructor(private http: HttpClient, private apollo: Apollo) { }

  // Using Static data from asstets/json

  // async getQuestions() {
  //   try {
  //     const response = await this.http.get('./assets/json/filters.json').toPromise();
  //     return response;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
  
  getQuestions() {
    const filtersQuery = gql`
      query {
        filters {
          categories {
            labels {
              checked
              id
              name
            }
            name
          }
        }
      }
    `

    return this.apollo.watchQuery({
      query: filtersQuery,
    }).valueChanges
  }
 
}
