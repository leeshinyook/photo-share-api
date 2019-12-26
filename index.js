// 1. 'apolloServer 불러오기.
const { ApolloServer } = require("apollo-server");

const typeDefs = `
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
      postedBy: User!
    }
    type User {
      githubLogin: ID!
      name: String
      avatar: String
      postedPhotos: [Photo!]!
    }
    input PostPhotoInput {
      name: String!
      category: PhotoCategory=PORTRAIT
      description: String
    }
    type Query {
        totalPhotos: Int!
        allPhotos: [Photo!]!
    }
    type Mutation {
        postPhoto(input: PostPhotoInput!): Photo!
    }
`;

let _id = 0;
// let photos = [];
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
    githubLogin: "gPlake"
  },
  {
    id: "2",
    name: "Enjoying the sunshine",
    category: "SELFIE",
    githubLogin: "sSchmidt"
  },
  {
    id: "3",
    name: "Gunbarrel 25",
    description: "25 laps on gunbarrel today",
    category: "LANDSCAPE",
    githubLogin: "sSchmidt"
  }
];

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos
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
    }
  },
  User: {
    postedPhotos: parent => {
      return photos.filter(p => p.githubLogin === parent.githubLogin);
    }
  }
};
// 2. 서버 인스턴스를 새로 만든다.
// 3. typeDefs(스키마)와 리졸버를 객체에 넣어 전달한다.
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// 4. 웹서버 구동을 위해 listen메서드를 호출한다.
server
  .listen()
  .then(({ url }) => console.log("GraphQl server running on ${url}"));
