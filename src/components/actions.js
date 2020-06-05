import dataJson from './data.json'

export const getWeeksData = () => dispatch => {
    dispatch({type: 'SET_DATA', payload: dataJson})
}
