import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { forkJoin, throwError } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { v4 as uuid } from 'uuid';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class graphqlApiService {

    // This api service has all query and mutation for neo4j database

    constructor(private http: HttpClient, private apollo: Apollo,) {}

    private url = environment.graphApi // URL of the Apollo server that interacts with Neo4j.
    
    // Query and mutaions for first page (Filters Page)

    getFilterStatements(){
      const query =`
        query MyQuery{
          filterGroups {
            name,
            id
            filterStatementsBelongsTo {
              text
              id
            }
          }
        }
      `;
      return this.http.post(this.url, {query: query}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);
        return throwError(error);
      }))
    }

    updateFilterGroup(editableObj) {
      const mutation = `
        mutation MyMutation {
          updateFilterGroups(
            where: {id: "${editableObj.id}"}
            update: {name: "${editableObj.category}"}
          ) {
            filterGroups {
              name
              id
            }
          }
        }
      `;
      return this.http.post(this.url, {query: mutation}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);
        return throwError(error);
      }));
    }



    createFilterGroups(category) {
      const mutation = `
          mutation MyMutation {
            createFilterGroups(input: {name: "${category}"}) {
              filterGroups {
                id
              }
            }
          }
      `;
      return this.http.post(this.url, {query: mutation}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);
        return throwError(error);
      }))
    }

    createFilterStatementsForNewGroup(task,groupId) {
      const mutation = `
        mutation MyMutation {
          createFilterStatements(
            input: {text: "${task}", belongsToFilterGroups: {connect: {where: {node: {id: "${groupId}"}}}}}
          ) {
            info {
              nodesCreated
              relationshipsCreated
            }
          }
        }
      `;
      return this.http.post(this.url, {query: mutation}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);
        return throwError(error);
      }))
    }

    deleteFilterGroups(groupId) {
      const mutation = `
        mutation MyMutation {
          deleteFilterGroups(
            where: {id: "${groupId}"}
            delete: {filterStatementsBelongsTo: {}}
          ) {
            nodesDeleted
            relationshipsDeleted
          }
        }
      `;
      return this.http.post(this.url, {query: mutation}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);
        return throwError(error);
      }))
    }

   
    updateFilterStatements(task) {
      const mutation = `
        mutation MyMutation {
          updateFilterStatements(
            update: {text: "${task.name}"}
            where: {id: "${task.id}"}
          ) {
            filterStatements {
              id
              text
            }
          }
        }
      `;
      return this.http.post(this.url, {query: mutation}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);
        return throwError(error);
      }))
    }

    createFilterStatements(task, groupId) {
      const mutation = `
        mutation MyMutation {
          createFilterStatements(
            input: {text: "${task.name}", belongsToFilterGroups: {connect: {where: {node: {id: "${groupId}"}}}}}
          ) {
            info {
              relationshipsCreated
            }
          }
        }
      `;
      return this.http.post(this.url, {query: mutation}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);
        return throwError(error);
      }))
    }

    // To update an existing filter group statements there will be two case one is updating the existing filters statements another is creating new filter statements. So here we need to handle both requests at a time. 
    updateOrCreateFilterStatements(editableObj, dataObj) {
      console.log("UC EditableObj :", editableObj);
      console.log("UC DataObj :", dataObj);
      
      let i = 0;
      const requests = [];
      editableObj.tasks.forEach(task => {
        if (i < dataObj.tasks.length) {
          task.name = dataObj.tasks[i].taskgroup;
          // console.log("Update i", i);
          
          requests.push(this.updateFilterStatements(task));
          i++;
        }
      });
      // console.log("i from above :", i);

      while (i < dataObj.tasks.length) {
        // const newTask = { id: uuid(), name: dataObj.tasks[i].taskgroup};
        const newTask = {name: dataObj.tasks[i].taskgroup};
        console.log("create i", i);
        console.log("newtask", newTask);
        requests.push(this.createFilterStatements(newTask, editableObj.id));
        i++;
      }

      return forkJoin(requests);
      
    }

    deleteFilterStatement(id){
      const mutation = `
      mutation MyMutation {
        deleteFilterStatements(where: {id: "${id}"}) {
          nodesDeleted
          relationshipsDeleted
        }
      }
      `
     return this.http.post(this.url, {query: mutation}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
      console.error('An error occurred:', error);
      return throwError(error);
      }))
    }

  // Query and mutaions for second page (Factors Page)

  // get all life cycle phases incuding their quality characteristics and factors
  getLifeCyclePhases(){
    const query = `
    query Myquery{
      lifeCyclePhases {
        name,
        id,
        description,
        qualityCharacteristicsContributesTo {
          name,
          id,
          description,
          qualityFactorsContributesTo {
            name,
            id,
            description,
            sources,
            relevantForFilterStatements {
              id
              text
            }
          }
        }
      }
    }
    `;
    return this.http.post(this.url, {query:query}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
      console.error('An error occurred:', error);
      return throwError(error);
    }))
  }

  //get all quality characteristics ids
  getAllQCids() {
    const query = `
      query QualityCharacteristics {
        qualityCharacteristics {
          id
        }
      }
    `;
    return this.http.post(this.url, {query: query}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
      console.error('An error occurred:', error);
      return throwError(error);
    }))
  }

  //get all quality factors ids
  getAllQFids() {
    const query = `
      query QualityFactors {
        qualityFactors {
          id
        }
      }
    `;
    return this.http.post(this.url, {query: query}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
      console.error('An error occurred:', error);
      return throwError(error);
    }))
  }

  // get all life cycle phases ids
  getAllLCids(){
    const query = `
      query MyQuery {
        lifeCyclePhases {
          id
        }
      }
      `;
    return this.http.post(this.url, {query: query}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
      console.error('An error occurred:', error);
      return throwError(error);
    }))
  }

  
  // update lifecycle phases description
  updateLCdescription(id:string, description:string){
    const mutation = `
      mutation MyMutation {
        updateLifeCyclePhases(
          where: {id: "${id}"}
          update: {description: "${description}"}
        ) {
          lifeCyclePhases {
            description
          }
        }
      }
      `;
      return this.http.post(this.url, {query:mutation}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);
        return throwError(error);
      }))
  }

  // update quality characteristics description
  updateQCdescription(id:string, description:string){
    const mutation = `
      mutation MyMutation {
        updateQualityCharacteristics(
          where: {id: "${id}"}
          update: {description: "${description}"}
        ) {
          qualityCharacteristics {
            description
          }
        }
      }
      `;
      return this.http.post(this.url, {query:mutation}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);
        return throwError(error);
      }))
  }

  // update quality factors description and source
  updateQFsourceDescription(id:string, description:string , source:string,){
    const mutation = `
      mutation MyMutation {
        updateQualityFactors(
          where: {id: "${id}"}
          update: {description: "${description}", sources: "${source}"}
        ) {
          qualityFactors {
            description
            sources
          }
        }
      }
      `;
      return this.http.post(this.url, {query:mutation}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);
        return throwError(error);
      }))
  }

  //get all filter statements with their id
  getAllFilterStatementswithID(){
    const query = `
      query MyQuery {
        filterStatements {
          id
          text
        }
      }
    `;
    return this.http.post(this.url, {query:query}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
      console.error('An error occurred:', error);
      return throwError(error);
    }))
  }

  // clear all relationships between quality factos and filter statements
  clearLabelIds(id){
    const query = `
      mutation MyMutation {
        updateQualityFactors(
          disconnect: { relevantForFilterStatements: {} }
          where: { id: "${id}" }
        ) {
          info {
            relationshipsDeleted
          }
        }
      } 
    `
    return this.http.post(this.url, {query:query}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
      console.error('An error occurred:', error);
      return throwError(error);
    }))
  }


  // clear relationships between quality factos and filter statements
  updateQFlabelIds(arr, id){
    const query = `
      mutation MyMutation(
        $id_IN: [ID!] = ${JSON.stringify(arr)}
      ) {
        updateQualityFactors(
          where: { id: "${id}" }
          connect: {
            relevantForFilterStatements: { where: { node: { id_IN: $id_IN } } }
          }
        ) {
          info {
            relationshipsCreated
          }
        }
      } 
    `
    return this.http.post(this.url, {query:query}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
      console.error('An error occurred:', error);
      return throwError(error);
    }))
  }

  // Query and mutaions for third page (Edit Tree Page)

  // update life cycle phase name
  updateLCname(id, name){
    const mutation = `
      mutation MyMutation {
        updateLifeCyclePhases(where: {id: "${id}"}, update: {name: "${name}"}) {
          lifeCyclePhases {
            id
            name
          }
        }
      }
    `;
    return this.http.post(this.url, {query:mutation}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
      console.error('An error occurred:', error);
      return throwError(error);
    }))
  }

  // update quality characteristics name
  updateQCname(id, name){
    const mutation = `
      mutation MyMutation {
        updateQualityCharacteristics(where: {id: "${id}"}, update: {name: "${name}"}) {
          qualityCharacteristics {
            id
            name
          }
        }
      }
    `;
    return this.http.post(this.url, {query:mutation}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
      console.error('An error occurred:', error);
      return throwError(error);
    }))
  }

  // update quality fators name
  updateQFname(id, name){
    const mutation = `
    mutation MyMutation {
      updateQualityFactors(where: {id: "${id}"}, update: {name: "${name}"}) {
        qualityFactors {
            id
            name
          }
        }
      }
    `;
    return this.http.post(this.url, {query:mutation}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
      console.error('An error occurred:', error);
      return throwError(error);
    }))
  }

  // create new life cycle phases
  createLC(name, description){
    const mutation = `
    mutation MyMutation {
      createLifeCyclePhases(input: {name: "${name}", description: "${description}"}) {
        lifeCyclePhases {
          id
          name
        }
      }
    }
    `
    return this.http.post(this.url, {query:mutation}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
      console.error('An error occurred:', error);
      return throwError(error);
    }))
  }

  // create new children of quality characteristics and connect it to their respective parent
  createQC(description, newItem, lcId){
    const mutation = `
    mutation MyMutation {
      createQualityCharacteristics(
        input: {description: "${description}", name: "${newItem}", contributesToLifeCyclePhases: {connect: {where: {node: {id: "${lcId}"}}}}}
      ) {
        qualityCharacteristics {
          id
          name
          description
          contributesToLifeCyclePhases {
            id
          }
        }
      }
    }
    `;
    return this.http.post(this.url, {query:mutation}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
      console.error('An error occurred:', error);
      return throwError(error);
    }))
  }

  // create new children of quality factors and connect it to their respective parent
  createQF(description, newItem, source, qcId){
    const mutation = `
      mutation MyMutation {
        createQualityFactors(
          input: {description: "${description}",name: "${newItem}", sources: "${source}", contributesToQualityCharacteristics: {connect: {where: {node: {id: "${qcId}"}}}}}
        ) {
          qualityFactors {
            id
            name
            contributesToQualityCharacteristics {
              id
              name
            }
          }
        }
      }
    `;
    return this.http.post(this.url, {query:mutation}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
      console.error('An error occurred:', error);
      return throwError(error);
    }))
  }


  // delete Life cycle phases and their relations
  deleteLC(id){
    const mutation = `
      mutation MyMutation {
        deleteLifeCyclePhases(
          delete: {qualityCharacteristicsContributesTo: {delete: {qualityFactorsContributesTo: {} } }}
          where: {id: "${id}"}
        ) {
          nodesDeleted
          relationshipsDeleted
        }
      }
    `;
    return this.http.post(this.url, {query:mutation}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
      console.error('An error occurred:', error);
      return throwError(error);
    }))
  }

  // delete quality characteristics and their relations
  deleteQC(id){
    const mutation = `
      mutation MyMutation {
        deleteQualityCharacteristics(
          where: {id: "${id}"}
          delete: {qualityFactorsContributesTo: {}}
        ) {
          nodesDeleted
          relationshipsDeleted
        }
      }
    `;
    return this.http.post(this.url, {query:mutation}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
      console.error('An error occurred:', error);
      return throwError(error);
    }))
  }

  // delete quality factors and their relations
  deleteQF(id){
    const mutation = `
      mutation MyMutation {
        deleteQualityFactors(
          where: {id: "${id}"}
        ) {
          nodesDeleted
          relationshipsDeleted
        }
      }
    `;
    return this.http.post(this.url, {query:mutation}).pipe(map(res => res), catchError((error: HttpErrorResponse) => {
      console.error('An error occurred:', error);
      return throwError(error);
    }))
  }

  
}