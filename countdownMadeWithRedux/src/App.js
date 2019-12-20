import React from "react";
import "./App.css";
// import { useSelector, useDispatch } from "react-redux";
import Timer from "./components/Timer";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
const client = new ApolloClient({ uri: "http://localhost:7878/graphql" });

// store.subscribe(() => {
// 	console.log("state updated");
// });

function App() {
	return (
		<ApolloProvider client={client}>
			<Timer />
		</ApolloProvider>
	);
}

export default App;
