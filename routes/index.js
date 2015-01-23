var express = require('express'),
	router = express.Router(),
	hn = require('hn-api'),
	Promise = require('bluebird');

var promiseWhile = Promise.method(function(condition, action) {
	if (!condition()) return;
	return action().then(promiseWhile.bind(null, condition, action));
});

function findHiringStory(submissions, callback) {
	// Do an iterative search
	var storyFound,
		titleNeedle = 'Ask HN: Who is hiring?',
		titleRegexp = new RegExp(titleNeedle),
		count = 0;

	promiseWhile(function() {
		// Shouldn't look through more than 20 submissions
		return count < 20;
	}, function() {
		return new Promise(function(resolve, reject) {
			var submission = submissions[count];

			hn.item(submission, function(err, item) {
				if (!err) {
					if (titleRegexp.test(item.title) && item.type === 'story') {
						storyFound = true;
						return callback(item);
					}

					count++;
					resolve();
				}
			});
		});
	}).then(function() {
		console.log('all done');
	});


	// while (!storyFound) {
	// 	var submission = submissions[count];
	// 	console.log(submission);

	// 	hn.item(submission, function(err, item) {
	// 		if (!err) {
	// 			console.log(item.type);
	// 			console.log(item.title); // Hacker News API
	// 			console.log(regexp.test(item.title));
	// 			if (regexp.test(item.title)) {
	// 				console.log(submission);
	// 				storyFound = true;
	// 				return submission;
	// 			}
	// 		}
	// 	});
	// 	count++;
	// }
}

function buildListings(story) {
	var comments = story.kids,
		listingPromises = [],
		listings = [];

  var hnAsync = Promise.promisifyAll(require('hn-api'));
  console.log(hnAsync);

	Promise.each(comments, function(itemID) {
		// return Message.findOneAsync({
		// 		'_id': req.params.message_id
		// 	})
		// 	.then(function(doc) {
		// 		// do stuff with 'doc' here.  
		// 	})
		return hn.item(itemID, function(err, item) {
			if (!err) {
				console.log('here');
        console.log(item);
				return item;
			}
		});
	}).then(function(items) {
		console.log(items);
	});

	// for (var i = 0, len = comments.length; i < len; i++) {
	// 	// Make a request to get item details and add its text to the listings array
	// hn.item(comments[i], function(err, item) {
	// 	if (!err) {
	// 		if (titleRegexp.test(item.title) && item.type === 'story') {
	// 			storyFound = true;
	// 			return callback(item);
	// 		}

	// 		count++;
	// 		resolve();
	// 	}
	// });
	// 	listings.push(comments[i]);
	// }

	console.log(listings);
	return listings;
}

function getListings() {
	// Look for items with type = 'story'
	// And check if title has 'Ask HN: Who is hiring?'

	// Iterate through the kids of the submission
	// Grabbing each one as an item and building an object of comment listings

	// ONLINE MODE
	// var submissions,
	// 	story;

	// hn.user('whoishiring', function(err, user) {
	// 	if (!err) {
	// 		submissions = user.submitted;
	// 		findHiringStory(submissions, function(story) {
	// 			return buildListings(story);
	// 		});
	// 	}
	// });
	// END ONLINE MODE

	// OFFLINE MODE BELOW
	var listings = [{
		category: "Buffer (http://bufferapp.com) - from wherever you want to be in the world (fully remote), we're looking for a Product Designer",
		description: "Over 30,000 people pay for a Buffer subscription to help them with their social media efforts, which helps us generate $420k MRR. With that we spend about $223k/mo on salaries, which is about 66% of our total spending (https://open.bufferapp.com/transparent-pricing-buffer/). We work without managers and are fully self-managing. You pick your own projects, recruit team members from within the company or join task forces that you find interesting ( https://open.bufferapp.com/decision-maker-no-managers-experi...) Like with everything else, our hiring process is fully transparent (more here https://open.bufferapp.com/how-we-hire/ )"
	}, {
		category: 'Counterparty - REMOTE - http://counterparty.io',
		description: "Counterparty is a freely licensed and open-source platform for peer-to-peer finance that lives on the Bitcoin blockchain. The network has been live since January, and it has seen over 130k transactions since then.[1] Overstock.com recently announced that it would be building the world's first SEC-regulated stock market for cryptosecurities on our platform.[2]"
	}, {
		category: 'Python',
		description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
	}, {
		category: 'Go',
		description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
	}, ]

	return listings;
	// END OFFLINE MODE
}

router.get('/', function(req, res) {
	var listings = getListings();

	res.render('index', {
		title: "HN Who's Hiring",
		month: 'January 2015',
		listings: listings
	});
});

module.exports = router;