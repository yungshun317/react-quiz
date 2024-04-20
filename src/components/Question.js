import Options from "./Options";

function Question({ question, dispatch, answer }) {
    console.log(question);
    // {question: 'Which is the most popular JavaScript framework?', options: Array(4), correctOption: 1, points: 10, id: 'b8ac'}

    return <div>
        <h4>{question.question}</h4>
        <Options question={question} dispatch={dispatch} answer={answer} />
    </div>
}

export default Question;