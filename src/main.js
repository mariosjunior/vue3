import { createApp, provide, h } from 'vue'
import { ApolloClient, InMemoryCache, createHttpLink} from '@apollo/client';
import { DefaultApolloClient } from '@vue/apollo-composable'
import { setContext } from '@apollo/client/link/context';
import 'nprogress/nprogress.css'
import App from './App.vue'



const httpLink = createHttpLink({
  uri: 'https://ecs-api-stage.jovensgenios.com/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('apollo-token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const defaultClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})
createApp(
  {
    setup () {
      provide(DefaultApolloClient, defaultClient)
    },
    render() {
      return h(App)
    }
  }
).mount('#app')
