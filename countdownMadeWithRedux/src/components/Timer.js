import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { graphql } from "react-apollo";
import {
	createLoggingMutation,
	updateLoggingMutation,
	deleteLogMutation
} from "../queries/mutations";
import { getLoggingsQuery } from "../queries/queries";
import { flowRight } from "lodash";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Swal from "sweetalert2";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { format, parseISO } from "date-fns";

const Timer = props => {
	let timeLogs = props.getLoggingsQuery.getLogs
		? props.getLoggingsQuery.getLogs
		: [];
	let dispatch = useDispatch();
	let state = Object.assign(
		{},
		useSelector(state => state)
	);
	const { paused, over } = state;

	if (props.getLoggingsQuery.loading) {
		Swal.fire({
			title: "Loading...",
			timer: 1000,
			timerProgressBar: true,
			onBeforeOpen: () => {
				Swal.showLoading();
			}
		});
	}
	// console.log(state.seconds);
	const tick = () => {
		// console.log(state.minutesStarted);
		// console.log(state.secondsStarted);
		if (state.paused || state.over) return;

		dispatch({
			type: "TICK"
		});

		if (state.minutes === 0 && state.seconds === 0) {
			// if (!over || paused) {
			// if (state.minutesStarted > 0 || state.secondsStarted > 0) {
			// check if the logging exits
			if (state.timeLogId !== "") {
				Swal.fire("Time's up!");
				let newLog = {
					id: state.timeLogId,
					stopTime: `${minutes
						.toString()
						.padStart(2, "0")}:${seconds
						.toString()
						.padStart(2, "0")}`
				};

				props
					.updateLoggingMutation({
						variables: newLog,
						refetchQueries: [
							{
								query: getLoggingsQuery
							}
						]
					})
					.then(res => {
						dispatch({
							...state,
							type: "RESET_TIMER",
							over: true
						});
					});
			}
			// }
			// }
			// return;
		}

		// if (state.minutes === 0 && state.seconds === 0) {
		// 	return;
		// }
	};

	useEffect(() => {
		let interval = setInterval(tick, 1000);
		return () => clearInterval(interval);
	});

	let minutes = state.minutes ? state.minutes : 0,
		seconds = state.seconds ? state.seconds : 0;

	const inputChangeHandler = ({ target: { name, value } }) => {
		// for input minutes
		if (name === "minutes") {
			dispatch({
				...state,
				type: "SET_MINUTES",
				minutes: value
			});
		}

		if (name === "seconds") {
			dispatch({
				...state,
				type: "SET_SECONDS",
				seconds: value
			});
		}
	};

	const start = () => {
		if (paused || over) {
			if (minutes !== 0 || seconds !== 0) {
				dispatch({
					...state,
					type: "START_TIMER"
				});
				dispatch({
					...state,
					type: "SET_START_TIME",
					minutes: state.minutes,
					seconds: state.seconds
				});
				Swal.fire({
					title: "Time Started!",
					timer: 700,
					showConfirmButton: false
				});
				let newLog = {
					startTime: `${minutes
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
					.then(res => {
						dispatch({
							type: "LOG_ID",
							timeLogId: res.data.createLog.id
						});
					});
			} else {
				Swal.fire("Please Enter A Value!");
			}
		}
	};

	const stop = () => {
		dispatch({
			...state,
			type: "STOP_TIMER"
		});

		if (!paused || over) {
			if (state.timeLogId !== "") {
				Swal.fire("Time Stopped!");
				let newLog = {
					id: state.timeLogId,
					stopTime: `${minutes
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

	const deleteFunc = id => {
		// console.log(id);
		let deleteLog = {
			id: id
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

	const buttonHandler = ({ target: { id, name } }) => {
		// start button function
		if (id === "start") {
			start();
		}

		// stop button function
		if (id === "stop") {
			stop();
		}

		// reset button function
		if (id === "reset") {
			if (!paused || over) {
				// check if the logging exits
				if (state.timeLogId !== "") {
					let newLog = {
						id: state.timeLogId,
						stopTime: `${minutes
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
					dispatch({
						...state,
						type: "RESET_TIMER"
					});
				}
			}
		}

		// delete button function
		if (name === "delete") {
			deleteFunc(id);
		}
	};

	const deletBtn = id => {
		if (id !== state.timeLogId || paused || over) {
			return (
				<Button
					id={id}
					name="delete"
					onClick={buttonHandler}
					variant="danger"
				>
					delete
				</Button>
			);
		}
	};

	const inputBox = () => {
		if (over || paused) {
			return (
				<Row>
					<InputGroup className="mb-3 col">
						<FormControl
							type="number"
							name="minutes"
							placeholder="minutes"
							onChange={inputChangeHandler}
							value={minutes}
						/>
					</InputGroup>
					<span className="col-1">:</span>
					<InputGroup className="mb-3 col">
						<FormControl
							type="number"
							name="seconds"
							placeholder="seconds"
							onChange={inputChangeHandler}
							value={seconds}
						/>
					</InputGroup>
				</Row>
			);
		}
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
							{inputBox()}
							<h1>
								{`${minutes
									.toString()
									.padStart(
										2,
										"0"
									)}:${seconds.toString().padStart(2, "0")}`}
							</h1>
							<Row>
								<Col>
									<Button
										id="start"
										onClick={buttonHandler}
										block
										variant="success"
									>
										Start
									</Button>
								</Col>
								<Col>
									<Button
										id="stop"
										onClick={buttonHandler}
										variant="danger"
										block
									>
										Stop
									</Button>
								</Col>
								<Col>
									<Button
										id="reset"
										onClick={buttonHandler}
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
									<th scope="col">Timestamp</th>
									<th scope="col">action</th>
								</tr>
							</thead>
							<tbody>
								{timeLogs.map((timeLog, index) => {
									const {
										id,
										startTime,
										stopTime,
										createdAt
									} = timeLog;
									return (
										<tr key={index}>
											<th scope="row">{index + 1}</th>
											<td>{startTime}</td>
											<td>{stopTime}</td>
											<td>
												{format(
													parseISO(createdAt),
													"MMM-dd-yy, hh:mm:ss"
												)}
											</td>
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
