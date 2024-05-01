//Fetches the HTML objects in each stated class and stores it in a variable
const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper "),
  addEventCloseBtn = document.querySelector(".close "),
  addEventTitle = document.querySelector(".employee-select "),
  addEventRole = document.querySelector(".event-role "),
  addEventFrom = document.querySelector(".event-time-from "),
  addEventTo = document.querySelector(".event-time-to "),
  addEventStartPeriod = document.querySelector(".event-period-from "),
  addEventEndPeriod = document.querySelector(".event-period-to ")
  addEventSubmit = document.querySelector(".add-event-btn ");

//Stores current date fields
let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [ //Hardcode months into calendar's array for months
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const eventsArr = []; //Create an array that will store the "events" / shifts that will be assigned
getEvents();

//Populates calendar w/ days and months
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day ">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addListener();
}

//Updates calendar to show previous month
function prevMonth() {
  month--; //Decrements month variable by 1
  if (month < 0) { //If the month variable is decremented past 0...
    month = 11; //Reset month count to December
    year--; //Decrement year variable to signify new year (i.e. December 2024 - January 2023)
  }
  initCalendar(); //Refresh calendar display to show new month and year
}

//Updates calendar to show next month
function nextMonth() {
  month++; //Increments month variable by 1
  if (month > 11) { //If the month variable is incremented past 11...
    month = 0; //Reset month count to January
    year++; //Increment year variable to signify new year (i.e. December 2023 - January 2024)
  }
  initCalendar(); //Refresh calendar display to show new month and year
}

//Event listeners connected with the Month's left and right arrows
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

//Refresh display after each click of left/right arrows
initCalendar();

//Adds event listeners for each day on the calendar
function addListener() {
  const days = document.querySelectorAll(".day"); //All day elements are stored in the days variable
  days.forEach((day) => { //Iterate through each day element in the days variable
    day.addEventListener("click", (e) => { //If a day is clicked on...
      getActiveDay(e.target.innerHTML); //Update HTML to make that day the active day
      updateEvents(Number(e.target.innerHTML)); //Update the events container to display the events of that day
      activeDay = Number(e.target.innerHTML); //Update the date of the activeDay to reflect selected day
      
      days.forEach((day) => { //Iterate through each day element in the days variable
        day.classList.remove("active"); //Not all day elements are active
      });
      
      if (e.target.classList.contains("prev-date")) { //User selects day that belongs to the previous month
        prevMonth(); //Display previous month
        setTimeout(() => { //Timing between updating of HTML elements to reflect new calendar month
          const days = document.querySelectorAll(".day");
          days.forEach((day) => { //Updates days for the new calendar month
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) { //User selects day that belongs to the next month
        nextMonth(); //Display next month
        setTimeout(() => { //Timing between updating of HTML elements to reflect new calendar month
          const days = document.querySelectorAll(".day");
          days.forEach((day) => { //Updates days for the new calendar month
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

//User clicks todayBTN which defaults the calendar view back to the current date
todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

//User input fields triggers text formatting
dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, ""); //Only allows integer input
  if (dateInput.value.length === 2) { 
    dateInput.value += "/"; //Automatically format MONTH/YEAR
  }
  if (dateInput.value.length > 7) { // "MM/YYYY" takes up 7 total char spaces
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward") { //Backspace
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

gotoBtn.addEventListener("click", gotoDate); //goToBTN triggers function that renders inputted date to calendar

//Allows User/Admin to select a specific date (MONTH/YEAR) in the past or future
function gotoDate() {
  console.log("here");
  const dateArr = dateInput.value.split("/"); //Splits month and year automatically
  if (dateArr.length === 2) { 
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) { //Month (1-12) and year (####-####) input logic 
      month = dateArr[0] - 1; //Offset for JS zero-month indexing, JS goes from 0-11
      year = dateArr[1]; //Inputted year is stored in year variable
      initCalendar(); //Updates calendar display
      return;
    }
  }
  alert("Invalid Date"); //Date does not fit date input criteria
}

function getActiveDay(date) {
  const day = new Date(year, month, date); //Instantiates new date object with year, month, and date fields
  const dayName = day.toString().split(" ")[0]; //Date object becomes String and weekdays are shortened
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year; //Updates HTML content of eventDate
}

//Update events container for the active day
function updateEvents(date) {
  let events = "";
  eventsArr.forEach((event) => { //Iterate through each day w/ events in eventsArr
    if (
      date === event.day &&
      month + 1 === event.month && //Checks if date matches date of event
      year === event.year
    ) {
      event.events.forEach((event) => { //Iterates through events of the current day 
        events += `<div class="event"> 
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${event.time}</span>
            </div>
        </div>`; //HTML formatting for events in event container
      });
    }
  });
  if (events === "") { //Check if day has no events
    events = `<div class="no-event">
            <h3>No Events</h3>  
        </div>`; //HTML formatting for empty events container
  }
  eventsContainer.innerHTML = events; 
  saveEvents(); //Saves updated event data to local storage
}

//Add event plus sign button becomes interactable
addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active"); //Shows add event pop-up
});

//Exit button for Add event pop-up
addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active"); //Hides add event pop-up
});


document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) { //If element clicked is not the add button or the add event pop-up does not include the element clicked
    addEventWrapper.classList.remove("active");
  }
});

//Add event to eventsArr when Assign button is clicked
addEventSubmit.addEventListener("click", () => {
  const eventTitle = addEventTitle.value;
  const eventRole = addEventRole.value;
  const eventTimeFrom = addEventFrom.value;
  const startPeriod =  addEventStartPeriod.value;
  const eventTimeTo = addEventTo.value;
  const endPeriod =  addEventEndPeriod.value;

  //Checks to make sure input values are not left empty
  if (eventTitle === "" || eventRole === "" || eventTimeFrom === "" || eventTimeTo === "" || addEventStartPeriod === "" || addEventEndPeriod === "") {
    alert("Please fill out all the fields.");
    return;
  }

  if(eventTimeFrom === eventTimeTo && startPeriod === endPeriod) {
    alert("Start time and end time cannot be the same.")
  }

      //   if (
      //     ((startPeriod === "AM" && endPeriod === "AM" && eventTimeFrom >= eventTimeTo) ||
      //     (startPeriod === "AM" && endPeriod === "PM" && eventTimeFrom >= eventTimeTo)) ||
      //     (startPeriod === "PM" && endPeriod === "PM" && eventTimeFrom >= eventTimeTo) ||
      //     (startPeriod === "PM" && endPeriod === "AM" && eventTimeFrom >= eventTimeTo))
      //     {
      //     alert("End time must be after start time.");
      //     return;
      //     }

  let eventExist = false; //Initialize eventExist variable and boolean
  eventsArr.forEach((event) => { //Iterate through each day w/ events in eventsArr
    if ( //Checks if day matches active day
      event.day === activeDay &&
      event.month === month + 1 && 
      event.year === year
    ) {
      event.events.forEach((event) => { //
        if (event.title === (eventTitle + "   (" + eventRole + ")")) { //Checks if employee was already scheduled for the day
          eventExist = true; //If true, then employee was already scheduled for that day
        }
      });
    }
  });
  if (eventExist) { //Send Admin notification for double-scheduling
    alert("Employee has already been scheduled for this day.");
    return;
  }
  const newEvent = { //Instantiate new event object with their title (a.k.a. name), role, start/end time
    title: eventTitle + "   (" + eventRole + ")",
    time: eventTimeFrom + startPeriod + " - " + eventTimeTo + endPeriod,
  };

  let eventAdded = false;
  if (eventsArr.length > 0) { //Checks to see if eventsArr is empty
    eventsArr.forEach((item) => { //Iterate through each item in eventsArr
      if (
        item.day === activeDay && //Checks event day, month, and year against active day, month, and year
        item.month === month + 1 &&
        item.year === year
      ) {
        item.events.push(newEvent); //New event is added to eventsArr for selected day
        eventAdded = true; //Changes boolean value to confirm event has been added
        console.log("eventAdded: " + eventAdded); //Tracing
      }
    });
  }

  //If event is added successfully, add event to eventsArr
  if (!eventAdded) {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [newEvent],
    });
  }

  addEventWrapper.classList.remove("active"); //Hide assign shift form
  addEventTitle.value = ""; //Clears selected values for next time assign shift form is active
  addEventRole.value = ""; //Clears selected values for next time assign shift form is active
  addEventStartPeriod.value = ""; //Clears selected values for next time assign shift form is active
  addEventEndPeriod.value = ""; //Clears selected values for next time assign shift form is active
  addEventFrom.value = ""; //Clears selected values for next time assign shift form is active
  addEventTo.value = ""; //Clears selected values for next time assign shift form is active
  updateEvents(activeDay); //Update events container for active day

  //Checks to make sue active day contains new event, if not manually add events for that day
  const activeDayEl = document.querySelector(".day.active");
  if (!activeDayEl.classList.contains("event")) {
    activeDayEl.classList.add("event");
  }
});

//Admin clicks on selected shift, is prompted to confirm action
eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) { 
    if (confirm("Are you sure you want to unassign this shift?")) { //Pop-up prompt
      const eventTitle = e.target.children[0].children[1].innerHTML; //Finds the title of the selected shift
      eventsArr.forEach((event) => { //Iterate through events array
        if ( //Cross-examines current shift's information with active day 
          event.day === activeDay &&
          event.month === month + 1 &&
          event.year === year
        ) {
          event.events.forEach((item, index) => {  //Iterates through the events of the selected day
            if (item.title === eventTitle) { //Check if they share the same employee name or title
              event.events.splice(index, 1); //If true, remove the event from event object
            }
          });
          if (event.events.length === 0) { //If no events found for active day, remove that day from eventsArr
            eventsArr.splice(eventsArr.indexOf(event), 1);
            const activeDayEl = document.querySelector(".day.active");
            if (activeDayEl.classList.contains("event")) { //Remove event from active day's list
              activeDayEl.classList.remove("event");
            }
          }
        }
      });
      updateEvents(activeDay);
    }
  }
});

//Save scheduled shifts
function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}
 //See if there are shifts saved
function getEvents() {
 
  if (localStorage.getItem("events") === null) { //Checks if there are saved shifts in local storage
    return;
  }
  eventsArr.push(...JSON.parse(localStorage.getItem("events"))); //Loads shifts 
}
