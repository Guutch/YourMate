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

  static async fetchMates(userId) {
    const friendsCollection = firebase.firestore().collection('friends');
    const querySnapshot = await friendsCollection
      .where('status', '==', 'mates')
      .where('receiver', '==', userId)
      .get();
  
    const mates = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
    const senderQuerySnapshot = await friendsCollection
      .where('status', '==', 'mates')
      .where('sender', '==', userId)
      .get();
  
    const matesAsSender = senderQuerySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
    return [...mates, ...matesAsSender];
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
  
        // Convert the createdAt timestamp to a Date object
        const createdAtDate = userData.createdAt.toDate();
  
        // Create a new object with the converted createdAt value
        const updatedUserData = {
          ...userData,
          createdAt: createdAtDate,
        };
  
        return updatedUserData;
      } else {
        console.log('User document does not exist');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  static async addMilestone(userId, goalId, milestoneData) {
    try {
      const milestonesCollection = firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('goals')
        .doc(goalId)
        .collection('milestones');

      const newMilestoneRef = await milestonesCollection.add({
        ...milestoneData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      console.log('Milestone added with ID: ', newMilestoneRef.id);
      return true;
    } catch (error) {
      console.error('Error adding milestone: ', error);
      return false;
    }
  }

  static async addNote(userId, goalId, noteData) {
    try {
      const notesCollection = firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('goals')
        .doc(goalId)
        .collection('notes');

      const newNoteRef = await notesCollection.add({
        ...noteData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      console.log('Note added with ID: ', newNoteRef.id);
      return true;
    } catch (error) {
      console.error('Error adding note: ', error);
      return false;
    }
  }

  static async searchUserByUsername(username) {
    try {
      const usersCollection = firebase.firestore().collection('users');
      const querySnapshot = await usersCollection.where('username', '==', username).get();
  
      if (!querySnapshot.empty) {
        // User found
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const userId = userDoc.id; // Get the user's ID from the document ID
  
        // Create a new object with the user ID and other data
        const userWithId = {
          ...userData,
          userId,
        };
  
        console.log('User found:', userWithId);
        return userWithId;
      } else {
        // User not found
        console.log('User not found');
        return null;
      }
    } catch (error) {
      console.error('Error searching user:', error);
      throw error;
    }
  };

  static async checkExistingFriendConnection(senderUserId, receiverUserId) {
    try {
      const friendsCollection = firebase.firestore().collection('friends');
      // First, check for any existing connection where the sender is the senderUserId and the receiver is the receiverUserId
      const friendQuerySenderAsSender = await friendsCollection
        .where('sender', '==', senderUserId)
        .where('receiver', '==', receiverUserId)
        .get();
  
      // Then, check for any existing connection where the sender is the receiverUserId and the receiver is the senderUserId
      const friendQueryReceiverAsSender = await friendsCollection
        .where('sender', '==', receiverUserId)
        .where('receiver', '==', senderUserId)
        .get();
  
      if (!friendQuerySenderAsSender.empty) {
        const friendDoc = friendQuerySenderAsSender.docs[0];
        const connection = friendDoc.data();
        return connection;
      } else if (!friendQueryReceiverAsSender.empty) {
        const friendDoc = friendQueryReceiverAsSender.docs[0];
        const connection = friendDoc.data();
        return connection;
      }
  
      return null;
    } catch (error) {
      console.error('Error checking friend connection:', error);
      throw error;
    }
  };

  static async handleAccept(requestId, receiverId) {
    try {
        // Update the request's status to 'mates'
        await firebase.firestore().collection('friends').doc(requestId).update({
            status: 'mates'
        });

        // Fetch the newly accepted friend's data
        const friendData = await UserModel.fetchUserData(receiverId);

        return friendData; // Return this data to add to the friends state
    } catch (error) {
        console.error('Error accepting friend request:', error);
        throw error;
    }
};

static async handleReject(requestId) {
  try {
      // Delete the friend request
      await firebase.firestore().collection('friends').doc(requestId).delete();
      console.log("Done")
    } catch (error) {
      console.error('Error handling the friend request rejection:', error);
      throw error;
  }
}


  
static async fetchFriendRequests(userId) {
  const friendsCollection = firebase.firestore().collection('friends');
  const sentRequestsQuery = await friendsCollection.where('sender', '==', userId).get();
  const receivedRequestsQuery = await friendsCollection.where('receiver', '==', userId).get();

  const sentRequests = sentRequestsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const receivedRequests = receivedRequestsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return { sentRequests, receivedRequests };
}


static async sendFriendRequest(senderUserId, receiverUserId) {
  try {
    const friendsCollection = firebase.firestore().collection('friends');
    const requestData = {
      sender: senderUserId,
      receiver: receiverUserId,
      status: 'pending',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    await friendsCollection.add(requestData);
    console.log('Friend request sent successfully');
  } catch (error) {
    console.error('Error sending friend request:', error);
  }
};


  static async addGoal(userId, goal, category, date, targetDate, startingValue, numericalTarget, unit) {
    console.log("target date in usermodel")
    console.log(targetDate)
    console.log(date)
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
        status: "Ongoing"
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
  };

  static async markGoalAsCompleted(userUID, goalId) {
    try {
      const goalRef = firebase
        .firestore()
        .collection('users')
        .doc(userUID)
        .collection('goals')
        .doc(goalId);
  
      // Check if the document exists
      const doc = await goalRef.get();
      if (doc.exists) {
        // Update the goal's status in Firestore
        await goalRef.update({ status: 'Completed' });
      } else {
        console.log('No such document exists');
      }
    } catch (error) {
      console.error('Error marking goal as completed:', error);
      throw error; // Rethrow the error for further handling
    }
  }

  static async deleteGoalAndSubcollections(userId, goalId) {
    const goalRef = firestore.collection('users').doc(userId).collection('goals').doc(goalId);
  
    // Delete subcollections like 'notes' and 'milestones' for the goal
    const subcollections = ['notes', 'milestones']; // Add more subcollections as needed
    try {
      for (const subcollection of subcollections) {
        const snapshot = await goalRef.collection(subcollection).get();
        snapshot.forEach(doc => {
          doc.ref.delete();
        });
      }
  
      // After deleting subcollections, delete the goal document itself
      await goalRef.delete();
      console.log(`Goal and its subcollections successfully deleted.`);
    } catch (error) {
      console.error('Error deleting goal and its subcollections:', error);
      throw error;
    }
  }

  static async deleteBlock(userId, blockId) {
    try {
      const blockRef = firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('blocks')
        .doc(blockId);

      // Delete the block document
      await blockRef.delete();
    } catch (error) {
      console.error('Error deleting block:', error);
      throw error;
    }
  };
  

  static async fetchUserGoals(userId) {
    try {
      const goalsCollection = await firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('goals')
        .get();
  
      const goalsData = await Promise.all(goalsCollection.docs.map(async (goalDoc) => {
        const goalDocData = goalDoc.data();
        const milestonesQuery = await goalDoc.ref.collection('milestones').get();
        const notesQuery = await goalDoc.ref.collection('notes').get();
  
        const milestones = milestonesQuery.docs.map((milestoneDoc) => ({
          id: milestoneDoc.id,
          ...milestoneDoc.data(),
          createdAt: milestoneDoc.data().createdAt.toDate(), // Assuming createdAt is a Firestore timestamp
        }));
        
        const notes = notesQuery.docs.map((noteDoc) => ({
          id: noteDoc.id,
          ...noteDoc.data(),
          createdAt: noteDoc.data().createdAt.toDate(), // Assuming createdAt is a Firestore timestamp
        }));
  
        // No need to console.log here unless you're debugging
        // console.log('Milestones for goal:', goalDocData.goal, milestones);
        // console.log('Notes for goal:', goalDocData.goal, notes);
  
        return {
          id: goalDoc.id,
          goal: goalDocData.goal,
          category: goalDocData.category,
          date: goalDocData.date.toDate(),
          targetDate: goalDocData.targetDate.toDate(),
          startingValue: goalDocData.startingValue,
          numericalTarget: goalDocData.numericalTarget,
          unit: goalDocData.unit,
          createdAt: goalDocData.createdAt.toDate(),
          milestones,
          notes,
        };
      }));
  
      return goalsData;
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  }
  
  static async fetchUserBlocks(userId) {
    try {
      const blocksCollection = await firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('blocks')
        .get();
  
      if (!blocksCollection.empty) {
        const blocksData = blocksCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return blocksData;
      } else {
        throw new Error('No blocks found');
      }
    } catch (error) {
      console.error('Error fetching blocks:', error);
      throw error;
    }
  };

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