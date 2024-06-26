import DateCounter from "./DateCounter";
import Header from "./Header";
import Main from "./Main";
import { useEffect, useReducer } from "react";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SECS_PER_QUESTION = 30;

const initialState = {
    questions: [],

    // 'loading', 'error', 'ready', 'active', 'finished'
    status: "loading",
    index: 0,
    answer: null,
    points: 0,
    highscore: 0,
    secondsRemaining: null
};

function reducer(state, action) {
    switch(action.type) {
        case "dataReceived":
            return {
                ...state,
                questions: action.payload,
                status: "ready"
            }
        case "dataFailed":
            return {
                ...state,
                status: "error"
            }
        case "start":
            return { ...state, status: "active", secondsRemaining: state.questions.length * SECS_PER_QUESTION }
        case "newAnswer":
            const question = state.questions.at(state.index);

            return {
                ...state,
                answer: action.payload,
                points:
                    action.payload === question.correctOption
                        ? state.points + question.points
                        : state.points
            };
        case "nextQuestion":
            return { ...state, index: state.index + 1, answer: null };
        case "finish":
            return { ...state, status: "finished", highscore: state.points > state.highscore ? state.points : state.highscore }
        case "restart":
            return { ...initialState, questions: state.questions, status: "ready" };
            // return { ...state, points: 0, highscore: 0, index: 0, answer: null, status: "ready" };
        case "tick":
            return { ...state, secondsRemaining: state.secondsRemaining - 1, status: state.secondsRemaining === 0 ? "finished" : state.status };
        default:
            throw new Error("Action unknown");
    }
}

export default function App() {
    const [{ questions, status, index, answer, points, highscore, secondsRemaining }, dispatch] = useReducer(reducer, initialState);

    const numQuestions = questions.length;
    const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0);

    useEffect(function() {
        fetch("http://localhost:8000/questions")
            .then((res) => res.json())
            .then((data) => dispatch({ type: "dataReceived", payload: data }))
            .catch((err) => dispatch({ type: "dataFailed" }));
    }, []);
    /*
    Array(15)
        0: {question: 'Which is the most popular JavaScript framework?', options: Array(4), correctOption: 1, points: 10, id: 'f1c0'}
        1: {question: 'Which company invented React?', options: Array(4), correctOption: 3, points: 10, id: 'ca1f'}
        2: {question: "What's the fundamental building block of React apps?", options: Array(4), correctOption: 0, points: 10, id: 'aad7'}
        3: {question: "What's the name of the syntax we use to describe the UI in React components?", options: Array(4), correctOption: 2, points: 10, id: 'a66c'}
        4: {question: 'How does data flow naturally in React apps?', options: Array(4), correctOption: 0, points: 10, id: '7f8b'}
        5: {question: 'How to pass data into a child component?', options: Array(4), correctOption: 1, points: 10, id: 'a7d1'}
        6: {question: 'When to use derived state?', options: Array(4), correctOption: 3, points: 30, id: '8109'}
        7: {question: 'What triggers a UI re-render in React?', options: Array(4), correctOption: 2, points: 20, id: 'aad9'}
        8: {question: 'When do we directly "touch" the DOM in React?', options: Array(4), correctOption: 3, points: 20, id: '4692'}
        9: {question: 'In what situation do we use a callback to update state?', options: Array(4), correctOption: 3, points: 30, id: 'adcd'}
        10: {question: 'If we pass a function to useState, when will that function be called?', options: Array(4), correctOption: 2, points: 30, id: '11aa'}
        11: {question: "Which hook to use for an API request on the component's initial render?", options: Array(4), correctOption: 1, points: 10, id: '58f0'}
        12: {question: 'Which variables should go into the useEffect dependency array?', options: Array(4), correctOption: 2, points: 30, id: 'fdec'}
        13: {question: 'An effect will always run on the initial render.', options: Array(4), correctOption: 0, points: 30, id: '5d73'}
        14: {question: "When will an effect run if it doesn't have a dependency array?", options: Array(4), correctOption: 3, points: 20, id: '23c8'}
        length: 15
        [[Prototype]]: Array(0)
    */

    return (
        <div className="app">
            <Header/>

            <Main>
                {status === "loading" && <Loader />}
                {status === "error" && <Error />}
                {status === "ready" && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
                {status === "active" && (
                    <>
                        <Progress index={index} numQuestions={numQuestions} points={points} maxPossiblePoints={maxPossiblePoints} answer={answer} />
                        <Question question={questions[index]} dispatch={dispatch} answer={answer} />
                        <Footer>
                            <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
                            <NextButton dispatch={dispatch} answer={answer} numQuestions={numQuestions} index={index} />
                        </Footer>
                    </>
                )}
                {status === "finished" && <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} highscore={highscore} dispatch={dispatch} />}
            </Main>
        </div>
    )
    { /*
    return <div>
               <DateCounter />
           </div>
    */ }
}