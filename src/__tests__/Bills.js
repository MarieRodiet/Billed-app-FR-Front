/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import BillsUI, { rows } from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import Bills, { filteredBills } from "../containers/Bills.js";
import router from "../app/Router";
import { formatDate } from "../app/format.js";

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
        describe("When it is loading", () => {
            test("Then, Loading page should be rendered", () => {
                document.body.innerHTML = BillsUI({ loading: true });
                expect(screen.getAllByText("Loading...")).toBeTruthy();
            });
        });
        describe("When back-end send an error message", () => {
            test("Then, Error page should be rendered", () => {
                document.body.innerHTML = BillsUI({
                    error: "some error message",
                });
                expect(screen.getAllByText("Erreur")).toBeTruthy();
            });
        });
        describe("The page is loaded and there is no error", () => {
            test("Then bill icon in vertical layout should be highlighted", async () => {
                Object.defineProperty(window, "localStorage", {
                    value: localStorageMock,
                });
                window.localStorage.setItem(
                    "user",
                    JSON.stringify({
                        type: "Employee",
                    })
                );
                const root = document.createElement("div");
                root.setAttribute("id", "root");
                document.body.append(root);

                router();

                window.onNavigate(ROUTES_PATH.Bills);

                const iconWindow = await screen.getByTestId("icon-window");
                expect(iconWindow).toBeTruthy();
                expect(iconWindow).toHaveAttribute("class", "active-icon");
                expect(iconWindow).toHaveAttribute("id", "layout-icon1");
            });

            test("Then I should see the title as well as a button to enter a New Bill", () => {
                Object.defineProperty(window, "localStorage", {
                    value: localStorageMock,
                });
                window.localStorage.setItem(
                    "user",
                    JSON.stringify({
                        type: "Employee",
                    })
                );
                const root = document.createElement("div");
                root.setAttribute("id", "root");
                document.body.append(root);

                router();

                window.onNavigate(ROUTES_PATH.Bills);
                document.body.innerHTML = BillsUI({
                    data: bills,
                    loading: false,
                    error: "",
                });

                expect(screen.getByTestId("btn-new-bill")).toBeTruthy();
                expect(screen.getByText("Mes notes de frais")).toBeTruthy();
            });
        });

        test("Then bills show up on page", () => {
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            };

            Object.defineProperty(window, "localStorage", {
                value: localStorageMock,
            });

            window.localStorage.setItem(
                "user",
                JSON.stringify({
                    type: "Employee",
                })
            );

            document.body.innerHTML = BillsUI({ data: bills });

            const billsBoard = new Bills({
                document,
                onNavigate,
                store: null,
                localStorage: window.localStorage,
            });
            const iconEye = screen.getAllByTestId("icon-eye")[0];
            expect(iconEye).toBeTruthy();
            const billType = screen.getByText("Transports");
            expect(billType).toBeTruthy();
            const billName = screen.getByText("test3");
            expect(billName).toBeTruthy();
        });

        test("Then if there is no data, the table should render nothing", () => {
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            };

            Object.defineProperty(window, "localStorage", {
                value: localStorageMock,
            });

            window.localStorage.setItem(
                "user",
                JSON.stringify({
                    type: "Employee",
                })
            );

            document.body.innerHTML = BillsUI({ data: [] });

            const billsBoard = new Bills({
                document,
                onNavigate,
                store: null,
                localStorage: window.localStorage,
            });

            expect(screen.queryByTestId("tbody")).not.toBeEmptyDOMElement();
        });

        test("Then the bills should be ordered from earliest to latest", () => {
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            };

            Object.defineProperty(window, "localStorage", {
                value: localStorageMock,
            });

            window.localStorage.setItem(
                "user",
                JSON.stringify({
                    type: "Employee",
                })
            );

            document.body.innerHTML = BillsUI({ data: bills });

            const billsBoard = new Bills({
                document,
                onNavigate,
                store: null,
                localStorage: window.localStorage,
            });

            let datesFromBills = bills.map((bill) => bill["date"]);
            const antiChrono = (a, b) => (a < b ? 1 : -1);
            const datesSorted = [...datesFromBills].sort(antiChrono);
            let formatedDates = [];
            //datesSorted need to go through formatDate() before being ready to render to DOM
            datesSorted.forEach((date) => formatedDates.push(formatDate(date)));

            const datesFromDOM = Array.from(
                document.body.querySelectorAll(
                    "#data-table tbody>tr>td:nth-child(3)"
                )
            ).map((a) => a.innerHTML);

            expect(datesFromDOM).toEqual(formatedDates);
        });
    });
});

describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
        describe("The page is loaded and there is no error", () => {
            test("Then when I click on the eye icon, I can see the picture of the bill", () => {
                const onNavigate = (pathname) => {
                    document.body.innerHTML = ROUTES({ pathname });
                };

                Object.defineProperty(window, "localStorage", {
                    value: localStorageMock,
                });

                window.localStorage.setItem(
                    "user",
                    JSON.stringify({
                        type: "Employee",
                    })
                );

                document.body.innerHTML = BillsUI({ data: bills });

                const billsBoard = new Bills({
                    document,
                    onNavigate,
                    store: null,
                    localStorage: window.localStorage,
                });
                const iconEye = screen.getAllByTestId("icon-eye")[0];
                const handleClickIconEye = jest.fn(
                    billsBoard.handleClickIconEye(iconEye)
                );
                iconEye.addEventListener("click", handleClickIconEye);
                fireEvent.click(iconEye);
                expect(handleClickIconEye).toHaveBeenCalled();
                expect(screen.getAllByAltText("Bill")).toBeTruthy();
                expect(screen.getByText("Justificatif")).toBeTruthy();
            });

            test("Then when I click on the btn-new-bill, I can enter a new Bill", () => {
                const onNavigate = (pathname) => {
                    document.body.innerHTML = ROUTES({ pathname });
                };

                Object.defineProperty(window, "localStorage", {
                    value: localStorageMock,
                });

                window.localStorage.setItem(
                    "user",
                    JSON.stringify({
                        type: "Employee",
                    })
                );

                document.body.innerHTML = BillsUI({ data: bills });

                const billsBoard = new Bills({
                    document,
                    onNavigate,
                    store: null,
                    localStorage: window.localStorage,
                });

                let newBillBtn = screen.getByTestId("btn-new-bill");
                const handleClickNewBill = jest.fn(
                    billsBoard.handleClickNewBill()
                );
                expect(newBillBtn).toBeTruthy();
                newBillBtn.addEventListener("click", handleClickNewBill);
                fireEvent.click(newBillBtn);
                expect(handleClickNewBill).toHaveBeenCalled();
                expect(
                    screen.getByText("Envoyer une note de frais")
                ).toBeTruthy();
            });
        });
    });
});

//test d'integration GET
describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
        test("The bills from mock API are fetched with GET", async () => {
            localStorage.setItem(
                "user",
                JSON.stringify({
                    type: "Employee",
                })
            );
            const root = document.createElement("div");
            root.setAttribute("id", "root");
            document.body.append(root);
            router();
            window.onNavigate(ROUTES_PATH.Bills);
            const accepted_bills = filteredBills(bills, "accepted");
            expect(accepted_bills.length).toBe(1);
            const refused_bills = filteredBills(bills, "refused");
            expect(refused_bills.length).toBe(2);
            const pending_bills = filteredBills(bills, "pending");
            expect(pending_bills.length).toBe(1);
        });
    });
    describe("When an error occurs on API", () => {
        beforeEach(() => {
            jest.spyOn(mockStore, "bills");
            Object.defineProperty(window, "localStorage", {
                value: localStorageMock,
            });
            window.localStorage.setItem(
                "user",
                JSON.stringify({
                    type: "Employee",
                })
            );
            const root = document.createElement("div");
            root.setAttribute("id", "root");
            document.body.appendChild(root);
            router();
        });
        //404 Error means that the page that has to process the post request can't be loaded or not exists
        test("fetches bills from an API and fails with 404 message error", async () => {
            mockStore.bills.mockImplementationOnce(() => {
                return {
                    list: () => {
                        return Promise.reject(new Error("Erreur 404"));
                    },
                };
            });
            window.onNavigate(ROUTES_PATH.Bills);
            await new Promise(process.nextTick);
            const message = await screen.getByText(/Erreur 404/);
            expect(message).toBeTruthy();
        });

        //The 500 Internal Server Error is a very general HTTP status code
        // that means something has gone wrong on the website's server,
        // but the server could not be more specific on what the exact problem is
        test("fetches messages from an API and fails with 500 message error", async () => {
            mockStore.bills.mockImplementationOnce(() => {
                return {
                    list: () => {
                        return Promise.reject(new Error("Erreur 500"));
                    },
                };
            });

            window.onNavigate(ROUTES_PATH.Bills);
            await new Promise(process.nextTick);
            const message = await screen.getByText(/Erreur 500/);
            expect(message).toBeTruthy();
        });
    });
});
