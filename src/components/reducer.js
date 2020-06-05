const weeksData = (state = {}, action) => {
    switch (action.type){
        case 'SET_DATA':{
            return action.payload;
        }

        default:
            return state;

    }

};

export {weeksData} ;