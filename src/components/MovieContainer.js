import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, FlatList } from 'react-native';
import { gql, useQuery, NetworkStatus } from '@apollo/client';

import MovieCard from './MovieCard';

const MOVIE_QUERY = gql`
	query getMovies($cursor: String, $search: String) {
		movies {
			search(term: $search, first: 10, after: $cursor) {
				edges {
					node {
						similar(first: 10) {
							edges {
								node {
									title
									releaseDate
									details {
										genres {
											name
											id
										}
										imdbID
									}
									id
									rating
								}
							}
						}
						title
						releaseDate
						details {
							genres {
								name
								id
							}
							imdbID
						}
						id
						rating
					}
					cursor
				}
				pageInfo {
					startCursor
					endCursor
					hasNextPage
					hasPreviousPage
				}
			}
		}
	}
`;

export default function MovieContainer({ search, isRelated, setRelated }) {
	const [ similarData, setSimilar ] = useState(null);
	const [ spinner, setSpinner ] = useState(true);
	const [ relatedTitle, setRelatedTitle ] = useState(true);
	let filteredData;

	const renderItem = ({ item: { node } }) => {
		return (
			<MovieCard
				data={node}
				setRelated={setRelated}
				setSimilar={setSimilar}
				isRelated={isRelated}
				setRelatedTitle={setRelatedTitle}
				relatedTitle={relatedTitle}
			/>
		);
	};

	const { loading, error, data, fetchMore } = useQuery(MOVIE_QUERY, {
		errorPolicy: 'ignore',
		variables: { search }
	});
	// Loading is always false on fetchmore :(
	console.log(loading);

	//  IMPORTANT: Cleans broken nodes, allows the application to keep running when scrolling, important for when the server returns null nodes
	if (data) {
		if (isRelated) {
			filteredData = similarData.filter((el) => {
				return el.node !== null;
			});
		} else {
			filteredData = data.movies.search.edges.filter((el) => {
				return el.node !== null;
			});
		}
	}
	console.log(filteredData);

	if (loading)
		return (
			<View style={{ paddingTop: 50 }}>
				<ActivityIndicator />
			</View>
		);
	if (!filteredData || filteredData.length === 0) {
		return <Text style={styles.noResultText}>No results found</Text>;
	}
	return (
		<View style={styles.container}>
			<FlatList
				data={filteredData}
				renderItem={renderItem}
				contentContainerStyle={isRelated ? { paddingBottom: 200 } : { paddingBottom: 250 }}
				keyExtractor={(item) => item.node.id.toString()}
				onEndReachedThreshold={0.1}
				ListFooterComponent={
					!isRelated && spinner ? (
						<View style={{ paddingTop: 50 }}>
							<ActivityIndicator color="blue" />
						</View>
					) : null
				}
				onEndReached={() => {
					fetchMore({
						variables: {
							cursor: data.movies.search.pageInfo.endCursor
						},
						updateQuery: (previousResult, { fetchMoreResult }) => {
							const newEdges = fetchMoreResult.movies.search.edges;
							// const pageInfo = fetchMoreResult.movies.search.pageInfo;
							console.log(newEdges);

							return newEdges.length
								? {
										...fetchMoreResult,
										...previousResult,
										movies: {
											...fetchMoreResult.movies,
											...previousResult.movies,
											search: {
												...fetchMoreResult.movies.search,
												...previousResult.movies.search,
												pageInfo: {
													...fetchMoreResult.movies.search.pageInfo
												},
												edges: [
													...previousResult.movies.search.edges,
													...fetchMoreResult.movies.search.edges
												]
											}
										}
									}
								: previousResult;
						}
					}).catch((e) => {
						console.log(e);
						setSpinner(false);
					});
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 10
	},
	noResultText: {
		textAlign: 'center',
		paddingTop: 50
	}
});
