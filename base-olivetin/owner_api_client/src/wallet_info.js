const ownerClient = require('./owner_api_client.js');

// read value of env var OWNER_API_PORT or default to 3415
const address = process.env.OWNER_API_ADDRESS || 'host.docker.internal:3415';
const password = process.env.WALLET_PASSWORD || '';

async function main() {
	console.log('http://' + address + '/v3/owner');
	ownerClient.initClient('http://' + address + '/v3/owner');
	let shared_key = await ownerClient.initSecure();

	let token = await ownerClient.openWallet(password, shared_key);
	console.log(shared_key);
	console.log(token);

	if (token == null) {
		return
	}

	let info_response = await new ownerClient.JSONRequestEncrypted(2, 'retrieve_summary_info', {
		"token": token,
		"refresh_from_node": true,
		"minimum_confirmations": 1,
	}).send(shared_key)

	try {
		let result = JSON.parse(info_response).result.Ok;
		console.log(result);
	} catch (e) {
		console.log(JSON.parse(info_response))
	}

	await ownerClient.closeWallet(shared_key, 3)
}

main();


