# Linkrun

Linkrun is a large Angular2 app running on a nodejs server.

1. `src` directory has code for client
2. `server` directory has nodejs code for server
3. `config` has configuration for both dev and production.


## Development server
Two terminal windows need to be open to run the development environment.

1. Run `npm run dev` to start the server on `http://localhost:8090/`
2. Run `npm run build:watch` to start the server that will watch any changes in client app and run the build.
3. App Engine will run `npm start`, so make sure that npm start is working
4. `gcloud app deploy`
5. Launch your browser and view the app at http://[YOUR_PROJECT_ID].appspot.com, by running the following command:
`gcloud app browse`

# Deploying on Google Cloud

1. List projects `gcloud config list`
2. Set Project `gcloud config set project [YOUR_PROJECT_ID]`
3. If you have installed the Google Cloud SDK on your machine and 
have run the command `gcloud auth application-default login`, your identity can be used as a proxy to test code calling APIs from that machine.
([see|https://developers.google.com/identity/protocols/application-default-credentials])

4. Run `gcloud app deploy`

# Angular Commands

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to GitHub Pages

Run `ng github-pages:deploy` to deploy to GitHub Pages.

## Further help

To get more help on the `angular-cli` use `ng help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
