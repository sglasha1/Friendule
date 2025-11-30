const submitButton = document.getElementById("submit");
const calendarCode = document.getElementById("code");
const errormsg = document.getElementById("calendarerror")

submitButton.addEventListener('click', () => {
    window.location.href = '/finished_calendar/' + calendarCode.value;
})