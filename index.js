// 1. 'apolloServer 불러오기.
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const { GraphQLScalarType } = require("graphql");

// 2. express()를 호출하여 익스프레스 애플리케이션을 만든다.
var app = express();
const server = new ApolloServer({ typeDefs, resolvers });

// 3. applyMiddleware()를 호출하여 미들웨어가 같은 경로에 마운트되도록 합니다.
server.applyMiddleware({ app });

// 4. 홈 라우트를 만든다.
app.get("/", (req, res) => {
  res.end("PhotoShare API에 오신 것을 환영합니다.");
});
app.listen({ port: 4000 }, () => {
  console.log(
    `GraphQl Server running @ http://localhost:4000${server.graphqlPath}`
  );
});
const typeDefs = `
    scalar DateTime
    enum PhotoCategory {
      SELFIE
      PORTRAIT
      ACTION
      LANDSCAPE
      GRAPHIC
    }
    type Photo {
      id: ID!
      url: String!
      name: String!
      description: String
      category: PhotoCategory!
      created: DateTime
      postedBy: User!
      taggedUsers: [User!]!
    }
    type User {
      githubLogin: ID!
      name: String
      avatar: String
      postedPhotos: [Photo!]!
      inPhotos: [Photo!]!
    }
    input PostPhotoInput {
      name: String!
      category: PhotoCategory=PORTRAIT
      description: String
    }
    type Query {
        totalPhotos: Int!
        allPhotos(after: DateTime): [Photo!]!
    }
    type Mutation {
        postPhoto(input: PostPhotoInput!): Photo!
    }
`;

let _id = 0;
// let photos = [];
let d = new Date("12/28/2019");
console.log(d.toISOString());
const serialize = value => new Date(value).toISOString();
const parseValue = value => new Date(value);

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

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: (parent, args) => {
      args.after;
    }
  },
  Mutation: {
    postPhoto(parent, args) {
      let newPhoto = {
        id: _id++,
        ...args.input
      };
      photos.push(newPhoto);
      return newPhoto;
    }
  },
  Photo: {
    url: parent => `http://yoursite.com/img/${parent.id}.jpg`,
    postedBy: parent => {
      return users.find(u => u.githubLogin === parent.githubLogin);
    },
    taggedUsers: parent =>
      tags
        .filter(tag => tag.photoID === parent.id)
        .map(tag => tag.userID)
        .map(userID => users.find(u => u.githubLogin === userID))
  },
  User: {
    postedPhotos: parent => {
      return photos.filter(p => p.githubLogin === parent.githubLogin);
    },
    inPhotos: parent =>
      tags
        .filter(tag => tag.userID === parent.id)
        .map(tag => tag.photoID)
        .map(photoID => photos.find(p => p.id === photoID))
  },
  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "A Valid date time value",
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString,
    parseLiteral: ast => ast.value
  })
};
