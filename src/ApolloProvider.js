// Set Apollo Client Provider - provides apolla client to application so we can connect to grpahql server
import React from 'react'
import App from './App'
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client'
import { createHttpLink } from "apollo-link-http";
import { setContext } from 'apollo-link-context'

const httplink = createHttpLink({ uri: "http://localhost:5000" });

const AuthLink = setContext(() => {
	const token = localStorage.getItem('jwtToken')
	return {
		headers: {
			Authorization: token ? `Bearer ${token}` : ''
		}
	} //modifies current request to add auth header so that mutations are possible when logged in
})

const client = new ApolloClient({
	link: AuthLink.concat(httplink),
	cache: new InMemoryCache()
});

export default (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
)