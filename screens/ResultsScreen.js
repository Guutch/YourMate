import { View, Text, TouchableOpacity, ScrollView, RadioButton } from 'react-native';
import { reusableStyles, communityMain, signUp } from '../components/styles'; // Adjust the path


const ResultsScreen = ({ route, navigation }) => {
  const { habit, selectedQuestions, questions, isSignUp } = route.params;

  const generateSpecificFeedback = (question, selectedOption) => {
    let feedback = "";

    switch (question) {
      // PORN QUESTIONS
      case 'Frequency of Use: How often do you view pornography?':
        feedback += "The statistic that 70% of men aged 18-24 visit pornographic websites at least once per month can be a reference point. Comparing an individual's frequency of use to this statistic can give insights into how their consumption level compares to a key demographic's average.";
        if (selectedOption === 'Daily') {
          feedback += "\n\nYour usage frequency is significantly higher than the average for young adults, where 70% report viewing pornography at least once per month.";
        }
        break;
      case 'Duration of Use: On average, how much time do you spend viewing pornography per session?':
        feedback += "The average length of time spent on a porn site is around 15 minutes. This can serve as a benchmark to discuss how an individual's session length compares to the general viewing habits.";
        // Further personalize the feedback based on selectedOption as needed
        break;
      case 'Impact on Daily Life: Do you feel that your pornography use impacts your daily responsibilities or relationships?':
        feedback += "While specific statistics on this aspect may be harder to come by, the concern about impacts on daily life can be linked to the general awareness of the potential negative effects of excessive pornography consumption, such as distraction from responsibilities or strain on relationships.";
        // Further personalize the feedback based on selectedOption as needed
        break;
      case 'Efforts to Reduce or Stop: Have you ever attempted to reduce or stop your pornography consumption?':
        feedback += "Discussing efforts to change is more about providing supportive feedback rather than comparing to data. Highlighting that changes in habits are common and can be part of a healthy approach to digital consumption.";
        // Further personalize the feedback based on selectedOption as needed
        break;
      case 'Reasons for Use: What are your primary reasons for viewing pornography? (Select all that apply)':
        feedback += "The rise in 'female-friendly' porn viewership by 1,400% from 2013 to 2017 can be linked to the diversification of reasons for consumption, indicating changing trends in why people view pornography.";
        // Further personalize the feedback based on selectedOption as needed
        break;
      case 'How concerned are you about your pornography use?':
        feedback += "With the statistic that 58% of Americans have watched pornography at least once in their lifetime, and concerns about consumption vary widely. The level of concern can be contrasted with general perceptions and the normalization of pornography in society.";
        // Further personalize the feedback based on selectedOption as needed
        break;

        // ONLINE GAMBLING
        case 'How often do you participate in online gambling activities?':
        feedback += "The global online gambling market is rapidly growing, with projections suggesting significant increases in user engagement and revenue. In North America alone, the online gambling industry is expected to register a CAGR of 11.78% over the next five years. This indicates a high level of participation that can be compared against individual gambling frequencies.";
        // Further personalize the feedback based on selectedOption as needed
        break;
      case 'On average, how long do your online gambling sessions last?':
        feedback += "While specific data on session lengths wasn't found, the growing trend towards mobile gambling suggests that people are spending significant amounts of time engaged in online gambling. Mobile users tend to spend more time playing games than desktop users, with mobile gaming leading the growth trajectory of the online gambling industry.";
        // Further personalize the feedback based on selectedOption as needed
        break;
      case 'How much money do you typically spend on online gambling per month?':
        feedback += "Financial expenditures on online gambling can vary widely. For example, Californian gamblers reported an average yearly expenditure of $46,000 on gambling. This highlights the significant financial implications of gambling habits and can serve as a benchmark for understanding personal gambling expenditures.";
        // Further personalize the feedback based on selectedOption as needed
        break;
      case 'How has online gambling affected your personal and financial well-being?':
        feedback += "The link between gambling and severe mental health issues, including elevated mortality and suicide rates among problem gamblers, underscores the potential negative impact of gambling on personal well-being. Comparing individual experiences with these broader trends can provide insight into the consequences of gambling habits.";
        // Further personalize the feedback based on selectedOption as needed
        break;
      case 'Have you ever attempted to reduce or stop gambling?':
        feedback += "The prevalence of gambling issues and the attempts to address them, such as the fact that 30% of gamblers had attempted to take their own lives before seeking treatment, suggests a significant challenge in modifying gambling behavior. Understanding the broader context of these struggles can be critical for individuals attempting to change their gambling habits.";
        // Further personalize the feedback based on selectedOption as needed
        break;

        // PROCRASTINATION
        case 'How often do you find yourself procrastinating on tasks that need to be completed?':
        feedback += "Given that chronic procrastination affects about 20% of the global population consistently across various countries, a respondent's frequency of procrastination could be contextualized against this backdrop. ";
        if (["Often", "Always"].includes(selectedOption)) {
          feedback += "This indicates you might be part of this significant proportion, suggesting a commonality rather than an outlier behavior.";
        }
        break;
      case 'What types of tasks do you most frequently procrastinate on?':
        feedback += "With high school students showing an over 85% tendency to procrastinate on school assignments, and adults experiencing procrastination in diverse life domains including health behaviors and career, it's clear that procrastination spans both mundane and critical tasks, emphasizing its wide-reaching impact.";
        break;
      case 'What are the main reasons you procrastinate?':
        feedback += "The complexity of procrastination's causes allows for a nuanced understanding of one's habits. Identifying with reasons such as 'Lack of motivation' can be linked to broader findings around how energy levels and task perception impact procrastination.";
        break;
      case 'How does procrastination affect your performance or the quality of work?':
        feedback += "Procrastination negatively correlates with performance, income, and employment status, where a single point increase in a 5-point procrastination scale correlates with a significant drop in salary, offering a concrete measure of procrastination's potential cost on one's professional life.";
        break;
      case 'How does procrastinating make you feel?':
        feedback += "Considering the broad negative emotional impact of procrastination, where over 80% of students report feelings such as stress and anxiety after procrastinating, it's important to know you're not alone and that seeking strategies for change is a positive step forward.";
        break;
      case 'Have you tried to overcome your procrastination? If so, what methods have you tried?':
        feedback += "Given the widespread nature of procrastination and its increase over time, those looking to overcome it can be reassured that a significant portion of the population is engaged in similar efforts. Exploring proven strategies like goal setting, interest enhancement, and addressing energy levels can be effective in mitigating procrastination.";
        break;

        // GENERAL SCREENTIME
        case 'How much time do you spend in front of screens daily (including smartphones, computers, tablets, and TVs)?':
        feedback += "Globally, the average screen time per day is nearly 7 hours, with Americans spending slightly over 7 hours on screens daily. This suggests a significant portion of the day is dedicated to screen use, aligning with the trend of increasing screen time noted across various countries.";
        // Further personalize the feedback based on selectedOption as needed
        break;
      case 'What are your primary reasons for screen time? (Select all that apply)':
        feedback += "Screen time usage varies by generation, with Gen Z and Millennials showing high engagement in social media and streaming services, whereas older generations focus more on online searches and banking. This reflects the diversity in digital activities across age groups, highlighting the extensive use of technology for entertainment and information.";
        // Further personalize the feedback based on selectedOption as needed
        break;
      case 'Have you experienced any physical discomfort or health issues that you believe are related to screen time? (e.g., eye strain, headaches, sleep disturbances)':
        feedback += "Excessive screen time has been linked to a range of health issues, including sleep disturbances, vision impairment, chronic pain, weight gain, and poor mental health. These consequences underscore the importance of managing screen time to mitigate potential negative impacts on well-being.";
        // Further personalize the feedback based on selectedOption as needed
        break;
      case 'Have you taken any steps to manage or reduce your screen time?':
        feedback += "While specific data on efforts to manage screen time was not directly found, the widespread recognition of excessive screen time's negative effects, especially among younger generations, suggests a growing awareness and potential for intervention strategies.";
        // Further personalize the feedback based on selectedOption as needed
        break;
      case 'Are you aware of the recommended limits for daily screen time and the potential health implications of exceeding those limits?':
        feedback += "The recommendation for screen time is around 2 to 4 hours a day for adults and less for children. However, actual screen times far exceed these recommendations, indicating a gap between awareness and behavior. This gap highlights the need for more effective communication and strategies to encourage healthier screen time habits.";
        // Further personalize the feedback based on selectedOption as needed
        break;
      default:
        feedback = "No specific feedback available for your selection.";
    }

    return feedback;
  };

  const generateFeedback = () => {
    let feedback = '';

    selectedQuestions.forEach(({ question, selectedOption }) => {
      feedback += `For the question "${question}", you chose: ${selectedOption}.\n\n`;
      feedback += `${generateSpecificFeedback(question, selectedOption)}\n\n`;
    });

    return feedback;
  };

  return (
    <ScrollView style={reusableStyles.container}>
      <Text>{generateFeedback()}</Text>
      <TouchableOpacity onPress={() =>
          navigation.navigate('MainFlow')
        }
        style={[reusableStyles.textInput, reusableStyles.moreRounded, { marginBottom: 5 }]}
        
        >
          
        
        <Text style={{ textAlign: 'center' }}>Go to the home screen</Text>

      </TouchableOpacity>
    </ScrollView>
  );
};

export default ResultsScreen;

