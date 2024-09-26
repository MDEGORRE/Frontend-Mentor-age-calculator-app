import { CountUp } from './node_modules/countup.js/dist/countUp.min.js';

const validateForm = {
    
    init: function() {
        document.getElementById('calculate-age').addEventListener('submit', validateForm.handleDates)
    },

    handleDates: function(event) {
        event.preventDefault();

        validateForm.resetErrorsAndResults();

        let errors = [];

        let day = document.getElementById('day').value
        day < 1 || day > 31 ? errors['wrongDay'] = 'The day is not between 1-31' : '';

        let month = document.getElementById('month').value
        month < 1 || month > 12 ? errors['wrongMonth'] = 'The month is not between 1-12' : '';

        let year = document.getElementById('year').value
        
        // this is used to format day or month when below 10
        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }
        if (year < 100 && year >= 10) {
            year = '00' + year;
        }
        if (year < 10) {
            year = '000' + year;
        }

        // allows to check the number of days in a month https://www.30secondsofcode.org/js/s/days-in-month/ it works for leap years as well
        const daysInMonth = (year, month) => new Date(year, month, 0).getDate();
        if (day > daysInMonth(year, month) && month <= 12) {
            const formattedMonth = Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(month))
            errors['dayNotValid'] = `${formattedMonth + ' ' + year} does not have ${day} days.`
        }

        // check if date is in the future
        const date = new Date(`${year}-${month}-${day}`)
        date > new Date() ? errors['dateInTheFuture'] = 'The date is in the future' : '';

        if (Object.keys(errors).length > 0) {
            validateForm.renderErrors(errors)
        } else validateForm.calculateAge(date, new Date());
    },

    resetErrorsAndResults: function() {
        document.querySelectorAll('.date-error').forEach((errorMessage) => errorMessage.remove());
        document.querySelectorAll('.result').forEach((resultData) => resultData.textContent = '--');
    },

    renderErrors: function(errors) {
        if ('wrongDay' in errors) {
            let errorMessage = document.createElement('p');
            errorMessage.textContent = errors['wrongDay'];
            errorMessage.classList.add('date-error')
            document.getElementById('day').after(errorMessage);
        }
        if ('wrongMonth' in errors) {
            let errorMessage = document.createElement('p');
            errorMessage.textContent = errors['wrongMonth'];
            errorMessage.classList.add('date-error')
            document.getElementById('month').after(errorMessage);
        }
        if ('dayNotValid' in errors) {
            let errorMessage = document.createElement('p');
            errorMessage.textContent = errors['dayNotValid'];
            errorMessage.classList.add('date-error')
            document.querySelector('section').after(errorMessage);
        }
        if ('dateInTheFuture' in errors) {
            let errorMessage = document.createElement('p');
            errorMessage.textContent = errors['dateInTheFuture'];
            errorMessage.classList.add('date-error')
            document.querySelector('section').after(errorMessage);
        }
    },

    calculateAge: function(date, currentDate) {
        const interval = new Date(currentDate.getTime() - date.getTime()); //interval in milliseconds

        let counterYears = new CountUp(document.getElementById('result-years'), interval.getUTCFullYear() -1970);
        counterYears.start();
        let counterMonths = new CountUp(document.getElementById('result-months'), interval.getUTCMonth());
        counterMonths.start();
        let counterDays = new CountUp(document.getElementById('result-days'), interval.getUTCDate() - 1);
        counterDays.start();
    }

}

document.addEventListener("DOMContentLoaded", validateForm.init)