import Options from "./Options";

function Question({ question }) {
    console.log(question);
    // {question: 'Which is the most popular JavaScript framework?', options: Array(4), correctOption: 1, points: 10, id: 'b8ac'}

    return <div>
        <h4>{question.question}</h4>
        <Options question={question} />
    </div>
}

export default Question;