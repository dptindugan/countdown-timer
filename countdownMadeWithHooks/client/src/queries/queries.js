import { gql } from "apollo-boost";

const getLoggingsQuery = gql`
	{
		getLogs {
			id
			stopTime
			startTime
		}
	}
`;

const getLoggingQuery = gql`
	query($id: ID) {
		getLog(id: $id) {
			id
			stopTime
			startTime
		}
	}
`;

export { getLoggingsQuery, getLoggingQuery };
