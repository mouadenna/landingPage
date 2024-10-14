import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getDatabase, ref, onValue, set } from "firebase/database";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey:  import.meta.env.VITE_apiKey,
  authDomain:  import.meta.env.VITE_authDomain,
  databaseURL: import.meta.env.VITE_databaseURL,
  projectId:  import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId:  import.meta.env.VITE_appId,
  measurementId:  import.meta.env.VITE_measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Simulated server state
interface Participant {
  name: string;
  score: number;
}

interface Question {
  question: string;
  choices: string[];
  correctAnswer: string;
}

let globalQuizState = {
  isActive: false,
  currentQuestion: null as Question | null,
  timeLeft: 0,
  participants: [] as Participant[],
};

// Simulated server functions
const startQuiz = () => {
  globalQuizState.isActive = true;
  globalQuizState.currentQuestion = questions[0];
  globalQuizState.timeLeft = 30;
};

const nextQuestion = () => {
  if (globalQuizState.currentQuestion) {
    const currentIndex = questions.findIndex(q => q.question === globalQuizState.currentQuestion!.question);
    if (currentIndex < questions.length - 1) {
      globalQuizState.currentQuestion = questions[currentIndex + 1];
      globalQuizState.timeLeft = 30;
    } else {
      globalQuizState.isActive = false;
      globalQuizState.currentQuestion = null;
    }
  }
};

const updateTime = () => {
  if (globalQuizState.timeLeft > 0) {
    globalQuizState.timeLeft -= 1;
  } else {
    nextQuestion();
  }
};

const questions: Question[] = [
  {
    question: "What is the capital of France?",
    choices: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris"
  },
  {
    question: "What is 2 + 2?",
    choices: ["3", "4", "5", "6"],
    correctAnswer: "4"
  },
  {
    question: "Who painted the Mona Lisa?",
    choices: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
    correctAnswer: "Leonardo da Vinci"
  }
];

const QuizInterface = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [localQuizState, setLocalQuizState] = useState(globalQuizState);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (globalQuizState.isActive) {
        updateTime();
      }
      setLocalQuizState({...globalQuizState});
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const adminRef = ref(database, 'adminMode');
    onValue(adminRef, (snapshot) => {
      setIsAdmin(snapshot.val());
    });
  }, []);

  const handleAdminToggle = (checked: boolean) => {
    setIsAdmin(checked);
    const adminRef = ref(database, 'adminMode');
    set(adminRef, checked);
  };

  const joinQuiz = () => {
    if (playerName && !globalQuizState.participants.some(p => p.name === playerName)) {
      globalQuizState.participants.push({ name: playerName, score: 0 });
    }
  };

  const submitAnswer = () => {
    if (localQuizState.currentQuestion && selectedAnswer === localQuizState.currentQuestion.correctAnswer) {
      const playerIndex = globalQuizState.participants.findIndex(p => p.name === playerName);
      if (playerIndex !== -1) {
        globalQuizState.participants[playerIndex].score += localQuizState.timeLeft * 10;
      }
    }
    setSelectedAnswer('');
  };

  const AdminPanel = () => (
    <div className="mb-4">
      <Button onClick={startQuiz} disabled={localQuizState.isActive}>Start Quiz</Button>
      <Button onClick={nextQuestion} disabled={!localQuizState.isActive} className="ml-2">Next Question</Button>
    </div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Real-time Multiple Choice Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="admin-mode"
                checked={isAdmin}
                onCheckedChange={handleAdminToggle}
              />
              <Label htmlFor="admin-mode">Admin Mode</Label>
            </div>
          </div>
          
          {isAdmin && <AdminPanel />}

          {!isAdmin && !localQuizState.isActive && (
            <div>
              <Input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="mb-2"
              />
              <Button onClick={joinQuiz} disabled={!playerName || globalQuizState.participants.some(p => p.name === playerName)}>
                Join Quiz
              </Button>
            </div>
          )}

          {localQuizState.isActive && (
            <div>
              <h2 className="text-xl font-bold mb-2">{localQuizState.currentQuestion?.question}</h2>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {localQuizState.currentQuestion?.choices.map((choice, index) => (
                  <Button
                    key={index}
                    onClick={() => setSelectedAnswer(choice)}
                    variant={selectedAnswer === choice ? "default" : "outline"}
                  >
                    {choice}
                  </Button>
                ))}
              </div>
              <Button onClick={submitAnswer} disabled={!selectedAnswer}>Submit Answer</Button>
              <p className="mt-2">Time left: {localQuizState.timeLeft} seconds</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Rank</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Score</th>
                </tr>
              </thead>
              <tbody>
                {localQuizState.participants.sort((a, b) => b.score - a.score).map((player, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{player.name}</td>
                    <td className="px-4 py-2">{player.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizInterface;
