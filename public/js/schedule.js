// Convert into local-midnight milliseconds without timezone shift
function dateToLocalMs(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d).getTime(); 
}

function quickSort(arr) {
  if (arr.length <= 1) return arr;

  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];
  
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i][0] < pivot[0]) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}

function deleteDuplicates(arr){
    console.log("Going to deleteDuplicates of:", arr);
    let length = arr.length;
    let deleteLst = [];
    for(let i = 0; i < length - 1; i++){
        if(arr[i] === arr[i+1]){
            deleteLst.push(arr[i]);
        }
    }
    for (let delnum of deleteLst){
        arr = arr.filter(item => item !== delnum);
    }
    console.log("Once deleted, it's:", arr);
    return arr;
}

function collapse(arr2d){
    let arr1d = [];
    for (let arr of arr2d){
        arr1d.push(arr[0]);
        arr1d.push(arr[1]);
    }
    arr1d = deleteDuplicates(arr1d);
    let arr2d2 = [];
    let length = arr1d.length;
    for(let i = 0; i <length; i += 2){
        let beginDate = new Date(arr1d[i]);
        let endDate = new Date(arr1d[i+1]);
        let entry = [arr1d[i], arr1d[i+1]];
        console.log("Collapsing to:", beginDate, "to", endDate);
        arr2d2.push(entry);
    }
    return arr2d2;
}

function compactify(preferences){
    console.log("original Pref:", preferences);
    let r1arr = preferences.rank1;
    let r2arr = preferences.rank2;
    r1arr = quickSort(r1arr);
    r2arr = quickSort(r2arr);
    r1arr = collapse(r1arr);
    r2arr = collapse(r2arr);
    let updatedPref = {rank1: r1arr, rank2: r2arr};
    console.log("updatedPref:", updatedPref);
    return updatedPref;
}

async function optimalMeetingTime(){
    let btn = document.getElementById('bestTime');
    if(btn.innerHTML === `<p>Calculate Optimal Time</p>`){
        let calInfo = await getCalendar(calendarURL);
        console.log("calInfo:", calInfo);
        let timeRequired = calInfo.duration;
        let sdateStr = calInfo.start_date;
        let edateStr = calInfo.end_date;
        console.log("sdateStr:", sdateStr);
        let start = dateToLocalMs(sdateStr);
        let end = dateToLocalMs(edateStr) + 86400000;
        let users = [];
        let allRows = await getCalendarInfo(calendarURL);
        console.log("allRows:", allRows);
        for(const row of allRows){
            let pref = JSON.parse(row.preferences);
            pref = compactify(pref);
            users.push(pref);
        }

        //# of milliseconds in 15 minutes
        let fifteen = 900000;

        // Get all the 15 minute windows from start to end
        console.log("start:", start);
        console.log("end:", end);
        const allPossibleTimes = getAllTimes(start, end);
        console.log("allPossibleTimes:", allPossibleTimes);
        // Initialize the list of scores
        let scoreList = [];
        //Calculate all scores
        for(const time of allPossibleTimes){
            const score = calculateScore(time, users, timeRequired);
            scoreList.push(score);
        }
        console.log("scoreList:", scoreList);
        //Choose the time with the best score
        const winner = getMaxIndex(scoreList);
        console.log("winner:", winner);
        //Convert from index to #of milliseconds
        const winning_time = start + (fifteen * winner);
        console.log("winning_time:", winning_time);
        const winning_date = new Date(winning_time);
        console.log("winning_date:", winning_date);
        let par = document.getElementById("showBest");
        par.innerHTML = `The optimal meeting time is <strong>${winning_date}</strong>`;
        btn.innerHTML = `<p>Hide Optimal Time</p>`;
    }
    else{
        let par = document.getElementById("showBest");
        par.innerHTML = ``;
        btn.innerHTML = `<p>Calculate Optimal Time</p>`;
    }
    
}

async function getCalendar(calendarURL){
    const response = await fetch(`/api2/calendar/${calendarURL}`);
    const data = await response.json();
    return data;
}

async function getCalendarInfo(calendarURL){
    const response = await fetch(`/api/calendar/${calendarURL}`);
    const data = await response.json();
    return data;
}


function getAllTimes(start, end){
    let fifteen = 900000;

    let allTimes = [];
    while(start < end){
        allTimes.push(start);
        start = start + fifteen;
    }
    return allTimes;

}

function calculateScore(time, users, timeRequired){
    console.log("----------");
    console.log("Scoring time:", new Date(time));

    let utility = 0;

    //Adds a certain amount for each user
    for(const user of users){

        console.log("User intervals:", {
            rank1: user.rank1,
            rank2: user.rank2
        });

        let inRank1 = false;
        for (const interval of user.rank1) {
            if (contains(time, interval, timeRequired)) {
                inRank1 = true;
            }
        }

        let inRank2 = false;
        if (!inRank1) {
            for (const interval of user.rank2) {
                if (contains(time, interval, timeRequired)) {
                    inRank2 = true;
                }
            }
        }

        console.log(
            "Result for this user:",
            inRank1 ? "Rank1" : (inRank2 ? "Rank2" : "Unavailable")
        );

        //Adds 2 points of utility if rank1
        if (inRank1) {
            utility += 2;
        } else {
            //Adds 1 point of utility if rank2
            if (inRank2) {
                utility += 1;
            } else {
                //Takes away 100 if isn't even rank2
                utility -= 100;
            }
        }
    }

    console.log("Total utility for this time:", utility);

    return utility;
}



function contains(time, interval, timeRequired){
    const start = interval[0];
    const end = interval[1];
    const effective_end = end - timeRequired;
    if(time > effective_end){
        return false;
    }
    if(time < start){
        return false;
    }
    return true;
}

function getMaxIndex(scoreList){
    let max = 0;
    for(let i = 0; i < scoreList.length; i++){
        if(scoreList[i] > scoreList[max]){
            max = i;
        }
    }
    return max;
}

//TODO: implement button that triggers this
document.getElementById('bestTime').addEventListener('click', optimalMeetingTime);
