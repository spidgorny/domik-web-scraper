require('better-logging')(console);
const cheerio = require('cheerio');
const got = require('got');
const Keyv = require('keyv');
const KeyvFile = require('keyv-file');
const tunnel = require('tunnel');
const globalTunnel = require('global-tunnel-ng');

globalTunnel.initialize();

const keyv = new Keyv({
	store: new KeyvFile()
});

declare interface DomikEntry {
	name: string;
	link: string;
	rating: string;
	email: string;
}

class FetchEmail {
	data: DomikEntry[];

	constructor() {
		let p1 = require('./page1.json');
		let p2 = require('./page2.json');
		let p3 = require('./page3.json');
		let p4 = require('./page4.json');
		let p5 = require('./page5.json');
		this.data = p1.concat(p2).concat(p3).concat(p4).concat(p5);

		this.data.sort((e1: DomikEntry, e2: DomikEntry) => {
			return parseFloat(e1.rating) > parseFloat(e2.rating) ? +1 : -1;
		}).reverse();
	}

	async processOneByOne() {
		// const proxy = new URL(process.env.http_proxy);
		// console.log(proxy);
		const json: DomikEntry[] = [];
		for (let row of this.data) {
			console.log(row);
			let link = 'http://domik.ua' + row.link;
			console.warn(link);
			let res = await got(link, {
				// agent: tunnel.httpOverHttp({
				// 	proxy: {
				// 		host: proxy.hostname,
				// 		port: proxy.port,
				// 	}
				// }),
				cache: keyv,
			});
			// console.log(res.body);
			const $ = cheerio.load(res.body);
			let mailto = $('table.vcard_table tr a[href^="mailto:"]');
			console.log(mailto.text());
			row.email = mailto.text();
			json.push(row);
		}
		console.log(JSON.stringify(json));
	}
}

(async () => {
	await new FetchEmail().processOneByOne();
})();
