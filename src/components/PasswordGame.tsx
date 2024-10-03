import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Timer, Trophy, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, query, orderByChild, limitToLast, get, set } from "firebase/database";

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

// Types
type Rule = {
  id: number;
  text: string;
  points: number;
  check: (pwd: string) => boolean;
};

type LeaderboardEntry = {
  name: string;
  score: number;
};

type PlayerData = {
  name: string;
  phoneNumber: string;
  triesLeft: number;
  currentScore: number;
  lastAttemptTime?: number;
};

// Constants
const GAME_TIME = 3600; // 1 hour in seconds
const MAX_TRIES = 3;
const TRIES_RESET_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds



const rules: Rule[] = [
  { id: 1, text: "The encrypted code 'htij' must be included in the  password, but to decrypt it, you'll need to find the President of Code and request the encryption key from her to unlock the code's true meaning.", points: 5, check: (pwd: string) => pwd.toLowerCase().includes('code') },
  { id: 2, text: "there's a QR code that has code esi logo somewhere in the school (first stage only) , find it and write the name hidden in the QR code", points: 10, check: (pwd: string) => pwd.toLowerCase().includes('huggingface')  },
  { id: 3, text: "Find the missing number in this sequence: 7 9 5 11     4 15 12 7       13 8 11 _?. Once you've solved the pattern, include the missing number in your password", points: 10, check: (pwd: string) => pwd.toLowerCase().includes('10') },
  { id: 4, text: "find the meaning of life in one of the boards members quotes in the badges and write it in computer language", points: 15, check: (pwd: string) => pwd.toLowerCase().includes('101010') },
  { id: 5, text: "what is the last dish we've cooked", points: 20, check: (pwd: string) => pwd.toLowerCase().includes('mdfds') },
  { id: 6, text: "Must contain a month of the year", points: 25, 
    check: (pwd: string) => {
      const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
      return months.some(month => pwd.toLowerCase().includes(month));
    }
  },
  { id: 7, text: "Total length must be at least 15 characters", points: 30, check: (pwd: string) => pwd.length >= 15 },
  { id: 8, text: "Must contain a prime number", points: 35,
    check: (pwd: string) => {
      const numbers = pwd.match(/\d+/g);
      if (!numbers) return false;
      const isPrime = (num: number) => {
        for(let i = 2; i <= Math.sqrt(num); i++)
          if(num % i === 0) return false; 
        return num > 1;
      };
      return numbers.some(num => isPrime(parseInt(num)));
    }
  },
  { id: 9, text: "Must contain two different special characters", points: 40,
    check: (pwd: string) => {
      const specials = pwd.match(/[!@#$%^&*]/g);
      return specials ? new Set(specials).size >= 2 : false; // Changed to return false if specials is null
    }
  },
  { id: 10, text: "Must contain a color (red, blue, green, etc)", points: 45,
    check: (pwd: string) => {
      const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'black', 'white'];
      return colors.some(color => pwd.toLowerCase().includes(color));
    }
  },
  { id: 12, text: "Must be a palindrome", points: 100, 
    check: (pwd: string) => {
      const cleaned = pwd.toLowerCase().replace(/[^a-z0-9]/g, '');
      return cleaned === cleaned.split('').reverse().join('');
    }
  },
];


const MAX_POSSIBLE_SCORE = rules.reduce((sum, rule) => sum + rule.points, 0);

// Helper Components
function DifficultyIndicator({ difficulty }: { difficulty: number }) {
  let color = 'bg-green-500';
  if (difficulty > 0.7) {
    color = 'bg-red-500';
  } else if (difficulty > 0.3) {
    color = 'bg-yellow-500';
  }
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`} />
    </div>
  );
}


// Utility functions
// Utility functions
const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Main Component
export default function PasswordGame() {
  const [password, setPassword] = useState('');
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showRegistration, setShowRegistration] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);

  // Firebase Leaderboard Effect
  useEffect(() => {
    const leaderboardRef = query(ref(database, 'leaderboard'), orderByChild('score'), limitToLast(10));
    onValue(leaderboardRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const leaderboardData = Object.values(data) as LeaderboardEntry[];
        setLeaderboard(leaderboardData.sort((a, b) => b.score - a.score));
      } else {
        setLeaderboard([]);
      }
    });
  }, []);

  // Load player data
  useEffect(() => {
    const loadPlayerData = async () => {
      if (phoneNumber) {
        const cleanPhoneNumber = phoneNumber.replace(/[^\d]/g, '');
        const playerRef = ref(database, `players/${cleanPhoneNumber}`);
        const snapshot = await get(playerRef);
        if (snapshot.exists()) {
          const data = snapshot.val() as PlayerData;
          const now = Date.now();
          
          // Reset tries if 24 hours have passed
          if (data.lastAttemptTime && now - data.lastAttemptTime > TRIES_RESET_TIME) {
            data.triesLeft = MAX_TRIES;
          }
          
          setPlayerData(data);
          setPlayerName(data.name);
          setShowRegistration(false);
        }
      }
    };
    loadPlayerData();
  }, [phoneNumber]);

  // Game Timer Effect remains the same
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (gameStarted && !gameOver && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameOver, timeLeft]);

  // Handle game start
  const handleStart = async () => {
    if (showRegistration && (!playerName.trim() || !phoneNumber.trim())) {
      alert("Please enter your name and phone number before starting!");
      return;
    }

    if (playerData && playerData.triesLeft <= 0) {
      alert("You've used all your tries. Please wait for the reset.");
      return;
    }

    const cleanPhoneNumber = phoneNumber.replace(/[^\d]/g, '');
    let currentPlayerData = playerData;

    if (!currentPlayerData) {
      currentPlayerData = {
        name: playerName,
        phoneNumber: cleanPhoneNumber,
        triesLeft: MAX_TRIES,
        currentScore: 0
      };
      await set(ref(database, `players/${cleanPhoneNumber}`), currentPlayerData);
    }

    setPlayerData(currentPlayerData);
    setShowRegistration(false);
    setGameStarted(true);
    setGameOver(false);
    setTimeLeft(GAME_TIME);
    setPassword('');
    setShowTutorial(false);
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!playerData) return;

    const score = rules
      .filter(rule => rule.check(password))
      .reduce((sum, rule) => sum + rule.points, 0);

    const cleanPhoneNumber = playerData.phoneNumber.replace(/[^\d]/g, '');
    
    // Update player data
    const updatedPlayerData = {
      ...playerData,
      triesLeft: playerData.triesLeft - 1,
      currentScore: score,
      lastAttemptTime: Date.now()
    };

    // Save player data
    await set(ref(database, `players/${cleanPhoneNumber}`), updatedPlayerData);

    // Update leaderboard
    await set(ref(database, `leaderboard/${cleanPhoneNumber}`), {
      phoneNumber: cleanPhoneNumber,
      name: playerData.name,
      score: score
    });

    setPlayerData(updatedPlayerData);
    setGameOver(true);
    setGameStarted(false);
    setPassword('');
    setTimeLeft(GAME_TIME);
  };

  const score = rules
    .filter(rule => rule.check(password))
    .reduce((sum, rule) => sum + rule.points, 0);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Password Challenge</CardTitle>
              {playerData && (
                <div className="text-sm text-gray-500">
                  Playing as: {playerData.name} | Tries left: {playerData.triesLeft}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {showTutorial && !gameStarted && (
                <Alert className="mb-4">
                  <Info className="h-4 w-4" />
                  <AlertTitle>How to Play</AlertTitle>
                  <AlertDescription>
                    Create a password that meets as many requirements as possible. You have 3 tries within an hour.
                    Only your latest score will be saved!
                  </AlertDescription>
                </Alert>
              )}
              
              {showRegistration && (
                <div className="mb-4 space-y-4">
                  <div>
                    <label htmlFor="playerName" className="block mb-2 text-sm font-medium">Enter your name:</label>
                    <input
                      id="playerName"
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium">Enter your phone number:</label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
              )}

              {/* Rest of the JSX remains largely the same */}
              <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center">
                    <Timer className="mr-2 text-blue-500" />
                    <span className="text-xl font-bold">{formatTime(timeLeft)}</span>
                  </div>
                </div>
                <div className="text-xl font-bold">Score: {score}</div>
                {(!playerData || playerData.triesLeft > 0) && (
                  <button 
                    onClick={gameStarted ? handleSubmit : handleStart}
                    className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  >
                    {gameStarted ? 'Submit' : 'Start Game'}
                  </button>
                )}
              </div>

              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password..."
                className="w-full p-3 border rounded mb-4 text-lg text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={!gameStarted || gameOver}
              />

              {gameOver && (
                <Alert variant={score > 0 ? "default" : "destructive"}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Attempt Complete!</AlertTitle>
                  <AlertDescription>
                    Score: {score} out of {MAX_POSSIBLE_SCORE} possible points
                    {playerData && <div>Tries remaining: {playerData.triesLeft}</div>}
                    {playerData && playerData.triesLeft > 0 && (
                      <button 
                        onClick={() => {
                          setGameOver(false);
                          setPassword('');
                        }}
                        className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Try Again
                      </button>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {/* Rules grid remains the same */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {rules.map(rule => {
                  const passed = rule.check(password);
                  const difficulty = rule.points / 50;

                  return (
                    <Card key={rule.id} className={`${passed ? 'bg-green-50' : 'bg-gray-50'} transition-colors`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {passed ? (
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                            )}
                            <span className="text-sm text-black">{rule.text}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-700">{rule.points}pts</span>
                            <DifficultyIndicator difficulty={difficulty} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full lg:w-80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="text-yellow-500" />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <p className="text-gray-500 text-center">No scores yet. Be the first!</p>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-black">{index + 1}</span>
                      <span className="text-black">{entry.name}</span>
                    </div>
                    <span className="font-bold text-black">{entry.score}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
