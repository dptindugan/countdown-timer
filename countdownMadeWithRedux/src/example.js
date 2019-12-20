const initialState = {
	seconds: 0,
	start_time: 0,
	status: "paused",
	decrement_interval: 0
};

const countdownTimer = (state = initialState, action) => {
	switch (action.type) {
		case "START_TIMER":
			return Object.assign({}, state, {
				start_time: action.start_time,
				seconds: action.start_time,
				status: "counting down"
			});
		case "STOP_TIMER":
			return Object.assign({}, state, { status: "paused" });
		case "TICK":
			return Object.assign({}, state, {
				seconds: (state.seconds - 0.01).toFixed(2)
			});
		default:
			return state;
	}
};

const store = createStore(countdownTimer);

/*
 * react app
 */

class TimerInput extends React.Component {
	constructor() {
		super();
		this.state = {
			timeInput: 0
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.cancelTimer = this.cancelTimer.bind(this);
	}

	render() {
		//console.log(store.getState());
		return (
			<form onSubmit={this.handleSubmit}>
				<input
					type="number"
					placeholder={this.state.timeInput}
					onChange={this.handleChange}
				/>
				<div className="form-controls">
					<button>Start</button>
					<button onClick={this.cancelTimer}>Stop</button>
				</div>
			</form>
		);
	}

	cancelTimer(event) {
		event.preventDefault();
		store.dispatch({
			type: "STOP_TIMER"
		});
		this.props.cancelTimer();
	}

	handleSubmit(event) {
		event.preventDefault();
		if (this.state.timeInput !== 0) {
			store.dispatch({
				type: "START_TIMER",
				start_time: this.state.timeInput
			});
			this.props.startTimer();
		}
	}

	handleChange(event) {
		this.setState({
			timeInput: event.target.value
		});
	}
}

TimerInput.propTypes = {
	startTimer: PropTypes.func.isRequired,
	cancelTimer: PropTypes.func.isRequired
};

//Stateless functional component
const CountDown = props => (
	<div className="countdown">
		Seconds Remaining:{" "}
		<span>{parseFloat(props.secondsRemaining).toFixed(2)}</span>
	</div>
);

CountDown.propTypes = {
	secondsRemaining: PropTypes.number.isRequired
};

const intervalLength = 10; // in milliseconds

class App extends React.Component {
	constructor() {
		super();
		// this.state = {
		//   secondsRemaining : 0
		// }

		this.tick = this.tick.bind(this);
		this.startTimer = this.startTimer.bind(this);
		this.cancelTimer = this.cancelTimer.bind(this);
	}

	componentDidMount() {
		// this.setState({
		//   secondsRemaining: this.state.secondsRemaining
		// });
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		console.log(store.getState());
		return (
			<div>
				<TimerInput
					startTimer={this.startTimer}
					cancelTimer={this.cancelTimer}
					interval={this.interval}
				/>
				<CountDown
					secondsRemaining={parseFloat(this.props.store.seconds)}
				/>
			</div>
		);
	}

	cancelTimer() {
		clearInterval(this.interval);
	}

	tick() {
		store.dispatch({
			type: "TICK"
		});

		if (this.props.store.seconds <= 0) {
			clearInterval(this.interval);
			store.dispatch({
				type: "STOP_TIMER"
			});
		}
	}

	startTimer() {
		this.interval = setInterval(this.tick, intervalLength);
	}
}
