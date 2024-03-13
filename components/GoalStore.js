// GlobalDataStore.js

let globalData = {};
let justCreatedGoal = false;

// export const setGlobalData = (data) => {
//   globalData = data;
// };

export const setGlobalData = (goal, category, date, targetDate, startingValue, numericalTarget, unit) => {
  

  globalData = {
    goal: goal, // Store only the title property of the goal object
    category,
    date: new Date(date), // Create a new Date object from the date string
    targetDate: new Date(targetDate), // Create a new Date object from the targetDate string
    startingValue,
    numericalTarget,
    unit,
  };

  console.log("globalData Below");
  console.log(globalData);
};


export const getGlobalData = () => {
  return globalData;
};

export const setJustCreatedGoal = (data) => {
  justCreatedGoal = data; 
}

export const getJustCreatedGoal = () => {
 return justCreatedGoal;
}


// export const isDataEmpty = () => {
//   return Object.keys(globalData).length === 0;
// };

