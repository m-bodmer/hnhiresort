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
		// Shouldn't look for more than 5 submissions ... for now
		return count < 5;
	}, function() {
		// Look for the first Who is hiring post
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
	})
}

function buildListings(story) {
	var comments = story.kids,
		listingPromises = [],
		listings = [];

  var hnAsync = Promise.promisifyAll(require('hn-api'));

  // This gets all the comments within one story
  // Figure out how TODO this is a nice Async matter, only calling then
  // when x number of comments have been parsed
	Promise.each(comments, function(itemID) {
		return hn.item(itemID, function(err, item) {
			if (!err) {
				console.log(item);
				listings.push(item);
			}
		});
	}).then(function(items) {
		console.log(listings);
		return listings;
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
		category: 'CloudFlare - San Francisco, CA and London, UK: VISA',
		description: "CloudFlare is building the next generation network edge, in the cloud, for security, performance, monitoring, and control of web traffic. We started the year at ~128 and are looking to double in size in 2015. Still early enough to make a difference, but we're now big enough that the difference you make will affect a large number of customers on day one, including Hacker News, Reddit, Stack Exchange, basically every bitcoin or torrent site ever, and 2M more. We're engineering driven, and have been great at solving hard engineering challenges (we've got nginx core team, some deep kernel tap knowledge, and insane levels of performance optimization up and down the stack), but we're hiring across the company: In addition to always looking for great systems engineers, SREs, and network engineers, we're particularly interested in exceptionally strong web front end developers, Postgres database expertise, and enterprise sales/sales engineers. https://www.cloudflare.com/join-our-team Things we particularly value are a drive to complete projects, deep technical curiosity, and an interest in fixing the Internet."
	}, {
		category: 'Electronic Frontier Foundation - https://eff.org - San Francisco, CA - Frontend/Backend Developers, Technoactivist',
		description: "The EFF fights for an Internet free of surveillance and censorship. We're currently hiring frontend and backend web developers: https://www.eff.org/opportunities/jobs/web-developer We're also hiring a Technoactivist who'll bridge the technology and activism teams: https://www.eff.org/opportunities/jobs/eff-seeks-techno-acti...If you think you might be a fit for either role, take a moment and get in touch. A small sample of projects our technology and activism teams have worked on in the last year: - Launched numerous projects including LetsEncrypt.org, Privacy Badger, Surveillance Self-Defense, DearFCC.org, The Day We Fight Back, Trolling Effects, Tor Challenge and others. - Worked with over 100 volunteer developers to crowdsource and populate contact-congress, an open dataset describing the contact forms of members of congress. - Created and open-sourced congress-forms: a delivery mechanism for sending emails to congress based on the open data we crowdsourced. - Created a new (and soon-to-be open source) activism platform that’s currently live at act.eff.org. - Launched a preview version of our OpenWireless open source router firmware."
	}, {
		category: 'https://webflow.com (YC S13) - San Francisco, CA - VISA OK, REMOTE could be an option. Salaries range from $70K to $140K depending on experience and location.',
		description: "At Webflow, we're building software to give superpowers to the 99.75% of the world that doesn't know how to code. We push the boundaries of what's possible in a browser-based app, and have tons of interesting (and hard!) engineering and design challenges yet to solve. We're hiring exceptional people across the board, including front-end engineers, back-end engineers, product designers, devops, sales, and customer success. Our hiring process is super simple and fast - Skype chat with the CEO, then set up a short-term (2-4 days) paid contract at a fair hourly rate to work on a real project that you ship to production, then we fly you out to meet the team, and make a decision right away. If you like what we're doing at Webflow, and you can see clearly see yourself contributing in a meaningful way, please shoot me an email to vlad@webflow.com so we can get started! Instead of the usual resume/CV application rigamarole, let's just start with a Skype chat instead :)"}]

	return listings;
	// END OFFLINE MODE
}

router.get('/', function(req, res) {
	var listings = getListings();

	res.render('index', {
		title: "HN Who's Hiring",
		month: 'April 2015',
		listings: listings
	});
});

module.exports = router;