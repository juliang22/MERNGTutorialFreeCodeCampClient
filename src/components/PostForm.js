import React from 'react'
import { Form, Button } from 'semantic-ui-react'
import { useForm } from '../util/hooks'
import gql from 'graphql-tag'
import { useMutation } from "@apollo/client"
import { FETCH_POSTS_QUERY } from '../util/graphql'

export default function PostForm() {
	const { values, onChange, onSubmit } = useForm(creatPostCallback, {
		body: ''
	})

	const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
		variables: values,
		update(proxy, result) {
			const data = proxy.readQuery({ //gets all the data in our cache
				query: FETCH_POSTS_QUERY,
			});
			proxy.writeQuery({ //persists change
				query: FETCH_POSTS_QUERY,
				data: {
					getPosts: [result.data.createPost, ...data.getPosts], //adding new post to getPosts
				},
			});
			values.body = "";
		},
		onError(err) {
			return err;
		},
	});

	function creatPostCallback() {
		createPost()
	}

	return (
		<>
			<Form onSubmit={onSubmit}>
				<h2>Create a post:</h2>
				<Form.Field>
					<Form.Input
						placeholder="hi world"
						name="body"
						value={values.body}
						onChange={onChange}
						error={error ? true : false}
					/>
					<Button type="submit" color="teal">
						Submit
				</Button>
				</Form.Field>
			</Form>
			{error && (
				<div className="ui error message" style={{ marginBottom: 20 }}>
					<ul className="list">
						<li>{error.graphQLErrors[0].message}</li>
					</ul>
				</div>
			)}
		</>
	)
}

const CREATE_POST_MUTATION = gql`
	mutation createPost($body: String!) {
		createPost(body: $body)	{
			id body createdAt username
			likes {
				id username createdAt
			}
			likeCount
			comments {
				id body username, createdAt
			}
			commentCount
		}
	}
`