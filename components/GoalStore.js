// Initialise variables
let globalData = {};
let justCreatedGoal = false;
let justCreatedM = false;

// Function is used to set the goal data so that it can then be used by the GoalScreen to display
// The goal once it has been created
export const setGlobalData = (goal, category, date, targetDate, startingValue, numericalTarget, unit, id) => {  

// Goal object is created - Initialised on line 2
globalData = {
    goal: goal, 
    category,
    date: date instanceof Date ? date : new Date(date), // This code here ensures that the variables are instances of the Date object
    targetDate: targetDate instanceof Date ? targetDate : new Date(targetDate), // Added the condition early on in development
    startingValue,
    numericalTarget,
    unit,
    id
  };
};


// This returns the goal data (gets set in the setter function above)
export const getGlobalData = () => {
  return globalData;
};

// This is called when a goal has just been created - boolean variable
export const setJustCreatedGoal = (data) => {
  justCreatedGoal = data; 
}

// Boolean value returned to check if goal should be added to front end
export const getJustCreatedGoal = () => {
 return justCreatedGoal;
}

// This is called when a milestone has just been created - boolean variable
export const setJustCreatedM = (data) => {
  justCreatedM = data; 
}

// Boolean value returned to check if milestone should be added to front end
export const getJustCreatedM = () => {
 return justCreatedM;
}
