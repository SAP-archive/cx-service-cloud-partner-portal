# Partner Portal application backend

For the architecture, design, and API documentation, please  read the [internal WIKI page](https://confluence.coresystems.net/display/cloud/FSM+Architecture)

## Setup
Install all dependencies.
```bash
npm install
```

### Build and run
Use `npm install` to install all dependencies.

Execute `npm run start:local:et` to start local server against the ET environment backend.


## Directory Service (Mock)

In order to log into any account, a directory service needs to be available.
For setup, follow the instructions of [tools-mock-ds](../../tools-mock-ds/).


## Tests
```bash
npm run test-ci
```
