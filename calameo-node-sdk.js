var unirest = require('unirest');
var crypto = require('crypto');

var CalameoSdk = function (config) 
{
	if (!config.apikey || !config.secret) return console.error('you must pass an object {} containing at least your apikey and secret');
	
	this.config = config;

	this.buildMethods();
}

CalameoSdk.prototype = 
{
	url: 'http://api.calameo.com/1.0',

	buildParam: function (params) 
	{

		params.apikey = this.config.apikey;
		params.output = params.output || this.config.output;

		// iterate over param object and concatenate key / value in a new array
		var paramArray = [];

		for (var param in params)
		{
			paramArray.push(param + params[param]);
		}

		// sort the paramArray alphabeticaaly
		paramArray = paramArray.sort();

		// prepend the secret and join paramArray
		var signature = this.config.secret + paramArray.join('');

		// push the signature param before sending request
		params['signature'] = crypto.createHash('md5').update(signature).digest("hex");

		return params;
	},

	serializeParam: function (params) 
	{
		return Object.keys(params).map(function(key) {
	    	return key + '=' + params[key];
		}).join('&');
	},

	request: function (options)
	{

		// store callback if present and remove it from params
		var callback = options.callback && typeof options.callback === 'function' ? options.callback : null;
		if (callback) delete options.callback;

		// store file and remove it from param if any
		var file = options.file;
		delete options.file;

		var params = this.buildParam(options);

		var request;

		if (!file) 
		{
			// if we don't need to upload file, serializeParam for GET request
			params = this.serializeParam(params);
			request = unirest.get((options.endpoint || this.url) + '?' + params);
		}
		else
		{
			request = unirest.post((options.endpoint || this.uploadUrl))
			.headers({'Accept': 'application/json'})
			.field(params) // Form field
			.attach('file', file) // Attachment
		}

		request.end(function (response) {
			var resp = response.body.response;
			if (resp.status !== 'ok') console.error(options.action + ' => '+ resp.error.code + ' ' + resp.error.message);
			if (callback) callback(response);
		})


	},

	checkError: function (required, options)
	{
		
		if (!required) return;

		var err = [];
		var arrayLength = required.length;
		
		for (var i = 0; i < arrayLength; i++) {
		    if ( !options[required[i]] ) err.push(required[i]);
		}

		if (err.length) return console.error(options.action + ' => ' +  err.join(', ') + (err.length > 1 ? ' are required' : ' is required')  );
	},

	buildMethods: function () {

		var methodList = this.methods;
		var self = this;

		for ( var method in methodList )
		{

			this[method] = (function (method, methodList, self) {

				return function (options) {
					options = options || {};

					options.action = method;

					if (methodList[method]['endpoint']) options.endpoint = methodList[method]['endpoint'];

					var err = self.checkError(methodList[method]['required'], options);
					if (err) return;

					self.request(options);
				}

			})(method, methodList, self);

		}

	},
	methods: {
		// accounts
		getAccountInfos: {},
		fetchAccountSubscriptions: {},
		fetchAccountBooks: {},
		fetchAccountSubscribers: {},
		
		// subscriptions
		getSubscriptionInfos: {required: ['subscription_id'] },
		fetchSubscriptionBooks: {required: ['subscription_id'] },
		fetchSubscriptionSubscribers: {required: ['subscription_id']},
		
		// publications
		getBookInfos: {required: ['book_id']},
		activateBook: {required: ['book_id']},
		deactivateBook: {required: ['book_id']},
		updateBook: {required: ['book_id']},
		deleteBook: {required: ['book_id']},
		fetchBookTocs: {required: ['book_id']},
		fetchBookComments: {required: ['book_id']},
		renewBookPrivateUrl: {required: ['book_id']},

		// publishing
		publish: {required: ['subscription_id', 'file'], endpoint: 'http://upload.calameo.com/1.0'},
		publishFromUrl: {required: ['subscription_id', 'url'],  endpoint: 'http://upload.calameo.com/1.0'},
		publishFromText: {required: ['subscription_id', 'text'],  endpoint: 'http://upload.calameo.com/1.0'},
		revise: {required: ['book_id', 'file'], endpoint: 'http://upload.calameo.com/1.0'},
		reviseFromUrl: {required: ['book_id', 'url', 'subscription_id'],  endpoint: 'http://upload.calameo.com/1.0'},
		reviseFromText: {required: ['book_id', 'text', 'subscription_id'],  endpoint: 'http://upload.calameo.com/1.0'},

		// subscribers
		getSubscriberInfos: {required: ['subscription_id', 'login']},
		activateSubscriber: {required: ['subscription_id', 'login']},
		deactivateSubscriber: {required: ['subscription_id', 'login']},
		addSubscriber: {required: ['subscription_id', 'login']},
		updateSubscriber: {required: ['subscription_id', 'login']},
		deleteSubscriber: {required: ['subscription_id', 'login']},
		fetchSubscriberBooks: {required: ['subscription_id', 'login']},
		authSubscriberSession: {required: ['subscription_id', 'login']},
		checkSubscriberSession: {required: ['session_id']},
		deleteSubscriberSession: {required: ['session_id']},

		// drm
		fetchSubscriberDRMSingles: {required: ['subscription_id', 'login']},
		fetchSubscriberDRMPeriods: {required: ['subscription_id', 'login']},
		fetchSubscriberDRMSeries: {required: ['subscription_id', 'login']},
		addSubscriberDRMSingle: {required: ['subscription_id', 'login', 'book_id']},
		addSubscriberDRMPeriod: {required: ['subscription_id', 'login', 'from', 'to']},
		addSubscriberDRMSerie: {required: ['subscription_id', 'login', 'from', 'books']},
		updateSubscriberDRMPeriod: {required: ['subscription_id', 'login', 'period_id', 'from', 'to']},
		updateSubscriberDRMSerie: {required: ['subscription_id', 'login', 'serie_id', 'from', 'books']},
		deleteSubscriberDRMSingle: {required: ['subscription_id', 'login', 'book_id']},
		deleteSubscriberDRMPeriod: {required: ['subscription_id', 'login', 'period_id']},
		deleteSubscriberDRMSerie: {required: ['subscription_id', 'login', 'serie_id']},
		clearSubscriberDRMs: {required: ['subscription_id', 'login']}
	}
}

module.exports = CalameoSdk;
