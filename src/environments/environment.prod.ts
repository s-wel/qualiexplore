export const environment = {
  production: true,
  socketUrlApi : "http://rasa-production-qualiexplore:5005/", // URL of the Rasa chatbot endpoint.
  botName: "QualiExplore assistant", // TODO check if this is still needed
  authApi : "http://apollo-auth:5000/graphql", // URL of the Apollo server that interacts with the MongoDB (has an integrated GraphQL server).
  graphApi: "http://apollo-server-qualiexplore:4000/graphql"  // URL of the Apollo server that interacts with Neo4j.
};
