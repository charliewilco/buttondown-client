interface EmailMetadata {}

export interface EmailRoot {
	creation_date: string;
	publish_date: string;
	id: string;
	body: string;
	subject: string;
	excluded_tags: string[];
	included_tags: string[];
	email_type: string;
	metadata: EmailMetadata;
	secondary_id: number;
	external_url: string;
}

interface ButtondownResponse {
	results: EmailRoot[];
}

export interface AddSubscriberBody {
	email: string;
}

interface Options {
	fetch: any;
}

export class ButtondownClient {
	_headers: HeadersInit;
	_fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response> = fetch;
	constructor(apiKey: string, options?: Options) {
		this._headers = {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Token ${apiKey}`,
		};

		if (options?.fetch) {
			this._fetch = options.fetch;
		}
	}

	async getEmails() {
		let response = await this._fetch("https://api.buttondown.email/v1/emails", {
			headers: this._headers,
		});

		let data: ButtondownResponse = await response.json();

		return data.results.sort(this.sortEmails);
	}

	async getEmailById(id: string) {
		let response = await this._fetch(`https://api.buttondown.email/v1/emails/${id}`, {
			headers: this._headers,
		});

		let data: EmailRoot = await response.json();

		return data;
	}

	async addSubscriber(body: AddSubscriberBody) {
		let response = await this._fetch("https://api.buttondown.email/v1/subscribers", {
			method: "post",
			body: JSON.stringify(body),
			headers: this._headers,
		});

		let result = await response.json();

		return result;
	}

	sortEmails(a: EmailRoot, b: EmailRoot) {
		let c = new Date(a.publish_date).getTime();
		let d = new Date(b.publish_date).getTime();

		return d - c;
	}
}
