const initState = {
	minutesStarted: 0,
	secondsStarted: 0,
	minutes: 0,
	seconds: 0,
	paused: true,
	over: false,
	timeLogId: ""
};

const countdownReducer = (state = initState, action) => {
	if (typeof state === "undefined") {
		return 0;
	} else if (action.type === "START_TIMER") {
		return {
			...state,
			paused: false,
			over: false
		};
	} else if (action.type === "STOP_TIMER") {
		return {
			...state,
			paused: true
			// over: action.over ? action.over : false
		};
	} else if (action.type === "RESET_TIMER") {
		return {
			paused: true,
			minutes: state.minutesStarted,
			seconds: state.secondsStarted,
			timeLogId: "",
			over: action.over ? action.over : false
		};
	} else if (action.type === "TICK") {
		// console.log("I am tick");

		if (state.paused) {
			return { ...state };
		} else if (state.minutes === 0 && state.seconds === 0) {
			return {
				...state,
				paused: true,
				over: true
			};
		} else if (state.seconds === 0) {
			return {
				...state,
				minutes: state.minutes - 1,
				seconds: 59
			};
		} else {
			return {
				...state,
				minutes: state.minutes,
				seconds: state.seconds - 1
			};
		}
	}
	if (action.type === "LOG_ID") {
		return {
			...state,
			timeLogId: action.timeLogId
		};
	}
	if (action.type === "SET_MINUTES") {
		return {
			...state,
			minutes: action.minutes
		};
	}
	if (action.type === "SET_SECONDS") {
		return {
			...state,
			seconds: action.seconds
		};
	}
	if (action.type === "SET_START_TIME") {
		return {
			...state,
			minutesStarted: action.minutes,
			secondsStarted: action.seconds
		};
	}
};

export default countdownReducer;
