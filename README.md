# Métodos de ciclo de vida do componente (lifecycle methods)

No React, todo componente tem um ciclo de vida, ou seja, todo componente é montado na tela (renderizado), sofre atualizações e consequetemente é re-montado (re-renderizado) e finalmente é desmontado (removido). O React nos fornece "janelas" para cada um desses momentos no ciclo de vida do componente, chamadas de métodos de ciclo de vida (lifecycle methods):

![fluxograma dos lifecycle methods](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_801d26372f9946811f79250cb98322bf.jpg)

## `componentDidMount`

O `componentDidMount` é executado uma vez assim que o componente é montado (renderizado) na tela. Geralmente colocamos dentro dele operações de inicialização de dados, como buscar informações em uma API ou procurar elementos específicos em uma lista. No exemplo abaixo, vamos usar o `componentDidMount` para inicializar o contador de um cronômetro:

```javascript
import { Component } from "react";

class Counter extends Component {
  constructor() {
    this.state = {
      count: 0,
    };
    console.log("Estou no constructor da classe Counter");
  }

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

  render() {
    console.log("Estou no método render da classe Counter.");
    return <h1> {this.state.count}</h1>;
  }
}

export default Counter;
```

> No código acima, a sequência dos console.logs seria:

```bash
1. Estou no constructor da classe Counter.
2. Estou no método render da classe Counter.
3. o Componente foi montado.
4. Estou no método render da classe Counter.
```

> Note que o responsável por invocar os lifecycle methods é o React, nós apenas os definimos dentro de nossos componentes de classe. O React os invoca internamente a cada ciclo de renderização

## `componentDidUpdate`

O `componentDidUpdate` é executado sempre que o componente sofre qualquer tipo de alteração em suas `props` ou `state`. Como o `setState` é assíncrono, ou seja, não respeita a ordem das linhas de código em sua execução, a única forma de ter certeza que o React terminou de atualizar o `state` é dentro do `componentDidUpdate`, pois esse método só invocado após o `state` ter sido atualizado. O `componentDidUpdate` também é a única forma de reagir a mudanças em `props`, uma vez que mudanças em `props` não causam re-renderizações.

```javascript
import { Component } from "react";

class Counter extends Component {
  constructor() {
    this.state = {
      count: 0,
    };
    console.log("Estou no constructor da classe Counter");
  }

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

  render() {
    console.log("Estou no método render da classe Counter.");
    return <h1> {this.state.count}</h1>;
  }
}

export default Counter;
```

> No código acima, a sequência dos console.logs seria:

```bash
1. Estou no constructor da classe Counter.
2. Estou no método render da classe Counter.
3. o Componente foi montado.
4. Estou no método render da classe Counter.
5. O Componente teve seu estado atualizado DE: 0 PARA: 1
6. Estou no método render da classe Counter.
7. O Componente teve seu estado atualizado DE: 1 PARA: 2
```

> Se você atualizar o state (chamando `this.setState`) dentro do `componentDidUpdate`, você precisa fazer isso dentro de uma condicional que verifica se o `prevState` (state antes da última atualização) ou as `prevProps` (props antes da última atualização) são diferentes do state ou props atuais, caso contrário você criará um loop infinito.

## `componentWillUnmount`

O `componentWillUnmount` roda uma vez antes do componente ser desmontado (removido). É usado para limpar instâncias ou cancelar operações pendentes antes do componente deixar de existir na tela.

Vejamos como o compo `App` está invocando nosso componente Counter:

```javascript
// App.js

import { Component } from "react";

import Counter from "./components/Counter";

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
```

Quando o usuário clicar no botão "Parar o contador", o state de `App` será atualizado para `{isRunning: false}`, fazendo com que o operador ternário do método `render` retorne `null`. Isso destruirá o componente Counter, que antes de ser removido irá executar seu método `componentWillUnmount`:

```javascript
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
```

> No código acima, a sequência dos console.logs seria:

```bash
1. Estou no constructor da classe Counter.
2. Estou no método render da classe Counter.
3. o Componente foi montado.
4. Estou no método render da classe Counter.
5. O Componente teve seu estado atualizado DE: 0 PARA: 1
6. Estou no método render da classe Counter.
7. O Componente teve seu estado atualizado DE: 1 PARA: 2
8. Usuário clicou no botão!
9. ======== Component COUNTER foi DESMONTADO! ========
```
