import { NgModule } from '@angular/core'
import { APOLLO_OPTIONS } from 'apollo-angular'
import {
  ApolloClientOptions,
  ApolloLink,
  InMemoryCache,
} from '@apollo/client/core'
import { HttpLink } from 'apollo-angular/http'
import { HttpHeaders } from '@angular/common/http'
import { setContext } from '@apollo/client/link/context'

const uri = 'http://localhost:5000/graphql' // <-- add the URL of the GraphQL server here

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8',
    },
  }))

  const auth = setContext((operation, context) => {
    const token = localStorage.getItem('token')

    if (token === null) {
      return {}
    } else {
      return {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      }
    }
  })

  const link = ApolloLink.from([basic, auth, httpLink.create({ uri })])
  const cache = new InMemoryCache()

  return {
    link,
    cache,
  }
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})

export class GraphQLModule {}
