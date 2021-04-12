import React from 'react'
import { operators, clear, equals, digits } from './operations.js'
import { isFormula, calculateFormula, formulaWithoutOperatorsAtTheEnd } from './utils.js'

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formula: "0",
      startNew: true,
      hasResult: false,
      canBeNegative: true,
      lastIsOperator: false
    };
  }

  handleOperators(event) {
    const current = event.target.value;
    let currentFormula = this.state.formula + current;

    if (this.state.startNew) {
      if (this.state.hasResult) // new formula has the previous result as the starting digits
        this.setState({ formula: currentFormula, startNew: false, hasResult: true, canBeNegative: false, lastIsOperator: true });
      else // new formula starts with the current digit
        this.setState({ formula: current, startNew: false, hasResult: true, canBeNegative: false, lastIsOperator: true });
      return;
    }

    if (!this.state.lastIsOperator) {
      this.setState({ formula: currentFormula, startNew: false, hasResult: true, canBeNegative: current !== '.', lastIsOperator: true });
      return;
    }

    if (current !== '-') {// we use the last entered operation
      currentFormula = formulaWithoutOperatorsAtTheEnd(this.state.formula) + current;
      this.setState({ formula: currentFormula, startNew: false, hasResult: true, canBeNegative: current !== '-', lastIsOperator: true });
      return;
    }

    const prevElement = this.state.formula[this.state.formula.length - 1];
    if (prevElement !== '-') {
      this.setState({ formula: currentFormula, startNew: false, hasResult: true, canBeNegative: false, lastIsOperator: true });
      return;
    }

    if (this.state.canBeNegative)
      this.setState({ formula: currentFormula, startNew: false, hasResult: true, canBeNegative: false, lastIsOperator: true });
    else {
      currentFormula = formulaWithoutOperatorsAtTheEnd(this.state.formula) + current;
      this.setState({ formula: currentFormula, startNew: false, hasResult: true, canBeNegative: true, lastIsOperator: true });
    }
  }

  handleDigits(event) {
    const current = event.target.value;

    if (this.state.startNew) {// starting a new formula with the current digit
      this.setState({ formula: current, startNew: false, hasResult: true, canBeNegative: true, lastIsOperator: false });
      return;
    }

    let currentFormula = this.state.formula + current; //adding the new digit to the formula
    if (isFormula(currentFormula)) {
      this.setState({ formula: currentFormula, startNew: false, hasResult: true, canBeNegative: true, lastIsOperator: false });
      return;
    }

    // if regexp failed and the previous symbol is '.', we remove the '.'
    if (this.state.formula.length > 1 && this.state.formula[this.state.formula.length - 1] === ".") {
      let formulaButLast = this.state.formula.substring(0, this.state.formula.length - 1);
      currentFormula = formulaButLast + current;
      if (isFormula(currentFormula))
        this.setState({ formula: currentFormula, startNew: false, hasResult: true, canBeNegative: true, lastIsOperator: false });
    }
  }

  handleClear() {
    this.setState({ formula: "0", startNew: true, canBeNegative: true, hasResult: false, lastIsOperator: false });
  }

  handleEquals() {
    if (!isFormula(this.state.formula)) { //cannot calculate, return NaN as result
      this.setState({ formula: NaN, startNew: true, hasResult: false, canBeNegative: true, lastIsOperator: false });
      return;
    }

    let result = calculateFormula(this.state.formula);
    this.setState({ formula: result, startNew: true, hasResult: true, canBeNegative: true, lastIsOperator: false });
  }

  render() {
    return (
      <div id="calculator">
        <div id="display">{this.state.formula}</div>
        <div className="grid-container">
          {digits.map((x, i) => {
            return (
              <button onClick={this.handleDigits.bind(this)} value={x.operation} id={x.id} style={{ gridArea: x.id }} key={i}>{x.operation}</button>
            )
          })}
          {operators.map((x, i) => {
            return (
              <button onClick={this.handleOperators.bind(this)} value={x.operation} id={x.id} style={{ gridArea: x.id }} key={i}>{x.operation}</button>
            )
          })}
          <button onClick={this.handleClear.bind(this)} id={clear.id} style={{ gridArea: clear.id }} key={clear.id}>{clear.operation}</button>
          <button onClick={this.handleEquals.bind(this)} id={equals.id} style={{ gridArea: equals.id }} key={equals.id}>{equals.operation}</button>
        </div>
      </div>
    );
  }
}

export default Calculator;