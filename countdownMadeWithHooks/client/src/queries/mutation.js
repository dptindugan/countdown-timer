import { gql } from "apollo-boost";

const createLoggingMutation = gql`
	mutation($startTime: String, $stopTime: String) {
		createLog(startTime: $startTime, stopTime: $stopTime) {
			id
			startTime
			stopTime
		}
	}
`;

const updateLoggingMutation = gql`
	mutation($id: ID!, $startTime: String, $stopTime: String) {
		updateLog(id: $id, startTime: $startTime, stopTime: $stopTime) {
			id
			startTime
			stopTime
		}
	}
`;

const deleteLogMutation = gql`
	mutation($id: ID!) {
		deleteLog(id: $id)
	}
`;

export { createLoggingMutation, updateLoggingMutation, deleteLogMutation };
