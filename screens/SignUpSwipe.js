import React, { useRef } from 'react';
import { View, Text, Button, Image, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import { reusableStyles, signUpSwipe } from '../components/styles';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const SignUpSwipe = ({ navigation }) => {

    const [count, setCount] = React.useState(0);

    // React.useEffect(() => {
    //     // Use `setOptions` to update the button that we previously specified
    //     // Now the button includes an `onPress` handler to update the count
    //     navigation.setOptions({
    //         headerRight: () => (
    //             <FontAwesome5 name="cog" size={30} color="#000" onPress={() => setCount((c) => c + 1)}/>
    //             // <Button onPress={() => setCount((c) => c + 1)} title="Update count" />
    //         ),
    //     });
    // }, [navigation]);

    const swiperRef = useRef(null);

    const goToNextSlide = () => {
        swiperRef.current.scrollBy(1);
    };

    return (
        <Swiper ref={swiperRef} style={signUpSwipe.wrapper} showsButtons={false} loop={false} activeDotColor="#0077FF">
            {/* Screen 1 */}
            <View style={signUpSwipe.slide} key="slide1">
                <Text style={signUpSwipe.text}>Track Habits</Text>
                <Text style={signUpSwipe.description}>Beat them to the curb</Text>
                <Image source={require('../components/assets/blob.png')} />
            </View>

            {/* Screen 2 */}
            <View style={signUpSwipe.slide2} key="slide2">
                <Text style={signUpSwipe.text}>Set Goals</Text>
                <Text style={signUpSwipe.description}>Aim for the stars</Text>
                <Image source={require('../components/assets/blob.png')}  style={{ transform: [{ rotate: '300deg' }] }}/>

            </View>

            {/* Screen 3 */}
            <View style={signUpSwipe.slide}>
                <Text style={signUpSwipe.text}>Discover Tools</Text>
                <Text style={signUpSwipe.description}>For the greatest chance possible</Text>
                <Image source={require('../components/assets/blob.png')}  style={{ transform: [{ rotate: '45deg' }] }}/>
            </View>

            {/* Screen 4 */}
            <View style={signUpSwipe.slide}>
                <Text style={signUpSwipe.text}>Connect And Grow</Text>
                <Text style={signUpSwipe.description}>Grow with others in the community</Text>
                <Image source={require('../components/assets/blob.png')}  style={{ transform: [{ rotate: '90deg' }] }}/>
                <TouchableOpacity style={reusableStyles.button} onPress={() => navigation.navigate('SignUp')}>
                    <Text style={reusableStyles.buttonText}>Let's Go!</Text>
                </TouchableOpacity>
            </View>
        </Swiper>


    );
};


export default SignUpSwipe;
