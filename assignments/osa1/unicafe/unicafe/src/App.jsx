import { use, useState } from 'react'

const Header = () => {
  return (
    <div>
      <h1>Give feedback for unicafe</h1>
    </div>
  )
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Buttons = ({ handleGoodClick, handleNeutralClick, handleBadClick}) => {
  return (
    <div> 
      <Button handleClick={handleGoodClick} text="good" />
      <Button handleClick={handleNeutralClick}text="neutral"/>
      <Button handleClick={handleBadClick}text="bad"/>
    </div>
  );
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good,neutral,bad,countAll,countAverage,countPositive}) => {
  if (countAll === 0) {
    return (
      <div>
        <h1>Statistics</h1>
        <p>No feedback submitted</p>
      </div>
    )
  }
  return (
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="Good" value={good} />
          <StatisticLine text="Neutral" value={neutral} />
          <StatisticLine text="Bad" value={bad} />
          <StatisticLine text="All feedback" value={countAll} />
          <StatisticLine text="Average feedback" value={countAverage} />
          <StatisticLine text="Positive feedback" value={`${countPositive} %`} />
        </tbody>
      </table>
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