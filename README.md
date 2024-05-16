# QualiExplore Angular Module

Standalone Frontend Angular application of QualiExplore Component in the [i4Q](www.i4q-project.eu)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.8.

## Important Notes

This App requires three backend servers 'mongodb-graphql', 'user-management' and 'neo4j-graphql'server.

## Backend Servers

- **mongodb-graphql**: This server is used for user authentication
- **user-management**: This server is used for create, read, update or delete users
- **neo4j-graphql**: This server handles all other functionalities of our app

Backend URLs and Socket URLs for RASA widget are stored in the `src/environments` folder.
The Rasa chatbots are not publicly available.

For backend servers setup, please refer to the [qualiexplore-stack repository](https://github.com/s-wel/qualiexplore-stack/tree/i4q).

## Installation Instructions

### Environment Setup

1. Navigate to the `\src\environments` directory.
2. Files :
  `environment.prod.ts`: Configuration file for the production environment.
  `environment.ts`: Default configuration file for the development environment or local setup.

3.These files holds the configuration for production or development environment, including URLs for various services.

## URLs

- **Socket URL for QualiExplore Chatbot**
  - Variable: `socketUrlApi`
  - Usage: Connects to the QualiExplore Rasa chatbot.

- **Socket URL for Audit Advisor Chatbot**
  - Variable: `auditUrlApi`
  - Usage: Connects to the Audit Advisor Rasa chatbot.

- **Authentication API**
  - Variable: `authApi`
  - Usage: Manages user authentication and data through GraphQL.

- **GraphQL API for Neo4j**
  - Variable: `graphApi`
  - Usage: Handles data querying and manipulation related to graphs.

- **User Management API**
  - Variable: `userManagementApi`
  - Usage: Manages user-related operations.

## Notes

- Ensure that URLs stored on the environments folder are updated to point to the actual endpoints when building the application.

### Local Setup

1. Clone the repository.
2. Navigate to the qualiexplore Directory.
3. Install dependencies by running `npm install --legacy-peer-deps`
4. Start the application by running `ng serve`.
5. By default, the application will be served on `http://localhost:4200/` and will automatically reload if you make any changes to the source files.
6. To specify a different port please use this command `ng serve --port yourDesiredPortNumber`

## Installation through Docker

QualiExplore is served through `nginx` HTTP Server. See `Dockerfile` for details.

## Build image

``` Bash
npm run build:docker
```

Qualiexplore is also available on [Docker Hub]

- [Dockerhub Image link will be added]

See Dockerfile and docker-compose.yml file for details

## Contact

- [Stefan Wellsandt](mailto:wel@biba.uni-bremen.de)

## Contributors

- [Stefan Wellsandt](mailto:wel@biba.uni-bremen.de)
- [Robin Kuri](mailto:kur@biba.uni-bremen.de)
- [Shantanoo Desai](mailto:des@biba.uni-bremen.de)

## License

__Apache2.0 License__

``` Text
  Copyright 2024
  University of Bremen, Faculty of Production Engineering, Badgasteiner Straße 1, 28359 Bremen, Germany.
  In collaboration with BIBA - Bremer Institut für Produktion und Logistik GmbH, Bremen, Germany.
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
      http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License. MIT License for npm package- "ngx-tree-dnd" : Copyright (c) 2018 Yaroslav Kikot.
```
