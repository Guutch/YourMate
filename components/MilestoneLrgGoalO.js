import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { reusableStyles } from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import UserModel from '../firebase/UserModel';
import GoalItem from './GoalItem';

const MilestoneLrgGoalO = ({ xOut, goal, onOverlayContentChange, mode, userId, updateGoalData }) => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [titleBorderColor, setTitleBorderColor] = useState('#000');
    const [descBorderColor, setDescBorderColor] = useState('#000');
    const [titlePlaceholder, setTitlePlaceholder] = useState(mode === 'milestone' ? 'Milestone Title' : 'Note Title');
    const [descPlaceholder, setDescPlaceholder] = useState(mode === 'milestone' ? 'Milestone Description' : 'Note Description');
    const [milestoneTV, setMilestoneTV] = useState('');
    const [milestoneU, setMilestoneU] = useState('');
    const [milestoneTU, setMilestoneTU] = useState('');

    const handleSaveAndClose = async () => {
        let isValid = true;

        if (title.trim() === '') {
            setTitleBorderColor('red');
            setTitlePlaceholder('Value is missing');
            isValid = false;
        }

        if (desc.trim() === '') {
            setDescBorderColor('red');
            setDescPlaceholder('Value is missing');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        const data = {
            title,
            description: desc,
        };

        const dataToShow = {
            title,
            description: desc,
            createdAt: new Date(), // This captures the current date and time
        };



        if (mode === 'milestone') {

            const milestoneDate = {
                title,
                description: desc,
                milestoneTV,
                milestoneU,
                milestoneTU,
                status: 'Ongoing'
            }

            const isSaved = await UserModel.addMilestone(userId, goal.id, milestoneDate);
            if (isSaved) {
                const updatedGoal = {
                    ...goal,
                    milestones: goal.milestones ? [...goal.milestones, dataToShow] : [dataToShow],
                };
                updateGoalData(updatedGoal);
                onOverlayContentChange('lrg');
                resetFormFields();
            } else {
                console.log('Error saving milestone');
            }
        } else {
            const savedNote = await UserModel.addNote(userId, goal.id, data);
            if (savedNote) {
                // Assuming `updateGoalData` is your method to update the goal's state
                const updatedGoal = {
                    ...goal,
                    notes: goal.notes ? [...goal.notes, dataToShow] : [dataToShow],
                };

                updateGoalData(updatedGoal);

                onOverlayContentChange('lrg');
                resetFormFields();
            } else {
                console.log('Error saving note');
            }
        }
    };

    function resetFormFields() {
        setTitle('');
        setDesc('');
        setMilestoneTU('');
        setMilestoneTV('');
        setMilestoneU('');
        setTitleBorderColor('#000');
        setDescBorderColor('#000');
        setTitlePlaceholder('Note Title');
        setDescPlaceholder('Note Description');
    }

    const handleCancel = () => {
        onOverlayContentChange('lrg');
    };

    const handleTitleChange = (text) => {
        setTitle(text);
        if (text.trim() !== '') {
            setTitleBorderColor('#000');
            setTitlePlaceholder(mode === 'milestone' ? 'Milestone Title' : 'Note Title');
        }
    };

    const handleDescChange = (text) => {
        setDesc(text);
        if (text.trim() !== '') {
            setDescBorderColor('#000');
            setDescPlaceholder(mode === 'milestone' ? 'Milestone Description' : 'Note Description');
        }
    };

    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[reusableStyles.headerText, { marginBottom: 9 }]}>
                    {mode === 'milestone' ? 'Add Milestone' : 'Add Note'}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                    <FontAwesome5 name="times" size={24} color="black" style={{ marginRight: 15 }} onPress={handleCancel} />
                    <FontAwesome5 name="save" size={24} color="black" onPress={handleSaveAndClose} />
                </View>
            </View>

            <Text>Required</Text>

            <TextInput
                style={[reusableStyles.textInput, { height: 44, borderColor: descBorderColor, borderWidth: 1, marginTop: 9 }, reusableStyles.lessRounded]}
                placeholder={titlePlaceholder}
                value={title}
                onChangeText={handleTitleChange}
            />
            <TextInput
                style={[reusableStyles.textInput, { height: 44, borderColor: descBorderColor, borderWidth: 1, marginTop: 9 }, reusableStyles.lessRounded]}
                placeholder={descPlaceholder}
                value={desc}
                onChangeText={handleDescChange}
                multiline
            />

            <View>
                {mode === "milestone" && (
                    <>
                        <Text style={{ marginTop: 10 }}>Additional</Text>
                        <TextInput
                            style={[reusableStyles.textInput, { height: 44, borderColor: 'black', borderWidth: 1, marginTop: 9 }, reusableStyles.lessRounded]}
                            placeholder="Target Value"
                            value={milestoneTV}
                            onChangeText={setMilestoneTV}
                        />
                        <TextInput
                            style={[reusableStyles.textInput, { height: 44, borderColor: 'black', borderWidth: 1, marginTop: 9 }, reusableStyles.lessRounded]}
                            placeholder="Unit"
                            value={milestoneU}
                            onChangeText={setMilestoneU}
                        />
                        <TextInput
                            style={[reusableStyles.textInput, { height: 44, borderColor: 'black', borderWidth: 1, marginTop: 9 }, reusableStyles.lessRounded]}
                            placeholder="Target Date"
                            value={milestoneTU}
                            onChangeText={setMilestoneTU}
                        />
                    </>
                )}
            </View>

        </View>
    );

};
export default MilestoneLrgGoalO;