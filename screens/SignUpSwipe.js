import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import { reusableStyles } from '../components/styles';

const SignUpSwipe = ({ navigation }) => {

    const swiperRef = useRef(null);

    const goToNextSlide = () => {
        swiperRef.current.scrollBy(1);
    };

    return (
        <Swiper ref={swiperRef} style={styles.wrapper} showsButtons={false} loop={false} activeDotColor="#0077FF">
            {/* Screen 1 */}
            <View style={styles.slide} key="slide1">
                <Text style={styles.text}>Track Habits</Text>
                <Text style={styles.description}>Grow with others in the community</Text>
                <Image source={require('../components/assets/blob.png')} />
                <TouchableOpacity></TouchableOpacity>
            </View>

            {/* Screen 2 */}
            <View style={styles.slide2} key="slide2">
                <Text style={styles.text}>Set Goals</Text>
                <Text style={styles.description}>Grow with others in the community</Text>
                <Image source={require('../components/assets/blob.png')} />

            </View>

            {/* Screen 3 */}
            <View style={styles.slide}>
                <Text style={styles.text}>Discover Tools</Text>
                <Text style={styles.description}>Grow with others in the community</Text>
                <Image source={require('../components/assets/blob.png')} />
            </View>

            {/* Screen 4 */}
            <View style={styles.slide}>
                <Text style={styles.text}>Connect And Grow</Text>
                <Text style={styles.description}>Grow with others in the community</Text>
                <Image source={require('../components/assets/blob.png')} />
                <TouchableOpacity style={reusableStyles.button} onPress={() => navigation.navigate('SomeScreen')}>
                    <Text style={reusableStyles.buttonText}>Let's Go!</Text>
                </TouchableOpacity>
            </View>
        </Swiper>


    );
};

const styles = StyleSheet.create({
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
        color: '#666',
        fontSize: 20,
        marginTop: 15,
    },
    // ... Add styles for your image and buttons
});

export default SignUpSwipe;
