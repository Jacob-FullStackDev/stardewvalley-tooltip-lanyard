"use strict";
/* STATE ARRAYS */

const dayValues = ["Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat.", "Sun."];
const weatherValues = [
  "Sunny",
  "Snow",
  "Festival",
  "Rain",
  "GreenRain",
  "Storm",
  "Wedding",
  "WindSpring",
  "WindFall",
];
const seasonValues = ["Spring", "Summer", "Fall", "Winter"];

/* DOM ELEMENTS */

const weatherIcon = document.getElementById("weather");
const seasonIcon = document.getElementById("season");
const hourEl = document.getElementById("hours");
const dayEl = document.getElementById("day");
const dayOfWeekEl = document.getElementById("day-of-week");
const minuteEl = document.getElementById("minutes");
const ampmEl = document.getElementById("am-pm");
const timeContainerEl = document.getElementById("time-text-container");

/* GLOBAL STATE */

const time = {
  currentDayOfWeekIdx: 0,
  dayNum: 1,
  currentHours: 6,
  currentMinutes: 0,
  isAm: true,
};
const weather = {
  currentWeatherIdx: 0,
  weatherUpdateTicks: Math.round(Math.random() * 50) + 50,
  currentSeasonIdx: 0,
};
const timer = {
  ticks: 0,
  nextTarget: performance.now() + 7000,
};

function updateWeather() {
  if (timer.ticks === weather.weatherUpdateTicks) {
    const oldWeatherIdx = weather.currentWeatherIdx;
    do {
      weather.currentWeatherIdx = Math.round(Math.random() * 8);
    } while (
      weather.currentWeatherIdx === oldWeatherIdx ||
      (weather.currentWeatherIdx === 7 && weather.currentSeasonIdx !== 0) ||
      (weather.currentWeatherIdx === 8 && weather.currentSeasonIdx !== 2)
    );
    weather.weatherUpdateTicks += Math.round(Math.random() * 50) + 50;
  }
}

function updateDays() {
  if (timer.ticks % 120 === 0 && time.dayNum < 29) {
    time.dayNum += 1;
  }
  if (timer.ticks % 120 === 0 && time.dayNum === 29) {
    time.dayNum = 1;
  }
}
function updateSeason() {
  // 3360 is 28 days X 120 ticks per day
  if (timer.ticks % 3360 === 0 && weather.currentSeasonIdx <= 3) {
    weather.currentSeasonIdx += 1;
  }
  if (time.dayNum % 28 && weather.currentSeasonIdx === 4) {
    weather.currentSeasonIdx = 0;
  }
}
function updateTime() {
  // Hours and minutes
  if (time.currentMinutes === 50) {
    time.currentMinutes = 0;
    time.currentHours += 1;
  } else {
    time.currentMinutes += 10;
  }
  if (time.currentHours === 12 && time.currentMinutes === 0) {
    time.isAm = !time.isAm;
  }
  if (time.currentHours === 13 && time.currentMinutes === 0) {
    time.currentHours = 1;
  }
  if (time.currentHours === 2 && time.currentMinutes === 0 && time.isAm) {
    time.currentHours = 6;
    time.currentDayOfWeekIdx += 1;
  }
  if (time.currentDayOfWeekIdx === 7) {
    time.currentDayOfWeekIdx = 0;
  }
}

function toggleRedTimeText() {
  if (
    time.currentHours === 12 &&
    time.currentMinutes === 0 &&
    time.isAm === true
  ) {
    timeContainerEl.classList.add("red-time");
  }
  if (
    time.currentHours === 6 &&
    time.currentMinutes === 0 &&
    time.isAm === true
  ) {
    timeContainerEl.classList.remove("red-time");
  }
}
function updateDOMProperties() {
  hourEl.textContent = time.currentHours;
  minuteEl.textContent = time.currentMinutes === 0 ? "00" : time.currentMinutes;
  ampmEl.textContent = time.isAm ? " am" : " pm";
  dayEl.textContent = ` ${time.dayNum}`;
  dayOfWeekEl.textContent = dayValues[time.currentDayOfWeekIdx];
  seasonIcon.src = `assets/imgs/seasons/${seasonValues[weather.currentSeasonIdx]}.png`;
  weatherIcon.src = `assets/imgs/weather/${weatherValues[weather.currentWeatherIdx]}.png`;
  toggleRedTimeText();
}

function tick() {
  // Should call all update functions
  timer.ticks += 1;
  timer.nextTarget += 7000;
  const delay = Math.max(0, timer.nextTarget - performance.now());
  updateTime();
  updateDays();
  updateWeather();
  updateSeason();
  updateDOMProperties();
  setTimeout(tick, delay);
}
setTimeout(tick, 7000);
