// questions.js
const getQuestions = (habit) => {
    switch (habit) {
        case 'porn':
            return [
                {
                    question: 'Frequency of Use: How often do you view pornography?',
                    options: ['Daily', 'Several times a week', 'Once a week', 'Less than once a week', 'Rarely'],
                    feedback: "The statistic that 70% of men aged 18-24 visit pornographic websites at least once per month can be a reference point. Comparing an individual's frequency of use to this statistic can give insights into how their consumption level compares to a key demographic's average."

                },
                {
                    question: 'Duration of Use: On average, how much time do you spend viewing pornography per session?',
                    options: ['Less than 10 minutes', '10 to 30 minutes', '30 minutes to 1 hour', 'More than 1 hour'],
                    feedback: "The average length of time spent on a porn site is around 15 minutes. This can serve as a benchmark to discuss how an individual's session length compares to the general viewing habits."

                },
                {
                    question: 'Impact on Daily Life: Do you feel that your pornography use impacts your daily responsibilities or relationships?',
                    options: ['Significantly', 'Moderately', 'Slightly', 'Not at all'],
                    feedback: "While specific statistics on this aspect may be harder to come by, the concern about impacts on daily life can be linked to the general awareness of the potential negative effects of excessive pornography consumption, such as distraction from responsibilities or strain on relationships."

                },
                {
                    question: 'Efforts to Reduce or Stop: Have you ever attempted to reduce or stop your pornography consumption?',
                    options: ['Yes, successfully', 'Yes, but unsuccessfully', 'No, but I\'ve considered it', 'No, and I haven\'t considered it'],
                    feedback: "Discussing efforts to change is more about providing supportive feedback rather than comparing to data. Highlighting that changes in habits are common and can be part of a healthy approach to digital consumption."

                },
                {
                    question: 'Reasons for Use: What are your primary reasons for viewing pornography?',
                    options: ['Entertainment/Leisure', 'Coping mechanism for stress or emotional distress', 'Curiosity', 'Habit'],
                    feedback: "The rise in 'female-friendly' porn viewership by 1,400% from 2013 to 2017 can be linked to the diversification of reasons for consumption, indicating changing trends in why people view pornography."

                },
                {
                    question: 'Awareness and Concern: How concerned are you about your pornography use?',
                    options: ['Very concerned', 'Somewhat concerned', 'Slightly concerned', 'Not concerned'],
                    feedback: "With the statistic that 58% of Americans have watched pornography at least once in their lifetime, and concerns about consumption vary widely. The level of concern can be contrasted with general perceptions and the normalization of pornography in society."

                },
            ];
        case 'procrastination':
            return [
                {
                    question: 'Frequency of Procrastination: How often do you find yourself procrastinating on tasks that need to be completed?',
                    options: ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'],
                    feedback: "Given that chronic procrastination affects about 20% of the global population consistently across various countries, a respondent's frequency of procrastination could be contextualized against this backdrop. "

                },
                {
                    question: 'Types of Tasks Delayed: What types of tasks do you most frequently procrastinate on?',
                    options: ['Work or school assignments', 'Household chores', 'Personal projects', 'Making important decisions'],
                    feedback: "With high school students showing an over 85% tendency to procrastinate on school assignments, and adults experiencing procrastination in diverse life domains including health behaviors and career, it's clear that procrastination spans both mundane and critical tasks, emphasizing its wide-reaching impact."

                },
                {
                    question: 'Reasons for Procrastination: What are the main reasons you procrastinate?',
                    options: ['Lack of motivation', 'Fear of failure', 'Overwhelmed by the task', 'Distractions (social media, TV, etc.)', 'Perfectionism'],
                    feedback: "The complexity of procrastination's causes allows for a nuanced understanding of one's habits. Identifying with reasons such as 'Lack of motivation' can be linked to broader findings around how energy levels and task perception impact procrastination."

                },
                {
                    question: 'Impact on Performance: How does procrastination affect your performance or the quality of work?',
                    options: ['Significantly worsens it', 'Somewhat worsens it', 'No impact', 'Somewhat improves it', 'Significantly improves it'],
                    feedback: "Procrastination negatively correlates with performance, income, and employment status, where a single point increase in a 5-point procrastination scale correlates with a significant drop in salary, offering a concrete measure of procrastination's potential cost on one's professional life."

                },
                {
                    question: 'Emotional Impact: How does procrastinating make you feel?',
                    options: ['Stressed', 'Anxious', 'Guilty', 'Indifferent', 'Relieved'],
                    feedback: "Considering the broad negative emotional impact of procrastination, where over 80% of students report feelings such as stress and anxiety after procrastinating, it's important to know you're not alone and that seeking strategies for change is a positive step forward."

                },
                {
                    question: 'Efforts to Overcome Procrastination: Have you tried to overcome your procrastination? If so, what methods have you tried?',
                    options: ['Yes (time tools, breaking tasks down, etc.)', 'No, but I want to', 'No, and I\'m not interested in changing'],
                    feedback: "Given the widespread nature of procrastination and its increase over time, those looking to overcome it can be reassured that a significant portion of the population is engaged in similar efforts. Exploring proven strategies like goal setting, interest enhancement, and addressing energy levels can be effective in mitigating procrastination."

                },
            ];
        case 'general':
            return [
                {
                    question: 'Daily Screen Time: How much time do you spend in front of screens daily (including smartphones, computers, tablets, and TVs)?',
                    options: ['Less than 2 hours', '2 to 4 hours', '4 to 6 hours', '6 to 8 hours', 'More than 8 hours'],
                    feedback: "Globally, the average screen time per day is nearly 7 hours, with Americans spending slightly over 7 hours on screens daily. This suggests a significant portion of the day is dedicated to screen use, aligning with the trend of increasing screen time noted across various countries."

                },
                {
                    question: 'Purpose of Screen Time: What are your primary reasons for screen time?',
                    options: ['Work or study', 'Social media', 'Gaming', 'Watching TV shows or movies', 'Reading or research'],
                    feedback: "Screen time usage varies by generation, with Gen Z and Millennials showing high engagement in social media and streaming services, whereas older generations focus more on online searches and banking. This reflects the diversity in digital activities across age groups, highlighting the extensive use of technology for entertainment and information."

                },
                {
                    question: 'Impact on Physical Health: Have you experienced any physical discomfort or health issues that you believe are related to screen time? (e.g., eye strain, headaches, sleep disturbances)',
                    options: ['Yes', 'No'],
                    feedback: "Excessive screen time has been linked to a range of health issues, including sleep disturbances, vision impairment, chronic pain, weight gain, and poor mental health. These consequences underscore the importance of managing screen time to mitigate potential negative impacts on well-being."

                },
                {
                    question: 'Screen Time Management: Have you taken any steps to manage or reduce your screen time?',
                    options: ['Yes, successfully', 'Yes, but not successfully', 'No, but I\'ve considered it', 'No, and I haven\'t considered it'],
                    feedback: "While specific data on efforts to manage screen time was not directly found, the widespread recognition of excessive screen time's negative effects, especially among younger generations, suggests a growing awareness and potential for intervention strategies."

                },
                {
                    question: 'Awareness of Screen Time: Are you aware of the recommended limits for daily screen time and the potential health implications of exceeding those limits?',
                    options: ['Fully aware', 'Somewhat aware', 'Not aware'],
                    feedback: "The recommendation for screen time is around 2 to 4 hours a day for adults and less for children. However, actual screen times far exceed these recommendations, indicating a gap between awareness and behavior. This gap highlights the need for more effective communication and strategies to encourage healthier screen time habits."

                },
            ];
        case 'gambling':
            return [
                {
                    question: 'Frequency of Online Gambling: How often do you participate in online gambling activities?',
                    options: ['Daily', 'Several times a week', 'Weekly', 'Monthly', 'Rarely or never'],
                    feedback: "The global online gambling market is rapidly growing, with projections suggesting significant increases in user engagement and revenue. In North America alone, the online gambling industry is expected to register a CAGR of 11.78% over the next five years. This indicates a high level of participation that can be compared against individual gambling frequencies."
                },
                {
                    question: 'Types of Gambling Activities: What types of online gambling activities do you engage in?',
                    options: ['Sports betting', 'Casino games (e.g., slots, roulette)', 'Poker', 'Fantasy sports'],
                    feedback: "While specific data on session lengths wasn't found, the growing trend towards mobile gambling suggests that people are spending significant amounts of time engaged in online gambling. Mobile users tend to spend more time playing games than desktop users, with mobile gaming leading the growth trajectory of the online gambling industry."
                },
                {
                    question: 'Financial Expenditure: How much money do you typically spend on online gambling per month?',
                    options: ['Less than $50', '$50 to $200', '$200 to $500', 'More than $500'],
                    feedback: "Financial expenditures on online gambling can vary widely. For example, Californian gamblers reported an average yearly expenditure of $46,000 on gambling. This highlights the significant financial implications of gambling habits and can serve as a benchmark for understanding personal gambling expenditures."

                },
                {
                    question: 'Impact on Personal and Financial Well-being: How has online gambling affected your personal and financial well-being?',
                    options: ['Positively', 'Negatively', 'No significant impact'],
                    feedback: "The link between gambling and severe mental health issues, including elevated mortality and suicide rates among problem gamblers, underscores the potential negative impact of gambling on personal well-being. Comparing individual experiences with these broader trends can provide insight into the consequences of gambling habits."

                },
                {
                    question: 'Efforts to Modify Gambling Behavior: Have you ever attempted to reduce or stop gambling?',
                    options: ['Yes, successfully', 'Yes, but reverted back', 'No, but I\'ve considered it', 'No, and I haven\'t considered it'],
                    feedback: "The prevalence of gambling issues and the attempts to address them, such as the fact that 30% of gamblers had attempted to take their own lives before seeking treatment, suggests a significant challenge in modifying gambling behavior. Understanding the broader context of these struggles can be critical for individuals attempting to change their gambling habits."

                },
            ];

        default:
            return [];
    }
};

export default getQuestions;