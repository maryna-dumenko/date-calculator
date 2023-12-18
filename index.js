import {Tabs} from "./tabs.js";
import {DateCalculator} from "./dateCalculator.js";
import {HolidaysCalculator} from "./holidaysCalculator.js";

import {tabsNav, tabsContent, inputStartDate, inputEndDate, timeIntervalSelect, typeDaysSelect, typeCountsSelect, buttonSubmit, tableResultDates, countriesSelect, yearsList, calculateBtnHolidays, tableResultHolidays, API_KEY} from './constants.js'

(() => {
    const tabs = new Tabs(tabsNav, tabsContent);
    const dateCalculator = new DateCalculator(inputStartDate, inputEndDate, timeIntervalSelect, typeDaysSelect, typeCountsSelect, buttonSubmit, tableResultDates);
    const holidaysCalculator = new HolidaysCalculator(API_KEY, countriesSelect, yearsList, calculateBtnHolidays, tableResultHolidays);

    dateCalculator.renderTableResults();

    tabs.tabsNav.addEventListener("click", function(event) {
        if(event.target.dataset.content === "holidaysCalculator" && holidaysCalculator.countries.length === 0) {
           holidaysCalculator.fetchCountries();
        }
    })
})()


