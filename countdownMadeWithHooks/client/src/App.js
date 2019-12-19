import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Timer from "./components/Timer";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
const client = new ApolloClient({ uri: "http://localhost:7878/graphql" });

function App() {
	return (
		<ApolloProvider client={client}>
			<Timer />;
		</ApolloProvider>
	);
}

export default App;
