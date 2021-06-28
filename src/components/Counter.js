import { Component } from "react";

class Counter extends Component {
  constructor() {
    super();
    console.log("Estou no constructor da classe Counter");
  }

  state = {
    count: 0,
  };

  counter = () => {
    this.setState((prevState) => {
      return {
        count: prevState.count + 1,
      };
    });
  };

  componentDidMount() {
    this.timer = setInterval(this.counter, 100);
    console.log("o Componente foi montado.");
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(
      "O Componente teve seu estado atualizado DE: ",
      prevState.count,
      "PARA: ",
      this.state.count
    );
  }

  componentWillUnmount() {
    console.log("======== Component COUNTER foi DESMONTADO! ========");
    clearInterval(this.timer); // Importante limpar o intervalo que incrementava o contador a cada 100 milissegundos, caso contrário ele continuaria incrementando até que a desmontagem fosse concluída, causando bugs
  }

  render() {
    console.log("Estou no método render da classe Counter.");
    return <h1> {this.state.count}</h1>;
  }
}

export default Counter;
