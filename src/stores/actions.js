import {
    SET_ACCESSTOKEN,
    SET_AUTHORIZED,
    SET_ISAUTHENTICATED,
    SET_PASSWORD,
    SET_ROLES,
    SET_USERNAME,
    SET_IDLESSON,
    SET_EXERCISE,
} from './constants';

export const setAccessToken = (payload) => ({
    type: SET_ACCESSTOKEN,
    payload,
});
export const setUserName = (payload) => ({
    type: SET_USERNAME,
    payload,
});
export const setPassword = (payload) => ({
    type: SET_PASSWORD,
    payload,
});
export const setAuthorized = (payload) => ({
    type: SET_AUTHORIZED,
    payload,
});
export const setIsAuthenticated = (payload) => ({
    type: SET_ISAUTHENTICATED,
    payload,
});
export const setRoles = (payload) => ({
    type: SET_ROLES,
    payload,
});
export const setIdLesson = (payload) => ({
    type: SET_IDLESSON,
    payload,
});
export const setExercise = (payload) => ({
    type: SET_EXERCISE,
    payload,
});
