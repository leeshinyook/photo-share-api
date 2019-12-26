// 1. 'apolloServer 불러오기.
const {
  ApolloServer
} = require('apollo-server');

const typeDefs = `
    type Query {
        totalPhotos: Int!
    }
`

const resolvers = {
  Query: {
    totalPhotos: () => 42
  }
}
// 2. 서버 인스턴스를 새로 만든다.
// 3. typeDefs(스키마)와 리졸버를 객체에 넣어 전달한다.
const server = new ApolloServer({
  typeDefs,
  resolvers
})

// 4. 웹서버 구동을 위해 listen메서드를 호출한다.
server.listen().then(({
  url
}) => console.log("GraphQl server running on ${url}"));
