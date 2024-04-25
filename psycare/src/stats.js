import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./stats.css";
import frog from "./assets/frog.png";
import streak from "./assets/streak.png";
import checkmark from "./assets/checkmark.png";
import timer from "./assets/timer.png";
import chest from "./assets/chest.png";
import { getDatabase, ref, onValue, set as firebaseSet, push as firebasePush } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from "./firebase.js";
import db from "./firebase.js";
import { addDoc, doc, setDoc, getDoc, collection } from "firebase/firestore";

// to-do
// achievments page css
// create user with uid in firestore database with google auth
// update incremement functions with uid variable
// streak counter
// daily quest box
// tasks completed today


// increment lifetime tasks
const lifetimeTasks = async (userId) => {
  const docRef = doc(db, 'userData', userId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  
  // Check if the document exists
  if (docSnap.exists()) {
    let currentTasks = 0;
    // Check if the document has the field "LifetimeTasks"
    if (data && data.hasOwnProperty('LifetimeTasks')) {
      currentTasks = data.LifetimeTasks;
    }
    // Increment the value of "LifetimePomodoros" or create it with the initial value of 1
    await setDoc(docRef, { LifetimeTasks: currentTasks + 1 }, { merge: true });
  } 
  else {
    // If the document doesn't exist, create it with the field "LifetimeTasks" and the initial value of 1
    await setDoc(docRef, { LifetimeTasks: 1 });
  }
}

// increment lifetime pomodoros
const lifetimePomodoros = async (userId) => {
  // setDoc(docRef, {lifetimePomodoros: num + 1});
  const docRef = doc(db, 'userData', userId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  
  // Check if the document exists
  if (docSnap.exists()) {
    let currentPomodoros = 0;
    // Check if the document has the field "LifetimePomodoros"
    if (data && data.hasOwnProperty('LifetimePomodoros')) {
      currentPomodoros = data.LifetimePomodoros;
    }
    // Increment the value of "LifetimePomodoros" or create it with the initial value of 1
    await setDoc(docRef, { LifetimePomodoros: currentPomodoros + 1 }, { merge: true });
  } 
  else {
    // If the document doesn't exist, create it with the field "LifetimePomodoros" and the initial value of 1
    await setDoc(docRef, { LifetimePomodoros: 1 });
  }
}

// increment lifetime quests
const lifetimeQuests = async (userId) => {
  const docRef = doc(db, 'userData', userId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  
  // Check if the document exists
  if (docSnap.exists()) {
    let currentQuests = 0;
    // Check if the document has the field "LifetimeQuests"
    if (data && data.hasOwnProperty('LifetimeQuests')) {
      currentQuests = data.LifetimeQuests;
    }
    // Increment the value of "LifetimePomodoros" or create it with the initial value of 1
    await setDoc(docRef, { LifetimeQuests: currentQuests + 1 }, { merge: true });
  } 
  else {
    // If the document doesn't exist, create it with the field "LifetimeTasks" and the initial value of 1
    await setDoc(docRef, { LifetimeQuests: 1 });
  }
}


export default function StatsPage(props) { 
  
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = getAuth().currentUser;
        if (currentUser !== null) {
          console.log("User ID:", currentUser.uid);
          setUserId(currentUser.uid);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const addUser = async (event) => {
    const docRef = await setDoc(doc(db, "userData", userId), {
      LifetimeTasks: 0,
      LifetimePomodoros: 0,
      LifetimeQuests: 0,
      LongestStreak: 0
    })
  }


  // retrieve lifetime stats

  // retrieve lifetime tasks
  const [currLifetimeTasks, setCurrLifetimeTasks] = useState(0);

  useEffect(() => {
    if (userId) {
      const fetchCurrLifetimeTasks = async () => {
        try {
          const docRef = doc(db, 'userData', userId);
          const docSnap = await getDoc(docRef);
          const data = docSnap.data();
          if (docSnap.exists() && data.hasOwnProperty('LifetimeTasks')) {
            setCurrLifetimeTasks(data.LifetimeTasks);
          }
        } catch (error) {
          console.error("Error fetching lifetime tasks:", error);
        }
      };
      fetchCurrLifetimeTasks();
    }
  }, [userId]);
  
  // Similarly modify other useEffect hooks for fetching pomodoros and quests
  

  // retrieve current lifetime pomodoros
  const [currLifetimePomodoros, setCurrLifetimePomodoros] = useState(0);

  useEffect(() => {
    if (userId) {
      const fetchCurrLifetimePomodoros = async () => {
        try {
          const docRef = doc(db, 'userData', userId);
          const docSnap = await getDoc(docRef);
          const data = docSnap.data();
          if (docSnap.exists() && data.hasOwnProperty('LifetimePomodoros')) {
            setCurrLifetimePomodoros(data.LifetimePomodoros);
          }
        } catch (error) {
          console.error("Error fetching lifetime pomodoros:", error);
        }
      };
      fetchCurrLifetimePomodoros();
    }
  }, [userId]);

  // retrieve current lifetime quests
  const [currLifetimeQuests, setCurrLifetimeQuests] = useState(0);

  useEffect(() => {
    if (userId) {
      const fetchCurrLifetimeQuests = async () => {
        try {
          const docRef = doc(db, 'userData', userId);
          const docSnap = await getDoc(docRef);
          const data = docSnap.data();
          if (docSnap.exists() && data.hasOwnProperty('LifetimeQuests')) {
            setCurrLifetimeQuests(data.LifetimeQuests);
          }
        } catch (error) {
          console.error("Error fetching lifetime quests:", error);
        }
      };
      fetchCurrLifetimeQuests();
    }
  }, [userId]);
  


  // display quotes

  // display load screen quote
  const [quote, setQuote] = useState(0);

  const randomNumber = Math.floor(Math.random() * 3) + 1;
  const quoteNum = "Quote" + randomNumber;

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const docRef = doc(db, 'quotes', 'loadScreenQuotes');
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        if (docSnap.exists() && data.hasOwnProperty(quoteNum)) {
          setQuote(data[quoteNum]);
        }
      } catch (error) {
        console.error("Error fetching quote:", error);
      }
    };
    fetchQuote();
  }, []);


  // display quests

  // display daily quest 1
  const [dailyQuest1, setDailyQuest1] = useState(0);

  const quest1Num = Math.floor(Math.random() * 2) + 1;
  const quest1NumText = "Quest" + quest1Num;

  useEffect(() => {
    const fetchQuest1 = async () => {
      try {
        const docRef = doc(db, 'quests', 'dailyQuest1');
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        if (docSnap.exists() && data.hasOwnProperty(quest1NumText)) {
          setDailyQuest1(data[quest1NumText]);
        }
      } catch (error) {
        console.error("Error fetching quest 1:", error);
      }
    };
    fetchQuest1();
  }, []);

  // display daily quest 2
  const [dailyQuest2, setDailyQuest2] = useState(0);

  const quest2Num = Math.floor(Math.random() * 2) + 1;
  const quest2NumText = "Quest" + quest2Num;

  useEffect(() => {
    const fetchQuest2 = async () => {
      try {
        const docRef = doc(db, 'quests', 'dailyQuest2');
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        if (docSnap.exists() && data.hasOwnProperty(quest2NumText)) {
          setDailyQuest2(data[quest2NumText]);
        }
      } catch (error) {
        console.error("Error fetching quest 2:", error);
      }
    };
    fetchQuest2();
  }, []);

  // display daily quest 3
  const [dailyQuest3, setDailyQuest3] = useState(0);

  const quest3Num = Math.floor(Math.random() * 2) + 1;
  const quest3NumText = "Quest" + quest3Num;

  useEffect(() => {
    const fetchQuest3 = async () => {
      try {
        const docRef = doc(db, 'quests', 'dailyQuest3');
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        if (docSnap.exists() && data.hasOwnProperty(quest3NumText)) {
          setDailyQuest3(data[quest3NumText]);
        }
      } catch (error) {
        console.error("Error fetching quest 3:", error);
      }
    };
    fetchQuest3();
  }, []);


  return (
    <div>
      <main>
        <nav>
          <ul class="menu mb-3 d-flex justify-content-end">
            <li><Link to='/homepage'>Home</Link></li>
            <li><Link to='/taskmanager'>Task Manager</Link></li>
            <li><Link to='/stats'>Achievements</Link></li>
          </ul>
        </nav>

        <div className="stats">

          <p>{quote}</p>

          <p>{userId}</p>

        <button onClick={addUser}>Add user</button>
        {/* <button onClick={lifetimeTasks}>Increment task</button> */}
        {/* <button onClick={lifetimePomodoros}>Increment pomodoro</button> */}
        {/* <button onClick={lifetimeQuests}>Increment quest</button> */}
        <button onClick={() => lifetimeTasks(userId)}>Increment task</button>
        <button onClick={() => lifetimePomodoros(userId)}>Increment pomodoro</button>
        <button onClick={() => lifetimeQuests(userId)}>Increment quest</button>



          {/* Stats header */}
          <div className="stats-header">
            <img className="frog" src={frog} alt="orange frog with magnifying glass"/>
            <div className="stats-header-stats">
              <h1>Statistics</h1>
              <div className="stats-main-box">
                <div className="stats-daily-streak">
                  <h3>Daily Streak</h3>
                  <div className="stats-streak-num">
                    <h4>3</h4>
                    <img src={streak} alt="fire"/>
                  </div>
                </div>
                <div className="stats-tasks-completed">
                  <h3>Tasks completed today</h3>
                  <div className="stats-tasks-completed-num">
                    <h4>5</h4>
                    <img src={checkmark} alt="green checkmark"/>
                  </div>
                  <div className="stats-tasks-progress">
                    <progress className="stats-progress-bar" value={.625}/>
                    <p>5/8</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Quests + All Time Stats */}
          <div className="stats-secondary">

            {/* Daily Quests */}
            <div className="stats-daily-quests">
              <h2>Daily Quests</h2>
              <div className="stats-quest-1 box-border stats-quest-box">
                <h3>{dailyQuest1}</h3>
                  <div className="stats-tasks-progress">
                    <progress className="stats-progress-bar" value={1}/>
                    <p>1/1</p>
                  </div>
              </div>
              <div className="stats-quest-2 box-border stats-quest-box">
                <h3>{dailyQuest2}</h3>
                  <div className="stats-tasks-progress">
                    <progress className="stats-progress-bar" value={.5}/>
                    <p>1/2</p>
                  </div>
              </div>
              <div className="stats-quest-3 box-border stats-quest-box">
                <h3>{dailyQuest3}</h3>
                  <div className="stats-tasks-progress">
                    <progress className="stats-progress-bar" value={0}/>
                    <p>0/1</p>
                  </div>
              </div>
            </div>

            {/* All Time Stats */}
            <div className="stats-all-time">
              <h2>All Time Statistics</h2>
              <div className="stats-longest-streak stats-all-time-box">
                <img src={streak} alt="fire"/>
                <div className="stats-all-time-text">
                  <p>16</p>
                  <h3>Longest day streak</h3>
                </div>
              </div>
              <div className="stats-lifetime-tasks stats-all-time-box">
                <img src={checkmark} alt="green checkmark"/>
                <div className="stats-all-time-text">
                  <p>{currLifetimeTasks}</p>
                  <h3>Tasks completed</h3>
                </div>
              </div>
              <div className="stats-pomodoros-set stats-all-time-box">
                <img src={timer} alt="timer"/>
                <div className="stats-all-time-text">
                  <p>{currLifetimePomodoros}</p>
                  <h3>Pomodoro timers set</h3>
                </div>
              </div>
              <div className="stats-quests-completed stats-all-time-box">
                <img src={chest} alt="chest"/>
                <div className="stats-all-time-text">
                  <p>{currLifetimeQuests}</p>
                  <h3>Daily quests completed</h3>
                </div>
              </div>

            </div>
          </div>

        </div>
        

      </main>
    </div>
  )
}