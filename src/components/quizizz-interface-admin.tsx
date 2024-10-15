import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue,  get, update } from 'firebase/database';
import Cookies from 'js-cookie';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQCAsgIwi8m_soYbnBN5XVUcs1qNT_5Io",
  authDomain: "passwordgame1.firebaseapp.com",
  databaseURL: "https://passwordgame1-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "passwordgame1",
  storageBucket: "passwordgame1.appspot.com",
  messagingSenderId: "813385507628",
  appId: "1:813385507628:web:03c3f9187e95f4401c0289",
  measurementId: "G-LY3QF8X1FN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

interface Participant {
  name: string;
  score: number;
  hasSubmitted: boolean;
  avatar: string;
}

interface Question {
  question: string;
  choices: string[];
  correctAnswer: string;
}

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

const QuizInterfaceAdmin: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [quizState, setQuizState] = useState({
    isActive: false,
    currentQuestion: null as Question | null,
    timeLeft: 0,
    participants: [] as Participant[],
    currentQuestionIndex: 0,
    questionStartTime: 0,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [localTimeLeft, setLocalTimeLeft] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasSubmittedRef = useRef(false);

  const updateQuizState = useCallback((newState: Partial<typeof quizState>) => {
    update(ref(database, 'quizState'), newState);
  }, []);

  useEffect(() => {
    const quizStateRef = ref(database, 'quizState');
    const unsubscribe = onValue(quizStateRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setQuizState(prevState => ({
          ...prevState,
          ...data,
        }));
        if (data.questionStartTime) {
          const elapsedTime = Math.floor((Date.now() - data.questionStartTime) / 1000);
          const remainingTime = Math.max(0, data.timeLeft - elapsedTime);
          setLocalTimeLeft(remainingTime);
        }
        if (data.currentQuestionIndex !== quizState.currentQuestionIndex) {
          hasSubmittedRef.current = false;
          setSelectedAnswer('');
        }
      }
    });

    const savedUsername = Cookies.get('quizUsername');
    if (savedUsername) {
      setPlayerName(savedUsername);
      setIsJoined(true);
    }

    return () => unsubscribe();
  }, [quizState.currentQuestionIndex]);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (quizState.isActive && localTimeLeft > 0) {
      timerRef.current = setInterval(() => {
        setLocalTimeLeft((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizState.isActive, localTimeLeft]);

  const startQuiz = () => {
    const startTime = Date.now();
    updateQuizState({
      isActive: true,
      currentQuestion: questions[0],
      timeLeft: 30,
      currentQuestionIndex: 0,
      questionStartTime: startTime,
      participants: quizState.participants.map(p => ({ ...p, hasSubmitted: false })),
    });
  };

  const nextQuestion = () => {
    const nextIndex = quizState.currentQuestionIndex + 1;
    const startTime = Date.now();
    if (nextIndex < questions.length) {
      updateQuizState({
        currentQuestion: questions[nextIndex],
        timeLeft: 30,
        currentQuestionIndex: nextIndex,
        questionStartTime: startTime,
        participants: quizState.participants.map(p => ({ ...p, hasSubmitted: false })),
      });
    } else {
      updateQuizState({
        isActive: false,
        currentQuestion: null,
        currentQuestionIndex: 0,
        questionStartTime: 0,
      });
    }
  };

  const joinQuiz = async () => {
    if (!playerName) {
      setErrorMessage('Please enter a name.');
      return;
    }

    const participantsRef = ref(database, 'quizState/participants');
    const snapshot = await get(participantsRef);
    const participants = snapshot.val() || [];

    if (participants.some((p: Participant) => p.name.toLowerCase() === playerName.toLowerCase())) {
      setErrorMessage('This name is already taken. Please choose another.');
      return;
    }

    const avatar = `https://api.dicebear.com/6.x/avataaars/svg?seed=${playerName}`;
    const newParticipant: Participant = { name: playerName, score: 0, hasSubmitted: false, avatar };
    const newParticipants = [...participants, newParticipant];
    updateQuizState({ participants: newParticipants });
    setErrorMessage('');
    setIsJoined(true);
    
    Cookies.set('quizUsername', playerName, { expires: 7 });
  };

  const submitAnswer = async () => {
    if (hasSubmittedRef.current) {
      setErrorMessage('You have already submitted an answer for this question.');
      return;
    }

    const playerIndex = quizState.participants.findIndex(p => p.name === playerName);
    if (playerIndex === -1) {
      setErrorMessage('Player not found.');
      return;
    }

    const participantRef = ref(database, `quizState/participants/${playerIndex}`);
    const snapshot = await get(participantRef);
    const participant = snapshot.val();

    if (participant.hasSubmitted) {
      setErrorMessage('You have already submitted an answer for this question.');
      hasSubmittedRef.current = true;
      return;
    }

    let newScore = participant.score;
    if (quizState.currentQuestion && selectedAnswer === quizState.currentQuestion.correctAnswer) {
      newScore += Math.max(0, localTimeLeft * 10);
    }

    await update(participantRef, {
      score: newScore,
      hasSubmitted: true
    });

    setSelectedAnswer('');
    setErrorMessage('');
    hasSubmittedRef.current = true;
  };

  const AdminPanel: React.FC = () => (
    <div className="mb-4">
      <Button onClick={startQuiz} disabled={quizState.isActive} className="bg-blue-600 hover:bg-blue-700 text-white mr-2">Start Quiz</Button>
      <Button onClick={nextQuestion} disabled={!quizState.isActive} className="bg-blue-600 hover:bg-blue-700 text-white">Next Question</Button>
    </div>
  );

  const leaveQuiz = () => {
    Cookies.remove('quizUsername');
    setPlayerName('');
    setIsJoined(false);
    const newParticipants = quizState.participants.filter(p => p.name !== playerName);
    updateQuizState({ participants: newParticipants });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto  min-h-screen text-white">
      <Card className="mb-4 bg-gray-900 text-white border-blue-500">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-blue-300">Real-time Multiple Choice Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <Switch id="admin-mode" checked={isAdmin} onCheckedChange={setIsAdmin} />
              <Label htmlFor="admin-mode" className="text-blue-300">Admin Mode</Label>
            </div>
          </div>
          
          {isAdmin && <AdminPanel />}

          {!isAdmin && !quizState.isActive && !isJoined && (
            <div>
              <Input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="mb-2 bg-gray-800 text-white border-blue-500"
              />
              <Button onClick={joinQuiz} disabled={!playerName} className="bg-blue-600 hover:bg-blue-700 text-white">Join Quiz</Button>
              {errorMessage && <p className="text-red-400 mt-2">{errorMessage}</p>}
            </div>
          )}

          {!isAdmin && !quizState.isActive && isJoined && (
            <div>
              <div className="flex items-center mb-2">
                <img src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${playerName}`} alt="Avatar" className="w-10 h-10 rounded-full mr-2" />
                <p className="text-lg font-semibold text-blue-300">Welcome, {playerName}!</p>
              </div>
              <p className="text-blue-200">Waiting for the quiz to start...</p>
              <Button onClick={leaveQuiz} className="mt-2 bg-red-600 hover:bg-red-700 text-white">Leave Quiz</Button>
            </div>
          )}

          {quizState.isActive && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-blue-300">{quizState.currentQuestion?.question}</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {quizState.currentQuestion?.choices.map((choice, index) => (
                  <Button
                    key={index}
                    onClick={() => setSelectedAnswer(choice)}
                    variant={selectedAnswer === choice ? "default" : "outline"}
                    className={`${selectedAnswer === choice ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-300'} hover:bg-blue-700 transition-colors`}
                    disabled={hasSubmittedRef.current}
                  >
                    {choice}
                  </Button>
                ))}
              </div>
              <Button 
                onClick={submitAnswer} 
                disabled={!selectedAnswer || hasSubmittedRef.current}
                className="bg-green-600 hover:bg-green-700 text-white transition-colors"
              >
                Submit Answer
              </Button>
              {errorMessage && <p className="text-red-400 mt-2">{errorMessage}</p>}
              <p className="mt-4 text-xl font-semibold text-blue-300">Time left: {localTimeLeft} seconds</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-900 text-white border-blue-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-300">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue-500">
                  <th className="px-4 py-2 text-left text-blue-300">Rank</th>
                  <th className="px-4 py-2 text-left text-blue-300">Avatar</th>
                  <th className="px-4 py-2 text-left text-blue-300">Name</th>
                  <th className="px-4 py-2 text-left text-blue-300">Score</th>
                </tr>
              </thead>
              <tbody>
                {quizState.participants.sort((a, b) => b.score - a.score).map((player, index) => (
                  <tr key={index} className={`border-b border-blue-500 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}`}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">
                      <img src={player.avatar} alt={`${player.name}'s avatar`} className="w-8 h-8 rounded-full" />
                    </td>
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

export default QuizInterfaceAdmin;
