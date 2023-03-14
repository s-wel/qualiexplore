export const environment = {
  production: true,
  socketUrlApi : "http://i4q-dev.ikap.biba.uni-bremen.de/bot", // URL of the Rasa chatbot endpoint.
  botName: "QualiExplore assistant", // TODO check if this is still needed
  authApi : "http://i4q-dev.ikap.biba.uni-bremen.de/auth", // URL of the Apollo server that interacts with the MongoDB (has an integrated GraphQL server).
  graphApi: "http://i4q-dev.ikap.biba.uni-bremen.de/knowledge"  // URL of the Apollo server that interacts with Neo4j.
};
