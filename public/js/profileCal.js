function getSlotMS(startDate, startTime, slotDate, slotHour, slotQuarter){
  const fifteen = 15 * 60000;
  const day = 86400000;
  let intSlotHour = parseInt(slotHour);
  let intSlotQuarter = parseInt(slotQuarter);
  let intSlotDate = parseInt(slotDate);
  let startHour = intSlotHour;
  let quarterMS = intSlotQuarter * fifteen;
  let startDateObj = new Date(`${startDate}T${startHour.toString().padStart(2, '0')}:00:00`);
  let almostMs = startDateObj.getTime();
  let dayAdjustment = day * intSlotDate;
  let actualMs = almostMs + quarterMS + dayAdjustment;
  let endMs = actualMs + fifteen;

  return [actualMs, endMs];
}

async function heatify(startTime, calendarURL){
  const response = await fetch(`/api/calendar/${calendarURL}`);
  const data = await response.json();
  let numUsers = data.length;
  let score = 0;
  for(const row of data){
    let pref = JSON.parse(row.preferences);
    if(matchesStart(pref.rank1, startTime)){
      score += 3;
    }
    else if(matchesStart(pref.rank2, startTime)){
      score += 2;
    }
    else{
      score -= 3;
    }
  }
  score = score / numUsers;
  console.log("score is:", score);
  let newClass = colorByScore(score);
  console.log("heatifying to: [" + newClass + "]");
  return newClass;
}

function matchesStart(arr, startTime){
  for (const entry of arr){
    if(entry[0] === startTime){
      return true;
    }
  }
  return false;
}

function colorByScore(score){
  let newClass = "";
  if(score <= -3){
    newClass = "Bad4";
  }
  else if(score <= -2){
    newClass = "Bad3";
  }
  else if(score <= -1){
    newClass = "Bad2";
  }
  else if(score <= 0){
    newClass = "Bad1";
  }
  else if(score <= 1){
    newClass = "Neutral";
  }
  else if(score <= 2){
    newClass = "Good1";
  }
  else if(score <= 2.5){
    newClass = "Good2";
  }
  else if(score < 3){
    newClass = "Good3";
  }
  else{
    newClass = "Good4";
  }
  return newClass;
}

function computeHeat(startTime, data) {
  let score = 0;
  const numUsers = data.length;

  for (const row of data) {
    const pref = JSON.parse(row.preferences);

    if (matchesStart(pref.rank1, startTime)) score += 3;
    else if (matchesStart(pref.rank2, startTime)) score += 2;
    else score -= 3;
  }

  const normalized = score / numUsers;
  return colorByScore(normalized);
}

async function displayGroup(calSpot) {
  const calendarURL = calSpot.dataset.url;

  // Fetch once
  const response = await fetch(`/api/calendar/${calendarURL}`);
  const data = await response.json();

  const boxes = calSpot.querySelectorAll(".slot");

  for (const slot of boxes) {
    const slotDate = slot.dataset.date;
    const slotHour = slot.dataset.hour;
    const slotQuarter = slot.dataset.quarter;
    const startDate = slot.dataset.startdate;
    const startTime = slot.dataset.starttime;

    const timeMS = getSlotMS(startDate, startTime, slotDate, slotHour, slotQuarter);
    const newClass = computeHeat(timeMS[0], data); // new function

    slot.classList.remove("gray");
    slot.classList.add(newClass);
  }
}


document.querySelectorAll(".calendar").forEach(calSpot =>{
    console.log("found a calSpot");
    displayGroup(calSpot);
});

