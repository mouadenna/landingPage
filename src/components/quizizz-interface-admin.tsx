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
  apiKey:  import.meta.env.VITE_apiKey,
  authDomain:  import.meta.env.VITE_authDomain,
  databaseURL: import.meta.env.VITE_databaseURL,
  projectId:  import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId:  import.meta.env.VITE_appId,
  measurementId: import.meta.env.VITE_measurementId,
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

const questions = [
  {
      question: "The word 'racecar' is spelled the same forwards and backwards.",
      choices: ["FALSE", "TRUE"],
      correctAnswer: "TRUE"
  },
  {
      question: "37, 34, 31, 28 - Which number should come next in the pattern?",
      choices: ["27", "23", "24", "25"],
      correctAnswer: "25"
  },
  {
      question: "What will be the output of this string manipulation?\n\ns = \"abcdefg\"\n\nprint(s[::-2])",
      choices: ["gda", "Error", "gfedcba", "fdcba"],
      correctAnswer: "gda"
  },
  {
      question: "What number best completes the analogy:\n8:4 as 10:",
      choices: ["7", "3", "24", "5"],
      correctAnswer: "5"
  },
  {
      question: "1,3,5,7,8,9,11 - which one doesn't belong to this series?",
      choices: ["8", "3", "5", "1"],
      correctAnswer: "8"
  },
  {
      question: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies?",
      choices: ["False", "I Don't know", "True"],
      correctAnswer: "True"
  },
  {
      question: "2,4,8,16,32,64 .. What is next?",
      choices: ["90", "100", "132", "128"],
      correctAnswer: "128"
  },
  {
      question: "Hakimi, who is sixteen years old, is four times as old as his sister. How old will Hakimi be when he is twice as old as his sister?",
      choices: ["24", "25", "I don't know", "20"],
      correctAnswer: "24"
  },
  {
      question: "What is 1/2 of 1/4 of 1/5 of 200?",
      choices: ["5", "10", "50", "25"],
      correctAnswer: "5"
  },
  {
      question: "If all bloopers are hoopers and all hoopers are loopers, are all bloopers definitely loopers?",
      choices: ["True", "False"],
      correctAnswer: "True"
  },
  {
      question: "If you are in a race and you pass the person in second place, what place are you in?",
      choices: ["2nd", "1st", "3rd", "4th"],
      correctAnswer: "2nd"
  },
  {
      question: "What was the tallest mountain before Mt. Everest was discovered?",
      choices: ["Mt. Fuji", "Mt. Everest", "Gurla Mandhata", "Kilimanjaro"],
      correctAnswer: "Mt. Everest"
  },
  {
      question: "What does 'talincta' rearranged spell?",
      choices: ["a city", "a theme park", "an ocean", "a country"],
      correctAnswer: "an ocean"
  },
  {
      question: "Which one is least like the four?",
      choices: ["human", "cat", "snake", "dog"],
      correctAnswer: "snake"
  },
  {
      question: "564738273472834481936237225455 backwards is",
      choices: [
          "554522732639148438274372837465",
          "7746562635435436545362153673537",
          "5546765454443256865654324632567",
          "5546765454443256865654323232 567"
      ],
      correctAnswer: "554522732639148438274372837465"
  },
  {
      question: "Which of the following is used to insert a comment in Python?",
      choices: ["#", "/* */", "//", "<!-- -->"],
      correctAnswer: "#"
  },
  {
      question: "What is the output of the following code?\n\nfor i in range(3):\n    for j in range(i):\n        print(i, j)",
      choices: ["102021", "Error", "112022", "001122"],
      correctAnswer: "102021"
  },
  {
      question: "What syntax can you use to insert a line break between strings so that they appear over multiple lines?",
      choices: ["/n", "*", "/b", "/"],
      correctAnswer: "/n"
  },
  {
      question: "Is Python an interpreter or compiler programming language?",
      choices: ["interpreter", "compiler"],
      correctAnswer: "interpreter"
  },
  {
      question: "What does 'HTTP' stand for?",
      choices: ["HyperText Transfer Protocol", "HighText Transfer Protocol", "HyperText Transmission Protocol", "HyperTransfer Text Protocol"],
      correctAnswer: "HyperText Transfer Protocol"
  },
  {
      question: "Which data type is used to store true/false values in Python?",
      choices: ["int", "bool", "str", "list"],
      correctAnswer: "bool"
  },
  {
      question: "What is the time complexity of binary search in a sorted array?",
      choices: ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
      correctAnswer: "O(log n)"
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
          <CardTitle className="text-3xl font-bold text-blue-300">ICE BREAKER</CardTitle>
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
