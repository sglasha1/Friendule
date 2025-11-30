console.log(Date.now());
function optimalMeetingTime(){
    let calInfo = getCalendar(calendarURL);
    let timeRequired = calInfo.duration;
    let start_date = calInfo.start_date;
    let end_date = calInfo.end_date;
    let start = start_date.getTime();
    let end = end_date.getTime() + 86400000;
    let users = [];
    let allRows = getCalendarInfo(calendarURL);
    for(const row of allRows){
        let pref = row.preferences;
        users.push(pref);
    }
    //# of milliseconds in 15 minutes
    let fifteen = 900000;

    // Get all the 15 minute windows from start to end
    const allPossibleTimes = getAllTimes(start, end);
    // Initialize the list of scores
    let scoreList = [];
    //Calculate all scores
    for(const time of allPossibleTimes){
        const score = calculateScore(time, users, timeRequired);
        scoreList.push(score);
    }
    //Choose the time with the best score
    const winner = getMaxIndex(scoreList);
    //Convert from index to #of milliseconds
    const winning_time = start + (fifteen * winner);
    return winning_time;
}

function getCalendarInfo(hashed_id){
    const sql = 'SELECT * FROM calendar_info WHERE hashed_id = ?';
    return new Promise((resolve, reject)=>{
        DB.all(sql, [hashed_id], (err, rows) => {
            if(err) reject(err);
            else resolve(rows);
        });
    });
}

function getCalendar(hashed_id){
    const sql = 'SELECT * FROM calendar_info WHERE hashed_id = ?';
    return new Promise((resolve, reject)=>{
        DB.get(sql, [hashed_id], (err, row) => {
            if(err) reject(err);
            else resolve(row);
        });
    });
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
    let utility = 0;
    //Adds a certain amount for each user
    for(const user of users){
        let inRank1 = false;
        for(const interval of user.rank1){
            //Checks if the time works for rank1
            if(contains(time, interval, timeRequired)){
                inRank1 = true;
            }
        }
        //Adds 2 points of utility if rank1
        if(inRank1){
            utility = utility + 2;
        }
        else{
            let inRank2 = false;
            for(const interval of user.rank2){
                //Checks if the time works for rank2
                if(contains(time, interval, timeRequired)){
                    inRank2 = true;
                }
            }
            //Adds 1 point of utility if rank2
            if(inRank2){
                utility = utility + 1;
            }
            else{
                //Takes away 100 if isn't even rank2
                utility = utility - 100;
            }
        }
    }
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

/*
let example_users1 = [{rank1: [[2, 4], [12, 14]], rank2: [[20, 24], [25, 170]]}, {rank1: [[3, 8], [22, 24]], rank2: [[6, 7], [25, 170]]}];

let example_users2 = [{rank1: [[2, 4], [100, 200]], rank2: [[5, 7], [15, 17]]}, {rank1: [[5, 7], [22, 24]], rank2: [[100, 120], [16, 17]]}];

let example_users3 = [{rank1: [[2, 4], [100, 200]], rank2: [[5, 7], [15, 17]]}, {rank1: [[5, 7], [22, 24]], rank2: [[201, 220], [16, 17]]}];

let example_users4 = [{rank1: [[2, 4], [100, 200]], rank2: [[5, 7], [15, 17]]}, {rank1: [[300, 400], [22, 24]], rank2: [[100, 120], [16, 17]]}];

let example_users5 = [{rank1: [[2, 4], [100, 200]], rank2: [[5, 7], [15, 17]]}, {rank1: [[22, 24]], rank2: [[316, 317]]}];

let example_users6 = [{rank1: [[2, 4], [100, 200]], rank2: [[5, 7], [15, 17]]}, {rank1: [[4, 8], [22, 24]], rank2: [[100, 120], [18, 19]]}];
let example_users7 = [{rank1: [[2, 4], [100, 200]], rank2: [[5, 7], [15, 17]]}, {rank1: [[4, 8], [22, 24]], rank2: [[100, 120], [18, 19]]}, {rank1: [[2, 4], [100, 200]], rank2: [[6, 17], [20, 23]]}];


console.log(chooseMeetingTime(example_users1, 100));
console.log(chooseMeetingTime(example_users2, 1));
console.log(chooseMeetingTime(example_users3, 1));
console.log(chooseMeetingTime(example_users4, 1));
console.log(chooseMeetingTime(example_users5, 1));
console.log(chooseMeetingTime(example_users6, 1));
console.log("Now, on to testing the new function.");
console.log(optimalMeetingTime(example_users1, 100, 0, 500));
console.log(optimalMeetingTime(example_users2, 1, 0, 500));
console.log(optimalMeetingTime(example_users3, 1, 0, 500));
console.log(optimalMeetingTime(example_users4, 1, 0, 500));
console.log(optimalMeetingTime(example_users5, 1, 0, 500));
console.log(optimalMeetingTime(example_users6, 1, 0, 500));

console.log(optimalMeetingTime(example_users7, 1, 0, 500));
*/