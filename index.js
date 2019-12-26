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
let photos = [];

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
    url: parent => `http://yoursite.com/img/${parent.id}.jpg`
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
