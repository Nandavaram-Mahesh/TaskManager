let Routine = [
    {
        taskName: 'Wakeup',
        time: '5:00 AM',
        Duration: "0:00"
    },
    {
        taskName: 'Yoga',
        time: '5:00 AM',
        Duration: "1:00"
    },
    {
        taskName: 'Refresh',
        time: '6:00 AM',
        Duration: "1:00"
    },
    {
        taskName: 'Lunch',
        time: '13:00 PM',
        Duration: "1:00"
    },
    {
        taskName: 'Dinner',
        time: '19:00 PM',
        Duration: "1:00"
    }, {
        taskName: 'Sleep',
        time: '21:00 PM',
        Duration: "0:00"
    },
]
let DayToDayTasks = [
    {
        taskName: 'creating the backend',
        Duration: "2:00",
        difficultyLevel: 'High',
        priority: 'High'
    },
    {
        taskName: 'creating the frontend',
        Duration: "1:00",
        difficultyLevel: 'Medium',
        priority: 'medium'
    },
    {
        taskName: 'working on adding Futures',
        Duration: "3:00",
        difficultyLevel: 'high',
        priority: 'low'
    },
]

let daySchedule = [

]


/**
 [
    { taskName: 'Wakeup', time: '5:00 AM', Duration: '0:00' }, 
    { taskName: 'Yoga', time: '5:00 AM', Duration: '1:00' },   
    { taskName: 'Refresh', time: '6:00 AM', Duration: '1:00' },
    { taskName: 'Lunch', time: '13:00 PM', Duration: '1:00' }, 
    { taskName: 'Dinner', time: '19:00 PM', Duration: '1:00' }, 
    { taskName: 'Sleep', time: '21:00 PM', Duration: '0:00' },  
    {
      taskName: 'creating the backend',
      Duration: '2:00',
      difficultyLevel: 'High',
      priority: 'High'
    },
    {
      taskName: 'creating the frontend',
      Duration: '1:00',
      difficultyLevel: 'Medium',
      priority: 'medium'
    },
    {
      taskName: 'working on adding Futures',
      Duration: '3:00',
      difficultyLevel: 'high',
      priority: 'low'
    }
  ]

 */


/*
    1. How much time do we have in a day to work (i.e total duration u take to do routine tasks)
     
        we have 24hrs in a day ,  total time i have in day is TotalTime = ((wakeup time - go to bed time) - Daily Routines)




 */
function calculateDuration(Duration) {
    let totalHours = 0
    let hour = Number(Duration.split(":")[0])
    let min = Number(Duration.split(":")[1])
    let minToHours = min / 60
    totalHours += (hour + minToHours)
    return [hour, min, totalHours]
}
function calculateTotalHours(time) {
    let hour = Number(time.split(" ")[0].split(":")[0])
    let min = Number(time.split(" ")[0].split(":")[1])
    let minToHours = min / 60
    let totalHours = 0
    totalHours += (hour + minToHours)
    return [hour, min, totalHours]
}

function getHourAndMin(time, duration) {
    const [timeHour, timeMin, totalTime] = calculateTotalHours(time)
    const [durationHour, durationMin, totalDuration] = calculateDuration(duration)
    let totalHours = timeHour + durationHour
    let totalMin = timeMin + durationMin
    return [totalHours, totalMin]
}
function calculateTotalTime() {
    let totalTimeLeft = 0;
    let wakeupTime = 0;
    let sleepTime = 0;
    let remainingTaskTime = 0

    Routine.forEach(task => {
        if (task.taskName == "Wakeup") {
            wakeupTime = calculateTotalHours(task.time)
        }
        else if (task.taskName == "Sleep") {
            sleepTime = calculateTotalHours(task.time)
        } else {
            const [hour, min, totalHours] = calculateDuration(task.Duration)
            remainingTaskTime += totalHours
        }
    })
    totalTimeLeft = (sleepTime - wakeupTime) - remainingTaskTime
    return totalTimeLeft

}

function timeForDailyTasks(task) {
    const [totalHr, totalMin] = getHourAndMin(task.time, task.Duration)
    const totalTaskTime = `${totalHr}:${totalMin}`
    return totalTaskTime
}


function getTimeGap(i) {
    const currenttask = Routine[i]
    const nextTask = Routine[i + 1];
    const [hour, min, currentTasktime] = calculateTotalHours(currenttask.time)
    const [durationHour, durationMin, currentTaskduration] = calculateDuration(currenttask.Duration)
    const currentTaskTimeAndDuration = currentTasktime + currentTaskduration
    const [nextTaskHour, nextTaskMin, nextTaskTime] = calculateTotalHours(nextTask.time)
    const timeGap = (nextTaskTime - currentTaskTimeAndDuration)

    return [currenttask,timeGap]
}

function calculatingTimeGapOfRoutine() {
    for (let i = 0; i < Routine.length; i++) {              /** n times */
        if (i != (Routine.length - 1)) {                     /** n */
            let[currenttask,timeGap]=getTimeGap(i)
            // console.log(`timegap between current task:${currenttask.taskName} and nexttask:${nextTask.taskName} timeGap:${timeGap}`)
            daySchedule.push(currenttask)
            let [previousTaskHr, previousTaskMin] = getHourAndMin(currenttask.time,currenttask.Duration)
            if (timeGap) {

                DayToDayTasks.forEach((task, index) => {
                     let [durationHour, durationMin, duration] = calculateDuration(task.Duration)
                    if (duration <= timeGap) {

                        // addedTaskTime = previous tasktime + duration
                        let previousHour = previousTaskHr
                        let previousMin = previousTaskMin

                        task.time = `${previousHour}:${previousMin}`
                        task.endTime = `${previousHour + durationHour}:${previousMin + durationMin}`
                        daySchedule.push(task)
                        DayToDayTasks = DayToDayTasks.filter(dailytask => dailytask.taskName !== task.taskName)
                        timeGap -= duration
                        let [previousDayTaskHr, previousDayTaskMin] = getHourAndMin(task.time, task.Duration)
                        previousTaskHr = previousDayTaskHr
                        previousTaskMin = previousDayTaskMin

                        // timegap - the duration of the task we pushed
                    }
                })
            }
        }



    }

}

const totalTime = calculateTotalTime()
calculatingTimeGapOfRoutine()
// console.log(`Time left in a day:${totalTime} hrs`)
console.log(daySchedule)
//console.log(`hour:${hour} , min:${min}, minToHours:${minToHours} , totalHours:${TotalHours}`)