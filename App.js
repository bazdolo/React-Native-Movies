import React, { Fragment, useState } from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar, Text } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import { ApolloClient, InMemoryCache, gql, ApolloProvider } from '@apollo/client';

import SearchButton from './src/components/SearchButton';
import MovieContainer from './src/components/MovieContainer';
import SearchInput from './src/components/SearchInput';

const client = new ApolloClient({
	uri: 'http://tmdb.sandbox.zoosh.ie/',
	cache: new InMemoryCache()
});

const App = () => {
	const [ searchTerm, setSearchTerm ] = useState('');
	const [ isButtonPressed, setButtonPress ] = useState('');
	const [ isRelated, setRelated ] = useState(false);

	const renderMovieContainer = () => {
		if (searchTerm && isButtonPressed) {
			return (
				<MovieContainer
					search={searchTerm}
					setButtonPress={setButtonPress}
					setRelated={setRelated}
					isRelated={isRelated}
				/>
			);
		} else {
			return (
				<View style={styles.titleContainer}>
					<Text style={styles.titleText}>Movie Search Database</Text>
					<Text style={styles.text}>Search above to start</Text>
				</View>
			);
		}
	};

	return (
		<Fragment>
			<ApolloProvider client={client}>
				<StatusBar barStyle="dark-content" />
				<SafeAreaView>
					<View style={styles.header}>
						<SearchInput setSearchTerm={setSearchTerm} setButtonPress={setButtonPress} />
						<SearchButton setButtonPress={setButtonPress} setRelated={setRelated} />
					</View>
					{renderMovieContainer()}
				</SafeAreaView>
			</ApolloProvider>
		</Fragment>
	);
};

const styles = StyleSheet.create({
	header: {
		backgroundColor: Colors.white,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		paddingTop: 50,
		paddingBottom: 20,
		borderBottomColor: 'grey',
		borderBottomWidth: 0.5
	},
	titleContainer: {
		display: 'flex',
		height: '70%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	titleText: {
		textAlign: 'center',
		fontSize: 20,
		padding: 20
	},
	text: {
		textAlign: 'center',
		fontSize: 20,
		padding: 20,
		color: '#1976D2'
	}
});

export default App;
