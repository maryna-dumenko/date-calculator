export class HolidaysCalculator {
    constructor(API_KEY, selectList, yearsList, calculateBtnHolidays, tableResult) {
        this.API_KEY = API_KEY;
        this.selectList = selectList;
        this.yearsList = yearsList;
        this.calculateBtnHolidays = calculateBtnHolidays;
        this.tableResult = tableResult;
        this.sortIcon = tableResult.querySelector("#sortIcon");
        this.holidaysList = [];

        this.calculateBtnHolidays.addEventListener("click", (event) => {
            event.preventDefault();
            this.fetchHolidays();
        })

        this.sortIcon.addEventListener("click", (event) => {
            this.#sortTable(event.target.dataset.sort)
        })
    }

    fetchCountries = async () => {
        const url =
            `https://calendarific.com/api/v2/countries?api_key=${this.API_KEY}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            this.#updateCountriesSelect(data.response.countries);
            this.#updateYearSelect();
            this.selectList.disabled = false;
            this.yearsList.disabled = false;
        } catch (error) {
            throw new Error(error);
        } finally {
            this.calculateBtnHolidays.disabled = false;
        }
    }

    fetchHolidays = async () => {
        const url =
            `https://calendarific.com/api/v2/holidays?api_key=${this.API_KEY}&country=${this.selectList.value}&year=${this.yearsList.value}`;

        try {
            this.calculateBtnHolidays.disabled = true;
            const response = await fetch(url);
            const data = await response.json();
            this.tableResult.querySelector("tbody").innerHTML = "";
            this.holidaysList = data.response.holidays;
            this.#updateTableResult(this.holidaysList);
            this.sortIcon.classList.remove("hidden");
        } catch (error) {
            throw new Error(error);
        } finally {
            this.calculateBtnHolidays.disabled = false;
        }
    }

    #updateYearSelect() {
        const currentDate = new Date();
        for(let i = 2001; i < 2050; i++) {
            const option = document.createElement('option');
            option.value = `${i}`;
            option.innerHTML = `${i}`;
            if(currentDate.getFullYear() === i) {
                option.selected = true
            }
            this.yearsList.appendChild(option);
        }
    }

    #updateCountriesSelect(countries) {
        countries.forEach((country) => {
            const option = document.createElement('option');
            option.value = country["iso-3166"];
            option.innerHTML = country["country_name"];
            this.selectList.appendChild(option);
        })
    }

    #updateTableResult(holidays) {
       this.tableResult.querySelector("tbody").innerHTML = "";

        holidays.forEach((holiday) => {
            this.#addHolidayToTable({
                date: holiday.date.iso,
                name: holiday.name
            });
        })
    }

    #addHolidayToTable(holiday) {
        const { date, name } = holiday;
        const row = document.createElement("tr");
        row.classList.add("table-result__row");

        row.innerHTML = `<td class="table-result__cell">${date}</td>
                         <td class="table-result__cell">${name}</td>  
                        `;

        this.tableResult.querySelector("tbody").appendChild(row);
    }

    #sortTable(typeSort) {
        this.holidaysList.sort((a, b) => {
            switch (typeSort) {
                case "ascending":
                    return Date.parse(a.date.iso) >
                    Date.parse(b.date.iso)
                        ? 1
                        : -1;
                case "descending":
                    return Date.parse(b.date.iso) <
                    Date.parse(a.date.iso)
                        ? -1
                        : 1;
                default:
                    break;
            }
        });

        this.sortIcon.dataset.sort = (typeSort === "ascending" ? "descending" : "ascending");
        this.#updateTableResult(this.holidaysList);
    }
}