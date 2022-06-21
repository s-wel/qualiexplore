# QualiExplore Angular Module

Standalone Frontend Angular application of QualiExplore Component in [NIMBLE Platform](https://github.com/nimble-platform/frontend-service)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://i4q-dev.ikap.biba.uni-bremen.de`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## JSON-Server
A mock json-server backend is used to build this project. This backend is used for CRUD operations on Filters page and generate editable tree for Factors data. Data are stored in `db.json` file. Rest of the things are handeled by GraphQl server.

For local setup:

Run `npm install -g json-server`  --to install json server on the system
Run `json-server --watch db.json` --to run json server

For Docker use this image from dockerhub : robinkuri/quali-json-server 

* Dockerhub Link : https://hub.docker.com/repository/docker/robinkuri/quali-json-server


## Important Notes

This App now need to backend server json-server and graphql server.

* Editable Filters and Editable Factors data fetch from json-server and data are stored in db.json file
* Static Filters and Factors data fetch from graphql server

## Contact

* [Shantanoo Desai](mailto:des@biba.uni-bremen.de)
* [Stefan Wellsandt](mailto:wel@biba.uni-bremen.de)
* [Robin Kuri](mailto:kur@biba.uni-bremen.de)

## Docker

QualiExplore is served through `nginx` HTTP Server. See `Dockerfile` for details.
Qualiexplore is also available on [Docker Hub]
1. https://hub.docker.com/repository/docker/shantanoodesai/qualiexplore
2. https://hub.docker.com/repository/docker/robinkuri/qualiexpolire-with-editing-environment

### Local Development

__Build Image__:

```bash
  npm run build:docker
```

__Run Image__:

```bash
  npm run start:docker
```

__Local Development Using `docker-compose`__:

See Dockerfile and docker-compose.yml file

## License

__Apache2.0 License__
```
  Copyright 2020
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
