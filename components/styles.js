import { StyleSheet, Dimensions } from 'react-native';

// Get the full width of the device
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const reusableStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white'
    },
    headerText: {
        fontSize: 30,
        color: "#000",
        fontWeight: 'bold',
        // marginBottom: 30, // Space below the header text
        textAlign: 'left', // Center the text
    },
    button: {
        width: 300,
        height: 45,
        backgroundColor: "#0077FF", // Make sure this is a valid color
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelText: {
        fontSize: 20,
        color: "#000",
        fontWeight: 'bold',
        marginTop: 9, // Space above the label text
    },
    lessRounded: {
        borderRadius: 10,
    },
    textInput: {
        borderColor: "#000",
        borderWidth: 2,
        width: 335,
        backgroundColor: "#fff",
        padding: 10,
    },
    buttonText: {
        fontFamily: 'Inter',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    },
    commonView: {
        height: 53,
        borderRadius: 40,
        borderWidth: 1,
        justifyContent: 'center',
        marginBottom: 9
    },
    overlay: {
        bottom: 0,
        position: "absolute",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: "100%"
    }
});

const landing = StyleSheet.create({
    mainContainer: {
        flex: 1, justifyContent: 'center', alignItems: 'center'
    },
    mainText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black'
    },
    signInText: {
        fontSize: 15,
        color: 'black',
        marginBottom: 10
    },
    continueContainer: {
        justifyContent: 'flex-end', // Aligns children to the bottom
        alignItems: 'center', // Aligns children horizontally in the center
        width: '100%', // Ensures the container takes the full width
        marginBottom: 25, // Adds some padding at the bottom
    }
});

const signUpSwipe = StyleSheet.create({
    wrapper: {},
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        color: '#000',
        fontSize: 30,
        fontWeight: 'bold',
    },
    description: {
        color: '#000',
        fontSize: 20,
        marginTop: 15,
    },
});

const signUp = StyleSheet.create({
    halfInput: {
        width: 160
    },
    row: {
        flexDirection: 'row',
        // justifyContent: 'space-between'
    },
    smallText: {
        color: "#000",
        fontSize: 12
    }
});

const username = StyleSheet.create({
    subtitle: {
        fontSize: 14,
        marginTop: 0,
    }
});

const goalStyles = StyleSheet.create({
    category: {
        width: 162,
        height: 104,
        borderColor: "#000",
        borderWidth: 2,
        marginTop: 10,
        justifyContent: 'center', alignItems: 'center'
    },
    container: {
        flexDirection: 'row', // Lays out children in a row
        flexWrap: 'wrap',     // Allows items to wrap to the next line
        justifyContent: 'space-around', // Adjusts spacing around items
        // Add more styling as needed
    },
    highlighted: {
        borderWidth: 3,
        borderColor: "#0077FF"
    }
});

export { reusableStyles, landing, signUpSwipe, signUp, username, goalStyles };
