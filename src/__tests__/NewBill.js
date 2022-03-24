/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js";
import mockStore from "../__mocks__/store"


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

    test("Then it should render the New Bill page with empty or default inputs", () => {
      document.body.innerHTML = NewBillUI();
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();

      const expenseName = screen.getByTestId("expense-name");
      expect(expenseName.value).toEqual("");

      const expenseTypeInput = screen.getByTestId("expense-type");
      expect(expenseTypeInput.value).toEqual("none");

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

    test("it should allow me to enter data in the inputs", () => {
      const expenseTypeInput = screen.getByTestId("expense-type");

      const handleChange = jest.fn();
      fireEvent.change(expenseTypeInput, {
        target: { value: "Transports" },
      });
      expect(expenseTypeInput.value).toEqual("Transports")

      fireEvent.change(expenseName, {
        target: {
          value: ""
        }
      })
    })

  })
})
