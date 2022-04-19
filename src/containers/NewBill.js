import { ROUTES_PATH } from "../constants/routes.js";
import Logout from "./Logout.js";

export default class NewBill {
    constructor({ document, onNavigate, store, localStorage }) {
        this.document = document;
        this.onNavigate = onNavigate;
        this.store = store;
        const formNewBill = this.document.querySelector(
            `form[data-testid="form-new-bill"]`
        );
        formNewBill.addEventListener("submit", this.handleSubmit);
        const file = this.document.querySelector(`input[data-testid="file"]`);
        file.addEventListener("change", this.handleChangeFile);
        this.fileUrl = null;
        this.email = null;
        this.fileName = null;
        this.billId = null;
        this.formData = new FormData();
        new Logout({ document, localStorage, onNavigate });
    }

    handleChangeFile = (e) => {
        this.formData = null;
        let messageBox = document.querySelector(`#errorMessage`);
        messageBox.textContent = "";
        const file = this.document.querySelector(`input[data-testid="file"]`)
            .files[0];
        const filePath = e.target.value.split(/\\/g);
        const fileName = filePath[filePath.length - 1];
        let fileExtension = fileName.split(".").pop();
        if (["jpg", "jpeg", "png"].includes(fileExtension)) {
            this.email = JSON.parse(localStorage.getItem("user")).email;
            this.formData.append("file", file);
            this.formData.append("email", this.email);

            this.store
                .bills()
                .create({
                    data: this.formData,
                    headers: {
                        noContentType: true,
                    },
                })
                .then(({ fileUrl, key }) => {
                    this.billId = key;
                    this.fileUrl = fileUrl;
                    this.fileName = fileName;
                })
                .catch((error) => {
                    throw error;
                });
        } else {
            messageBox.textContent =
                "Les extensions de fichiers acceptées sont .jpg, .jpeg et .png";
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.fileName) {
            const email = JSON.parse(localStorage.getItem("user")).email;
            const bill = {
                email,
                type: e.target.querySelector(
                    `select[data-testid="expense-type"]`
                ).value,
                name: e.target.querySelector(
                    `input[data-testid="expense-name"]`
                ).value,
                amount: parseInt(
                    e.target.querySelector(`input[data-testid="amount"]`).value
                ),
                date: e.target.querySelector(`input[data-testid="datepicker"]`)
                    .value,
                vat: e.target.querySelector(`input[data-testid="vat"]`).value,
                pct:
                    parseInt(
                        e.target.querySelector(`input[data-testid="pct"]`).value
                    ) || 20,
                commentary: e.target.querySelector(
                    `textarea[data-testid="commentary"]`
                ).value,
                fileUrl: this.fileUrl,
                fileName: this.fileName,
                status: "pending",
            };
            this.updateBill(bill);
            this.onNavigate(ROUTES_PATH["Bills"]);
        }
    };

    // not need to cover this function by tests
    updateBill = (bill) => {
        if (this.store) {
            this.store
                .bills()
                .update({ data: JSON.stringify(bill), selector: this.billId })
                .then(() => {
                    this.onNavigate(ROUTES_PATH["Bills"]);
                })
                .catch((error) => {
                    throw error;
                });
        }
    };
}
