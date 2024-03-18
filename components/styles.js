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
    moreRounded: {
        borderRadius: 40,
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
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
      },
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

const communityMain = StyleSheet.create({
    updatedCircle: {
        width: 50,
        height: 50
    },
    friendBox: {
        height: 100,
        width: '100%',
        // flexDirection: 'colu',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginBottom: 10,
      },
    nameContainer: {
        // flex: 1,
        marginHorizontal: 10,
        justifyContent: 'center',
      },
      userName: {
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
      },
});

const homeMain = StyleSheet.create({
    dateBorder: {
        height: 56,
        width: 39,
        borderColor: "#000",
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    dateText: {
        color: "#000",
        fontWeight: 'bold'
    },
    timeCircle: {
        width: 100, // Adjust the width and height to your desired circle size
        height: 100, // The width and height should be equal to create a circle
        borderRadius: 50, // Half of the width and height to make it a circle
        justifyContent: 'center', // Center the text vertically
        alignItems: 'center', // Center the text horizontally
        borderWidth: 2,
        borderColor: '#000',
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scrollPicker: {
        height: 150, // Fixed height for the scrollable area
        width: 100, // Fixed width for each picker
    },
    item: {
        paddingVertical: 10, // Spacing for each item
        alignItems: 'center',
    },
    itemText: {
        fontSize: 18,
    },
    noBlocksContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    blocksContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 9
    },
    noBlocks: {
        textAlign: 'center',
        color: '#000'
    }
});

const goalMain = StyleSheet.create({
    settings: {
        // width: 30,  // You can adjust this value to make it smaller
        // height: 30, // You can adjust this value to make it smaller
        padding: 3,
        borderWidth: 2,
        borderRadius: 15, // Set half of the width/height value for a perfect circle
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottomBit: {
        position: 'absolute',
        bottom: 0,
        left: 5,
        right: 5,
        height: "20%",
        borderTopColor: 'rgba(0,0,0,0.2)',
        borderTopWidth: 1,
        alignSelf: 'center',
    },


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

const journalStyles = StyleSheet.create({
    textInput: {
        // your default text input style
        borderColor: 'black', // Default border color
        borderWidth: 1,
    },
    errorInput: {
        // style for error state
        borderColor: 'red', // Change border color to red on error
    },
});

export {
    reusableStyles,
    landing,
    signUpSwipe,
    signUp,
    username,
    goalStyles,
    goalMain,
    homeMain,
    communityMain,
    journalStyles
};
