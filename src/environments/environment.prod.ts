export const environment = {
  production: true,
  socketUrlApi : "http://${HOSTNAME}/bot", // URL of the Rasa chatbot endpoint.
  botName: "QualiExplore assistant", // TODO check if this is still needed
  authApi : "http://${HOSTNAME}/auth", // URL of the Apollo server that interacts with the MongoDB (has an integrated GraphQL server).
  graphApi: "http://${HOSTNAME}/knowledge"  // URL of the Apollo server that interacts with Neo4j.
};
