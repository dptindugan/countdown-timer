const { ApolloServer, gql } = require("apollo-server-express");
const { GraphQLDateTime } = require("graphql-iso-date");

const Logging = require("../models/Logging");

const customScalarResolver = {
	Date: GraphQLDateTime
};

const typeDefs = gql`
	scalar Date
	type LogType {
		id: ID
		startTime: String
		stopTime: String
		createdAt: Date
		updatedAt: Date
	}

	type Mutation {
		createLog(startTime: String, stopTime: String): LogType

		updateLog(id: ID!, startTime: String, stopTime: String): LogType

		deleteLog(id: ID!): Boolean
	}

	type Query {
		getLogs: [LogType]
		getLog(id: ID): LogType
	}
`;

const resolvers = {
	Query: {
		getLogs: () => {
			return Logging.find({});
		},
		getLog: (_, { id }) => {
			return Logging.findById(id);
		}
	},

	Mutation: {
		createLog: (_, { startTime, stopTime }) => {
			let newLog = new Logging({
				startTime: startTime,
				stopTime: stopTime
			});
			return newLog.save();
		},

		updateLog: (_, { id, startTime, stopTime }) => {
			return Logging.findByIdAndUpdate(id, {
				$set: {
					stopTime: stopTime
				}
			});
		},

		// or this
		// updateLog: (_, args) => {
		// 	return Logging.findByIdAndUpdate(args.id, {
		// 		$set: {
		// 			stopTime: args.stopTime,
		// 		}
		// 	});
		// },

		deleteLog: (_, { id }) => {
			return Logging.findByIdAndDelete(id).then((logging, err) => {
				if (err || !logging) {
					// console.log("delete fail")
					return false;
				} else {
					// console.log("delete success")
					return true;
				}
			});
		}
	}
};

// create an instance of apollo server
const server = new ApolloServer({
	typeDefs,
	resolvers
});

// export module
module.exports = server;
