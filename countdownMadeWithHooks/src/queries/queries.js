import { gql } from "apollo-boost";

const getLoggingsQuery = gql`
	{
		getLogs {
			id
			stopTime
			startTime
			createdAt
			updatedAt
		}
	}
`;

const getLoggingQuery = gql`
	query($id: ID) {
		getLog(id: $id) {
			id
			stopTime
			startTime
			createdAt
			updatedAt
		}
	}
`;

export { getLoggingsQuery, getLoggingQuery };
