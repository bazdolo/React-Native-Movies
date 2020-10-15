import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';

const SearchButton = ({ setButtonPress, setRelated }) => {
	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={() => {
					setButtonPress(true);
					setRelated(false);
				}}
				style={styles.body}
			>
				<Text style={styles.text}>SEARCH</Text>
			</TouchableOpacity>
		</View>
	);
};

export default SearchButton;

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	body: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
		backgroundColor: '#1976D2',
		borderRadius: 5,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5
	},
	text: {
		color: 'white',
		fontWeight: '600',
		fontFamily: 'Helvetica'
	}
});
