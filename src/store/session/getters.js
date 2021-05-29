export function getUsername(state) {
    return state.username;
}

export function getName(state) {
    return state.username;
}

export function isAuth(state) {
    return state.authToken && state.authToken.length > 0;
}