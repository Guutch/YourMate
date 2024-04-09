// UserDataManager.js
let userHabit = '';
let userFirstName = '';
let userLastName = '';
let userUsername = '';

export const getUserData = () => {
  const data = {
    habit: userHabit,
    firstName: userFirstName,
    lastName: userLastName,
    username: userUsername,
  };

  // Reset the variables
  userHabit = '';
  userFirstName = '';
  userLastName = '';
  userUsername = '';

  return data;
};

export const setUserData = (data) => {
  if (data.habit) userHabit = data.habit;
  if (data.firstName) userFirstName = data.firstName;
  if (data.lastName) userLastName = data.lastName;
  if (data.username) userUsername = data.username;
};