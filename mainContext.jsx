import React, { createContext, useContext, useEffect, useState } from "react";
export const MainContext = createContext();
function GlobalState(props) {

    const [userID, setUserID] = useState(null)
    const changeUserID = (id) => {
        setUserID(id)
    }
    const state = {

        changeUserID,
        userID
    };
    return (
        <MainContext.Provider value={state}>
            {props.children}
        </MainContext.Provider>
    );
}
export default GlobalState;
