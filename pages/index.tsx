import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Sun, Moon } from 'lucide-react';

const PomodoroTimer = () => {
  const defaultTimes = {
    deepWork: 25,
    shortBreak: 5,
    longBreak: 15
  };

  const [mode, setMode] = useState('deepWork');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('25');
  const [times, setTimes] = useState({...defaultTimes});

  // Set document title
  useEffect(() => {
    document.title = 'PomoWork';
  }, []);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Dam9vc3R5cG1pZmBgYmBlb3J1eNP/+dby6ObZ1M3Hw7+9urmzraeioJ6aj4yKiomHhcfExP/+/96umzN3pRN0/6ODzuT/9MJ7UQ==');
      audio.play();
      
      // Auto switch to next mode
      if (mode === 'deepWork') {
        handleModeChange('shortBreak');
      } else if (mode === 'shortBreak' || mode === 'longBreak') {
        handleModeChange('deepWork');
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  // Mode change handler
  const handleModeChange = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimes({...defaultTimes}); // Reset all times to defaults
    setTimeLeft(defaultTimes[newMode] * 60);
    setEditValue(defaultTimes[newMode].toString());
  };

  // Timer controls
  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(times[mode] * 60);
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle time edit
  const handleTimeEdit = (value) => {
    const newValue = parseInt(value);
    if (newValue > 0 && newValue <= 60) {
      setTimes({
        ...times,
        [mode]: newValue
      });
      setTimeLeft(newValue * 60);
      setIsEditing(false);
    }
  };

  // Handle time display click
  const handleTimeClick = () => {
    if (!isRunning) {
      setIsEditing(true);
      setEditValue(Math.floor(timeLeft / 60).toString());
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 ease-in-out ${
      isDarkMode 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800'
    }`}>
      <div className="max-w-md mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-semibold">PomoWork</h1>
          <div className="relative">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full transition-all duration-700 ease-in-out ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
            >
              {isDarkMode ? (
                <Sun className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out opacity-100 rotate-0" />
              ) : (
                <Moon className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out opacity-100 rotate-0" />
              )}
              <div className="w-6 h-6" /> {/* Spacer to maintain button size */}
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className={`rounded-2xl p-2 shadow-sm mb-10 transition-all duration-700 ease-in-out ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="grid grid-cols-3 gap-2 relative">
            <div 
              className={`absolute transition-all duration-500 ease-in-out rounded-xl ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              } ${
                mode === 'deepWork' ? 'left-0 w-1/3' :
                mode === 'shortBreak' ? 'left-1/3 w-1/3' :
                'left-2/3 w-1/3'
              } top-0 h-full`}
            />
            {Object.entries(times).map(([timerMode]) => (
              <button
                key={timerMode}
                onClick={() => handleModeChange(timerMode)}
                className={`py-2 px-4 rounded-xl text-sm font-medium relative transition-all duration-500 ease-in-out ${
                  mode === timerMode
                    ? isDarkMode ? 'text-white' : 'text-gray-800'
                    : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {timerMode === 'deepWork' ? 'deep work' : timerMode.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Timer Display */}
        <div className={`rounded-2xl p-10 shadow-sm mb-12 text-center transition-all duration-700 ease-in-out relative ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>

          <div 
            onClick={handleTimeClick}
            className={`inline-block text-6xl font-light mb-8 ${!isRunning ? 'cursor-pointer hover:opacity-80' : ''}`}
          >
            {isEditing ? (
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={editValue}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  if (value === '' || (parseInt(value) > 0 && parseInt(value) <= 60)) {
                    setEditValue(value);
                  }
                }}
                onBlur={() => handleTimeEdit(editValue)}
                onKeyDown={(e) => e.key === 'Enter' && handleTimeEdit(editValue)}
                className={`w-32 text-6xl font-light text-center bg-transparent outline-none ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}
                autoFocus
              />
            ) : (
              formatTime(timeLeft)
            )}
          </div>
          
          {/* Timer Controls */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={toggleTimer}
style={{
                transition: 'all 0.1s ease',
                transform: 'translateY(0)',
                boxShadow: '0 4px 0 0 rgba(0,0,0,0.15)',
                cursor: 'pointer'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(4px)';
                e.currentTarget.style.boxShadow = '0 0px 0 0 rgba(0,0,0,0.15)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 0 0 rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 0 0 rgba(0,0,0,0.15)';
              }}
              className={`w-16 h-16 flex items-center justify-center rounded-full ${
                isDarkMode 
                  ? 'bg-white text-gray-800 hover:bg-gray-200' 
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button
              onClick={resetTimer}
style={{
                transition: 'all 0.1s ease',
                transform: 'translateY(0)',
                boxShadow: '0 4px 0 0 rgba(0,0,0,0.15)',
                cursor: 'pointer'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(4px)';
                e.currentTarget.style.boxShadow = '0 0px 0 0 rgba(0,0,0,0.15)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 0 0 rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 0 0 rgba(0,0,0,0.15)';
              }}
              className={`w-16 h-16 flex items-center justify-center rounded-full ${
                isDarkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Messages below timer */}
      <div className="max-w-md mx-auto px-6 text-center space-y-4">
        <p className={isDarkMode ? 'text-white text-sm' : 'text-gray-900 text-sm'}>
          <em>Your next breakthrough is 25 minutes away.</em>
        </p>
        <p className="text-sm text-gray-400">
          There is no <em>To Do</em> list feature. Grab a notebook and a pen, write down what you need to get done, then do it.
        </p>
      </div>
    </div>
  );
};

export default PomodoroTimer;