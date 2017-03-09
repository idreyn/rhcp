const {HOST, PORT} = require("./config.js");
const socket = require("socket.io-client")(`http://${HOST}:${PORT}`);
const ip = require("ip");

const {Message, DeviceStatus} = require("./frontend/js/protocol.js");

var pulse = null;

const DEVICE_INFO = {
	id: "robin-prototype-fake",
	ip: ip.address(),
	deviceBatteryLow: false,
	emitterBatteryLow: false,
	bluetoothConnections: "Unknown",
};

function emitStatus() {
	console.log("emitting status", DeviceStatus.READY);
	socket.emit(Message.DEVICE_STATUS, {
		status: DeviceStatus.READY,
		info: Object.assign({
			lastSeen: new Date().toString(),
			pulse: pulse,
		}, DEVICE_INFO),
	});
}

socket.on(Message.CONNECT, () => {
	console.log("I am connected");
	console.log("Sending device handshake...");
	socket.emit(Message.HANDSHAKE_DEVICE, DEVICE_INFO);
});

socket.on(Message.DEVICE_NEW_REMOTE, () => {
	console.log("I have a new client");
	emitStatus();
});

socket.on(Message.DISCONNECT, () => {
	console.log("I am disconnected");
});

socket.on(Message.UPDATE_PULSE, (p) => {
	console.log("Setting pulse to ", p);
	pulse = p;
});

setInterval(emitStatus, 5000);