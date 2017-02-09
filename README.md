
# Bookshop API

## Installation

Installation is simple and straightforward. The first step is to ensure that the latest version of **Node Version Manager** (NVM) is installed then use this to install the latest version of NodeJS.
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
source ~/.bashrc
nvm list-remote
  ...
  v7.4.0
  v7.5.0
nvm install 7.5.0
node -v
  v7.5.0
```
Next we need to clone the repository and install all the dependencies, the `--production` flag means only the dependencies will be installed (no devDependencies).
```
git clone https://github.com/covcom/bookshop.git
cd bookshop
npm install --production
```
Finally the API can be run.
```
node index
```
To stop the script press ctrl+C

## Environment Variables

The server will need to provide the following environment variables. Instructions on setting environment variables was in the _deployment_ lab:

1. **PORT** The port at which the API will be served
2. **MONGO_USER** The username of your Mongo database
3. **MONGO_PASS** The password of the Mongo database
4. **MONGO_HOST** The server name or IP address
5. **MONGO_PORT** The Mongo Database server port
6. **MONGO_DB** The name of the Mongo database (bookshop)

## Using the API

by studying the `index.js` file which contains the _routes_, it should be clear how to use the API. The book search requires a URL parameter called `q`.

```
/books?q=security
```

Installing devDependencies

npm install jasmine-node --save-dev

Running jasmine locally

./node_modules/.bin/jasmine-node spec/

Install the **Typescript Definition Language** tool and use it to install the _NodeJS_ definitions. This will add node to the autocomplete.
```
npm install tsd -g
tsd query -r -o -a install node jasmine
```
