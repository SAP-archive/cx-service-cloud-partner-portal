# SAP FSM Crowd Partner Portal

Partner Portal enables [SAP FSM Crowd](https://apps.coresystems.net/marketplace/) service partners to:
* maintain their technicians data (skills, certificates, contact information, etc.)
* upload and maintain company information (e.g. upload certificate documents)

This repository contains a reference implementation. It is an example on how to use our public APIs. It helps crowd owners to offer their service partners a customized experience.


## Table of contents

- [Partner Portal](#partner-portal)
  - [Table of contents](#table-of-contents)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Known issues](#known-issues)
  - [How to obtain support](#how-to-obtain-support)
  - [Contributing](#contributing)
  - [To-Do (upcoming changes)](#to-do-upcoming-changes)
  - [Architecture](#architecture)
  - [SAP APIs being used](#sap-apis-being-used)
  - [License](#license)

## Requirements
* Node.js (find required version in the `.nvmrc` files)
* @angular/cli installed globally ([link](https://cli.angular.io/))
* Valid credentials for the *SAP Customer Experience - Service Cloud*


## Installation

Run the application backend:
```shell
> cd backend
> npm install
> npm run start:local:de
```

Then start the UI:
```shell
> cd frontend
> npm install
> npm run dev
```

The webpage will be accessible under:
```
http://localhost:4200
```

## Configuration

The application can be started with configuration files as parameters. Those files are located under `/backend/config`. Create new configurations as needed.


## Known issues

None


## How to obtain support

There is no support offered for this project. The project serves as reference implementation on how to use our APIs.


## Contributing

Contributions are not supported. Since this is just example code.


## To-Do (upcoming changes)

## Architecture

In the repository, there are two folders:
1. _frontend_, containing the user interface
2. _backend_, the application backend

(Following the [FBB](https://samnewman.io/patterns/architectural/bff/) pattern.)

The application itself is being executed as a stateless client. There is only ephemeral data being processed in the frontend.

The following libraries are utilized:
* Frontend
  * Angular
  * ngrx
  * Karma + Jasmine for tests
  * Angular CLI as build manager
* Backend
  * express.js
  * Mocha for tests
  * gulp as build manager


## SAP APIs being used

The following public APIs are being utilized:
* Branding Settings Service ([docs](https://de.coresuite.com/cloud-crowd-branding-service/swagger-ui.html))
* Crowd Service ([docs](https://de.coresuite.com/cloud-crowd-service/swagger-ui.html))
* OAuth2 (endpoint `https://de.coresuite.com/api/oauth2/`)


## License
Copyright (c) 2020 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, v. 2 except as noted otherwise in the [LICENSE file](LICENSE).
