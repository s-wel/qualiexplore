// SSL
// export const environment = {
//   production: true,
//   socketUrlApi : "https://i4q.ikap.biba.uni-bremen.de/qa/socket.io", // URL of the QualiExplore Rasa chatbot endpoint.
//   auditUrlApi : "https://i4q.ikap.biba.uni-bremen.de/aa/socket.io", // URL of the Audit Advisor Rasa chatbot endpoint.
//   authApi : "https://i4q.ikap.biba.uni-bremen.de/auth", // URL of the Apollo server that interacts with the MongoDB (has an integrated GraphQL server).
//   graphApi: "https://i4q.ikap.biba.uni-bremen.de/knowledge"  // URL of the Apollo server that interacts with Neo4j.
// };

// No SSL
export const environment = {
  production: true,
  socketUrlApi : "http://i4q.ikap.biba.uni-bremen.de/qa/socket.io", // URL of the QualiExplore Rasa chatbot endpoint.
  auditUrlApi : "http://i4q.ikap.biba.uni-bremen.de/aa/socket.io", // URL of the Audit Advisor Rasa chatbot endpoint.
  authApi : "http://i4q.ikap.biba.uni-bremen.de/auth", // URL of the Apollo server that interacts with the MongoDB (has an integrated GraphQL server).
  graphApi: "http://i4q.ikap.biba.uni-bremen.de/knowledge"  // URL of the Apollo server that interacts with Neo4j.
};


// No SSL local
// export const environment = {
//   production: true,
//   socketUrlApi : "http://localhost/qa/socket.io", // URL of the QualiExplore Rasa chatbot endpoint.
//   auditUrlApi : "http://localhost/aa/socket.io", // URL of the Audit Advisor Rasa chatbot endpoint.
//   authApi : "http://localhost/auth", // URL of the Apollo server that interacts with the MongoDB (has an integrated GraphQL server).
//   graphApi: "http://localhost/knowledge"  // URL of the Apollo server that interacts with Neo4j.
// };
