import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { Button, Confirm, Icon } from 'semantic-ui-react'
import { FETCH_POSTS_QUERY } from '../util/graphql'
import MyPopup from '../util/MyPopup'

export default function DeleteButton({ postId, commentId, callback }) {
	const [confirmOpen, setConfirmOpen] = useState(false)
	const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION // if we pass in a commentId then it we are trying to delete a comment
	const [deletePostOrMutation] = useMutation(mutation, {
		update(proxy, result) {
			setConfirmOpen(false) //closing modal
			if (!commentId) {
				const data = proxy.readQuery({
					query: FETCH_POSTS_QUERY
				})// remove post from cache
				const newGetPosts = data.getPosts.filter(post => post.id !== postId)
				const updatedData = { ...data, getPosts: newGetPosts }
				proxy.writeQuery({ query: FETCH_POSTS_QUERY, updatedData })
				if (callback) callback() //could be coming from POstcard which wont send a callback
			}
		},
		variables: {
			postId,
			commentId //will be ignored in deletePost
		}
	})
	return (
		<>
			<MyPopup
				content={commentId ? "Delete Comment" : "Delete Post"}
			>
				<Button
					as="div"
					color="red"
					onClick={() => setConfirmOpen(true)}
					floated="right"
				>
					<Icon name="trash" style={{ margin: 0 }} />
				</Button>
			</MyPopup>
			<Confirm
				open={confirmOpen}
				onCancel={() => setConfirmOpen(false)}
				onConfirm={deletePostOrMutation}
			/>
		</>
	)
}

const DELETE_POST_MUTATION = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`

const DELETE_COMMENT_MUTATION = gql`
	mutation deleteComment($postId: ID!, $commentId: ID!) {
		deleteComment(postId: $postId, commentId: $commentId) {
			id 
			comments {
				id 
				username
				createdAt 
				body
			}
			commentCount
		}
	}
`

