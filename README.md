# QualiExplore Angular Module

Angular application of the QualiExplore component in the [i4Q](www.i4q-project.eu)

*TODO Update*
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.15.

This App requires to backend server mongodb-graphql and neo4j-graphql server.

* Data for user authentication fetched from mongodb-graphql server
* Rest of the things are hanledled by neo4j-graphql server
* Backend URLs are stored in environment folder
* For rasa widget Socket connection has been used and SocketUrl stored in environment folder

## Installation

Run `ng serve` for a dev server. The app will automatically reload if you change any of the source files.
Use the docker-compose.yml file to create a mini-stack.

qualiexplore-stack: https://github.com/s-wel/qualiexplore-stack/tree/i4q

## Docker

QualiExplore is served through `nginx` HTTP Server. See `Dockerfile` for details.
Qualiexplore is also available on [Docker Hub]

*  [Dockerhub Image link will be added]

See Dockerfile and docker-compose.yml file for details

## Contact

* [Stefan Wellsandt](mailto:wel@biba.uni-bremen.de)

## Contributors

* [Shantanoo Desai](mailto:des@biba.uni-bremen.de)
* [Stefan Wellsandt](mailto:wel@biba.uni-bremen.de)
* [Robin Kuri](mailto:kur@biba.uni-bremen.de)


## License

__Apache2.0 License__

``` Text
  Copyright 2023
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
