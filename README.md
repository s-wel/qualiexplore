# QualiExplore Angular Module

Standalone Frontend Angular application of QualiExplore Component in the [i4Q](www.i4q-project.eu)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.15.

## Important Notes

This App requires to backend server json-server and graphql server.

* Filters and Factors data fetch from json-server and data are stored in db.json file
* Data for user authentication fetch from graphql server

For rasa widget Socket connection has been used and SocketUrl stored as environment variable

## Installation

Run `ng serve` for a dev server
The app will automatically reload if you change any of the source files.

For local setup:

* Run `npm install -g json-server`  --to install json server on the system
* Run `json-server --watch db.json` --to run json server

For Docker use this image from dockerhub : robinkuri/quali-json-server 

* Dockerhub Link : https://hub.docker.com/repository/docker/robinkuri/quali-json-server

## Docker

QualiExplore is served through `nginx` HTTP Server. See `Dockerfile` for details.
Qualiexplore is also available on [Docker Hub]
* V1 https://hub.docker.com/repository/docker/shantanoodesai/qualiexplore
* V2 https://hub.docker.com/repository/docker/robinkuri/qualiexpolire-with-editing-environment

See Dockerfile and docker-compose.yml file for details

## Contact

* [Stefan Wellsandt](mailto:wel@biba.uni-bremen.de)

## Contributors

* [Shantanoo Desai](mailto:des@biba.uni-bremen.de)
* [Stefan Wellsandt](mailto:wel@biba.uni-bremen.de)
* [Robin Kuri](mailto:kur@biba.uni-bremen.de)

## License

__Apache2.0 License__
```
  Copyright 2022
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
