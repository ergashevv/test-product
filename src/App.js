import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Progress, message } from "antd";
import "./App.css";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    // API orqali savollarni olish
    axios
      .get("https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple")
      .then((response) => {
        console.log(response, 'response');
        const formattedQuestions = response.data.results.map((q) => ({
          question: q.question,
          answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
          correctAnswer: q.correct_answer,
        }));
        setQuestions(formattedQuestions);
        setLoading(false);
      })
      .catch((error) => {
        message.error("Savollarni yuklashda xatolik yuz berdi!");
        console.error(error);
      });
  }, []);

  const handleAnswer = (answer) => {
    if (answer === questions[currentIndex].correctAnswer) {
      setScore(score + 1);
      message.success("To'g'ri javob!");
    } else {
      message.error("Noto'g'ri javob.");
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
    } else {
      setFinished(true);
    }
  };

  if (loading) return <div className="loading">Savollar yuklanmoqda...</div>;

  if (finished) {
    return (
      <div className="result-container">
        <Card className="result-card">
          <h1>Natijalar</h1>
          <p>
            Siz {questions.length} savoldan {score} ta to‘g‘ri javob berdingiz.
          </p>
          <Progress
            percent={(score / questions.length) * 100}
            status="active"
            strokeColor="#52c41a"
          />
          <Button type="primary" onClick={() => window.location.reload()}>
            Qayta boshlash
          </Button>
        </Card>
      </div>
    );
  }

  console.log(questions, 'questions');

  return (
    <div className="test-container">
      <Card className="question-card">
        <h2>
          {currentIndex + 1}. {questions[currentIndex].question}
        </h2>
        <div className="answers">
          {questions[currentIndex].answers.map((answer, index) => (
            <Button
              key={index}
              className="answer-button"
              onClick={() => handleAnswer(answer)}
            >
              {answer}
            </Button>
          ))}
        </div>
        <Progress
          percent={((currentIndex + 1) / questions.length) * 100}
          status="active"
        />
      </Card>
    </div>
  );
};

export default App;