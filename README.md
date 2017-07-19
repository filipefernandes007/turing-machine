# Turing Machine
##### Turing Machine Javascript Implementation
This implementation is based on wikipedia material: https://en.wikipedia.org/wiki/Turing_machine

Clone the repository and open index.html:
```sh
$ git clone https://github.com/filipefernandes007/turing-machine.git
$ cd turing-machine
$ open index.html
```
To use the javascript code in your own projects, all you have to do is
initiate turingMachine object and run it: 
```javascript
turingMachine.init(); 
runner.run();
```
Look at the code - lib/turingmachine.js -, and you will find methods to add your own decision table (table state symbol):

- add an entry to the state/symbol table: ```turingMachine.table.addState(0, 'A', 1, 'R', 'B');```

The signature of this method is: 
> addState(tapeSymbol, currentState, writeSymbol, moveTape, nextState)

- define the states like this: ```turingMachine.M.Q = ['A','B','C']; ```
- define the tape: ``` turingMachine.tape = [0,1,0,1,0,1]; ```
- put the header in a start position: ``` turingMachine.head = 0; // position 0 of the tape ```
- define the initial state register of the Turing machine: ``` turingMachine.stateRegister = turingMachine.M.q0; ```