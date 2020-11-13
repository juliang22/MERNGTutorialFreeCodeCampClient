import React, { useState, useContext } from 'react'
import { Form, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { useForm } from '../util/hooks'
import { AuthContext } from '../context/auth'

export default function Register(props) {
	const context = useContext(AuthContext)
	const [errors, setErrors] = useState({})

	const { onChange, onSubmit, values } = useForm(registerUser, { //normally would pass in addUser, but that isn't declared till later, but if we move it under then values won't be recognized in the mutation => workaround is to put it in another function 
		username: "",
		password: "",
		email: "",
		confirmPassword: ""
	})
	const [addUser, { loading }] = useMutation(REGISTER_USER, {
		// destructuring result into data.register and renaming it userData
		update(proxy, { data: { register: userData } }) { //triggers update if mutation is successful, proxy is metadata, result is the result of the mutation
			context.login(userData)
			props.history.push('/') //redirects back to home page
		},
		onError(err) {
			setErrors(err.graphQLErrors[0].extensions.exception.errors) //graphQLErrors is the object thrown from the our server code if theres an error, it can hold multiple errors, but we wrote it that it returns one, hence the [0]
		},
		variables: values //variables being sent into mutation
	})

	function registerUser() {
		addUser()
	}

	return (
		<div className="form-container">
			<Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
				<h1>Register</h1>
				<Form.Input label="Username"
					placeholder="Username"
					name="username"
					value={values.username}
					onChange={onChange}
					error={errors.username ? true : false} //highlights the field if there is an error
					type="text">
				</Form.Input>
				<Form.Input label="Email"
					placeholder="Email"
					name="email"
					value={values.email}
					onChange={onChange}
					error={errors.email ? true : false}
					type="text">
				</Form.Input>
				<Form.Input label="Password"
					placeholder="Password"
					name="password"
					value={values.password}
					onChange={onChange}
					error={errors.password ? true : false}
					type="password">
				</Form.Input>
				<Form.Input label="Confirm Password"
					placeholder="Confirm Password"
					name="confirmPassword"
					value={values.confirmPassword}
					onChange={onChange}
					error={errors.confirmPassword ? true : false}
					type="password">
				</Form.Input>
				<Button type="submit" primary>
					Register
				</Button>
			</Form>
			{Object.keys(errors).length > 0 && ( //checking if there are errors, if there are then map through them
				<div className="ui error message" >
					<ul className="list">
						{Object.values(errors).map(val => (
							<li key={val}>{val}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;