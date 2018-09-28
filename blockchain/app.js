'use strict';
var express = require('express');
var fs = require('fs');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var util = require('util');
var app = express();
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');
var cors = require('cors');

require('./config.js');
var hfc = require('fabric-client');

var utils = require('./app/utils.js');
var createChannel = require('./app/create-channel.js');
var join = require('./app/join-channel.js');
var install = require('./app/install-chaincode.js');
var instantiate = require('./app/instantiate-chaincode.js');
var upgrade = require('./app/upgrade-chaincode.js');
var invoke = require('./app/invoke-transaction.js');
var query = require('./app/query.js');
var host = process.env.HOST || hfc.getConfigSetting('host');
var port = process.env.PORT || hfc.getConfigSetting('port');


var log4js = require('log4js');
var logger = log4js.getLogger('Jeabc-Rebuildlives-App:[app.js]');
log4js.configure({
	appenders: {
		allLogs: {
			type: 'file',
			filename: 'logs/all_log.log'
		},
		specialLogs: {
			type: 'file',
			filename: 'logs/special_log.log'
		},
		console: {
			type: 'console'
		}
	},
	categories: {
		write: {
			appenders: ['specialLogs'],
			level: 'info'
		},
		default: {
			appenders: ['console', 'allLogs'],
			level: 'trace'
		}
	}
});

const baseurl = "/api/v1";

//********************** SET CONFIGURATONS *******************************

app.options('*', cors());
app.use(cors());
//support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
	extended: false
}));
// set secret variable
app.set('secret', 'C!3VU$tokenSecret');
app.use(expressJWT({
	secret: 'C!3VU$tokenSecret'
}).unless({
	path: [baseurl + '/enroll_users', baseurl + '/newAffiliation', baseurl + '/register', baseurl + '/login']
}));
app.use(bearerToken());
app.use(function (err, req, res, next) {
	console.log("err>>>.." + err);
	if (err.name === 'UnauthorizedError') {
		res.status(401).send({
			"success": "false",
			"message": "Invalid Token"
		});
	}
});
app.use(function (req, res, next) {
	logger.debug(' New request for %s', req.originalUrl);
	if (req.originalUrl.indexOf(baseurl + '/enroll_users') >= 0) {
		return next();
	}
	if (req.originalUrl.indexOf(baseurl + '/newAffiliation') >= 0) {
		return next();
	}
	if (req.originalUrl.indexOf(baseurl + '/register') >= 0) {
		return next();
	}
	if (req.originalUrl.indexOf(baseurl + '/login') >= 0) {
		return next();
	}
	var token = req.token;
	jwt.verify(token, app.get('secret'), function (err, decoded) {
		if (err) {
			res.send({
				success: false,
				message: 'Failed to authenticate token. Make sure to include the ' +
					'token returned from /api/v1/enroll_users call in the authorization header ' +
					' as a Bearer token'
			});
			return;
		} else {
			// add the decoded user name and org name to the request object
			// for the downstream code to use
			req.username = decoded.username;
			req.orgname = decoded.orgName;
			req.role = decoded.role;
			logger.debug(util.format('Decoded from JWT token: username - %s, orgname - %s', decoded.username, decoded.orgName));
			return next();
		}
	});
});


//************************ START SERVER *******************************

var server = http.createServer(app).listen(port, function () {});
logger.info('****************** SERVER STARTED ************************');
logger.info('***************  http://%s:%s  ******************', host, port);
server.timeout = 240000;

function getErrorMessage(field) {
	var response = {
		success: false,
		message: field + ' field is missing or Invalid in the request'
	};
	return response;
}



//******************* REST ENDPOINTS START HERE *****************************

// Register and enroll user
app.post(baseurl + '/enroll_users', async function (req, res) {
	try {
		var username = req.body.username;
		var orgName = req.body.orgName;
		if (!username) {
			res.json(getErrorMessage('\'username\''));
			return;
		}
		if (!orgName) {
			res.json(getErrorMessage('\'orgName\''));
			return;
		}
		var token = jwt.sign({
			exp: Math.floor(Date.now() / 1000) + parseInt(hfc.getConfigSetting('jwt_expiretime')),
			username: username,
			orgName: orgName
		}, app.get('secret'));
		let response = await utils.enrollInitUser(username, orgName, true);
		if (response && typeof response !== 'string') {
			logger.debug('Successfully registered the username %s for organization %s', username, orgName);
			response.token = token;
			res.json(response);
		} else {
			logger.debug('Failed to register the username %s for organization %s with::%s', username, orgName, response);
			res.json({
				success: false,
				message: response
			});
		}
	} catch (e) {
		res.json({
			success: false,
			message: e.toString()
		});
	}

});

// Create Channel
app.post(baseurl + '/create_channels', async function (req, res) {
	logger.info('<<<<<<<<<<<<<<<<< C R E A T E  C H A N N E L >>>>>>>>>>>>>>>>>');
	logger.debug('End point : /api/v1/create_channels');
	var channelName = req.body.channelName;
	var channelConfigPath = req.body.channelConfigPath;
	logger.debug('Channel name : ' + channelName);
	logger.debug('channelConfigPath : ' + channelConfigPath); //../artifacts/channel/mychannel.tx
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!channelConfigPath) {
		res.json(getErrorMessage('\'channelConfigPath\''));
		return;
	}

	let message = await createChannel.createChannel(channelName, channelConfigPath, req.username, req.orgname);
	res.send(message);
});
// Join Channel
app.post(baseurl + '/join_channels/:channelName/peers', async function (req, res) {
	logger.info('<<<<<<<<<<<<<<<<< J O I N  C H A N N E L >>>>>>>>>>>>>>>>>');
	var channelName = req.params.channelName;
	var peers = req.body.peers;
	logger.debug('channelName : ' + channelName);
	logger.debug('peers : ' + peers);
	logger.debug('username :' + req.username);
	logger.debug('orgname:' + req.orgname);

	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!peers || peers.length == 0) {
		res.json(getErrorMessage('\'peers\''));
		return;
	}

	let message = await join.joinChannel(channelName, peers, req.username, req.orgname);
	res.send(message);
});
// Install chaincode on target peers
app.post(baseurl + '/install_chaincodes', async function (req, res) {
	logger.debug('==================== INSTALL CHAINCODE ==================');
	var peers = req.body.peers;
	var chaincodeName = req.body.chaincodeName;
	var chaincodePath = req.body.chaincodePath;
	var chaincodeVersion = req.body.chaincodeVersion;
	var chaincodeType = req.body.chaincodeType;
	logger.debug('peers : ' + peers); // target peers list
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('chaincodePath  : ' + chaincodePath);
	logger.debug('chaincodeVersion  : ' + chaincodeVersion);
	logger.debug('chaincodeType  : ' + chaincodeType);
	if (!peers || peers.length == 0) {
		res.json(getErrorMessage('\'peers\''));
		return;
	}
	if (!chaincodeName) {
		res.json(getErrorMessage('\'chaincodeName\''));
		return;
	}
	if (!chaincodePath) {
		res.json(getErrorMessage('\'chaincodePath\''));
		return;
	}
	if (!chaincodeVersion) {
		res.json(getErrorMessage('\'chaincodeVersion\''));
		return;
	}
	if (!chaincodeType) {
		res.json(getErrorMessage('\'chaincodeType\''));
		return;
	}
	let message = await install.installChaincode(peers, chaincodeName, chaincodePath, chaincodeVersion, chaincodeType, req.username, req.orgname)
	res.send(message);
});
// Instantiate chaincode on target peers
app.post(baseurl + '/instantiate_chaincode/:channelName/chaincodes', async function (req, res) {
	logger.debug('==================== INSTANTIATE CHAINCODE ==================');
	var peers = req.body.peers;
	var chaincodeName = req.body.chaincodeName;
	var chaincodeVersion = req.body.chaincodeVersion;
	var channelName = req.params.channelName;
	var chaincodeType = req.body.chaincodeType;
	var fcn = req.body.fcn;
	var args = req.body.args;
	logger.debug('peers  : ' + peers);
	logger.debug('channelName  : ' + channelName);
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('chaincodeVersion  : ' + chaincodeVersion);
	logger.debug('chaincodeType  : ' + chaincodeType);
	logger.debug('fcn  : ' + fcn);
	logger.debug('args  : ' + args);
	if (!chaincodeName) {
		res.json(getErrorMessage('\'chaincodeName\''));
		return;
	}
	if (!chaincodeVersion) {
		res.json(getErrorMessage('\'chaincodeVersion\''));
		return;
	}
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!chaincodeType) {
		res.json(getErrorMessage('\'chaincodeType\''));
		return;
	}
	if (!args) {
		res.json(getErrorMessage('\'args\''));
		return;
	}

	let message = await instantiate.instantiateChaincode(peers, channelName, chaincodeName, chaincodeVersion, chaincodeType, fcn, args, req.username, req.orgname);
	res.send(message);
});

// Upgrade chaincode on target peers
app.post(baseurl + '/upgrade_chaincode/:channelName/chaincodes', async function (req, res) {
	logger.debug('==================== UPGRADE CHAINCODE ==================');
	var peers = req.body.peers;
	var chaincodeName = req.body.chaincodeName;
	var chaincodeVersion = req.body.chaincodeVersion;
	var channelName = req.params.channelName;
	var chaincodeType = req.body.chaincodeType;
	var fcn = req.body.fcn;
	var args = req.body.args;
	logger.debug('peers  : ' + peers);
	logger.debug('channelName  : ' + channelName);
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('chaincodeVersion  : ' + chaincodeVersion);
	logger.debug('chaincodeType  : ' + chaincodeType);
	logger.debug('fcn  : ' + fcn);
	logger.debug('args  : ' + args);
	if (!chaincodeName) {
		res.json(getErrorMessage('\'chaincodeName\''));
		return;
	}
	if (!chaincodeVersion) {
		res.json(getErrorMessage('\'chaincodeVersion\''));
		return;
	}
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!chaincodeType) {
		res.json(getErrorMessage('\'chaincodeType\''));
		return;
	}
	if (!args) {
		res.json(getErrorMessage('\'args\''));
		return;
	}

	let message = await upgrade.upgradeChaincode(peers, channelName, chaincodeName, chaincodeVersion, chaincodeType, fcn, args, req.username, req.orgname);
	res.send(message);
});
// ************************************************************************************
// *****************************SmartContract Endpoints********************************
// ************************************************************************************

// Invoke Transaction:- Create new house request-user(newHouseRequest)
app.post(baseurl + '/new_house_request', async function (req, res) {
	logger.debug('====================Create Invoice ==================');
	var peers = "peer0.user.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "newHouseRequest";
	var args = req.body.args;
	var username = req.username;
	var orgname = req.orgname;
	var role = req.role;

	logger.info("<><>" + args);
	if (role != "HouseOwner") {
		var response = {
			success: false,
			message: 'This user can not have permission  to request for a new house',
		};
		return res.send(response);
	}

	try {
		let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgname);
		var response = {
			"success": true,
			"tx_id": message.tx_id,
			"resp": "New house request sucessfully submitted"
		}
		res.send(response);
	} catch (err) {
		logger.info(err);
		var response = {
			"success": false,
			"tx_id": "",
			"error": err.toString(),
			"resp": "Failed to submit new house request"
		}
		res.send(response);
	}

});

// Query:- Get house request status -user(getHouseRequestStatus)
app.get(baseurl + '/get_house_request_status/:houserequestid', async function (req, res) {
	logger.debug('====================Get All Invoice ==================');
	var peer = "peer0.govt.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "getHouseRequestStatus";
	var args = [];
	args.push(req.params.houserequestid);
	var role = req.role;
	logger.info(role);
	logger.info("<<>>" + args);
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});

// Query:- Get all new house request-planner (getNewHouseRequest)
app.get(baseurl + '/get_new_house_request', async function (req, res) {
	logger.debug('====================Get All Invoice ==================');
	var peer = "peer0.govt.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "getNewHouseRequest";
	var args = [];
	var role = req.role;
	logger.info(role);
	if (role != "Planner") {
		var response = {
			success: false,
			message: 'This user can not have permission',
		};
		return res.send(response);
	}
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});

// Invoke Transaction:- Upadte house request-planner(acceptOrRejectHouseRequest)
app.post(baseurl + '/update_house_request', async function (req, res) {
	logger.debug('====================Update Invoice ==================');
	var peers = "peer0.govt.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "acceptOrRejectHouseRequest";
	var args = req.body.args;
	var username = req.username;
	var orgname = req.orgname;
	try {
		let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgname);
		logger.debug(message);
		res.send(message);
	} catch (err) {
		logger.info(err);
		var response = err.toString();
		res.send(response);
	}
});

// Query:- Get all new house request -planner(getAllHouseRequest)
app.get(baseurl + '/get_all_house_request', async function (req, res) {
	logger.debug('====================Get All Invoice ==================');
	var peer = "peer0.govt.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "getAllHouseRequest";
	var args = [];
	var role = req.role;
	logger.info(role);
	if (role != "Planner") {
		var response = {
			success: false,
			message: 'This user can not have permission',
		};
		return res.send(response);
	}
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});

// Query:- Get all new house request (getLandSurveyList)
app.get(baseurl + '/surveyor/all_house_request', async function (req, res) {
	logger.debug('====================Get All Invoice ==================');
	var peer = "peer0.govt.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "getLandSurveyList";
	var args = [];
	var role = req.role;
	logger.info(role);
	if (role != "Surveyor") {
		var response = {
			success: false,
			message: 'This user can not have permission',
		};
		return res.send(response);
	}
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});


// Invoke Transaction:- Upadte house request(updateSurveyDetails)
app.post(baseurl + '/surveyor/update_house_request', async function (req, res) {
	logger.debug('====================Update Invoice ==================');
	var peers = "peer0.govt.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "updateSurveyDetails";
	var args = req.body.args;
	var username = req.username;
	var orgname = req.orgname;
	try {
		let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgname);
		logger.debug(message);
		res.send(message);
	} catch (err) {
		logger.info(err);
		var response = err.toString();
		res.send(response);
	}
});




//getAllHouseRequest
app.get(baseurl + '/getList_all_house_request', async function (req, res) {
	logger.debug('====================Get All Invoice ==================');
	var peer = "peer0.govt.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "getAllHouseRequest";
	var args = [];
	var role = req.role;
	logger.info(role);
	if (role != "Planner") {
		var response = {
			success: false,
			message: 'This user can not have permission',
		};
		return res.send(response);
	}
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});

// Query:- Get all new plan request (getPlanListForPlanner)
app.get(baseurl + '/planner/all_plan_list', async function (req, res) {
	logger.debug('====================Get All Invoice ==================');
	var peer = "peer0.builder.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "getPlanListForPlanner";
	var args = [];
	var role = req.role;
	logger.info(role);
	if (role != "Planner") {
		var response = {
			success: false,
			message: 'This user can not have permission',
		};
		return res.send(response);
	}
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});

// Invoke Transaction:- Create new house plan(submitNewHousePlan)
app.post(baseurl + '/builder/submit_new_house_plan', async function (req, res) {
	logger.debug('====================Create Invoice ==================');
	var peers = "peer0.builder.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "submitNewHousePlan";
	var args = req.body.args;
	var username = req.username;
	var orgname = req.orgname;
	var role = req.role;
	logger.info(role);
	if (role != "Architect") {
		var response = {
			success: false,
			message: 'This user can not have permission  to request for a new house',
		};
		return res.send(response);
	}
	try {
		let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgname);
		res.send(message);
	} catch (err) {
		logger.info(err);
		var response = err.toString();
		res.send(response);
	}

});




// Query:- Get all new plan request (listAllHousePlan)
app.get(baseurl + '/list_all_plans/:houseRequestId', async function (req, res) {
	logger.debug('====================Get All Invoice ==================');
	var peer = "peer0.govt.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "listAllHousePlan";
	var args = [];
	args.push(req.params.houseRequestId);
	var role = req.role;
	logger.info(role);
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});


// Invoke Transaction:- Create new house plan(approveHousePlan)
app.post(baseurl + '/approve_house_plan', async function (req, res) {
	logger.debug('====================Create Invoice ==================');
	var peers = "peer0.builder.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "approveHousePlan";
	var args = req.body.args;
	var username = req.username;
	var orgname = req.orgname;
	var role = req.role;
	logger.info(role);
	if (role != "Planner") {
		var response = {
			success: false,
			message: 'This user can not have permission  to approve plan',
		};
		return res.send(response);
	}
	try {
		let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgname);
		res.send(message);
	} catch (err) {
		logger.info(err);
		var response = err.toString();
		res.send(response);
	}

});

//----------------------------------------

// Query:- Get all new plan request (listAllPlanApproved)
app.get(baseurl + '/list_all_approved_plans/:bidRequestID', async function (req, res) {
	logger.debug('====================Get All Invoice ==================');
	var peer = "peer0.builder.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "listAllPlanApproved";
	var args = [];
	args.push(req.params.bidRequestID);

	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});
//listAllPlanApprovedNotWorking
app.get(baseurl + '/list_all_approved_plans-notWorking/:bidRequestID', async function (req, res) {
	logger.debug('====================Get All Invoice ==================');
	var peer = "peer0.builder.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "listAllPlanApprovedNotWorking";
	var args = [];
	args.push(req.params.bidRequestID);
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});
// submit new bid-construction company(submitNewBid)
app.post(baseurl + '/submit_new_bid', async function (req, res) {
	var peers = "peer0.builder.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "submitNewBid";
	var args = req.body.args;
	var username = req.username;
	var orgname = req.orgname;
	var role = req.role;
	logger.info(role);
	if (role != "ConstructionCompany") {
		var response = {
			success: false,
			message: 'This user can not have permission  to request for a bid',
		};
		return res.send(response);
	}
	try {
		let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgname);
		res.send(message);
	} catch (err) {
		logger.info(err);
		var response = err.toString();
		res.send(response);
	}
});
// list all bid request-planner(getAllBidRequest)
app.get(baseurl + '/all_bid_request', async function (req, res) {
	var peer = "peer0.govt.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "getAllBidRequest";
	var args = [];
	var role = req.role;
	logger.info(role);
	if (role != "Planner") {
		var response = {
			success: false,
			message: 'This user can not have permission',
		};
		return res.send(response);
	}
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});
// approve bid-planner(approveBidRequest)
app.post(baseurl + '/approve_bid', async function (req, res) {
	var peers = "peer0.govt.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "approveBidRequest";
	var args = req.body.args;
	var username = req.username;
	var orgname = req.orgname;
	var role = req.role;
	logger.info(role);
	if (role != "Planner") {
		var response = {
			success: false,
			message: 'This user can not have permission  to request for a new house',
		};
		return res.send(response);
	}
	try {
		let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgname);
		res.send(message);
	} catch (err) {
		logger.info(err);
		var response = err.toString();
		res.send(response);
	}
});
// update first phase work status-construction company(updateWorkStatus)

app.post(baseurl + '/update_work_status', async function (req, res) {
	var peers = "peer0.builder.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "updateWorkStatus";
	var args = req.body.args;
	var username = req.username;
	var orgname = req.orgname;
	var role = req.role;
	logger.info(role);
	if (role != "ConstructionCompany") {
		var response = {
			success: false,
			message: 'This user can not have permission  to request for a new house',
		};
		return res.send(response);
	}
	try {
		let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgname);
		res.send(message);
	} catch (err) {
		logger.info(err);
		var response = err.toString();
		res.send(response);
	}
});
// update  payment(Payment)
app.post(baseurl + '/payment', async function (req, res) {
	var peers = "peer0.govt.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "Payment";
	var args = req.body.args;
	var username = req.username;
	var orgname = req.orgname;
	var role = req.role;
	logger.info(role);
	if (role != "Planner") {
		var response = {
			success: false,
			message: 'This user can not have permission  to request for a new house',
		};
		return res.send(response);
	}
	try {
		let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgname);
		res.send(message);
	} catch (err) {
		logger.info(err);
		var response = err.toString();
		res.send(response);
	}
});

//CompletedHouseList
app.get(baseurl + '/completed_house_list', async function (req, res) {
	var peer = "peer0.govt.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "CompletedHouseList";
	var args = [];
	var role = req.role;
	logger.info(role);
	if (role != "Planner") {
		var response = {
			success: false,
			message: 'This user can not have permission',
		};
		return res.send(response);
	}
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});

// get complete list of house request for planner from architect(getListofHouseRequest)


app.get(baseurl + '/all_houseRequest_list', async function (req, res) {
	logger.debug('====================Get All Invoice ==================');
	var peer = "peer0.govt.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "getListofHouseRequest";
	var args = [];
	var role = req.role;
	logger.info(role);
	if (role != "Planner") {
		var response = {
			success: false,
			message: 'This user can not have permission',
		};
		return res.send(response);
	}
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});

// list all plans against a house request(listOfAllHousePlan)

app.get(baseurl + '/get_all_plans/:houseRequestId', async function (req, res) {
	logger.debug('====================Get All Invoice ==================');
	var peer = "peer0.govt.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "listOfAllHousePlan";
	var args = [];
	args.push(req.params.houseRequestId);
	var role = req.role;
	logger.info(role);
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});
//getListofApprovedBid
app.get(baseurl + '/get_all_bids/:ConstrucionId', async function (req, res) {
	logger.debug('====================Get All Invoice ==================');
	var peer = "peer0.builder.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "getListofApprovedBid";
	var args = [];
	args.push(req.params.ConstrucionId);
	var role = req.role;
	logger.info(role);
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});
//listofPaymentrequest
app.get(baseurl + '/all_work_status', async function (req, res) {
	var peer = "peer0.govt.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "listofPaymentrequest";
	var args = [];
	var role = req.role;
	logger.info(role);
	if (role != "Planner") {
		var response = {
			success: false,
			message: 'This user can not have permission',
		};
		return res.send(response);
	}
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});
//UserUpdation
app.post(baseurl + '/user_updation', async function (req, res) {
	var peers = "peer0.user.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "UserUpdation";
	var args = req.body.args;
	var username = req.username;
	var orgname = req.orgname;

	try {
		let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgname);
		res.send(message);
	} catch (err) {
		logger.info(err);
		var response = err.toString();
		res.send(response);
	}
});
//	getListofApprovedBidForPlanner
app.get(baseurl + '/get_all_approved_bids/:houseRequestId', async function (req, res) {
	logger.debug('====================Get All Invoice ==================');
	var peer = "peer0.govt.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "getListofApprovedBidForPlanner";
	var args = [];
	args.push(req.params.houseRequestId);
	var role = req.role;
	logger.info(role);
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});
//getNewBidRequestForPlanner
app.get(baseurl + '/all_new_bid_request_for_planner', async function (req, res) {
	var peer = "peer0.govt.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "getNewBidRequestForPlanner";
	var args = [];
	var role = req.role;
	logger.info(role);
	if (role != "Planner") {
		var response = {
			success: false,
			message: 'This user can not have permission',
		};
		return res.send(response);
	}
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});
//getBidAgainstAHouseRequest
app.get(baseurl + '/get_all_bids_against_a_houseRequest/:houseRequestId', async function (req, res) {
	logger.debug('====================Get All Invoice ==================');
	var peer = "peer0.govt.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "getBidAgainstAHouseRequest";
	var args = [];
	args.push(req.params.houseRequestId);
	var role = req.role;
	logger.info(role);
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});
// Query:- Get all new plan request(getPlanRequest) 
app.get(baseurl + '/list_all/:architectID', async function (req, res) {
	logger.debug('====================Get All Invoice ==================');
	var peer = "peer0.builder.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "getPlanRequest";
	var args = [];
	args.push(req.params.architectID);

	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});



















// Query:- Get history of rebuildlives by rebuildlives number
app.get(baseurl + '/get_Invoice_History/:rebuildlivesNumber', async function (req, res) {
	logger.debug('====================Get Invoice History ==================');
	var args = [];
	var peer = "peer0.govt.jeabc.com";
	var chaincodeName = "rebuildlives";
	var channelName = "jeadigitalchannel";
	var fcn = "getInvoiceHistory";
	args.push(req.params.rebuildlivesNumber);
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});


app.post(baseurl + '/newAffiliation', async function (req, res) {
	logger.debug('***/newAffiliation***');
	var orgName = req.body.orgName;
	var affliation = req.body.affliation;
	try {
		let message = await utils.createNewAffiliation(orgName, affliation);
		logger.debug(message);
		res.send(message);
	} catch (e) {
		var response = e.toString();
		logger.info(response);
		res.send(response);
	}
});



// ************************************************************************************
// *****************************BlockChain Query Endpoints*****************************
// ************************************************************************************

//Query for Channel Information
app.get(baseurl + '/jeadigitalchannel/info', async function (req, res) {
	console.log('================ QUERY CHANNEL INFORMATION ======================');
	var peer = "peer0.govt.jeabc.com";
	var channelName = "jeadigitalchannel";
	let message = await query.getChainInfo(peer, channelName, req.username, req.orgname);
	res.send(message);
});

//  Query Block by BlockNumber
app.get(baseurl + '/jeadigitalchannel/block_info/:blockId', async function (req, res) {
	console.log('==================== GET BLOCK BY NUMBER ==================');
	let blockId = req.params.blockId;
	let peer = "peer0.govt.jeabc.com";
	var channelName = "jeadigitalchannel";
	if (!blockId) {
		res.json(getErrorMessage('\'blockId\''));
		return;
	}
	let message = await query.getBlockByNumber(peer, channelName, blockId, req.username, req.orgname);
	res.send(message);
});

// Query Transaction by Transaction ID
app.get(baseurl + '/jeadigitalchannel/transaction_info/:trxnId', async function (req, res) {
	console.log('================ GET TRANSACTION BY TRANSACTION_ID ======================');
	let peer = "peer0.govt.jeabc.com";
	var channelName = "jeadigitalchannel";
	let trxnId = req.params.trxnId;
	if (!trxnId) {
		res.json(getErrorMessage('\'trxnId\''));
		return;
	}
	let message = await query.getTransactionByID(peer, channelName, trxnId, req.username, req.orgname);
	console.log(message);
	res.send(message);
});

// Query Block by Hash
app.get(baseurl + '/block/by_hash', async function (req, res) {
	console.log('================ GET BLOCK BY HASH ======================');
	let hash = req.query.hash;
	let peer = "peer0.govt.jeabc.com";
	var channelName = "jeadigitalchannel";
	if (!hash) {
		res.json(getErrorMessage('\'hash\''));
		return;
	}
	let message = await query.getBlockByHash(peer, channelName, hash, req.username, req.orgname);
	res.send(message);
});

//Query for Channel instantiated chaincodes
app.get(baseurl + '/jeadigitalchannel/instantiated_chaincodes', async function (req, res) {
	console.log('============= GET INSTANTIATED CHAINCODES ===================');
	let peer = "peer0.govt.jeabc.com";
	var channelName = "jeadigitalchannel";
	let message = await query.getInstalledChaincodes(peer, channelName, 'instantiated', req.username, req.orgname);
	res.send(message);
});

// Query to fetch all Installed chaincodes
app.get(baseurl + '/jeadigitalchannel/installed_chaincodes', async function (req, res) {
	let peer = "peer0.govt.jeabc.com";
	var channelName = "jeadigitalchannel";
	console.log('================ GET INSTALLED CHAINCODES ======================');
	let message = await query.getInstalledChaincodes(peer, channelName, 'installed', req.username, req.orgname)
	res.send(message);
});

// Query to fetch channels
app.get(baseurl + '/get_channels', async function (req, res) {
	console.log('================ GET CHANNELS ======================');
	let peer = "peer0.govt.jeabc.com";
	if (!peer) {
		res.json(getErrorMessage('\'peer\''));
		return;
	}
	let message = await query.getChannels(peer, req.username, req.orgname);
	res.send(message);
});

//Registration Request
app.post(baseurl + '/register', async function (req, res) {
	console.log('============= NEW USER REGISTRATION REQUEST==================');
	var args = req.body.args;
	if (!args) {
		return res.send({
			success: false,
			message: 'Invalid input arguments'
		});
	}
	var channelName = "jeadigitalchannel";
	var fcn = "registerUser";
	var chaincodeName = "rebuildlives";
	var peers = "";
	var orgName = "";
	if (args[0] == "HouseOwner") {
		peers = "peer0.user.jeabc.com";
		orgName = "User";
		if (args.length != 5) {
			res.send({
				success: false,
				message: 'Incorrect argument length'
			});
		}
	} else if (args[0] == "Planner" || args[0] == "Surveyor") {
		peers = "peer0.govt.jeabc.com";
		orgName = "Govt";
		if (args.length != 3) {
			res.send({
				success: false,
				message: 'Incorrect argument length'
			});
		}
	} else if (args[0] == "Architect" || args[0] == "ConstructionCompany") {
		peers = "peer0.builder.jeabc.com";
		orgName = "Builder";
		if (args.length != 3) {
			res.send({
				success: false,
				message: 'Incorrect argument length'
			});
		}
	} else {
		return res.send({
			success: false,
			message: 'Invalid user role'
		});
	}
	if (!chaincodeName) {
		return res.send({
			success: false,
			message: 'Invalid chaincodeName'
		});
	}
	if (!channelName) {
		return res.send({
			success: false,
			message: 'Invalid channelName'
		});
	}
	if (!fcn) {
		return res.send({
			success: false,
			message: 'Invalid input function name'
		});
	}
	let message = await utils.registerNewUser(peers, channelName, chaincodeName, fcn, args, orgName, true);
	res.send(message);
});
//login  Request
app.post(baseurl + '/login', async function (req, res) {
	console.log('==================== QUERY BY CHAINCODE ==================');
	var args = req.body.args;
	if (!args) {
		return res.send({
			success: false,
			message: 'Invalid input arguments'
		});
	}
	if (args.length != 3) {
		res.send({
			success: false,
			message: 'Incorrect argument length'
		});
	}
	try {

		var channelName = "jeadigitalchannel";
		var fcn = "authUser";
		var chaincodeName = "rebuildlives";
		console.log(args);
		var peer = "";
		var orgName = "";
		if (args[2] == "HouseOwner") {
			peer = "peer0.user.jeabc.com";
			orgName = "User";
		} else if (args[2] == "Planner" || args[2] == "Surveyor") {
			peer = "peer0.govt.jeabc.com";
			orgName = "Govt";
		} else if (args[2] == "Architect" || args[2] == "ConstructionCompany") {
			logger.info("1");
			peer = "peer0.builder.jeabc.com";
			logger.info("2");
			orgName = "Builder";
			logger.info("31");
		} else {
			response = {
				user: args[0],
				success: false,
				role: null,
				message: 'Invalid User role',
				token: null
			};
			return res.send(response);
		}
		logger.info("12");
		var username = args[0];
		var role = args[2];
		var token = jwt.sign({
			exp: Math.floor(Date.now() / 1000) + parseInt(hfc.getConfigSetting('jwt_expiretime')),
			username: username,
			orgName: orgName,
			role: role
		}, app.get('secret'));

		let response = await utils.getRegisteredUser(username, orgName, true);
		let message = await query.queryLogin(peer, channelName, chaincodeName, args, orgName, fcn);
		var auth = message.toString();
		try {
			var auth_json = JSON.parse(auth);
			if (auth_json.success == true) {
				auth_json.token = token;
				console.log(auth_json);
				logger.info("User " + username + " Sucessfully loged in as " + auth_json.role);
				return res.send(auth_json);
			} else {
				auth_json.token = null;
				return res.send(auth_json);
			}
		} catch (err) {
			return res.send(auth);
		}
	} catch (err) {
		var response = {
			user: args[0],
			success: false,
			role: null,
			message: 'Invalid User',
			token: null
		};
		return res.send(response);
	}
});