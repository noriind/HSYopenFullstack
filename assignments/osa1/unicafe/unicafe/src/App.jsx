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

const Statistics = ({good,neutral,bad,countAll,countAverage,countPositive}) => {
  return (
    <div>
      <h1>Statistics</h1>
      <p>Good: {good}</p>
      <p>Neutral: {neutral}</p>
      <p>Bad: {bad}</p>
      <p>All feedback: {countAll}</p>
      <p>Average feedback: {countAverage}</p>
      <p>Positive feedback: {countPositive} %</p>
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

  const total = good + neutral + bad
  const average = total === 0 ? 0 : (good - bad) / total
  const positivePercentage = total === 0 ? 0 : (good / total) * 100

  return (
    <div>
      <Header />
      <Buttons 
        handleGoodClick={handleGoodClick} 
        handleNeutralClick={handleNeutralClick} 
        handleBadClick={handleBadClick}
      />
      <Statistics 
        good={good} 
        neutral={neutral} 
        bad={bad}
        countAll={total}
        countAverage={average}
        countPositive={positivePercentage}
      />
    </div>
  )
}

export default App