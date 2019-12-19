const express = require("express");

const app = express();

const port = process.env.PORT || 7878;
const mongoose = require("mongoose");
const server = require("./queries/queries.js");

mongoose.connect(
	"mongodb+srv://seierherre:qgWujmRGrCfbPnTG@cluster0-zxhmp.mongodb.net/loggingsDB?retryWrites=true&w=majority",
	{
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
		useCreateIndex: true
	}
);

mongoose.connection.once("open", () => {
	console.log("Now connected to the online Mongodb server");
});

server.applyMiddleware({
	app,
	path: "/graphql"
});

app.listen(port, () => {
	console.log(
		`🚀 Server ready at http://localhost:${port + server.graphqlPath}`
	);
});
