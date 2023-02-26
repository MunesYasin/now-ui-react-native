const initialState = {
    // Define your initial state here
    selected_user_id: null,
    selected_user_categouries: null
};

const selectUser = (state = initialState, action) => {
    switch (action.type) {
        case "select_user_from_my_list":
            return({
                ...state,
                ...action.payload
            })
            break;
        default:
            return state;
    }
};

export default selectUser;