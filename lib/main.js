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
				},
				addState(tapeSymbol, currentState, writeSymbol, moveTape, nextState) {
					var s = {writeSymbol: writeSymbol,
							 moveTape: 	  moveTape,
							 nextState:   nextState};

					this.setState(tapeSymbol, currentState, s);

					return this;
				},
				/**
				 * Transition function, also called delta
				 */
				state: function(i) {

					if(turingMachine.M.Q[i] !== -1) {
						this.stateRegister = turingMachine.M.Q[i];
					}

					return states[this.head][this.stateRegister];
				},
				/**
				 *
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
					
					// what is in the tape
					var head 		= this.getParent().head;
					var scannedType = this.getParent().tape[head];		
					var stateTable  = states[scannedType][currentState];

					this.getParent().tape[head]    = stateTable.writeSymbol;
					this.getParent().stateRegister = stateTable.nextState;

					if(stateTable.moveTape === 'R') {
						head++;
					} else if(stateTable.moveTape === 'L') {
						if(this.getParent().head === 0) {
							throw 'Head is already at position 0. Cannot LEFT!';
						}

						head--;
					}

					this.getParent().head = head;

					var tuple = {currentState: currentState, 
							     scannedType:  scannedType, 
							     writeSymbol:  stateTable.writeSymbol, 
							     moveTape: 	   stateTable.moveTape, 
							     nextState:    stateTable.nextState};

					// return the tuple		
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
		init: function() {
			this.M.Q 			= ['A','B','C'];
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
		run: function() {
			while(!this.halted) {
				var tuple = this.table.delta();

				if(this.toRender) {
					this.render.add(tuple);	
				}
				
			}
		},
		render: {
			tag:       '<td>{VALUE}</td>',
			main: 	   '<tr>{TUPLE}</tr>',
			container: '#result-table',
			add: function(o) {
				var tr    = '';
				var final = '';
				
				for(var key in o) {
					tr += this.tag.replace('{VALUE}', o[key]);
				}

				tr    += this.tag.replace('{VALUE}', turingMachine.tape.toString());  
				final += this.main.replace('{TUPLE}', tr);

				$(this.container).append(final);
			}
		},
		halted: false,
		debug: true,
		toRender: true
	}
})();

var path = {
	path: [],
	add: function(o) {
		this.path.push(o);
	},
	get: function() {
		return this.path;
	}
}


turingMachine.init().run();
