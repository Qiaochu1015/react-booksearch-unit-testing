import Header from "./Header";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

describe("Header component", () => {
	test("Navigate to wishlist page after clicking the wishlist link", () => {
		render(
			<BrowserRouter>
				<Header />
			</BrowserRouter>
		);

		const wishlistLinkEl = screen.getByText("Wishlist");
		fireEvent.click(wishlistLinkEl);
		expect(window.location.pathname).toContain("wishlist");
	});

	test("Navigate to search page after clicking the search link", () => {
		render(
			<BrowserRouter>
				<Header />
			</BrowserRouter>
		);

		const searchLinkEl = screen.getByText("Search");
		fireEvent.click(searchLinkEl);
		expect(window.location.pathname).toContain("search");
	});
});
