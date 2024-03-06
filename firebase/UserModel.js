import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

class UserModel {
  static async createUser(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Add other user-related methods here
}

export default UserModel;