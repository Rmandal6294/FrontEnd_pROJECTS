const todayDate = new Date();
document.getElementById("todayDate").textContent = `${todayDate.toLocaleString("default", { month: "long" })} ${todayDate.getDate()},  ${todayDate.getFullYear()}`

const showError = (msg) => {
    const errorField = document.getElementById("errorText");
    document.getElementById("errorMessage").style.display = "flex";
    errorField.innerHTML = msg;
}

const clearError = () =>{
    document.getElementById("errorMessage").style.display = "none";
    document.getElementById("errorText").innerHTML = "";
}

const showResultField = () =>{
    document.getElementById("resultText").style.display = "block";
    document.getElementById("nextBirthday").style.display = "block";
}

const clearResultField = () => {
    document.getElementById("resultText").style.display = "none";
    document.getElementById("nextBirthday").style.display = "none";
}

function calculate(){
    const dayValue   = document.getElementById("dayInput").value.trim();
    const monthValue = document.getElementById("monthInput").value;
    const yearValue  = document.getElementById("yearInput").value.trim();
    clearError();
    clearResultField();

    if(!dayValue || !monthValue || !yearValue){
        return showError("Please Enter Values ! Empty Field Detected !")
    }

    const day = Number(dayValue)
    const month = Number(monthValue)
    const year = Number(yearValue)

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return showError("Please Enter Only NUmber Value");
    }
    if (year < 1900 || year > todayDate.getFullYear()) {
        return showError(`Year must be under 1900 to ${now.getFullYear()}.`);
    }
    if (month < 1 || month > 12) {
        return showError("Month must be under JAN to DEC");
    }
    const maxDay = new Date(year, month, 0).getDate();
      if (day < 1 || day > maxDay) {
        return showError(`Day is Incorrect it should 1 and ${maxDay} for the selected month.`);
    }

    const dob = new Date(year, month - 1, day);
    if(dob > todayDate){
        return showError("Date of birth cannot be in the future.");
    }

    let getAgeYears = todayDate.getFullYear() - dob.getFullYear()
    let getAgeMonths = todayDate.getMonth() -  dob.getMonth()
    let getAgeDays = todayDate.getDate() - dob.getDate();

    if (getAgeDays < 0) {
        getAgeMonths--;
        let prevMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0).getDate();
        getAgeDays += prevMonth;
    }

    if (getAgeMonths < 0) {
        getAgeYears--;
        getAgeMonths += 12;
    }

    const livedTotal = todayDate - dob;
    const totalDaysLived = Math.floor(livedTotal / (1000 * 60 * 60 * 24))

    let nextBirthDay = new Date(todayDate.getFullYear(), month-1, day)
    if (nextBirthDay <= todayDate) {
        nextBirthDay.setFullYear(todayDate.getFullYear() + 1);
    }
    const daysUntilBirthday = Math.ceil((nextBirthDay - todayDate) / (1000 * 60 * 60 * 24));
    const isBirthday =  todayDate.getDate() === day && todayDate.getMonth() === month - 1

    document.getElementById("R_years").innerHTML = getAgeYears;
    document.getElementById("R_months").innerHTML = getAgeMonths;
    document.getElementById("R_days").innerHTML = getAgeDays;
    console.log(getAgeDays + getAgeMonths + getAgeDays)

    showResultField();
    document.getElementById("resultText").innerHTML =`You were born on <span> ${dob.toLocaleString("default", { month: "long" })} ${day}, ${year} </span> and have lived <span> ${totalDaysLived.toLocaleString()} days</span> In this Planet.`;

    if (isBirthday) {
        document.getElementById("nextBirthday").innerHTML = "🎉🎂 Happy Birthday! 🎂🎉";
    } else {
        document.getElementById("nextBirthday").innerHTML = `🎂 ${daysUntilBirthday} days left until your birthday.`;
    }
}