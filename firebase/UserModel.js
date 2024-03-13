import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { auth, firestore } from './firebase';

// MUST READ
// TRIED TO CREATE A USER BUT THEN I GOT HIS ERROR
//  ERROR  Error creating user: [ReferenceError: Property 'firestore' doesn't exist]
// ERROR  Error creating user: [ReferenceError: Property 'firestore' doesn't exist]
// BUT IT DOES CREATE THE USER IN THE AUTHENTICATION BIT

class UserModel {
  static async createUser(firstName, lastName, username, email, password) {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;
      const userId = user.uid;

      console.log(firestore)
      console.log("firestore")

      // Create a document in the "users" collection with the user's data
      await firestore.collection('users').doc(userId).set({
        firstName,
        lastName,
        username,
        email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Add other user-related methods here
  static async addHabit(userId, habitName) {
    try {
      const habitData = {
        name: habitName,
        startDate: firebase.firestore.FieldValue.serverTimestamp(),
      };

      await firestore
        .collection('users')
        .doc(userId)
        .collection('habits')
        .add(habitData);
    } catch (error) {
      console.error('Error adding habit:', error);
      throw error;
    }
  }

  static async fetchUserData(userId) {
    try {
      const userDoc = await firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .get();
  
      if (userDoc.exists) {
        const userData = userDoc.data();
        return userData;
      } else {
        console.log('User document does not exist');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  static async addGoal(userId, goal, category, date, targetDate, startingValue, numericalTarget, unit) {
    try {
      const goalData = {
        goal: goal,
        category: category,
        date: date,
        targetDate: targetDate,
        startingValue: startingValue,
        numericalTarget: numericalTarget,
        unit: unit,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Assuming you also want to store the creation timestamp
      };

      await firestore
        .collection('users')
        .doc(userId)
        .collection('goals')
        .add(goalData);
    } catch (error) {
      console.error('Error adding goal:', error);
      throw error;
    }
  }

  static async fetchUserGoals(userId) {
    try {
      const goalsCollection = await firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('goals')
        .get();

      const goalData = goalsCollection.docs.map((doc) => {
        const goalData = doc.data();
        return {
          id: doc.id,
          goal: goalData.goal,
          category: goalData.category,
          date: goalData.date.toDate(), // Convert Firestore Timestamp to JavaScript Date
          targetDate: goalData.targetDate.toDate(), // Convert Firestore Timestamp to JavaScript Date
          startingValue: goalData.startingValue,
          numericalTarget: goalData.numericalTarget,
          unit: goalData.unit,
          createdAt: goalData.createdAt.toDate(), // Convert Firestore Timestamp to JavaScript Date
        };
      });

      return goalData;
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  }

  static async fetchUserHabit(userId) {
    try {
      const habitsCollection = await firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('habits')
        .get();
  
      if (!habitsCollection.empty) {
        // Retrieve the first habit document
        const firstHabitDoc = habitsCollection.docs[0];
        const habitData = firstHabitDoc.data();
        return {
          id: firstHabitDoc.id,
          name: habitData.name,
          startDate: habitData.startDate.toDate(), // Convert Firestore Timestamp to JavaScript Date
        };
      } else {
        throw new Error('No habits found');
      }
    } catch (error) {
      console.error('Error fetching habit:', error);
      throw error;
    }
  }

  static async addJournal(userId, journalData) {
    try {
      const journalRef = await firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('journals')
        .add(journalData);
  
      console.log('Journal added with ID:', journalRef.id);
      return journalRef.id; // Return the ID
    } catch (error) {
      console.error('Error adding journal:', error);
      throw error;
    }
  }
  
  static async addBlock(userId, blockData) {
    try {
      const blockRef = await firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('blocks') // Assuming a 'blocks' collection under each user
        .add(blockData);
  
      console.log('Block added with ID:', blockRef.id);
      return blockRef.id; // Return the ID for potential future use
    } catch (error) {
      console.error('Error adding block:', error);
      throw error;
    }
  }
  

  static async fetchUserJournals(userId) {
    try {
      const journalsCollection = await firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('journals')
        .get();

      if (!journalsCollection.empty) {
        const journals = journalsCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return journals;
      } else {
        throw new Error('No journals found');
      }
    } catch (error) {
      console.error('Error fetching journals:', error);
      throw error;
    }
  }

}

export default UserModel;