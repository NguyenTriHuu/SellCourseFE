import {
    SET_ACCESSTOKEN,
    SET_ROLES,
    SET_USERNAME,
    SET_PASSWORD,
    SET_AUTHORIZED,
    SET_ISAUTHENTICATED,
    SET_IDLESSON,
    SET_EXERCISE,
} from './constants';
const initState = {
    roles: [],
    isAuthenticated: false,
    accessToken: {},
    authorized: [],
    userName: '',
    passWord: '',
    idLesson: '',
    exercise: [],
};

function reducer(state, action) {
    switch (action.type) {
        case SET_ACCESSTOKEN:
            return {
                ...state,
                accessToken: action.payload,
            };
        case SET_ROLES:
            return {
                ...state,
                roles: action.payload,
            };

        case SET_AUTHORIZED:
            return {
                ...state,
                authorized: action.payload,
            };
        case SET_ISAUTHENTICATED:
            return {
                ...state,
                isAuthenticated: action.payload,
            };
        case SET_USERNAME:
            return {
                ...state,
                userName: action.payload,
            };
        case SET_PASSWORD:
            return {
                ...state,
                passWord: action.payload,
            };
        case SET_IDLESSON:
            return {
                ...state,
                idLesson: action.payload,
            };

        case SET_EXERCISE:
            return {
                ...state,
                exercise: action.payload,
            };

        default:
            throw new Error('Invalid action');
    }
}

export default reducer;
export { initState };
