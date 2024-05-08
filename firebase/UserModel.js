import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
const admin = require('firebase-admin');

import { auth, firestore } from './firebase';

class UserModel {
  static async createUser(firstName, lastName, username, email, password) {
    try {

      // Check if the username is already in use
      const usernameQuery = await firestore.collection('users').where('username', '==', username).get();
      if (!usernameQuery.empty) {
        return 'Username already in use.'
      }

      // Check if the email is already in use
      const emailQuery = await firestore.collection('users').where('email', '==', email).get();
      if (!emailQuery.empty) {
        return 'Email already in use'
      }

      

      // If email and username are available, create the user
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      const userId = user.uid;

      // Create a document in the "users" collection with the user's data
      try {
        await firestore.collection('users').doc(userId).set({
          firstName,
          lastName,
          username,
          email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        return user;
      } catch (docCreationError) {
        console.error('Error creating user document:', docCreationError); 
        throw docCreationError; // specific document creation issues
      } 

    } catch (error) {
      // console.error('Error creating user:', error);
      throw error;
    }
  }

  // This function is responsible for changing the user's password
  // Before changing the password, we verify if the password entered is correct
  // Either 'true' is returned or an error message that then gets displayed to the front end
  static async changePassword(currentPassword, newPassword) {
    try {
      // Get the currently authenticated user
      const user = firebase.auth().currentUser;

      // Create a credential object with the user's details
      const credential = await firebase.auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      // Re-authenticate the user with the provided credential
      await user.reauthenticateWithCredential(credential);

      // Update the password
      await user.updatePassword(newPassword);

      // Password changed successfully
      return true; 
    } catch (error) {
      // Check if the error was caused by a wrong password being entered
      if (error.code === 'auth/wrong-password') {
        return { error: 'Incorrect current password' };
      }
      // Return a generic error message
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

  static async removeHabit(userId, habitId) {
    try {
      await firestore
        .collection('users')
        .doc(userId)
        .collection('habits')
        .doc(habitId)
        .delete();
    } catch (error) {
      console.error('Error removing habit:', error);
      throw error;
    }
  }

  static async updateHabitTime(userId, currentHabitId) {
    try {
      const habitRef = firestore
        .collection('users')
        .doc(userId)
        .collection('habits')
        .doc(currentHabitId);

      await habitRef.update({
        startDate: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating habit time:', error);
      throw error;
    }
  }

  static async saveStatusToBackend(userId, statusMessage) {
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
    console.log("ADDMILESTONE")
    console.log(milestoneData)
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

  static async deleteMilestoneFromBackend(userId, goalId, milestone) {
    console.log("goalId", goalId);
    console.log("milestone", milestone);
  
    try {
      const milestonesCollection = firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('goals')
        .doc(goalId)
        .collection('milestones');
  
      // Find the milestone document to delete
      const milestonesSnapshot = await milestonesCollection.get();
      const milestoneToDelete = milestonesSnapshot.docs.find(
        (doc) => doc.id === milestone.id
      );
  
      if (milestoneToDelete) {
        await milestoneToDelete.ref.delete();
        console.log('Milestone deleted from backend');
        return true;
      } else {
        console.log('Milestone not found in backend');
        return false;
      }
    } catch (error) {
      console.error('Error deleting milestone from backend: ', error);
      return false;
    }
  }


  static async updateMilestoneStatus(userId, goal, milestone, newStatus) {

    console.log("updateMilestoneStatus milestone", milestone)

    const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
      return date.toISOString();
    };

    try {
      let milestoneDocRef;

      if (milestone.id) {
        // If the milestone has an ID, use it to find the milestone document
        milestoneDocRef = firebase
          .firestore()
          .collection('users')
          .doc(userId)
          .collection('goals')
          .doc(goal.id)
          .collection('milestones')
          .doc(milestone.id);

        console.log("milestoneDocRef", milestoneDocRef)
      } else {
        // Get all milestones for the given goal
        const milestonesQuery = firebase
          .firestore()
          .collection('users')
          .doc(userId)
          .collection('goals')
          .doc(goal.id)
          .collection('milestones');

        const querySnapshot = await milestonesQuery.get();
        const milestones = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log('All milestones for the goal:', milestones);

        // Find the milestone by createdAt and description
        const targetMilestone = milestones.find(m => {
          const createdAtString = formatTimestamp(m.createdAt);
          const milestoneCreatedAt = new Date(milestone.createdAt);
          const dbCreatedAt = new Date(createdAtString);

          const timeDiff = Math.abs(milestoneCreatedAt.getTime() - dbCreatedAt.getTime());
          const tolerance = 2000; // 1 second in milliseconds

          console.log("created at string:", createdAtString);
          return timeDiff <= tolerance && m.description === milestone.description;
        });

        console.log("targetMilestone", targetMilestone.id)

        if (targetMilestone) {
          // Construct the document reference directly
          milestoneDocRef = firebase
            .firestore()
            .collection('users')
            .doc(userId)
            .collection('goals')
            .doc(goal.id)
            .collection('milestones')
            .doc(targetMilestone.id);

          console.log("milestoneDocRef", milestoneDocRef)

          // if (milestoneDocRef.exists) {
          //   await milestoneDocRef.update({ status: newStatus });
          //   console.log('Milestone status updated successfully');
          //   return true;
          // } else {
          //   console.error('Milestone document not found');
          //   return false;
          // }
        } else {
          console.error('Milestone not found');
          return false;
        }
      }

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
      return { success: true, noteId: newNoteRef.id };
    } catch (error) {
      console.error('Error adding note: ', error);
      return { success: false, noteId: null };
    }
  }

  static async deleteNoteFromBackend(userId, goalId, note) {
    try {
      const notesCollection = firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('goals')
        .doc(goalId)
        .collection('notes');
  
      // Find the note document to delete
      const notesSnapshot = await notesCollection.get();
      const noteToDelete = notesSnapshot.docs.find((doc) => doc.id === note.id);
  
      if (noteToDelete) {
        await noteToDelete.ref.delete();
        console.log('Note deleted from backend');
        return true;
      } else {
        console.log('Note not found in backend');
        return false;
      }
    } catch (error) {
      console.error('Error deleting note from backend: ', error);
      return false;
    }
  };

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

  static async updateGoal(userId, goalId, updatedGoalData) {
    try {
      const goalRef = firestore
        .collection('users')
        .doc(userId)
        .collection('goals')
        .doc(goalId);
  
      // Check if the goal exists
      const goalSnapshot = await goalRef.get();
      if (!goalSnapshot.exists) {
        console.log('Goal does not exist');
        return;
      }
  
      // Update the goal document with the new data
      await goalRef.update(updatedGoalData);
      console.log('Goal updated successfully');
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  }

  static async unMarkGoalAsCompleted(userUID, goalId) {
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
        await goalRef.update({ status: 'Ongoing' }); // Or any other status you prefer
  
        // Optional: Success message 
        console.log('Goal successfully unmarked as completed');
      } else {
        // Document doesn't exist - handle this
        console.error('Goal document not found');
      }
    } catch (error) {
      console.error('Error unmarking goal as completed:', error);
    }
  }
  

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
  
        // Update the status of all milestones associated with the goal
        const milestonesCollection = goalRef.collection('milestones');
        const milestonesSnapshot = await milestonesCollection.get();
        const milestoneBatches = [];
  
        milestonesSnapshot.forEach((doc) => {
          const batch = firebase.firestore().batch();
          const milestoneRef = milestonesCollection.doc(doc.id);
          batch.update(milestoneRef, { status: 'Completed' });
          milestoneBatches.push(batch);
        });
  
        // Commit the batches
        for (const batch of milestoneBatches) {
          await batch.commit();
        }
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

  static async updateBlockTitleInFirebase(userId, blockId, newTitle) {
    try {
      const blockRef = firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('blocks')
        .doc(blockId);
  
      // Update the block document with the new title
      await blockRef.update({ title: newTitle });
    } catch (error) {
      console.error('Error updating block title:', error);
      throw error;
    }
  }
  
  static async updateBlockDurationInFirebase(userId, blockId, newDuration) {
    try {
      const blockRef = firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('blocks')
        .doc(blockId);
  
      // Update the block document with the new duration
      await blockRef.update({ duration: newDuration });
    } catch (error) {
      console.error('Error updating block duration:', error);
      throw error;
    }
  }

  static async updateBlockStartingTimeInFirebase(userId, blockId, newStartingTime) {
    try {
      const blockRef = firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('blocks')
        .doc(blockId);
  
      // Update the block document with the new starting time
      await blockRef.update({ startingTime: newStartingTime });
    } catch (error) {
      console.error('Error updating block starting time:', error);
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
        createdAt: milestoneDoc.data().createdAt.toDate(),
      }));

      const notesQuery = await goalDocRef.collection('notes').get();
      const notes = notesQuery.docs.map((noteDoc) => ({
        id: noteDoc.id,
        ...noteDoc.data(),
        createdAt: noteDoc.data().createdAt.toDate(),
      }));

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
        // Return an empty array instead of throwing an error
        return [];
      }
    } catch (error) {
      console.log('Error fetching blocks:', error);
      // You can optionally throw the error here if needed
      // throw error;
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
        const habitsData = habitsCollection.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            startDate: data.startDate.toDate(), // Convert Firestore Timestamp to JavaScript Date
          };
        });

        return habitsData;
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

  static async removeJournal(userId, journalId) {
    try {
      const userRef = firebase.firestore().collection('users').doc(userId);
      const journalRef = userRef.collection('journals').doc(journalId);
  
      // Check if the journal exists
      const journalSnapshot = await journalRef.get();
      if (!journalSnapshot.exists) {
        console.log('Journal does not exist');
        return;
      }
  
      // Remove the journal document
      await journalRef.delete();
      console.log('Journal removed successfully');
    } catch (error) {
      console.error('Error removing journal:', error);
      throw error;
    }
  }

  static async removeStatus(userId, journalId) {
    try {
      const userRef = firebase.firestore().collection('users').doc(userId);
      const journalRef = userRef.collection('statuses').doc(journalId);
  
      // Check if the journal exists
      const journalSnapshot = await journalRef.get();
      if (!journalSnapshot.exists) {
        console.log('Status does not exist');
        return;
      }
  
      // Remove the journal document
      await journalRef.delete();
      console.log('Status removed successfully');
    } catch (error) {
      console.error('Error removing status:', error);
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
        // No journals found - return an empty array
        return []; 
      }
    } catch (error) {
      // console.log('Error fetching journals:', error);
      // Re-throwing the error is optional, you might want to handle it differently.
      // throw error; 
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
      // Check for existing email (Optional - if applicable to your project)
      const emailExistsQuery = firestore.collection('users').where('email', '==', newEmail).limit(1);
      const emailExistsSnapshot = await emailExistsQuery.get();
      if (!emailExistsSnapshot.empty) {
        return false; // Email already exists
      }
  
      // Update the email in Firebase Authentication using Admin SDK
      await admin.auth().updateUser(userId, {
        email: newEmail
      });
  
      // Update the email in Firestore (if you track it there)
      await firestore.collection('users').doc(userId).update({ email: newEmail });
  
      return true; // Update successful
    } catch (error) {
      console.error('Error updating email:', error);
      return false; 
    }
  }

  // static async updateEmail(email) {
  //   try {
  //     // Get the currently authenticated user
  //     const user = firebase.auth().currentUser;
  
  //     if (!user) {
  //       return { error: 'No user is currently authenticated' };
  //     }
  
  //     // Check if the provided email is different from the current email
  //     if (user.email === email) {
  //       return { success: true, updatedEmailIdentifier: user.uid };
  //     }
  
  //     // Get the user's authentication credentials
  //     const credential = firebase.auth.EmailAuthProvider.credential(user.email, '');
      
  //     // Re-authenticate the user with the credentials
  //     await user.reauthenticateWithCredential(credential);
  
  //     // Update the user's email
  //     await user.updateEmail(email);
  
  //     // Get the updated user's email identifier (UID)
  //     const updatedEmailIdentifier = user.uid;
  
  //     // Update the user's email in the Firebase Authentication user object
  //     await firebase.auth().updateCurrentUser(user);
  
  //     // Sign out the user after updating the email
  //     await firebase.auth().signOut();
  
  //     return { success: true, updatedEmailIdentifier };
  //   } catch (error) {
  //     console.error('Error updating email:', error);
  
  //     if (error.code === 'auth/email-already-in-use') {
  //       return { error: 'The email address is already in use by another account' };
  //     } else if (error.code === 'auth/invalid-email') {
  //       return { error: 'The email address is not valid' };
  //     } else {
  //       return { error: 'An error occurred while updating the email' };
  //     }
  //   }
  // }

}

export default UserModel;