// GlobalDataStore.js

let globalData = {};
let justCreatedGoal = false;
let justCreatedM = false;

// export const setGlobalData = (data) => {
//   globalData = data;
// };

export const setGlobalData = (goal, category, date, targetDate, startingValue, numericalTarget, unit, id) => {  
console.log("These are the dates in setGlobal")
console.log(targetDate)
console.log(date)


globalData = {
    goal: goal, 
    category,
    date: date instanceof Date ? date : new Date(date),
    targetDate: targetDate instanceof Date ? targetDate : new Date(targetDate),
    startingValue,
    numericalTarget,
    unit,
    id
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

export const setJustCreatedM = (data) => {
  justCreatedM = data; 
}

export const getJustCreatedM = () => {
 return justCreatedM;
}


// export const isDataEmpty = () => {
//   return Object.keys(globalData).length === 0;
// };

