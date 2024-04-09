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
      // Check if the email is already in use
      const emailQuery = await firestore.collection('users').where('email', '==', email).get();
      if (!emailQuery.empty) {
        throw new Error('Email already in use');
      }
  
      // Check if the username is already in use
      const usernameQuery = await firestore.collection('users').where('username', '==', username).get();
      if (!usernameQuery.empty) {
        throw new Error('Username already in use');
      }
  
      // If email and username are available, create the user
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      const userId = user.uid;
  
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
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async changePassword(currentPassword, newPassword) {
    try {
      const user = firebase.auth().currentUser;
      const credential = await firebase.auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      // Re-authenticate the user with the provided credential
      await user.reauthenticateWithCredential(credential);

      // Update the password
      await user.updatePassword(newPassword);

      return true; // Password changed successfully
    } catch (error) {
      // console.error('Error changing password:', error);
      // return false;
      if (error.code === 'auth/wrong-password') {
        return { error: 'Incorrect current password' };
      }
      return { error: 'An error occurred while changing the password' };
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

  static async saveStatusToBackend(userId, statusMessage){
    try {
        const statusData = {
            // username: userName, // Replace with the actual username
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: statusMessage,
        };

        await firestore
            .collection('users')
            .doc(userId)
            .collection('statuses')
            .add(statusData);
    } catch (error) {
        console.error('Error saving status:', error);
        throw error;
    }
};

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
  };

  static async fetchStatuses(userId, mates) {
    console.log("mates", mates);
  try {
    const mateUserIds = mates.map((mate) => {
      if (mate.id === userId) {
        // If the mate's id matches the userId, it means the other user is the friend
        return mate.userId; // Assuming the friend's id is stored in the 'userId' property
      } else {
        // If the mate's id doesn't match the userId, it means the mate is the friend
        return mate.id;
      }
    });

    const userIdsToFetch = [userId, ...mateUserIds.filter(Boolean)];
    console.log("userIdsToFetch", userIdsToFetch);
  
      // Fetch user documents for all relevant user IDs
      const userDocsPromises = userIdsToFetch.map((userIdToFetch) =>
        firestore.collection('users').doc(userIdToFetch).get()
      );
      const userDocs = await Promise.all(userDocsPromises);
  
      // Create a map of user IDs to usernames
      const userIdToUsernameMap = new Map();
      userDocs.forEach((userDoc) => {
        const userData = userDoc.data();
        if (userData) {
          userIdToUsernameMap.set(userDoc.id, userData.username);
        }
      });
  
      const statusesPromises = [
        firestore
          .collection('users')
          .doc(userId)
          .collection('statuses')
          .orderBy('timestamp', 'desc')
          .get(),
        ...mateUserIds.map((mateUserId) =>
          firestore
            .collection('users')
            .doc(mateUserId)
            .collection('statuses')
            .orderBy('timestamp', 'desc')
            .get()
        ),
      ];
  
      const statusesSnapshots = await Promise.all(statusesPromises);
      const allStatuses = statusesSnapshots.flatMap((snapshot) =>
        snapshot.docs.map((doc) => {
          const statusData = doc.data();
          const userId = doc.ref.parent.parent.id; // Get the user ID from the reference
          const username = userIdToUsernameMap.get(userId); // Get the username from the map
          return { id: doc.id, username, ...statusData };
        })
      );
  
      console.log("allStatuses")
      console.log(allStatuses)

      return allStatuses;
    } catch (error) {
      console.error('Error fetching statuses:', error);
      throw error;
    }
  }

//   static async fetchStatuses(userId, mates) {
//     try {
//         const mateUserIds = mates.map((mate) => mate.sender === userId ? mate.receiver : mate.sender);

//         const statusesPromises = [
//             firestore
//                 .collection('users')
//                 .doc(userId)
//                 .collection('statuses')
//                 .orderBy('timestamp', 'desc')
//                 .get(),
//             ...mateUserIds.map((mateUserId) =>
//                 firestore
//                     .collection('users')
//                     .doc(mateUserId)
//                     .collection('statuses')
//                     .orderBy('timestamp', 'desc')
//                     .get()
//             ),
//         ];

//         const statusesSnapshots = await Promise.all(statusesPromises);

//         const allStatuses = statusesSnapshots.flatMap((snapshot) =>
//             snapshot.docs.map((doc) => ({
//                 id: doc.id,
//                 ...doc.data(),
//             }))
//         );

//         return allStatuses;
//     } catch (error) {
//         console.error('Error fetching statuses:', error);
//         throw error;
//     }
// };

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
        status: "Ongoing"
      });

      console.log('Milestone added with ID: ', newMilestoneRef.id);
      return true;
    } catch (error) {
      console.error('Error adding milestone: ', error);
      return false;
    }
  }

  static async updateMilestoneStatus(userId, goalId, milestoneId, newStatus) {
    try {
      const milestoneDocRef = firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('goals')
        .doc(goalId)
        .collection('milestones')
        .doc(milestoneId);
  
      await milestoneDocRef.update({ status: newStatus });
      console.log('Milestone status updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating milestone status: ', error);
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

  static async handleAccept(requestId, senderId) {
    try {
        // Update the request's status to 'mates'
        await firebase.firestore().collection('friends').doc(requestId).update({
            status: 'mates'
        });

        // Fetch the newly accepted friend's data
        const friendData = await UserModel.fetchUserData(senderId);
        console.log("friendData")
        console.log(friendData)

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

static async handleDeleteFriend(currentUserId, friendId) {
  try {
    const friendsRef = firebase.firestore().collection('friends');

    // Find the document where the current user is the sender and the friend is the receiver
    const senderQuery = await friendsRef
      .where('sender', '==', currentUserId)
      .where('receiver', '==', friendId)
      .get();

    // Find the document where the current user is the receiver and the friend is the sender
    const receiverQuery = await friendsRef
      .where('receiver', '==', currentUserId)
      .where('sender', '==', friendId)
      .get();

    if (!senderQuery.empty) {
      // Delete the found document
      await senderQuery.docs[0].ref.delete();
    } else if (!receiverQuery.empty) {
      // Delete the found document
      await receiverQuery.docs[0].ref.delete();
    } else {
      console.warn('No friend document found with the provided user IDs');
    }
  } catch (error) {
    console.error('Error deleting friend:', error);
    throw error;
  }
}

static async handleBlockFriend(currentUserId, friendId) {
  try {
    const friendsRef = firebase.firestore().collection('friends');
    const batch = firebase.firestore().batch();

    // Find the document where the current user is the sender and the friend is the receiver
    const senderQuery = await friendsRef
      .where('sender', '==', currentUserId)
      .where('receiver', '==', friendId)
      .get();

    // Find the document where the current user is the receiver and the friend is the sender
    const receiverQuery = await friendsRef
      .where('receiver', '==', currentUserId)
      .where('sender', '==', friendId)
      .get();

    if (!senderQuery.empty) {
      // Update the status and blockedBy fields for the found document
      const docRef = senderQuery.docs[0].ref;
      batch.update(docRef, { status: 'Blocked', blockedBy: currentUserId });
    } else if (!receiverQuery.empty) {
      // Update the status and blockedBy fields for the found document
      const docRef = receiverQuery.docs[0].ref;
      batch.update(docRef, { status: 'Blocked', blockedBy: currentUserId });
    } else {
      console.warn('No friend document found with the provided user IDs');
    }

    await batch.commit();
  } catch (error) {
    console.error('Error blocking friend:', error);
    throw error;
  }
}

  
static async fetchFriendRequests(userId) {
  const friendsCollection = firebase.firestore().collection('friends');
  const sentRequestsQuery = await friendsCollection
    .where('sender', '==', userId)
    .where('status', '==', 'pending')
    .get();
  const receivedRequestsQuery = await friendsCollection
    .where('receiver', '==', userId)
    .where('status', '==', 'pending')
    .get();

  const sentRequests = sentRequestsQuery.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  const receivedRequests = receivedRequestsQuery.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return { sentRequests, receivedRequests };
}
  
static async fetchBlockedUsers(currentUserId) {
  try {
    const friendsRef = firebase.firestore().collection('friends');
    const blockedQuery = await friendsRef
      .where('blockedBy', '==', currentUserId)
      .where('status', '==', 'Blocked')
      .get();

    const blockedUsers = blockedQuery.docs.map(doc => ({
      id: doc.id,
      userId: doc.data().receiver, // Assuming the blocked user is the receiver
      ...doc.data()
    }));

    return blockedUsers;
  } catch (error) {
    console.error('Error fetching blocked users:', error);
    throw error;
  }
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

      const docRef = await firestore
        .collection('users')
        .doc(userId)
        .collection('goals')
        .add(goalData);

      return docRef;
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
          status: goalDocData.status
        };
      }));
  
      return goalsData;
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  }
  
  static async newGoalMile(goalId, userId) {
    try {
      const goalDocRef = firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('goals')
        .doc(goalId);

      const goalDocData = (await goalDocRef.get()).data();

      if (!goalDocData) {
        console.error('Goal not found');
        return null;
      }

      const milestonesQuery = await goalDocRef.collection('milestones').get();
      const milestones = milestonesQuery.docs.map((milestoneDoc) => ({
        id: milestoneDoc.id,
        ...milestoneDoc.data(),
        createdAt: milestoneDoc.data().createdAt.toDate(), // Assuming createdAt is a Firestore timestamp
      }));

      const notesQuery = await goalDocRef.collection('notes').get();
      const notes = notesQuery.docs.map((noteDoc) => ({
        id: noteDoc.id,
        ...noteDoc.data(),
        createdAt: noteDoc.data().createdAt.toDate(), // Assuming createdAt is a Firestore timestamp
      }));

      console.log("milestones!!!!")
      console.log(milestones)

      return {
        id: goalDocRef.id,
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
        status: goalDocData.status,
      };
    } catch (error) {
      console.error('Error fetching goal with milestone data:', error);
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
        // throw new Error('No blocks found');
      }
    } catch (error) {
      console.log('Error fetching blocks:', error);
      // throw error;
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

  static async updateUserFirstLastName(userId, newFirstName, newLastName) {
    try {
      await firestore.collection('users').doc(userId).update({
        firstName: newFirstName,
        lastName: newLastName,
      });
    } catch (error) {
      console.error('Error updating user name:', error);
      throw error;
    }
  }

  static async updateUsername(userId, newUsername) {
    try {
      const userRef = firestore.collection('users').doc(userId);
      const usernameQuery = firestore.collection('users').where('username', '==', newUsername);
      const snapshot = await usernameQuery.get();
  
      if (!snapshot.empty) {
        // Username is already taken
        return false;
      }
  
      // Update the username
      await userRef.update({ username: newUsername });
      return true;
    } catch (error) {
      console.error('Error updating username:', error);
      throw error;
    }
  }

  static async updateEmail(userId, newEmail) {
    try {
        // Check for existing email
        const emailExistsQuery = firestore.collection('users').where('email', '==', newEmail).limit(1);
        const emailExistsSnapshot = await emailExistsQuery.get();

        if (!emailExistsSnapshot.empty) {
            return false; // Email already exists
        }

        // Update the email if unique
        await firestore.collection('users').doc(userId).update({
            email: newEmail,
        });

        return true; // Update successful
    } catch (error) {
        console.error('Error updating email:', error);
        return false; // Handle unexpected errors 
    }
}

}

export default UserModel;