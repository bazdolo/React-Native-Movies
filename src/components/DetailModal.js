import React, { useEffect, useState } from 'react';
import {
	View,
	StyleSheet,
	Text,
	Modal,
	TouchableHighlight,
	ActivityIndicator,
	ScrollView,
	Linking
} from 'react-native';

export default function DetailModal({ showModal, title, imdbID, releaseDate, setRelated, similar }) {
	const [ summary, setSummary ] = useState('');
	const [ wikiTitle, setWikiTitle ] = useState('');
	const [ spinner, setSpinner ] = useState(true);

	const IMDB_URL = 'https://www.imdb.com/title/' + imdbID;
	const WIKI_LINK = 'https://en.wikipedia.org/wiki/';

	const fetchSummary = () => {
		releaseDate = releaseDate.substring(0, 4);

		fetch(
			'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' +
				title +
				' ' +
				releaseDate +
				'&utf8=&format=json'
		)
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);

				let queryTitle = responseJson.query.search[0].title;
				console.log(queryTitle);

				fetch(
					'http://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=' +
						queryTitle
				)
					.then((response) => response.json())
					.then((responseJson) => {
						let key = '';
						Object.keys(responseJson.query.pages).forEach((el, index) => {
							if (index === 0) {
								key = el;
							}
						});
						let parsedText;
						if (responseJson.query.pages[key].extract.includes('<')) {
							parsedText = responseJson.query.pages[key].extract.replace(/<[^>]*>?/gm, '');
						} else {
							parsedText = responseJson.query.pages[key].extract;
						}
						queryTitle = queryTitle.replace(/ /g, '_');
						setWikiTitle(queryTitle);
						setSummary(parsedText.trim());
						setSpinner(false);
					});
			});
	};

	const openLinkOnPress = async (url) => {
		console.log(url);

		const supported = await Linking.canOpenURL(url);
		if (supported) {
			await Linking.openURL(url);
		}
	};

	useEffect(() => {
		fetchSummary();
	}, []);

	return (
		<View style={styles.centeredView}>
			<Modal
				animationType="slide"
				transparent={true}
				visible={true}
				onRequestClose={() => {
					Alert.alert('Modal has been closed.');
				}}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalTitle}>{title}</Text>
						{spinner ? (
							<ActivityIndicator />
						) : (
							<ScrollView>
								<Text>{summary}</Text>
							</ScrollView>
						)}

						<View style={{ paddingTop: 10 }} />
						{similar ? (
							<TouchableHighlight
								style={styles.relatedButton}
								onPress={() => {
									setRelated(true);
									showModal(false);
								}}
							>
								<Text style={styles.relatedText}>Find Related Movies</Text>
							</TouchableHighlight>
						) : null}

						<Text style={styles.linkText}>IMDB: </Text>
						<View style={styles.linkContainer}>
							<TouchableHighlight
								style={styles.linkButton}
								onPress={() => {
									openLinkOnPress(IMDB_URL);
								}}
							>
								<Text style={styles.textStyle}>Link</Text>
							</TouchableHighlight>
							<Text style={styles.linkText}>Wikipedia: </Text>
							<TouchableHighlight
								style={styles.linkButton}
								onPress={() => {
									openLinkOnPress(WIKI_LINK + wikiTitle);
								}}
							>
								<Text style={styles.textStyle}>Link</Text>
							</TouchableHighlight>
						</View>

						<TouchableHighlight
							style={styles.backButton}
							onPress={() => {
								showModal(false);
							}}
						>
							<Text style={styles.backText}>BACK</Text>
						</TouchableHighlight>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 10,
		padding: 35,
		height: '90%',
		width: '80%',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5
	},
	backButton: {
		backgroundColor: '#E0E0E0',
		borderRadius: 5,
		padding: 10,
		alignSelf: 'flex-start',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5
	},
	linkButton: {
		backgroundColor: '#1976D2',
		borderRadius: 5,
		padding: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5
	},
	relatedButton: {
		backgroundColor: 'white',
		borderWidth: 0.5,
		borderColor: '#1976D2',
		borderRadius: 5,
		padding: 10
	},
	relatedText: {
		color: '#1976D2',
		fontWeight: 'bold',
		textAlign: 'center'
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center'
	},
	modalTitle: {
		marginBottom: 15,
		textAlign: 'center',
		fontSize: 25
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
		fontSize: 20,
		paddingTop: 20
	},
	backText: {
		color: 'grey',
		fontWeight: 'bold',
		textAlign: 'center'
	},
	linkText: {
		paddingTop: 5
	}
});
