import React, { useReducer, createContext } from 'react'
import jwtDecode from 'jwt-decode'

const initialState = { user: null }
const token = localStorage.getItem('jwtToken')
if (token) {
	const decodedToken = jwtDecode(token)
	if (decodedToken.exp * 1000 < Date.now) { //checking expiration date of decoded token
		localStorage.removeItem('jwtToken')
	} else {
		initialState.user = decodedToken
	}
}

const AuthContext = createContext({
	user: null,
	login: (data) => { },
	logout: () => { }
})

//creating reducer - receives an action with a type and a payload and determines what to do with it 
function authReducer(state, action) {
	switch (action.type) {
		case 'LOGIN': {
			return {
				...state,
				user: action.payload
			}
		}
		case "LOGOUT":
			return {
				...state,
				user: null
			}
		default: return state
	}
}

function AuthProvider(props) {
	const [state, dispatch] = useReducer(authReducer, initialState) // Takes in our reducer and initial state
	// dipatch is used to dispatch action with type and payload which then this passes in reducer listens for it and performs any action according to the dispatched action

	//We want to call this function when logging in => this then changes the data in our context
	function login(userData) {
		localStorage.setItem("jwtToken", userData.token) //persisting token so refresh doesnt logout user
		dispatch({
			type: 'LOGIN',
			payload: userData
		})
	}

	function logout() {
		localStorage.removeItem('jwtToken')
		dispatch({
			type: 'LOGOUT',
		})
	}
	//{...props} in case we get props from top-down components that need to be passed down
	return (
		<AuthContext.Provider value={{ user: state.user, login, logout }} {...props} />
	)
}

export { AuthContext, AuthProvider }