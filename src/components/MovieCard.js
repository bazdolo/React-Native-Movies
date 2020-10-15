import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import DetailModal from './DetailModal';

export default function MovieCard({
	data: { title, rating, details, id, releaseDate, similar },
	setRelated,
	setSimilar,
	isRelated,
	setRelatedTitle,
	relatedTitle
}) {
	const [ modal, showModal ] = useState(false);

	return (
		<View>
			<TouchableOpacity
				style={styles.container}
				onPress={() => {
					showModal(true);
					if (similar) setSimilar(similar.edges);
					setRelatedTitle(title);
				}}
			>
				{isRelated ? <Text style={styles.relatedText}>Related to {relatedTitle}</Text> : null}
				<Text style={styles.title}>{title}</Text>
				<View style={styles.category}>
					{details.genres.map((el) => (
						<Text style={styles.text} key={el.id}>
							{el.name}{' '}
						</Text>
					))}
				</View>
				<Text>Rating: {rating}</Text>
			</TouchableOpacity>
			{modal ? (
				<DetailModal
					showModal={showModal}
					title={title}
					imdbID={details.imdbID}
					releaseDate={releaseDate}
					setRelated={setRelated}
					similar={similar}
				/>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		height: 120,
		backgroundColor: 'white',
		borderTopColor: 'grey',
		borderTopWidth: 0.5,
		borderBottomColor: 'grey',
		borderBottomWidth: 0.5
	},
	category: {
		display: 'flex',
		flexDirection: 'row'
	},
	text: {
		fontFamily: 'Helvetica'
	},
	title: {
		fontWeight: '600',
		fontFamily: 'Helvetica'
	},
	relatedText: {
		color: 'green',
		fontWeight: '600'
	}
});
