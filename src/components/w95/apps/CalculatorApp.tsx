'use client'

import { useState } from 'react'

export function CalculatorApp() {
  const [display, setDisplay] = useState('0')
  const [prevValue, setPrevValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [newNumber, setNewNumber] = useState(true)
  
  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num)
      setNewNumber(false)
    } else {
      setDisplay(display === '0' ? num : display + num)
    }
  }
  
  const handleOperator = (op: string) => {
    const current = parseFloat(display)
    
    if (prevValue !== null && operation) {
      const result = calculate(prevValue, current, operation)
      setDisplay(String(result))
      setPrevValue(result)
    } else {
      setPrevValue(current)
    }
    
    setOperation(op)
    setNewNumber(true)
  }
  
  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b
      case '-': return a - b
      case '*': return a * b
      case '/': return b !== 0 ? a / b : 0
      default: return b
    }
  }
  
  const handleEquals = () => {
    if (prevValue !== null && operation) {
      const current = parseFloat(display)
      const result = calculate(prevValue, current, operation)
      setDisplay(String(result))
      setPrevValue(null)
      setOperation(null)
      setNewNumber(true)
    }
  }
  
  const handleClear = () => {
    setDisplay('0')
    setPrevValue(null)
    setOperation(null)
    setNewNumber(true)
  }
  
  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay('0')
    }
  }
  
  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.')
      setNewNumber(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }
  
  const handlePercent = () => {
    const value = parseFloat(display) / 100
    setDisplay(String(value))
  }
  
  const handleSign = () => {
    const value = parseFloat(display) * -1
    setDisplay(String(value))
  }
  
  return (
    <div className="calculator-app">
      <div className="calc-display">
        {display}
      </div>
      
      <div className="calc-buttons">
        <button className="calc-btn function" onClick={handleClear}>C</button>
        <button className="calc-btn function" onClick={handleBackspace}>⌫</button>
        <button className="calc-btn function" onClick={handlePercent}>%</button>
        <button className="calc-btn operator" onClick={() => handleOperator('/')}>÷</button>
        
        <button className="calc-btn number" onClick={() => handleNumber('7')}>7</button>
        <button className="calc-btn number" onClick={() => handleNumber('8')}>8</button>
        <button className="calc-btn number" onClick={() => handleNumber('9')}>9</button>
        <button className="calc-btn operator" onClick={() => handleOperator('*')}>×</button>
        
        <button className="calc-btn number" onClick={() => handleNumber('4')}>4</button>
        <button className="calc-btn number" onClick={() => handleNumber('5')}>5</button>
        <button className="calc-btn number" onClick={() => handleNumber('6')}>6</button>
        <button className="calc-btn operator" onClick={() => handleOperator('-')}>−</button>
        
        <button className="calc-btn number" onClick={() => handleNumber('1')}>1</button>
        <button className="calc-btn number" onClick={() => handleNumber('2')}>2</button>
        <button className="calc-btn number" onClick={() => handleNumber('3')}>3</button>
        <button className="calc-btn operator" onClick={() => handleOperator('+')}>+</button>
        
        <button className="calc-btn number" onClick={handleSign}>±</button>
        <button className="calc-btn number" onClick={() => handleNumber('0')}>0</button>
        <button className="calc-btn number" onClick={handleDecimal}>.</button>
        <button className="calc-btn equals" onClick={handleEquals}>=</button>
      </div>
    </div>
  )
}
