import "./styles.css";
import React from "react";
import Die from "./Die";
import {nanoid} from "nanoid"
import Confettie from "./Confetti"

export default function App() {

  const [diceElements , setDiceElements] = React.useState(randomGenerator())
  const [tenzies , setTenzies] = React.useState(false);
  const [currentScore , setCurrentScore] = React.useState(0);
  const [isNewRecord,setIsNewRecord] = React.useState(false);
  const [bestScore , setBestScore] = React.useState(
     
      () => JSON.parse(localStorage.getItem('bestScore')) || 100
     
     )

  React.useEffect(()=>{
    
    localStorage.setItem("bestScore",JSON.stringify(bestScore));
  },[bestScore])


  React.useEffect(()=>
    {

      const firstElement = diceElements[0].value;
      const allHeld = diceElements.every(dice => dice.isHeld)
      const allSameVal = diceElements.every(dice => dice.value === firstElement)
      if (allHeld && allSameVal)
      {
         if(currentScore < bestScore)
         {
           setBestScore(currentScore)
           setIsNewRecord(true);
         }
         setTenzies(true);
      }
    
    },[diceElements])
   
  function generateNewDice(preValue)
  {
    let randomVal = 1 ; 
    do
    {
      randomVal = Math.floor(Math.random() * 6) + 1; 
      if(randomVal !== preValue)
      {
        break;
      }

    }while(true)
    
    return {
          value : randomVal ,
          isHeld : false,
          id : nanoid()
    }
  }

  function randomGenerator()
  {
    const diceArray = [];
    for(let i = 0 ; i<10 ; i++)
    {
      diceArray.push(generateNewDice())
    }
    return diceArray;
  }
  

  function handleRoll()
  {
    if(!tenzies)
    {
      setCurrentScore(prevScore => prevScore + 1)
    }

    if(tenzies)
     {
       setTenzies(false)
       setCurrentScore(0);
       setIsNewRecord(false);
       setDiceElements(randomGenerator())

    }  
    else{
      setDiceElements(prev =>{
        return prev.map(item =>{
          return item.isHeld === true ? item : generateNewDice(item.value)
        })
      })
    }
  

  }

  function makeFixed(id)
  {
    setDiceElements(prev =>{

      return prev.map(item =>{
        return (item.id === id ? {...item , isHeld : !item.isHeld} : item)
      })
    })  
  }
 
  const dieElements = diceElements.map(item => {
    return (
            <Die 
                key = {item.id} 
                dieInfo = {item} 
                fixed = {makeFixed} 
                 
            />)
  })

  return (
        <main>
            {tenzies && <Confettie />}
            <div className="current-score">
                <p className="current">Current score : {currentScore}</p>
            </div>
             <h1 className="title">Tenzies</h1>
            <p className="instructions">{ tenzies && isNewRecord  ? "Congratulations you set a new record 👏🏻👏🏻":
             tenzies|| isNewRecord? "Winner...winner Congratulations 👏🏻👏🏻" : 
            "Roll until all dice are the same. Click each die to freeze it at its current value between rolls."}</p>
          <div className="die-grid">  
            {dieElements}
          </div>
          <button onClick={handleRoll}>{tenzies ? "New Game" : "Roll" }</button>
          { bestScore !==100 ? <p className="instructions">Play again and break your record <br /><br /> Your best score is : {bestScore} attempts </p> : ""}
        </main>

)}

