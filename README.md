
# Bookshop API

## Environment Variables

The server will need to provide the following environment variables:

1. **PORT** The port at which the API will be served
2. **MONGO_USER** The username of your Mongo database
3. **MONGO_PASS** The password of the Mongo database
4. **MONGO_HOST** The server name or IP address
5. **MONGO_PORT** The Mongo Database server port
6. **MONGO_DB** The name of the Mongo database (bookshop)



Installing devDependencies

npm install jasmine-node --save-dev

Running jasmine locally

./node_modules/.bin/jasmine-node spec/

Install the **Typescript Definition Language** tool and use it to install the _NodeJS_ definitions. This will add node to the autocomplete.
```
npm install tsd -g
tsd query -r -o -a install node jasmine
```
