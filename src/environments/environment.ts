// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
  production: false,
  socketUrlApi : "http://localhost:5005/", // Qualiexplore Assistant url
  auditUrlApi : "http://localhost:6005/", // Audit Assistant url
  authApi : "http://localhost:5000/graphql", // URL of the Apollo server that interacts with the MongoDB (has an integrated GraphQL server).
  graphApi: "http://localhost:4000/graphql", // URL of the Apollo server that interacts with Neo4j.
  userManagementApi: "http://localhost/users"
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
