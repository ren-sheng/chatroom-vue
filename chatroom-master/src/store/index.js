import { set } from 'core-js/core/dict';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store =  new Vuex.Store({
    state: {
        JWT: '',
        userId: '0',
        headImg: '',
        username: '',
        isGroup: false
    },
    mutations: {
        setJWT(state, jwt) {
            state.JWT = jwt;
        },
        setUserId(state, userId) {
            state.userId = userId;
        },
        setheadImg(state,headImg){
            state.headImg = headImg;
        },
        setUsername(state, username) {
            state.username = username;
        },
        setIsGroup(state, isGroup) {
            state.isGroup = isGroup;
        }
    },
    actions: {
        updateJWT({ commit }, jwt) {
            commit('setJWT', jwt);
        },
        updateUserId({ commit }, userId) {
            commit('setUserId', userId);
        },
        updateheadImg({ commit }, headImg) {
            commit('setheadImg', headImg)
        },
        updateUsername({ commit }, username) {
            commit('setUsername', username);
        },
        updateIsGroup({ commit }, isGroup) {
            commit('setIsGroup', isGroup);
        }
    },
    getters: {
        JWT: state => state.JWT,
        userId: state => state.userId,
        headImg: state => state.headImg,
        username: state => state.username,
        isGroup: state => state.isGroup
    }
});

export default store;