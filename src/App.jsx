import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc,
  serverTimestamp, 
  getDoc, 
  onSnapshot, 
  updateDoc 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  Users, 
  Play, 
  Lock, 
  Eye, 
  EyeOff, 
  Send, 
  Vote, 
  Trophy, 
  RotateCcw, 
  Zap, 
  Sparkles, 
  ShieldAlert, 
  HelpCircle, 
  CheckCircle2, 
  MessageSquare,
  Crown,
  Flame,
  AlertTriangle
} from 'lucide-react';

// --- Firebase Initialization ---
const firebaseConfig = {
  apiKey: "AIzaSyCNvWTIwNspNLRudKOtbZaVZzh9KGokX60",
  authDomain: "question-imposter-b9bf6.firebaseapp.com",
  projectId: "question-imposter-b9bf6",
  storageBucket: "question-imposter-b9bf6.firebasestorage.app",
  messagingSenderId: "520839855657",
  appId: "1:520839855657:web:1365d57c2b5156c77c6638"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Comprehensive & Non-Linear Question Pairs & Banks ---
const QUESTION_PAIRS = [
  {
    id: 1,
    majority: "At what age did you first have sex?",
    imposter: "At what age did you first masturbate?"
  },
  {
    id: 2,
    majority: "How many 10-year-olds could you realistically take on in a fight?",
    imposter: "How many chicken nuggets could you eat in one sitting?"
  },
  {
    id: 3,
    majority: "What is something you should NEVER bring to a funeral?",
    imposter: "What is something you always bring on a romantic first date?"
  },
  {
    id: 4,
    majority: "What is the worst thing you could say right after kissing someone?",
    imposter: "What is the most honest thing you could say to your boss?"
  },
  {
    id: 5,
    majority: "What is something you only do when you are completely alone in your room?",
    imposter: "What is your favorite healthy morning routine habit?"
  },
  {
    id: 6,
    majority: "What’s something you’d be mortified if your parents walked in on you doing?",
    imposter: "What’s your favorite guilty pleasure activity on a lazy Sunday afternoon?"
  },
  {
    id: 7,
    majority: "What is the weirdest thing you've ever done while completely drunk?",
    imposter: "What is a fun team-building activity you did at work or school?"
  },
  {
    id: 8,
    majority: "If you got arrested tomorrow, what would your friends automatically assume it was for?",
    imposter: "What is a hidden talent or hobby you are secretly super proud of?"
  },
  {
    id: 9,
    majority: "What is something you've lied about on a first date?",
    imposter: "What is a major accomplishment listed on your resume?"
  },
  {
    id: 10,
    majority: "What object in your house would be hardest to explain if someone found it in your bag?",
    imposter: "What is an essential item you never travel without?"
  },
  {
    id: 11,
    majority: "What is the quickest way to ruin a wedding reception?",
    imposter: "What is the best way to get a party started?"
  },
  {
    id: 12,
    majority: "How long could you survive naked in the Amazon Rainforest?",
    imposter: "How long can you comfortably go without checking your phone?"
  },
  {
    id: 13,
    majority: "What body part would you willingly sacrifice for $1,000,000?",
    imposter: "What household appliance could you live without for a year?"
  },
  {
    id: 14,
    majority: "What is the most embarrassing place you've ever thrown up?",
    imposter: "What is your absolute favorite vacation destination?"
  },
  {
    id: 15,
    majority: "What is a pickup line that will instantly get you blocked?",
    imposter: "What is a motivational quote that actually inspires you?"
  },
  {
    id: 16,
    majority: "What is something you would do if you were invisible for 24 hours?",
    imposter: "What is the first thing you'd do if you won the lottery today?"
  },
  {
    id: 17,
    majority: "What's the worst reason to break up with someone?",
    imposter: "What is your biggest minor pet peeve about roommates?"
  },
  {
    id: 18,
    majority: "What is the worst thing to whisper in someone's ear on a crowded subway?",
    imposter: "What is a nice compliment you love receiving from strangers?"
  },
  {
    id: 19,
    majority: "What sounds like an insult, but is actually a compliment?",
    imposter: "What is the funniest nickname you’ve ever had?"
  },
  {
    id: 20,
    majority: "What is something you secretly enjoy doing in public that people judge you for?",
    imposter: "What is your favorite way to exercise or stay active?"
  },
  {
    id: 21,
    majority: "What's the most illegal thing you think you could get away with?",
    imposter: "What's the most daring thrill-seeking activity on your bucket list?"
  },
  {
    id: 22,
    majority: "What is the worst thing to say during a job interview?",
    imposter: "What is the worst thing to say when meeting your partner's parents?"
  },
  {
    id: 23,
    majority: "What's the strangest place you've ever fallen asleep?",
    imposter: "Where is the coziest place to read a book on a rainy day?"
  },
  {
    id: 24,
    majority: "What is something you spend way too much money on each month?",
    imposter: "What is something you think everyone should invest in?"
  },
  {
    id: 25,
    majority: "What is a secret red flag you look out for when meeting new people?",
    imposter: "What is an instant green flag that makes you like someone immediately?"
  },
  {
    id: 26,
    majority: "What would your last meal be on death row?",
    imposter: "What is your absolute favorite comfort food after a hard day?"
  },
  {
    id: 27,
    majority: "What is the worst advice a friend has ever given you?",
    imposter: "What is the best piece of wisdom you've ever received from a mentor?"
  },
  {
    id: 28,
    majority: "What is a weird habit you have while taking a shower?",
    imposter: "What is your exact night routine before sleeping?"
  },
  {
    id: 29,
    majority: "What is the worst thing to find in your fast food burger?",
    imposter: "What is your favorite topping to add to a pizza?"
  },
  {
    id: 30,
    majority: "What is a rule you break on a regular basis?",
    imposter: "What is a personal rule you religiously stick to every day?"
  },
  {
    id: 31,
    majority: "What is something you would do for $100,000 in front of all your friends?",
    imposter: "What is your favorite dares or party challenge you've completed?"
  },
  {
    id: 32,
    majority: "What is something you do completely naked when no one is home?",
    imposter: "What is the very first thing you do when you wake up in the morning?"
  },
  {
    id: 33,
    majority: "What is the longest you've gone without showering?",
    imposter: "How long can you comfortably go without checking social media?"
  },
  {
    id: 34,
    majority: "What is the worst place to accidentally let out a loud fart?",
    imposter: "What is the worst place to have your phone ring on loud?"
  },
  {
    id: 35,
    majority: "What is a fetish or kink you think is super overrated?",
    imposter: "What is a popular fashion trend you think is ridiculous?"
  }
];

const EXTRA_CHAOTIC_QUESTIONS = [
  "What is your go-to excuse when you want to cancel plans at the last minute?",
  "How many consecutive hours have you spent binge-watching a show?",
  "What is the most ridiculous secret you've kept from your parents?",
  "What is the worst purchase you've ever made while online shopping?",
  "What is something you act like you understand but actually have no clue about?",
  "What is the funniest thing you've ever heard someone say in their sleep?",
  "What is a lie you tell people so they think you have your life together?",
  "What is the most awkward text message you've ever sent to the wrong person?",
  "What is your guilty pleasure song that you only sing loudly in the car?",
  "What is something silly you used to believe as a young child?"
];

export default function App() {
  // --- Auth State ---
  const [user, setUser] = useState(null);
  
  // --- Screen / Lobby Navigation State ---
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [gameState, setGameState] = useState('HOME');
  
  // --- Game Data State (Synced from Firestore) ---
  const [roomData, setRoomData] = useState(null);
  
  // --- Local UI States ---
  const [questionRevealed, setQuestionRevealed] = useState(false);
  const [myAnswer, setMyAnswer] = useState('');
  const [selectedVote, setSelectedVote] = useState('');

  // 1. Firebase Auth Initializer
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) setPlayerId(u.uid);
    });
    return () => unsubscribe();
  }, []);

  // 2. Realtime Room Listener
  useEffect(() => {
    if (!roomCode || roomCode.length !== 4) return;

    const roomRef = doc(db, "rooms", roomCode.toUpperCase());

    const unsubscribe = onSnapshot(
      roomRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setRoomData(data);
          setErrorMsg("");
          if (data.status) {
            setGameState(data.status);
          }
        } else {
          console.warn(`Room document ${roomCode} not found.`);
          setRoomData(null);
          setErrorMsg("Room closed or does not exist.");
        }
      },
      (err) => {
        console.error("Firestore Listener Error:", err);
      }
    );

    return () => unsubscribe();
  }, [roomCode]);

  const getRoomRef = (code) => {
    return doc(db, 'rooms', code.toUpperCase());
  };

  const isHost = roomData?.hostId === playerId;

  // --- ACTIONS ---

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      alert("Please enter your name!");
      return;
    }

    setLoading(true);

    try {
      let currentUser = auth.currentUser;
      if (!currentUser) {
        const userCred = await signInAnonymously(auth);
        currentUser = userCred.user;
      }

      if (!currentUser) {
        throw new Error("Authentication failed. Unable to obtain user ID.");
      }

      const hostId = currentUser.uid;
      setPlayerId(hostId);

      const generateCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let result = "";
        for (let i = 0; i < 4; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      const code = generateCode();
      const roomRef = doc(db, "rooms", code);
      
      await setDoc(roomRef, {
        code: code,
        hostId: hostId,
        status: "LOBBY",
        stage: "LOBBY",
        createdAt: serverTimestamp(),
        players: [
          {
            id: hostId,
            name: playerName.trim(),
            score: 0,
            isHost: true,
            isImposter: false,
            answer: "",
            votedFor: null,
          }
        ],
        currentRound: 0,
        totalRounds: 3,
        secretQuestion: "",
        imposterQuestion: "",
        imposterId: null,
        isAllImposterDecoy: false,
      });

      setRoomCode(code);
      setGameState("LOBBY");
    } catch (error) {
      console.error("Error creating room:", error);
      alert(`Failed to create room: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!playerName.trim()) {
      alert("Please enter your name!");
      return;
    }

    if (!joinCode || joinCode.trim().length !== 4) {
      alert("Please enter a valid 4-letter room code.");
      return;
    }

    setLoading(true);

    try {
      let currentUser = auth.currentUser;
      if (!currentUser) {
        const userCred = await signInAnonymously(auth);
        currentUser = userCred.user;
      }

      const currentId = currentUser.uid;
      setPlayerId(currentId);

      const code = joinCode.toUpperCase().trim();
      const roomRef = doc(db, "rooms", code);
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        alert("Room not found! Check your 4-letter code.");
        setLoading(false);
        return;
      }

      const rData = roomSnap.data();

      if (rData.status !== "LOBBY") {
        alert("Game has already started!");
        setLoading(false);
        return;
      }

      const existingPlayers = Array.isArray(rData.players) ? rData.players : [];
      const alreadyInRoom = existingPlayers.some(p => p.id === currentId);
      const updatedPlayers = alreadyInRoom ? existingPlayers : [
        ...existingPlayers,
        {
          id: currentId,
          name: playerName.trim(),
          score: 0,
          isHost: false,
          isImposter: false,
          answer: "",
          votedFor: null,
        }
      ];

      await updateDoc(roomRef, {
        players: updatedPlayers
      });

      setRoomCode(code);
      setGameState("LOBBY");
    } catch (error) {
      console.error("Error joining room:", error);
      alert(`Failed to join room: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNextRound = async () => {
    if (!roomData || !isHost) return;

    const playersList = Array.isArray(roomData.players) ? roomData.players : [];
    if (playersList.length < 3) {
      setErrorMsg("You need at least 3 players to start the game!");
      return;
    }

    const randomPair = QUESTION_PAIRS[Math.floor(Math.random() * QUESTION_PAIRS.length)];
    const isChaoticRound = Math.random() < 0.35;
    
    let imposterIds = [];
    let isAllImposters = false;
    let customQuestionsMap = {};

    const shuffledPlayerIds = [...playersList].map(p => p.id).sort(() => Math.random() - 0.5);

    if (!isChaoticRound) {
      imposterIds = [shuffledPlayerIds[0]];
    } else {
      const minImposters = 2;
      const possibleCounts = [];
      for (let i = minImposters; i <= playersList.length; i++) {
        possibleCounts.push(i);
      }
      
      const numImposters = possibleCounts[Math.floor(Math.random() * possibleCounts.length)];
      imposterIds = shuffledPlayerIds.slice(0, numImposters);

      if (numImposters === playersList.length) {
        isAllImposters = true;
        const pool = [
          randomPair.imposter,
          ...QUESTION_PAIRS.map(qp => qp.imposter),
          ...EXTRA_CHAOTIC_QUESTIONS
        ].sort(() => Math.random() - 0.5);

        playersList.forEach((p, idx) => {
          customQuestionsMap[p.id] = pool[idx % pool.length];
        });
      }
    }

    await updateDoc(getRoomRef(roomCode), {
      status: 'GAME',
      stage: 'ANSWERING',
      currentRound: (roomData.currentRound || 0) + 1,
      isChaoticRound,
      isAllImposters,
      questionPair: randomPair,
      customQuestionsMap,
      imposterIds,
      answers: {},
      votes: {}
    });

    setMyAnswer('');
    setSelectedVote('');
    setQuestionRevealed(false);
  };

  const handleSubmitAnswer = async () => {
    if (!myAnswer.trim()) return;
    const roomRef = getRoomRef(roomCode);
    
    const updatedAnswers = {
      ...(roomData.answers || {}),
      [playerId]: myAnswer.trim()
    };

    await updateDoc(roomRef, {
      answers: updatedAnswers
    });
  };

  const handleAdvanceStage = async (nextStage) => {
    if (!isHost) return;
    await updateDoc(getRoomRef(roomCode), {
      stage: nextStage
    });
  };

  const handleVotePlayer = async (targetId) => {
    setSelectedVote(targetId);
    const roomRef = getRoomRef(roomCode);
    const updatedVotes = {
      ...(roomData.votes || {}),
      [playerId]: targetId
    };

    await updateDoc(roomRef, {
      votes: updatedVotes
    });
  };

  // --- Strict Majority Voting & Scoring Calculation Logic ---
  const handleCalculateResults = async () => {
    if (!isHost || !roomData) return;

    const votes = roomData.votes || {};
    const imposterIds = roomData.imposterIds || [];
    const players = Array.isArray(roomData.players) ? roomData.players : [];
    const totalPlayersCount = players.length;
    const isAllImposters = !!roomData.isAllImposters;

    // Tally votes for each player
    const voteCounts = {};
    players.forEach(p => voteCounts[p.id] = 0);
    Object.values(votes).forEach(targetId => {
      if (voteCounts[targetId] !== undefined) {
        voteCounts[targetId] += 1;
      }
    });

    // Find the player(s) with the highest votes
    let maxVotes = 0;
    Object.values(voteCounts).forEach(count => {
      if (count > maxVotes) maxVotes = count;
    });

    const topVotedIds = Object.keys(voteCounts).filter(id => voteCounts[id] === maxVotes && maxVotes > 0);
    
    // Strict Majority Rule Check: > 50% of total players must agree on the target
    const majorityThreshold = Math.floor(totalPlayersCount / 2) + 1;
    const hasTrueMajority = maxVotes >= majorityThreshold && topVotedIds.length === 1;
    const votedOutId = hasTrueMajority ? topVotedIds[0] : null;
    const isImposterCaught = votedOutId ? imposterIds.includes(votedOutId) : false;

    // Update Scores based on Majority Consensus outcome
    const updatedPlayers = players.map(p => {
      const isImposter = imposterIds.includes(p.id);
      let newScore = p.score || 0;

      if (isAllImposters) {
        // In all-imposter rounds, players win points only if they successfully caught someone (or nobody gets majority)
        if (votedOutId && !imposterIds.includes(votedOutId)) {
          // Majority voted an innocent (none existed), imposters win points
          if (isImposter) newScore += 3;
        } else if (!votedOutId) {
          // No majority reached -> Imposters escape & win points
          if (isImposter) newScore += 3;
        }
      } else {
        // Standard / Multi-Imposter rounds
        if (isImposterCaught) {
          // Majority successfully caught an imposter!
          if (!isImposter) {
            newScore += 1; // Innocent players who voted correctly get +1 pt
          }
        } else {
          // Imposter(s) successfully avoided majority detection or vote tied/failed
          if (isImposter) {
            newScore += 3; // Imposter gets +3 pts for escaping detection
          }
        }
      }

      return {
        ...p,
        score: newScore
      };
    });

    await updateDoc(getRoomRef(roomCode), {
      players: updatedPlayers,
      stage: 'RESULTS',
      votingOutcome: {
        votedOutId,
        hasTrueMajority,
        isImposterCaught
      }
    });
  };

  const handleLeaveRoom = () => {
    setRoomCode('');
    setJoinCode('');
    setRoomData(null);
    setGameState('HOME');
  };

  // --- RENDER LOGIC ---
  const playersList = Array.isArray(roomData?.players) ? roomData.players : [];
  const isImposter = roomData?.imposterIds?.includes(playerId);
  
  let myQuestion = "";
  if (roomData?.isAllImposters) {
    myQuestion = roomData?.customQuestionsMap?.[playerId] || roomData?.questionPair?.imposter;
  } else if (isImposter) {
    myQuestion = roomData?.questionPair?.imposter;
  } else {
    myQuestion = roomData?.questionPair?.majority;
  }

  const totalVotesCount = Object.keys(roomData?.votes || {}).length;
  const allVotesIn = totalVotesCount >= playersList.length && playersList.length > 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-between p-4 sm:p-6 select-none">
      
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-600/25 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto flex-1 flex flex-col">

        {/* HEADER BRANDING */}
        <header className="text-center py-4 mb-2 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-gradient-to-tr from-pink-500 to-violet-600 rounded-xl shadow-lg shadow-pink-500/30">
              <Zap className="w-6 h-6 text-white animate-pulse" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
              IMPOSTER PARTY
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-medium">Find the liar. Answer the unthinkable.</p>

          {roomCode && roomData && (
            <div className="mt-4 flex items-center justify-between w-full bg-slate-900/80 backdrop-blur-md border border-slate-800 px-4 py-2 rounded-2xl shadow-inner">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">ROOM:</span>
                <span className="font-mono font-bold text-lg text-cyan-400 tracking-wider">{roomCode}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 border border-slate-700">
                  <Users className="w-3.5 h-3.5 text-pink-400" />
                  {playersList.length}
                </span>
                <button 
                  onClick={handleLeaveRoom}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-2 py-1 rounded-lg hover:bg-rose-500/10 transition"
                >
                  Exit
                </button>
              </div>
            </div>
          )}
        </header>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm text-center flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="text-rose-400 text-xs ml-2 font-bold">✕</button>
          </div>
        )}

        {/* HOME / ENTRY FORM */}
        {gameState === 'HOME' && !roomCode && (
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-6 my-auto">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Your Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. PartyAnimal99"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={15}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 rounded-2xl px-4 py-3 text-white placeholder-slate-600 outline-none transition font-medium"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 pt-2">
                <button
                  onClick={handleCreateRoom}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-pink-500/25 active:scale-[0.98] transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  {loading ? "Creating..." : "Create New Room (Host)"}
                </button>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">Or Join Room</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="4-LETTER CODE"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={4}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-2xl px-4 py-3 text-cyan-400 font-mono font-bold tracking-widest placeholder-slate-600 outline-none text-center transition"
                />
                <button
                  onClick={handleJoinRoom}
                  disabled={loading}
                  className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-6 py-3 rounded-2xl shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition flex items-center justify-center"
                >
                  Join
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800/60 rounded-2xl text-xs text-slate-400 space-y-2">
              <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-purple-400" /> How to Play:
              </div>
              <p>Everyone receives secret questions. The host reveals the main question, and players debate who got a different question. Watch out for random chaotic rounds where everyone could be an imposter!</p>
            </div>
          </div>
        )}

        {/* LOBBY VIEW */}
        {gameState === 'LOBBY' && roomData && (
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-6 my-auto flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Party Lobby
                </h2>
                <span className="text-xs text-slate-400">{playersList.length} Connected</span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {playersList.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-slate-950/70 border border-slate-800/60 rounded-2xl">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-xs text-white shadow">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-sm text-slate-200">
                        {p.name} {p.id === playerId && "(You)"}
                      </span>
                    </div>
                    {p.isHost && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                        <Crown className="w-3 h-3" /> HOST
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-3.5 bg-purple-950/30 border border-purple-500/30 rounded-2xl text-xs text-purple-300 flex items-center gap-2">
                <Flame className="w-5 h-5 text-pink-400 flex-shrink-0 animate-bounce" />
                <span>Chaotic Rounds are active! Any round could randomly feature multiple imposters or an all-imposter standoff!</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              {isHost ? (
                <button
                  onClick={handleStartNextRound}
                  disabled={playersList.length < 3}
                  className={`w-full py-4 rounded-2xl font-bold text-base shadow-xl flex items-center justify-center gap-2 transition ${
                    playersList.length >= 3
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 shadow-emerald-500/20 active:scale-[0.98]'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Play className="w-5 h-5 fill-current" />
                  {playersList.length >= 3 ? "Start Game" : "Need at least 3 players"}
                </button>
              ) : (
                <div className="text-center text-slate-400 text-sm py-3 animate-pulse font-medium">
                  Waiting for host to start the game...
                </div>
              )}
            </div>
          </div>
        )}

        {/* ANSWERING STAGE */}
        {gameState === 'GAME' && roomData?.stage === 'ANSWERING' && (
          <div className="space-y-4 my-auto">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Secret Question
                </span>
                <button
                  onClick={() => setQuestionRevealed(!questionRevealed)}
                  className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-3 py-1.5 rounded-xl border border-slate-700 transition"
                >
                  {questionRevealed ? <EyeOff className="w-4 h-4 text-pink-400" /> : <Eye className="w-4 h-4 text-cyan-400" />}
                  {questionRevealed ? "Hide Screen" : "Tap to Peek"}
                </button>
              </div>

              {questionRevealed ? (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-2xl">
                    <p className="text-base sm:text-lg font-bold text-white leading-snug">
                      "{myQuestion}"
                    </p>
                  </div>
                  {/* Note: Imposter status warning banner removed per requirement so players don't know they are imposters! */}
                </div>
              ) : (
                <div 
                  onClick={() => setQuestionRevealed(true)}
                  className="h-32 bg-slate-950/60 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/50 transition group"
                >
                  <Eye className="w-8 h-8 text-slate-600 group-hover:text-purple-400 mb-2 transition" />
                  <span className="text-xs text-slate-400 group-hover:text-slate-200 font-semibold">Tap to view your private question</span>
                </div>
              )}
            </div>

            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-4">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Your Answer
              </label>

              {roomData.answers?.[playerId] ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="font-semibold text-sm">Submitted: "{roomData.answers[playerId]}"</span>
                  </div>
                  <button 
                    onClick={() => {
                      const updated = {...roomData.answers};
                      delete updated[playerId];
                      updateDoc(getRoomRef(roomCode), { answers: updated });
                    }}
                    className="text-xs text-slate-400 hover:text-white underline"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    rows={3}
                    placeholder="Type your funny or sneaky answer here..."
                    value={myAnswer}
                    onChange={(e) => setMyAnswer(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-2xl p-4 text-white placeholder-slate-600 outline-none transition text-sm resize-none"
                  />
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!myAnswer.trim()}
                    className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition ${
                      myAnswer.trim()
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-purple-500/25 active:scale-[0.98]'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    Lock In Answer
                  </button>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex justify-between items-center text-xs text-slate-400 mb-2 font-medium">
                  <span>Submitted Status</span>
                  <span>
                    {Object.keys(roomData.answers || {}).length} / {playersList.length} Players
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1.5">
                  {playersList.map(p => {
                    const hasSubmitted = !!roomData.answers?.[p.id];
                    return (
                      <span 
                        key={p.id}
                        className={`text-[11px] px-2.5 py-1 rounded-xl font-medium flex items-center gap-1 border ${
                          hasSubmitted 
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                            : 'bg-slate-950/40 border-slate-800 text-slate-500'
                        }`}
                      >
                        {hasSubmitted ? '✓' : '…'} {p.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              {isHost && (
                <div className="pt-3 border-t border-slate-800">
                  <button
                    onClick={() => handleAdvanceStage('REVEALING_ANSWERS')}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold py-3 rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition"
                  >
                    Reveal Answers Aloud →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* REVEALING ANSWERS STAGE */}
        {gameState === 'GAME' && roomData?.stage === 'REVEALING_ANSWERS' && (
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-6 my-auto flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-400">Phase 2</span>
                <h2 className="text-xl font-extrabold text-white">The Answers Revealed</h2>
                <p className="text-xs text-slate-400">Read these answers out loud to the group!</p>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {playersList.map((p) => {
                  const ans = roomData.answers?.[p.id];
                  return (
                    <div key={p.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                        <span>{p.name}</span>
                      </div>
                      <p className="text-base font-bold text-white leading-relaxed">
                        {ans ? `"${ans}"` : <span className="italic text-slate-600 font-normal">No answer submitted</span>}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {isHost ? (
              <button
                onClick={() => handleAdvanceStage('DEBATE')}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-pink-500/25 transition"
              >
                Reveal Majority Question & Debate →
              </button>
            ) : (
              <div className="text-center text-xs text-slate-400 animate-pulse font-medium py-2">
                Waiting for host to reveal the real question...
              </div>
            )}
          </div>
        )}

        {/* DEBATE STAGE */}
        {gameState === 'GAME' && roomData?.stage === 'DEBATE' && (
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-6 my-auto flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Phase 3</span>
                <h2 className="text-xl font-extrabold text-white flex items-center justify-center gap-2">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  The Main Question
                </h2>
                <p className="text-xs text-slate-400">This was the question sent out this round!</p>
              </div>

              <div className="p-5 bg-gradient-to-tr from-purple-950/80 to-slate-950 border border-purple-500/40 rounded-2xl shadow-inner text-center space-y-2">
                <p className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300">
                  "{roomData.questionPair?.majority}"
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-slate-300 space-y-2">
                <span className="font-bold text-pink-400 block uppercase tracking-wider">Time to Discuss & Accuse!</span>
                <p>Look at everyone's answers again. Whose answer sounds slightly off, overly creative, or totally unrelated?</p>
              </div>
            </div>

            {isHost ? (
              <button
                onClick={() => handleAdvanceStage('VOTING')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-purple-500/25 transition flex items-center justify-center gap-2"
              >
                <Vote className="w-5 h-5" />
                Proceed to Voting Phase →
              </button>
            ) : (
              <div className="text-center text-xs text-slate-400 animate-pulse font-medium py-2">
                Discuss with the group! Host will open voting shortly...
              </div>
            )}
          </div>
        )}

        {/* VOTING STAGE */}
        {gameState === 'GAME' && roomData?.stage === 'VOTING' && (
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-6 my-auto flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-400">Final Vote</span>
                <h2 className="text-xl font-extrabold text-white">Who is an Imposter?</h2>
                <p className="text-xs text-slate-400">Cast your vote. A strict majority is required to catch the liar!</p>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {playersList.map((p) => {
                  const isSelected = selectedVote === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleVotePlayer(p.id)}
                      className={`w-full p-3.5 rounded-2xl border font-bold text-sm flex items-center justify-between transition ${
                        isSelected
                          ? 'bg-pink-500 text-white border-pink-400 shadow-lg shadow-pink-500/30 scale-[1.01]'
                          : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <span>{p.name} {p.id === playerId && "(You)"}</span>
                      {isSelected && <CheckCircle2 className="w-5 h-5" />}
                    </button>
                  );
                })}
              </div>

              <div className="text-xs text-slate-400 text-center font-medium pt-2">
                Votes Submitted: {totalVotesCount} / {playersList.length}
              </div>
            </div>

            {isHost ? (
              <button
                onClick={handleCalculateResults}
                disabled={!allVotesIn}
                className={`w-full py-4 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition ${
                  allVotesIn
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 shadow-emerald-500/20 active:scale-[0.98]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Trophy className="w-5 h-5" />
                {allVotesIn ? "Reveal Results & Calculate Scores" : `Waiting for all votes (${totalVotesCount}/${playersList.length})`}
              </button>
            ) : (
              <div className="text-center text-xs text-slate-400 animate-pulse font-medium py-2">
                {allVotesIn ? "All votes locked in! Waiting for host..." : `Waiting for everyone to vote (${totalVotesCount}/${playersList.length})...`}
              </div>
            )}
          </div>
        )}

        {/* RESULTS STAGE */}
        {gameState === 'GAME' && roomData?.stage === 'RESULTS' && (
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-6 my-auto">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Round Over</span>
              <h2 className="text-2xl font-extrabold text-white">The Reveal</h2>
            </div>

            {/* Voting Consensus Outcome Banner */}
            <div className={`p-4 rounded-2xl border text-center space-y-1 ${
              roomData.votingOutcome?.isImposterCaught 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              <span className="text-xs font-extrabold uppercase tracking-widest block">
                {roomData.votingOutcome?.isImposterCaught ? "🎉 PLAYERS WIN THE ROUND!" : "🚨 IMPOSTER ESCAPED THE MAJORITY!"}
              </span>
              <p className="text-xs text-slate-300">
                {roomData.votingOutcome?.isImposterCaught 
                  ? "A strict majority successfully targeted the imposter." 
                  : "Majority consensus failed or targeted an innocent player. The imposter scores!"}
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-pink-500/10 border border-pink-500/30 rounded-2xl space-y-2 text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-pink-400 block">
                  {roomData.isAllImposters ? "EVERYONE WAS AN IMPOSTER! 😱" : "The True Imposter(s):"}
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {roomData.imposterIds?.map(impId => {
                    const impPlayer = playersList.find(p => p.id === impId);
                    return (
                      <span key={impId} className="text-base sm:text-lg font-black text-white bg-pink-500/30 px-3 py-1 rounded-xl border border-pink-400/50">
                        🚨 {impPlayer?.name || "Unknown"}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {roomData.isAllImposters ? "Individual secret questions were:" : "The Imposter Question Was:"}
                </span>
                {roomData.isAllImposters ? (
                  <div className="space-y-1 pt-1 text-xs text-left">
                    {playersList.map(p => (
                      <div key={p.id} className="text-slate-300 font-medium border-b border-slate-900 pb-1">
                        <strong className="text-purple-400">{p.name}:</strong> "{roomData.customQuestionsMap?.[p.id]}"
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-bold text-purple-300 italic">
                    "{roomData.questionPair?.imposter}"
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" /> Leaderboard
                </h3>
                <span className="text-xs text-slate-400">Total Points</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {[...playersList]
                  .sort((a, b) => (b.score || 0) - (a.score || 0))
                  .map((p, index) => (
                    <div 
                      key={p.id} 
                      className={`flex items-center justify-between p-3 rounded-2xl border ${
                        index === 0 
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' 
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 text-center font-extrabold text-xs ${index === 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                          #{index + 1}
                        </span>
                        <span className="font-semibold text-sm">
                          {p.name} {p.id === playerId && "(You)"}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-sm bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                        {p.score || 0} pts
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {isHost ? (
              <button
                onClick={handleStartNextRound}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-purple-500/25 active:scale-[0.98] transition flex items-center justify-center gap-2 text-base"
              >
                <RotateCcw className="w-5 h-5" />
                Play Next Round
              </button>
            ) : (
              <div className="text-center text-xs text-slate-400 animate-pulse font-medium py-2">
                Waiting for host to start the next round...
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}