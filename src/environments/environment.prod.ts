// SSL server on i4q.ikap
export const environment = {
  production: true,
  socketUrlApi : "https://your-host-name/qa/socket.io", // URL of the QualiExplore Rasa chatbot endpoint.
  auditUrlApi : "https://your-host-name/aa/socket.io", // URL of the Audit Advisor Rasa chatbot endpoint.
  authApi : "https://your-host-name/auth", // URL of the Apollo server that interacts with the MongoDB (has an integrated GraphQL server).
  graphApi: "https://your-host-name/knowledge", // URL of the Apollo server that interacts with Neo4j.
  userManagementApi: "https://your-host-name/users" //URL to the user management API
};
