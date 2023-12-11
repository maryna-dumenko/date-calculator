export class DateCalculator {
    constructor(inputStartDate, inputEndDate, timeIntervalSelect, typeDaysSelect, typesResultSelect, buttonSubmit, tableResults) {
        this.inputStartDate = inputStartDate;
        this.inputEndDate = inputEndDate;
        this.timeIntervalSelect = timeIntervalSelect;
        this.typeDaysSelect = typeDaysSelect;
        this.typesResultSelect = typesResultSelect;
        this.buttonSubmit = buttonSubmit;
        this.tableResults = tableResults;

        this.inputStartDate.addEventListener("change", () => {
            this.#changeStateEndDateInput();
        })

        this.inputEndDate.addEventListener("change", () => {
            this.inputStartDate.max = this.inputEndDate.value;
        })

        this.timeIntervalSelect.addEventListener("change", event => {
            this.#changeTimeInterval(event.target.value);
        })

        this.buttonSubmit.addEventListener("click", () => {
            this.#submit();
        })
    }

    #changeStateEndDateInput() {
        this.inputEndDate.disabled = false;
        this.inputEndDate.min = this.inputStartDate.value;
    }

    #addDaysToDate(countDays, date) {
        return new Date(
            date.setDate(date.getDate() + countDays)
        )
    }

    #formatToDate(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const days = date.getDate();

        return `${year}-${month > 9 ? month : `0${month}`}-${days > 9 ? days : `0${days}`}`;
    }

    #changeTimeInterval(interval) {
        if(!this.inputStartDate.value) {
            const today = new Date();
            this.inputStartDate.value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
            this.#changeStateEndDateInput();
        }

        switch (interval) {
            case "week":
                this.inputEndDate.value = this.#formatToDate(this.#addDaysToDate(7, new Date(this.inputStartDate.value)));
                break;
            case "month":
                this.inputEndDate.value = this.#formatToDate(this.#addDaysToDate(30, new Date(this.inputStartDate.value)));
        }

        this.inputStartDate.max = this.inputEndDate.value;
    }

    #calculateResultInDays() {
        let totalResultInDays = 0;
        switch (this.typeDaysSelect.value) {
            case "allDay":
                totalResultInDays = this.#getCountsDays(new Date(this.inputStartDate.value), new Date(this.inputEndDate.value));
                break;
            case "weekendDays":
                totalResultInDays = this.#getCountsTypeDays(new Date(this.inputStartDate.value), new Date(this.inputEndDate.value)).weekendsDay;
                break;
            case "workingDays":
                totalResultInDays = this.#getCountsTypeDays(new Date(this.inputStartDate.value), new Date(this.inputEndDate.value)).workingDays;
        }

        return totalResultInDays;
    }

    #getCountsDays(startDate, endDate) {
        return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
    }

    #getCountsTypeDays(startDate, endDate) {
        let weekendsDay= 0;
        let workingDays= 0;

        for(startDate; startDate <= endDate; startDate.setDate(startDate.getDate() + 1)) {
            if (startDate.getDay() === 0 || startDate.getDay() === 6) {
                weekendsDay++;
            } else {
                workingDays++;
            }
        }

        return {
            weekendsDay: weekendsDay,
            workingDays: workingDays
        };
    }

    #getResultsFromStorage() {
        return localStorage.getItem('dateCalculatorResults') !== null
            ? JSON.parse(localStorage.getItem('dateCalculatorResults'))
            : [];
    }

    #storeResultsToLocalStorage(startDate, endDate, result) {
        const lastResults = this.#getResultsFromStorage();

        if(lastResults.length > 9) {
            lastResults.shift();
        }

        lastResults.push({
            startDate: startDate,
            endDate: endDate,
            resultString: result
        });

        localStorage.setItem('dateCalculatorResults', JSON.stringify(lastResults));
    }

    #addResultToTable(result) {
        const { startDate, endDate, resultString } = result;

        const row = document.createElement("tr");
        row.classList.add("table-result__row");

        row.innerHTML = `<td class="table-result__cell">${startDate}</td>
                         <td class="table-result__cell">${endDate}</td>
                         <td class="table-result__cell">${resultString}</td>   
                        `;

        this.tableResults.querySelector("tbody").appendChild(row);
    }

    renderTableResults() {
        const lastResults = this.#getResultsFromStorage();

        lastResults.forEach((result) => {
            this.#addResultToTable(result);
        })
    }

    #submit() {
        let resultString = "";
        if(this.inputStartDate.value && this.inputEndDate.value) {
            const resultInDays = this.#calculateResultInDays();

            switch (this.typesResultSelect.value) {
                case "days":
                    resultString = `${resultInDays} days`;
                    break;
                case "hours":
                    resultString = `${resultInDays * 24} hours`;
                    break;
                case "minutes":
                    resultString = `${resultInDays * 24 * 60} minutes`;
                    break;
                case "seconds":
                    resultString = `${resultInDays * 24 * 60 * 60} seconds`;
                    break;
            }

            if(this.#getResultsFromStorage().length > 9) {
                this.tableResults.querySelector("tbody .table-result__row").remove();
            }

            this.#addResultToTable({
                    startDate: this.inputStartDate.value,
                    endDate: this.inputEndDate.value,
                    resultString: resultString
            });

            this.#storeResultsToLocalStorage(this.inputStartDate.value, this.inputEndDate.value, resultString);
        } else {
            alert("Будь ласка введіть початкову і кінцеву дату");
        }
    }
}