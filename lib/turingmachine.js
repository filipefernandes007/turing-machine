/**
 * Based on https://en.wikipedia.org/wiki/Turing_machine
 *
 * @author Filipe Fernandes <filipefernandes007@gmail.com>
 */
var turingMachine = (function() {
	return {
		tape: [],
		stateRegister: null,
		head: 0, // first position by default
		table: (function() {
			var states = [];

			return {
				getParent: function() {
					return turingMachine;
				},
				getStates: function() {
					return states;
				},
				setStates: function(s) {
					states = s;

					return this;
				},
				setState: function(tapeSymbol, currentState, s) {
					if(states[tapeSymbol] === undefined) {
						states[tapeSymbol] = [];
					}

					if(states[tapeSymbol][currentState] === undefined) {
						states[tapeSymbol][currentState] = [];
					}

					states[tapeSymbol][currentState] = s;

					return this;
				},
				addState(tapeSymbol, currentState, writeSymbol, moveTape, nextState) {
					// verify if current state exists in set states		
					if(turingMachine.M.Q.indexOf(currentState) === -1) {
						throw "State (current state) '" + currentState + "' don't exists in Q!";
					}

					// verify if write symbol exists in alphabet		
					if(turingMachine.M.gamma.indexOf(writeSymbol) === -1) {
						throw "Symbol '" + writeSymbol + "' don't exists in gamma!";
					}

					// verify if move tape symbol exists
					if(['L','R'].indexOf(moveTape) === -1) {
						throw "Move symbol '" + moveTape + "' don't exists in {L,R}!";
					}

					// verify if next state exists in set states		
					if(turingMachine.M.Q.indexOf(nextState) === -1) {
						throw "State (next state) '" + nextState + "' don't exists in Q!";
					}

					var s = {writeSymbol: writeSymbol,
							 moveTape: 	  moveTape,
							 nextState:   nextState};

					return this.setState(tapeSymbol, currentState, s);
				},
				/**
				 * Transition function, also called delta
				 */
				delta: function() {
					var currentState = this.getParent().stateRegister;

					if(turingMachine.M.F.indexOf(currentState) !== -1) {
						this.getParent().halted = true;

						throw 'HALT';
					}

					// verify if state exists in set states		
					if(turingMachine.M.Q.indexOf(currentState) === -1) {
						throw "State '" + currentState + "' don't exists in Q!";
					}
					
					// what is in the head position
					var head 		= this.getParent().head;

					// what is in the tape for the head position
					var scannedType = this.getParent().tape[head];		

					// what is the state table for an entry symbol and state?
					var stateTable  = states[scannedType][currentState];

					// write the symbol at head current position		
					this.getParent().tape[head]    = stateTable.writeSymbol;

					// define the new state of the Turing machine
					this.getParent().stateRegister = stateTable.nextState;

					// move head
					if(stateTable.moveTape === 'R') {
						head++;
					} else if(stateTable.moveTape === 'L') {
						if(this.getParent().head === 0) {
							throw 'Head is already at position 0. Cannot LEFT!';
						}

						head--;
					}

					// update head position		
					this.getParent().head = head;

					// define a 5-entry tuple		
					var tuple = {currentState: currentState, 
							     scannedType:  scannedType, 
							     writeSymbol:  stateTable.writeSymbol, 
							     moveTape: 	   stateTable.moveTape, 
							     nextState:    stateTable.nextState};

					// add the tuple to path, to track it		
					path.add(tuple);

					if(this.getParent().debug) {
						console.log(tuple);
						console.log(this.getParent().tape);
					}

					return tuple;
				}
			}
		})(),
		M: {
			/**
			 * Is a finite, non-empty set of states
			 */
			Q: [],

			/**
			 * Is a finite, non-empty set of tape alphabet symbols
			 * 
			 * b belongs to gamma // sigma is included in gamma
			 */
			gamma: [0,1],

			/**
			 * Tha blank symbol
			 */
			b: 0,

			/**
			 * Is the set of input symbols
			 */
			sigma: [1],

			/**
			 * Intial state
			 */		
			q0: null,

			/**
			 * Is the set of final or accepting states
			 */		
			F: ['HALT','H']
		},
		/**
		 * This method defines a default set of values in order to see 
		 * Turing machine running
		 */
		init: function() {
			this.M.Q 			= ['A','B','C','HALT'];
			this.M.q0			= 'A';
			this.tape 			= [0,1,0,1,0,1];
			this.head		    = 0;
			this.stateRegister  = this.M.q0;
			
			this.table.addState(0, 'A', 1, 'R', 'B');
			this.table.addState(0, 'B', 1, 'L', 'A');
			this.table.addState(0, 'C', 1, 'L', 'B');

			this.table.addState(1, 'A', 1, 'L', 'C');
			this.table.addState(1, 'B', 1, 'R', 'B');
			this.table.addState(1, 'C', 1, 'R', 'HALT');

			return this;
		},
		/**
		 * Halted is set when delta finds a halt symbol
		 */
		halted: false,
		/**
		 * For console.log
		 */
		debug: true,
		/**
		 * Allow render 
		 */
		toRender: true
	}
})();

/**
 * Keep track on Turing machine action
 */
var path = {
	path: [],
	add: function(o) {
		this.path.push(o);
	},
	get: function() {
		return this.path;
	}
}
