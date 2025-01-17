/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import mockStore from "../__mocks__/store.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import router from "../app/Router";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import userEvent from "@testing-library/user-event";

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page", () => {
        test("Then the icon-mail in vertical layout should now be highlighted and icon-window should not", () => {
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
            window.onNavigate(ROUTES_PATH.NewBill);

            const iconMail = screen.getByTestId("icon-mail");
            expect(iconMail).toHaveAttribute("class", "active-icon");
            expect(iconMail).toBeTruthy();
            expect(iconMail).toHaveAttribute("id", "layout-icon2");

            const iconWindow = screen.getByTestId("icon-window");
            expect(iconWindow).toBeTruthy();
            expect(iconWindow).toHaveAttribute("id", "layout-icon1");
        });

        test("Then it should render the New Bill page with empty inputs", () => {
            document.body.innerHTML = NewBillUI();

            const expenseName = screen.getByTestId("expense-name");
            const expenseTypeInput = screen.getByTestId("expense-type");
            const datePicker = screen.getByTestId("datepicker");
            const amount = screen.getByTestId("amount");
            const tva = screen.getByTestId("vat");
            const pct = screen.getByTestId("pct");
            const comment = screen.getByTestId("commentary");
            const file = screen.getByTestId("file");

            expect(screen.getByTestId("form-new-bill")).toBeTruthy();
            expect(expenseName.value).toEqual("");
            expect(expenseTypeInput.value).toEqual("");
            expect(datePicker.value).toBe("");
            expect(amount.value).toBe("");
            expect(tva.value).toBe("");
            expect(pct.value).toBe("");
            expect(comment.value).toBe("");
            expect(file.value).toBe("");
        });

        test("it should prevent me from submitting the form with empty inputs", () => {
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
            window.onNavigate(ROUTES_PATH.NewBill);
            document.body.innerHTML = NewBillUI();

            const expenseName = screen.getByTestId("expense-name");
            const expenseTypeInput = screen.getByTestId("expense-type");
            const datePicker = screen.getByTestId("datepicker");
            const amount = screen.getByTestId("amount");
            const tva = screen.getByTestId("vat");
            const pct = screen.getByTestId("pct");
            const comment = screen.getByTestId("commentary");

            const newBillData = {
                id: "47qAXb6fIm2zOKkLzMro",
                vat: "80",
                fileUrl:
                    "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
                status: "pending",
                type: "Hôtel et logement",
                commentary: "séminaire billed",
                name: "encore",
                fileName: "preview-facture-free-201801-pdf-1.jpg",
                date: "2004-04-04",
                amount: 400,
                commentAdmin: "ok",
                email: "a@a",
                pct: 20,
            };

            fireEvent.change(expenseTypeInput, {
                target: { value: newBillData["type"] },
            });
            expect(expenseTypeInput.value).toBe(newBillData["type"]);

            fireEvent.change(expenseName, {
                target: { value: newBillData["name"] },
            });
            expect(expenseName.value).toBe(newBillData["name"]);

            fireEvent.change(datePicker, {
                target: { value: newBillData["date"] },
            });
            expect(datePicker.value).toBe(newBillData["date"]);

            fireEvent.change(amount, {
                target: { value: newBillData["amount"] },
            });
            expect(parseInt(amount.value)).toBe(newBillData["amount"]);

            fireEvent.change(tva, { target: { value: newBillData["vat"] } });
            expect(tva.value).toBe(newBillData["vat"]);

            fireEvent.change(pct, { target: { value: newBillData["pct"] } });
            expect(parseInt(pct.value)).toBe(newBillData["pct"]);

            fireEvent.change(comment, {
                target: { value: newBillData["commentary"] },
            });
            expect(comment.value).toBe(newBillData["commentary"]);

            const submitBtn = screen.getByRole("button");
            expect(submitBtn).toBeTruthy();

            const form = screen.getByTestId("form-new-bill");
            const handleSubmit = jest.fn((e) => e.preventDefault());
            form.addEventListener("submit", handleSubmit);
            fireEvent.submit(form);
            expect(form).toBeTruthy();
            const iconWindow = screen.getByTestId("icon-window");
            expect(iconWindow).toBeTruthy();
        });

        test("Then it should call handleChangeFile when a file is selected for uploading img of bill", () => {
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
            window.onNavigate(ROUTES_PATH.NewBill);
            document.body.innerHTML = NewBillUI();

            const newBill = new NewBill({
                document, onNavigate, store: null, localStorage: window.localStorage,
            });

            const fileInput = screen.getByTestId("file");
            let file = new File(["file.pdf"], "file.pdf", {
                type: "application/pdf",
            });
            const handleFile = jest.fn(() => newBill.handleChangeFile);
            fileInput.addEventListener("change", handleFile);
            fireEvent.change(fileInput, { target: { files: [file] } });
            expect(handleFile).toHaveBeenCalled();
            const numberOfFile = screen.getByTestId("file").files.length;
            expect(numberOfFile).toEqual(1);
        });

        test("Then it should give me an error when a wrong extension is part of the chosen file", () => {
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
            window.onNavigate(ROUTES_PATH.NewBill);
            document.body.innerHTML = NewBillUI();

            const newBill = new NewBill({
                document,
                onNavigate,
                store: mockStore,
                localStorage: window.localStorage,
            });
            const fileInput = screen.getByTestId("file");
            let file = new File(["file.pdf"], "file.pdf", {
                type: "application/pdf",
            });

            const handleFile = jest.fn(() => newBill.handleChangeFile);
            fileInput.addEventListener("change", handleFile);
            fireEvent.change(fileInput, { target: { files: [file] } });

            expect(fileInput.files[0].name).toBe("file.pdf");
            let errorMessage = screen.getByTestId("errorMessage");

            expect(errorMessage.textContent).toEqual(
                expect.stringContaining(
                    "Les extensions de fichiers acceptées sont .jpg, .jpeg et .png"
                )
            );
            expect(newBill.fileName).toBeNull();
            expect(newBill.fileUrl).toBeNull();
            expect(newBill.formData).toBeNull();
            expect(newBill.email).toBeNull();
        });

        test("Then it should redirect me to Bills page if form has been submitted with correct inputs", () => {
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
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            };

            document.body.innerHTML = NewBillUI();

            const newBill = new NewBill({
                document,
                onNavigate,
                store: mockStore,
                localStorage: window.localStorage,
            });

            const form = screen.getByTestId("form-new-bill");
            const expenseName = screen.getByTestId("expense-name");
            const expenseTypeInput = screen.getByTestId("expense-type");
            const datePicker = screen.getByTestId("datepicker");
            const amount = screen.getByTestId("amount");
            const tva = screen.getByTestId("vat");
            const pct = screen.getByTestId("pct");
            const comment = screen.getByTestId("commentary");

            const newBillData = {
                id: "BeKy5Mo4jkmdfPGYpTxZ",
                vat: "",
                amount: 100,
                name: "test1",
                fileName: "1592770761.jpeg",
                commentary: "plop",
                pct: 20,
                type: "Transports",
                email: "a@a",
                fileUrl:
                    "https://test.storage.tld/v0/b/billable-677b6.a…61.jpeg?alt=media&token=7685cd61-c112-42bc-9929-8a799bb82d8b",
                date: "2001-01-01",
                status: "refused",
                commentAdmin: "en fait non",
            };

            fireEvent.change(expenseTypeInput, {
                target: { value: newBillData["type"] },
            });
            fireEvent.change(expenseName, {
                target: { value: newBillData["name"] },
            });
            fireEvent.change(datePicker, {
                target: { value: newBillData["date"] },
            });
            fireEvent.change(amount, {
                target: { value: newBillData["amount"] },
            });
            fireEvent.change(tva, { target: { value: newBillData["vat"] } });
            fireEvent.change(pct, { target: { value: newBillData["pct"] } });
            fireEvent.change(comment, {
                target: { value: newBillData["commentary"] },
            });

            newBill.fileName = newBillData["name"];
            newBill.fileUrl = newBillData["fileUrl"];

            const handleSubmit = jest.fn(newBill.handleSubmit);
            form.addEventListener("submit", handleSubmit);
            fireEvent.submit(form);
            let userType = localStorageMock.getItem("user");

            expect(userType.search("Employee")).not.toBe(-1);
            expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
            expect(screen.getByTestId("btn-new-bill")).toBeTruthy();
        });
    });
});

describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page", () => {
        test("Then I should be able to create a new bill and get its fileUrl and key", async () => {
            let spy = jest.spyOn(mockStore, "bills");
            const newBillData = {
                id: "1234",
                vat: "",
                amount: 100,
                name: "test1",
                fileName: "1592770761.jpeg",
                commentary: "plop",
                pct: 20,
                type: "Transports",
                email: "a@a",
                fileUrl:
                    "https://localhost:3456/images/test.jpg",
                date: "2001-01-01",
                status: "refused",
                commentAdmin: "en fait non",
            };

            let method = new mockStore.bills();
            let object = await method
                .create(newBillData);

            expect(spy).toHaveBeenCalledTimes(1);
            expect(object.key).toBe(newBillData["id"]);
            expect(object.fileUrl).toBe(newBillData["fileUrl"]);

        });
        var newCreatedBill = null;
        beforeEach(() => {
            jest.spyOn(mockStore, "bills")
            Object.defineProperty(
                window,
                'localStorage',
                { value: localStorageMock }
            )
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }
            document.body.innerHTML = NewBillUI()
            newCreatedBill = new NewBill({
                document, onNavigate, store: mockStore, localStorage: window.localStorage
            })

            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.appendChild(root)
            router()
        })
        test("Then it could fail to create a message with 404 message error from the server", async () => {
            mockStore.bills.mockImplementationOnce(() => {
                return {
                    list: () => {
                        return Promise.reject(new Error("Erreur 404"))
                    }
                }
            });

            const fileInput = screen.getAllByTestId("file");
            let file = new File(['img'], 'test_error_newbill.png', { type: 'image/png' });
            userEvent.upload(fileInput[0], file)
            window.onNavigate(ROUTES_PATH.Bills);
            await new Promise(process.nextTick)
            const message = await screen.getByText(/Erreur 404/)
            expect(message).toBeTruthy()
        });

        test("Then it could fail to create a message with 500np message error from the server", async () => {
            mockStore.bills.mockImplementationOnce(() => {
                return {
                    list: () => {
                        return Promise.reject(new Error("Erreur 500"))
                    }
                }
            })

            const fileInput = screen.getAllByTestId("file");
            let file = new File(['img'], 'test_error_newbill.png', { type: 'image/png' });
            userEvent.upload(fileInput[0], file)
            window.onNavigate(ROUTES_PATH.Bills);
            await new Promise(process.nextTick)
            const message = await screen.getByText(/Erreur 500/)
            expect(message).toBeTruthy()
        });
    })



});


