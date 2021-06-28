import { Component } from "react";

import Counter from "./Counter";

class App extends Component {
  state = { isRunning: true };

  stopCounter = () => {
    this.setState({ ...this.state, isRunning: false });
    console.log("Usuário clicou no botão!");
  };

  render() {
    return this.state.isRunning ? (
      <div className="App">
        <h2>
          Clicar nesse botão vai destruir o componente Counter e limpar o state
        </h2>
        <button onClick={this.stopCounter}>Parar o contador</button>

        <Counter />
      </div>
    ) : null;
  }
}

export default App;
