const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LoggingSchema = new Schema(
	{
		startTime: { type: String },
		stopTime: { type: String }
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("Logging", LoggingSchema);
