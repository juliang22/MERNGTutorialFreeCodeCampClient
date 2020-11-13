import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Grid, Transition } from 'semantic-ui-react'
import PostCard from '../components/PostCard'
import { AuthContext } from '../context/auth'
import PostForm from '../components/PostForm'
import { FETCH_POSTS_QUERY } from '../util/graphql'

export default function Home() {
	// destructuring loading and data obj, data obj being destructured to get the payload getPosts which is aliased to posts
	const { loading, data } = useQuery(FETCH_POSTS_QUERY);
	const { user } = useContext(AuthContext)
	return (
		<Grid columns={3}>
			<Grid.Row className="page-title">
				<h1>Recent Posts</h1>
			</Grid.Row>
			<Grid.Row>
				{user && (
					<Grid.Column>
						<PostForm />
					</Grid.Column>
				)}
				{loading ? (
					<h1>Loading posts..</h1>
				) : (
						<Transition.Group>
							{data.getPosts &&
								data.getPosts.map((post) => (
									<Grid.Column key={post.id} style={{ marginBottom: 20 }}>
										<PostCard post={post} />
									</Grid.Column>
								))}
						</Transition.Group>
					)}
			</Grid.Row>
		</Grid>
	);
}

