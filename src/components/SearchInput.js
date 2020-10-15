import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';

export default function SearchInput({ setSearchTerm, setButtonPress }) {
	return (
		<View style={styles.container}>
			<TextInput
				onChange={(event) => {
					setSearchTerm(event.nativeEvent.text);
					setButtonPress(false);
				}}
				onSubmitEditing={(event) => setButtonPress(true)}
				placeholder="Enter Search"
				style={styles.inputText}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	inputText: {
		width: 150,
		textAlign: 'center',
		fontSize: 20,
		paddingTop: 0,
		borderBottomWidth: 2
	}
});
