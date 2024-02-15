// GlobalDataStore.js

let globalData = {};
let justCreatedGoal = false;

export const setGlobalData = (data) => {
  globalData = data;
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

