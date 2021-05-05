const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
var multer = require('multer');

const schema = require('./schema');

const url = "mongodb://localhost:27017/mavazi";
 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });

const connect = mongoose.connect(url, { useNewUrlParser: true });
connect.then((db) => {
      console.log('Database connected');
}, (err) => {
      console.log(err);
});

const server = new ApolloServer({
      typeDefs: schema.typeDefs,
      resolvers: schema.resolvers
});
const app = express();

app.use(bodyParser.json());
app.use('*', cors());

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`));