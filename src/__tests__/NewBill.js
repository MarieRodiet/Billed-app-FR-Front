/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import '@testing-library/jest-dom/extend-expect'
import mockStore from "../__mocks__/store"
import { localStorageMock } from "../__mocks__/localStorage.js";
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import Bills, { getBills } from "../containers/Bills.js"
import router from "../app/Router";
import { formatDate } from "../app/format.js"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js";

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    const inputData = {
      name: "Admin",
      date: "johndoe@email.com",
      amount: "azerty",
      tva: "connected",
      pct: "",
      comment: "",
      type: "",
      file: ""
    };

    test("Then it should render the New Bill page with empty inputs", () => {
      document.body.innerHTML = NewBillUI();
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();
      const expenseName = screen.getByTestId("expense-name");
      expect(expenseName.value).toEqual("");

      const expenseTypeInput = screen.getByTestId("expense-type");
      expect(expenseTypeInput.value).toEqual("");

      const datePicker = screen.getByTestId("datepicker");
      expect(datePicker.value).toBe("");

      const amount = screen.getByTestId("amount");
      expect(amount.value).toBe("");

      const tva = screen.getByTestId("vat");
      expect(tva.value).toBe("");

      const pct = screen.getByTestId("pct");
      expect(pct.value).toBe("");

      const comment = screen.getByTestId("commentary");
      expect(comment.value).toBe("");

      const file = screen.getByTestId("file");
      expect(file.value).toBe("");
    })

    test("it should prevent me from submitting the form with wrong inputs", () => {

      //try different extensions than jpg, jpeg ou png
    })

    test("it should prevent me from submitting the form with empty inputs", () => {

    })

    test("it should allow me to submit the form once inputs are correctly entered", () => {
      const expenseTypeInput = screen.getByTestId("expense-type");

      const handleChange = jest.fn();
      fireEvent.change(expenseTypeInput, {
        target: { value: "Transports" },
      });
      expect(expenseTypeInput.value).toEqual("Transports")
      const expenseName = screen.getByTestId("expense-name");
      fireEvent.change(expenseName, {
        target: {
          value: ""
        }
      })
    })

  })
})
