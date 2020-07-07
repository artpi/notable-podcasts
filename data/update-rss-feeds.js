const fetch = require('node-fetch');
const FeedParser = require('feedparser');
const feeds = require('./feeds.json');
const fs = require('fs').promises;

const promises = feeds.map((feed) => {
	const p = fetch(feed.url);
	return p.then(
		(response) =>
			new Promise((resolve, reject) => {
				var feedparser = new FeedParser([]);
				const items = [];
				feedparser.on('readable', function () {
					while ((item = this.read())) {
						items.push({
							title: item.title,
							link: item.link,
							audio: item.enclosures[0].url,
							date: item.date,
							summary: item.summary,
						});
					}
				});
				feedparser.on('end', () => fs.writeFile( feed.file, JSON.stringify( items, null, 2 ) ).then( resolve ) );
				response.body.pipe(feedparser);
			})
	);
});
Promise.all(promises).then((feeds) => console.log(feeds));
