import { useState } from 'react'

const Header = () => {
  return (
    <div>
      <h1>Give feedback for unicafe</h1>
    </div>
  )
}

const Buttons = ({ handleGoodClick, handleNeutralClick, handleBadClick}) => {
  return (
    <div> 
      <button onClick={handleGoodClick}>Good</button>
      <button onClick={handleNeutralClick}>Neutral</button>
      <button onClick={handleBadClick}>Bad</button>
    </div>
  );
};

const Stats = ({good,neutral,bad}) => {
  return (
    <div>
      <h1>Statistics</h1>
      <p>Good: {good}</p>
      <p>Neutral: {neutral}</p>
      <p>Bad: {bad}</p>
    </div>
  )
}


const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => 
    setGood(good + 1)
  const handleNeutralClick = () =>
    setNeutral(neutral + 1)
  const handleBadClick = () =>
    setBad(bad + 1)

  return (
    <div>
      <Header />
      <Buttons 
        handleGoodClick={handleGoodClick} 
        handleNeutralClick={handleNeutralClick} 
        handleBadClick={handleBadClick}
      />
      <Stats 
        good={good} 
        neutral={neutral} 
        bad={bad}
      />
    </div>
  )
}

export default App