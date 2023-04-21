import { fireEvent, render, screen } from "@testing-library/react";
import Search from "./Search";
import Wishlist from "./Wishlist";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import wishlistSlice from "../redux/slices/wishlistSlice";
import searchSlice from "../redux/slices/searchSlice";

const createMockStore = (
	preloadedState = {
		searchSlice: {
			keyword: "",
			isLoading: false,
			list: [],
			totalPages: 1,
			currentPage: 1,
			itemsPerPage: 10,
		},
		wishlistSlice: { list: [] },
	}
) => {
	return configureStore({
		reducer: {
			searchSlice,
			wishlistSlice,
		},
		preloadedState,
	});
};

fetch = jest.fn();
describe("wishlist component", () => {
	beforeEach(() => {
		fetch.mockImplementation(() => {
			return new Promise((res, rej) =>
				res({
					json: () =>
						new Promise((res, rej) => {
							res({
								items: [
									{
										id: 1,
										volumeInfo: {
											title: "",
											authors: "",
											publisher: "",
											publishedDate: "",
											description: "",
											imageLinks: { thumbnail: "" },
										},
									},
									{
										id: 2,
										volumeInfo: {
											title: "",
											authors: "",
											publisher: "",
											publishedDate: "",
											description: "",
											imageLinks: { thumbnail: "" },
										},
									},
								],
								totalItems: 2,
								kind: "",
							});
						}),
				})
			);
		});
	});

	test("book should be displayed after clicking it from the search page", async () => {
		render(
			<Provider store={createMockStore()}>
				<Search />
				<Wishlist />
			</Provider>
		);
		const inputEl = screen.getByRole("textbox");
		fireEvent.change(inputEl, { target: { value: "ab" } });
		const submitBtnEl = screen.getByText("Submit");
		fireEvent.click(submitBtnEl);
		const liEls = await screen.findAllByRole("listitem");
		fireEvent.click(liEls[0]);
		const wishlistLiEls = await screen
			.getByTestId("wishlist")
			.querySelectorAll("li");
		expect(wishlistLiEls).toHaveLength(1);
	});

	test("book should be removed after clicking it from the wishlist page", async () => {
		render(
			<Provider store={createMockStore()}>
				<Search />
				<Wishlist />
			</Provider>
		);
		const placeHolderEl = screen.getAllByText("Nothing here");
		const inputEl = screen.getByRole("textbox");
		fireEvent.change(inputEl, { target: { value: "ab" } });
		const submitBtnEl = screen.getByText("Submit");
		fireEvent.click(submitBtnEl);
		const liEls = await screen.findAllByRole("listitem");
		fireEvent.click(liEls[0]);
		expect(placeHolderEl[0]).not.toBeInTheDocument();
		expect(placeHolderEl[1]).not.toBeInTheDocument();
		const wishlistLiEls = await screen
			.getByTestId("wishlist")
			.querySelectorAll("li");
		fireEvent.click(wishlistLiEls[0]);
		const newPlaceHolderEl = screen.getByText("Nothing here");
		expect(newPlaceHolderEl).toBeInTheDocument();
	});
});
