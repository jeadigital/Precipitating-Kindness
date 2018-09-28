'use strict';
var log4js = require('log4js');
var logger = log4js.getLogger('utils');

var path = require('path');
var util = require('util');
var fabricCaClient = require('fabric-ca-client');
var hfc = require('fabric-client');
var invoke = require('./invoke-transaction');
var ORGS = hfc.loadFromConfig(hfc.getConfigSetting('network-connection-profile-path'));

var clients = {};
var channels = {};
var caClients = {};

var log4js = require('log4js');
var logger = log4js.getLogger('Jeadigital-Rebuild_lives-App:[utils.js]');
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
hfc.setLogger(logger);

// Get a client for the ORG
async function getClientForOrg(userorg, username) {
	try{
	logger.debug('getClientForOrg - %s %s', userorg, username)
	// get a fabric client loaded with a connection profile for this org
	let config = '-connection-profile-path';

	let client = hfc.loadFromConfig(hfc.getConfigSetting('network' + config));
	client.loadFromConfig(hfc.getConfigSetting(userorg + config));

	await client.initCredentialStores();

	if (username) {

		let user = await client.getUserContext(username, true);
		if (!user) {
			throw new Error(util.format('User was not found username:', username));
		} else {
			logger.debug('User %s was found to be registered and enrolled', username);
		}
	}
	logger.debug('getClientForOrg - ****** END %s %s \n\n', userorg, username)

	return client;
}
catch(e){
	throw new Error(e);
}
}

// Enroll a new user to the specified ORG
var enrollInitUser = async function (username, userOrg, isJson) {
	try {
		var client = await getClientForOrg(userOrg);
		logger.debug('Successfully initialized the credential stores');
		// client can now act as an agent for organization Org1
		// first check to see if the user is already enrolled
		var user = await client.getUserContext(username, true);
		if (user && user.isEnrolled()) {
			logger.info('Successfully loaded member from persistence');
		} else {

			// user was not enrolled, so we will need an admin user object to register
			var admins = hfc.getConfigSetting('admins');
			let adminUserObj = await client.setUserContext({
				username: admins[0].username,
				password: admins[0].secret
			});
			let caClient = client.getCertificateAuthority();

			let secret = await caClient.register({
				enrollmentID: username,
				affiliation:userOrg.toLowerCase() + '.department1',
				role: 'client'
			}, adminUserObj);
			user = await client.setUserContext({
				username: username,
				password: secret
			});
			logger.debug('Successfully enrolled username %s  and setUserContext on the client object', username);

		}
		if (user && user.isEnrolled) {
			if (isJson && isJson === true) {
				var response = {
					success: true,
					secret: user._enrollmentSecret,
					message: username + ' Enrolled Successfully',
				};
				return response;
			}
		} else {
			throw new Error('User was not enrolled ');
		}
	} catch (error) {
		logger.error('Failed to get registered user: %s with error: %s', username, error.toString());
		throw new Error(error.toString());
	}

};

// Get Registered user
var getRegisteredUser = async function (username, userOrg, isJson) {
	try {
		var client = await getClientForOrg(userOrg);
		logger.debug('Successfully initialized the credential stores');
		// client can now act as an agent for organization Org1
		// first check to see if the user is already enrolled

		var user = await client.getUserContext(username, true);
		if (user && user.isEnrolled()) {
			logger.info('Successfully loaded member from persistence');
		} else {
			throw new Error('Not a valid user');
		}
		if (user && user.isEnrolled) {
			if (isJson && isJson === true) {
				var response = {
					success: true,
					secret: user._enrollmentSecret,
					message: username + ' Enrolled Successfully',
				};
				return response;
			}
		} else {
			throw new Error('User was not enrolled ');
		}
	} catch (error) {
		logger.error('Failed to get registered user: %s with error: %s', username, error.toString());
		throw new Error(error);
	}

};

// Create new affiliation 
var createNewAffiliation = async function (orgName, aff) {
	try {
		var client = await getClientForOrg(orgName);
		let tlsOptions = {
			trustedRoots: [],
			verify: false
		};
		let caClient = client.getCertificateAuthority();
		var org= orgName.toLowerCase();
		var affname= org+'.'+aff.toLowerCase();
		logger.info('New affilitation :'+affname);
		var port =caClient._fabricCAClient._port;
		var fabricCAEndpoint = 'https://localhost:'+port;
		var caname = caClient.caName;
		const caService = new fabricCaClient(fabricCAEndpoint, tlsOptions, caname);
		const affiliationRequest = {
			name: affname,
			force: true,
		};
		var admins = hfc.getConfigSetting('admins');
		;
		let adminUserObj = await client.setUserContext({
			username: admins[0].username,
			password: admins[0].secret
		});
		var affiliationService = await caService.newAffiliationService();
		var newaff = await affiliationService.create(affiliationRequest, adminUserObj);
		return newaff;
	}
	catch (err) {
		throw new Error(err);
	}
};

var setupChaincodeDeploy = function () {
	process.env.GOPATH = path.join(__dirname, hfc.getConfigSetting('CC_SRC_PATH'));
};

var getLogger = function (moduleName) {
	var logger = log4js.getLogger(moduleName);
	return logger;
};



var registerNewUser = async function(peers, channelName, chaincodeName, fcn, args, orgName, isJson) {
	console.log('==================== HELPER.......REGISTER ==================');
	console.log(peers);
	console.log(channelName);
	console.log(chaincodeName);
	console.log(fcn);
	console.log(args);
	console.log(orgName);
	console.log(isJson);

	var username=args[1];
	try {
		var client = await getClientForOrg(orgName);
		console.log('Successfully initialized the credential stores');
			// client can now act as an agent for organization Org1
			// first check to see if the user is already enrolled
		var user = await client.getUserContext(username, true);
		if (user && user.isEnrolled()) {
			throw new Error('User already Registered ');
		} else {
			// user was not enrolled, so we will need an admin user object to register
			console.log('User %s was not enrolled, so we will need an admin user object to register',username);
			var admins = hfc.getConfigSetting('admins');
			let adminUserObj = await client.setUserContext({username: admins[0].username, password: admins[0].secret});
			let caClient = client.getCertificateAuthority();
			let secret = await caClient.register({
				enrollmentID: username,
				affiliation: orgName.toLowerCase() + '.department1'
			}, adminUserObj);
			console.log('Successfully got the secret for user %s',username);
			user = await client.setUserContext({username:username, password:secret});
			let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgName);
			console.log('Successfully enrolled username %s  and setUserContext on the client object', username);
		
		}
		if(user && user.isEnrolled) {
			if (isJson && isJson === true) {
				var response = {
					success: true,
					secret: user._enrollmentSecret,
					message: ' Registered Successfully',
				};
				
				return response;
			}
		} else {
			if (isJson && isJson === true) {
				var response = {
					success: false,
					secret: user._enrollmentSecret,
					message: ' Registration failed',
				};
				
				return response;
		}
		}
	} catch(error) {
		if (isJson && isJson === true) {
			var response = {
				success: false,
				secret: "",
				message: error.toString() ,
				error: error.toString(),
			};
			return response;
}
	}

};

exports.getClientForOrg = getClientForOrg;
exports.getLogger = getLogger;
exports.setupChaincodeDeploy = setupChaincodeDeploy;
exports.getRegisteredUser = getRegisteredUser;
exports.createNewAffiliation = createNewAffiliation;
exports.enrollInitUser = enrollInitUser;
exports.registerNewUser = registerNewUser;