import React, { useEffect, useState } from "react";
import { graphql } from "react-apollo";
import {
	createLoggingMutation,
	updateLoggingMutation,
	deleteLogMutation
} from "../queries/mutation";
import { getLoggingsQuery } from "../queries/queries";
import { flowRight } from "lodash";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Swal from "sweetalert2";

const Timer = props => {
	let timeLogs = props.getLoggingsQuery.getLogs
		? props.getLoggingsQuery.getLogs
		: [];

	const [timeLogId, setTimeLogId] = useState("");

	// for the timer
	const [paused, setPaused] = useState(false);
	const [over, setOver] = useState(true);
	const [time, setTime] = useState({
		minutes: 0,
		seconds: 2
	});

	const timeHandler = ({ target: { id } }) => {
		if (id === "start") {
			if (paused || over) {
				const { minutes, seconds } = time;
				if (minutes !== 0 || seconds !== 0) {
					let newLog = {
						startTime: `${(0)
							.toString()
							.padStart(2, "0")}:${minutes
							.toString()
							.padStart(2, "0")}:${seconds
							.toString()
							.padStart(2, "0")}`
					};

					props
						.createLoggingMutation({
							variables: newLog,
							refetchQueries: [
								{
									query: getLoggingsQuery
								}
							]
						})
						.then(res => setTimeLogId(res.data.createLog.id));
				}
			}

			setPaused(false);
			setOver(false);
		}

		if (id === "stop") {
			const { minutes, seconds } = time;
			if (!paused || over) {
				let newLog = {
					id: timeLogId,
					stopTime: `${(0)
						.toString()
						.padStart(2, "0")}:${minutes
						.toString()
						.padStart(2, "0")}:${seconds
						.toString()
						.padStart(2, "0")}`
				};

				props.updateLoggingMutation({
					variables: newLog,
					refetchQueries: [
						{
							query: getLoggingsQuery
						}
					]
				});
			}
			setPaused(true);
		}
	};

	const tick = () => {
		if (paused || over) return;
		if (time.minutes === 0 && time.seconds === 0) {
			setTimeLogId("");
			Swal.fire("Time's up!");
			const { minutes, seconds } = time;
			if (!paused || over) {
				let newLog = {
					id: timeLogId,
					stopTime: `${(0)
						.toString()
						.padStart(2, "0")}:${minutes
						.toString()
						.padStart(2, "0")}:${seconds
						.toString()
						.padStart(2, "0")}`
				};

				props.updateLoggingMutation({
					variables: newLog,
					refetchQueries: [
						{
							query: getLoggingsQuery
						}
					]
				});
			}
			setOver(true);
			setTime({
				minutes: 2,
				seconds: 0
			});
		} else if (time.seconds === 0)
			setTime({
				minutes: time.minutes - 1,
				seconds: 59
			});
		else
			setTime({
				minutes: time.minutes,
				seconds: time.seconds - 1
			});
	};

	const reset = () => {
		setTime({
			minutes: 2,
			seconds: 0
		});
		setPaused(false);
		setOver(true);

		const { minutes, seconds } = time;
		if (!paused || over) {
			// check if the logging exits
			if (timeLogId !== "") {
				let newLog = {
					id: timeLogId,
					stopTime: `${(0)
						.toString()
						.padStart(2, "0")}:${minutes
						.toString()
						.padStart(2, "0")}:${seconds
						.toString()
						.padStart(2, "0")}`
				};

				props.updateLoggingMutation({
					variables: newLog,
					refetchQueries: [
						{
							query: getLoggingsQuery
						}
					]
				});
			}
		}
	};

	const deletBtn = id => {
		if (id !== timeLogId || paused || over) {
			return (
				<Button id={id} onClick={deleteHandler}>
					delete
				</Button>
			);
		}
	};

	useEffect(() => {
		let timerID = setInterval(() => tick(), 1000);
		return () => clearInterval(timerID);
	});

	const deleteHandler = e => {
		if (e.target.id === timeLogId) {
			setTimeLogId("");
		}

		let deleteLog = {
			id: e.target.id
		};
		props.deleteLogMutation({
			variables: deleteLog,
			refetchQueries: [
				{
					query: getLoggingsQuery
				}
			]
		});
	};

	return (
		<Container className="p-5">
			<Row className="mt-5">
				<Col className="text-center" xs={12} md={6}>
					<Card>
						<Card.Header>
							<h2>Timer</h2>
						</Card.Header>
						<Card.Body>
							<h1>
								{`${time.minutes
									.toString()
									.padStart(
										2,
										"0"
									)}:${time.seconds
									.toString()
									.padStart(2, "0")}`}
							</h1>
							<Row>
								<Col>
									<Button
										id="start"
										onClick={timeHandler}
										block
									>
										start
									</Button>
								</Col>
								<Col>
									<Button
										id="stop"
										onClick={timeHandler}
										variant="danger"
										block
									>
										stop
									</Button>
								</Col>
								<Col>
									<Button
										onClick={reset}
										variant="outline-secondary"
										block
									>
										reset
									</Button>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Col>

				<Col xs={12} md={6}>
					<Card>
						<Card.Header>
							<h3>Time Logs</h3>
						</Card.Header>
						<Table striped hover responsive>
							<thead className="thead-dark">
								<tr>
									<th scope="col">#</th>
									<th scope="col">start time</th>
									<th scope="col">stop time</th>
									<th scope="col">action</th>
								</tr>
							</thead>
							<tbody>
								{timeLogs.map((timeLog, index) => {
									const { id, startTime, stopTime } = timeLog;
									return (
										<tr key={index}>
											<th scope="row">{index + 1}</th>
											<td>{startTime}</td>
											<td>{stopTime}</td>
											<td>{deletBtn(id)}</td>
										</tr>
									);
								})}
							</tbody>
						</Table>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default flowRight(
	graphql(getLoggingsQuery, { name: "getLoggingsQuery" }),
	graphql(createLoggingMutation, { name: "createLoggingMutation" }),
	graphql(updateLoggingMutation, { name: "updateLoggingMutation" }),
	graphql(deleteLogMutation, { name: "deleteLogMutation" })
)(Timer);
