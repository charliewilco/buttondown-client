import { ButtondownClient } from "../src";

const mockFetch = jest.fn(async () => {
	return {
		json: jest.fn(),
		ok: true,
	};
});

describe("ButtondownClient", () => {
	test("accepts API key", () => {
		const b = new ButtondownClient("foo", { fetch: mockFetch });

		b.addSubscriber({ email: "foo@foo.com" });

		expect(mockFetch).toHaveBeenCalledWith("https://api.buttondown.email/v1/subscribers", {
			body: '{"email":"foo@foo.com"}',
			headers: {
				Accept: "application/json",
				Authorization: "Token foo",
				"Content-Type": "application/json",
			},
			method: "post",
		});
	});

	test("takes custom fetcher", () => {
		const b = new ButtondownClient("foo", { fetch: mockFetch });

		b.addSubscriber({ email: "foo@foo.com" });

		expect(mockFetch).toHaveBeenCalled();
	});
});
