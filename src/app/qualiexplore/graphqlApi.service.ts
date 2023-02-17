import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { forkJoin, throwError } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class graphqlApiService {
  // Handles graphql queries for the Neo4j knowledge graph. 

    constructor(private http: HttpClient, private apollo: Apollo,) {}
    
    // TODO Move url to a config file
    // URL of the Apollo server that interacts with Neo4j.
    private url = 'http://localhost:4000/graphql'

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
      return this.http.post(this.url, {query: query})
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
      return this.http.post(this.url, {query: mutation});
    }

    // TODO Remove or keep after debugging
    // updateFilterStatements(editableObj) {
    //   editableObj.tasks.forEach(task => {
    //     const mutation = `
    //       mutation MyMutation {
    //         updateFilterStatements(
    //           update: {text: "${task.name}"}
    //           where: {id: "${task.id}"}
    //         ) {
    //           filterStatements {
    //             id
    //             text
    //           }
    //         }
    //       }
    //     `;
    //     this.http.post(this.url, {query: mutation}).subscribe(response => {
    //       console.log(response);
    //     });
    //   });
    // }

    // createFilterStatements(editableObj) {
    //   editableObj.tasks.forEach(task => {
    //     const mutation = `
    //       mutation MyMutation {
    //         createFilterStatements(
    //           input: {id: "${task.id}", text: "${task.name}", belongsToFilterGroups: {connect: {where: {node: {id: "${editableObj.id}"}}}}}
    //         ) {
    //           info {
    //             relationshipsCreated
    //           }
    //         }
    //       }
    //     `;
    //     this.http.post(this.url, {query: mutation}).subscribe(response => {
    //       console.log(response);
    //     });
    //   });
    // }

    createFilterGroups(category,id) {
      const mutation = `
        mutation MyMutation {
          createFilterGroups(input: {id: "${id}", name: "${category}"}) {
            info {
              relationshipsCreated
            }
          }
        }
      `;
      return this.http.post(this.url, {query: mutation}).pipe(map(res => res))
    }

    createFilterStatementsForNewGroup(task,taskId,groupId) {
      const mutation = `
        mutation MyMutation {
          createFilterStatements(
            input: {id: "${taskId}", text: "${task}", belongsToFilterGroups: {connect: {where: {node: {id: "${groupId}"}}}}}
          ) {
            info {
              nodesCreated
              relationshipsCreated
            }
          }
        }
      `;
      return this.http.post(this.url, {query: mutation}).pipe(map(res => res))
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
      return this.http.post(this.url, {query: mutation}).pipe(map(res => res))
    }
    createFilterStatements(task, groupId) {
      const mutation = `
        mutation MyMutation {
          createFilterStatements(
            input: {id: "${task.id}", text: "${task.name}", belongsToFilterGroups: {connect: {where: {node: {id: "${groupId}"}}}}}
          ) {
            info {
              relationshipsCreated
            }
          }
        }
      `;
      return this.http.post(this.url, {query: mutation}).pipe(map(res => res))
    }



    updateOrCreateFilterStatements(editableObj, dataObj) {
      // TODO add a description
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
        // const newTask = { id: uuid(), name: dataObj.tasks[i].taskgroup, checked: false };
        const newTask = { id: uuid(), name: dataObj.tasks[i].taskgroup};
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
     return this.http.post(this.url, {query: mutation})
    }

////////////////// 2nd page //////////////////////////

getLifeCyclePhases(){
  const query = `
  query Myquery{
    lifeCyclePhases {
      name,
      id,
      qualityCharacteristicsContributesTo {
        name,
        id,
        description,
        qualityFactorsContributesTo {
          name,
          id,
          label_ids,
          description,
          sources
        }
      }
    }
  }
  `;
  return this.http.post(this.url, {query:query})
}


getAllQCids() {
  const query = `
    query QualityCharacteristics {
      qualityCharacteristics {
        id
      }
    }
  `;
  return this.http.post(this.url, {query: query})
}

getAllQFids() {
  const query = `
    query QualityFactors {
      qualityFactors {
        id
      }
    }
  `;
  return this.http.post(this.url, {query: query})
}

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
    return this.http.post(this.url, {query:mutation})
}
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
    return this.http.post(this.url, {query:mutation})
}

getAllFilterStatementswithID(){
  const query = `
    query MyQuery {
      filterStatements {
        id
        text
      }
    }
  `;
  return this.http.post(this.url, {query:query})
}

clearLabelIds(id){
  const query = `
    mutation MyMutation {
      updateQualityFactors(
        update: {label_ids_POP: 100}
        where: {id: "${id}"}
      ) {
        qualityFactors {
          name
          label_ids
          id
        }
      }
    }
  `
  return this.http.post(this.url, {query:query})
}
updateQFlabelIds(arr, id){
  const query = `
    mutation MyMutation {
      updateQualityFactors(
        where: {id:  "${id}"}
        update: {label_ids: ${JSON.stringify(arr)}}
        
      ) {
        qualityFactors {
          name
          id
          label_ids
        }
      }
    }
  `
 
  return this.http.post(this.url, {query:query})

}


  
}
