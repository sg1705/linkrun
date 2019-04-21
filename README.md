# Linkrun
Test
Linkrun is a large Angular2 app running on a nodejs server.

1. `src` directory has code for client
2. `server` directory has nodejs code for server
3. `config` has configuration for both dev and production.


## Development server
Two terminal windows need to be open to run the development environment.

### Set Google Cloud Project
1. Make sure `gcloud auth` is using your admin@link.run account
2. List projects `gcloud config list`
3. Set Project `gcloud config set project beta-linkrun`
4. Set application `gcloud auth application-default login`
5. Confirm using `gcloud config list`


### Start development server
1. Run `cd client && npm install && ng build -watch` to start the server that will watch any changes in client app and run the build.
2. Run `npm run dev` to start the server on `http://localhost:8090/`
3. App Engine will run `npm start`, so make sure that npm start is working
4. `gcloud app deploy`
5. Launch your browser and view the app at http://[YOUR_PROJECT_ID].appspot.com, by running the following command:
`gcloud app browse`

If you have installed the Google Cloud SDK on your machine and 
have run the command `gcloud auth application-default login`, your identity can be used as a proxy to test code calling APIs from that machine.
([see|https://developers.google.com/identity/protocols/application-default-credentials])


# Deploying on Google Cloud Staging

1. Build for product `npm install && cd client && npm install && cd .. && npm run build:staging`
2. Change the environment variable in app.yaml to `staging`
3. List projects `gcloud config list`
4. Set Project `gcloud config set project beta-linkrun`
4. Set application `gcloud auth application-default login`
5. Confirm using `gcloud config list`
6. Run `gcloud app deploy`

# Deploying on Google Cloud Production
When building angular application for production, we should make sure that we are passing `--env=prod` flag 
to `ng build`. `npm run build:prod` passes the environment flag.

1. Build for product `npm install && cd client && npm install && cd .. && npm run build:prod`
2. Change the environment variable in app.yaml to `production`
3. List projects `gcloud config list`
4. Set Project `gcloud config set project prod-linkrun`
4. Set application `gcloud auth application-default login`
5. Confirm using `gcloud config list`
6. Run `gcloud app deploy`

# Google Analytics 

 ## Custom tracking dimensions
 cd1: org-id
 cd2: client-id
 cd3: user-id
 
 ## Events
 Event Category: Link
 Event Action: redirect
 Event Label: link id(redirect), short name(creat), or error message
