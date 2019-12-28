// 1. 'apolloServer 불러오기.
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const { GraphQLScalarType } = require("graphql");
const expressPlayground = require("graphql-playground-middleware-express")
  .default;
const { readFileSync } = require("fs");
const typeDefs = readFileSync("./typeDef.graphql", "UTF-8");
const resolvers = require("./resolvers");
// import resolvers from "./resolvers/resolvers.js";

// 2. express()를 호출하여 익스프레스 애플리케이션을 만든다.
var app = express();

let users = [
  {
    githubLogin: "mHattrup",
    name: "Mike Hattrup"
  },
  {
    githubLogin: "gPlake",
    name: "Glen Plake"
  },
  {
    githubLogin: "sSchmidt",
    name: "Scot Schmidt"
  }
];
let photos = [
  {
    id: "1",
    name: "Dropping the Heart Chute",
    description: "The heart chute is one of my favorite chutes",
    category: "ACTION",
    githubLogin: "gPlake",
    created: "3-28-2017"
  },
  {
    id: "2",
    name: "Enjoying the sunshine",
    category: "SELFIE",
    githubLogin: "sSchmidt",
    created: "3-28-2007"
  },
  {
    id: "3",
    name: "Gunbarrel 25",
    description: "25 laps on gunbarrel today",
    category: "LANDSCAPE",
    githubLogin: "sSchmidt",
    created: "3-28-2005"
  }
];
let tags = [
  { photoID: "1", userID: "gPlake" },
  { photoID: "2", userID: "sSchmidt" },
  { photoID: "2", userID: "mHattrup" },
  { photoID: "2", userID: "gPlake" }
];

const server = new ApolloServer({ typeDefs, resolvers });

// 3. applyMiddleware()를 호출하여 미들웨어가 같은 경로에 마운트되도록 합니다.
server.applyMiddleware({ app });

// 4. 홈 라우트를 만든다.
app.get("/", (req, res) => {
  res.send("PhotoShare API에 오신 것을 환영합니다.");
});

app.get("/playground", expressPlayground({ endpoint: "/graphql" }));
app.listen({ port: 4000 }, () => {
  console.log(
    `GraphQl Server running @ http://localhost:4000${server.graphqlPath}`
  );
});
