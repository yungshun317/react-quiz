import { useEffect } from "react";

function Timer({ dispatch, secondsRemaining }) {
    useEffect(function() {
        setInterval(function() {
            console.log("tick");
            dispatch({ type: "tick" })
        }, 1000);
    }, [dispatch]);

    return <div className="timer">{secondsRemaining}</div>;
}

export default Timer;