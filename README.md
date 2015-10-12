# calameo-node-sdk
Consume Calameo API easily

### Install

To install, run:

```bash
npm install calameo-node-sdk --save
```

### Use
now in your own code you can use it with `require('calameo-node-sdk')`

#### Instantiate
sdk require to be instantiated wtih at least your apikey and private (secret key)

you can also add any default parameter you want

for e.g :
```
var calameoSdk = new CalameoSdk({
	apikey: 'your api key',
	secret: 'your private (secret) key',
	output: 'json'
});
```

#### Example request
```
// add a drm single to a subscriber
calameoSdk.addSubscriberDRMSingle({
	login: 'subscriber login',
	subscription_id: 'id of the subscription',
	book_id: 'book code',
	callback: function (response) {
    // do what you need with the response
    var resp = response.body.response;
    if (resp && resp.status === 'error') return throw new Error(resp.error.message);
    console.log(resp.content);
	}
});
```

#### Full API documentation
you can find the full API reference at http://help.calameo.com/

#### Available methods and their required arguments
```
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
```
