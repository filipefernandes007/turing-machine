/**
 * Code pieces to run and render the turing machine
 *
 * @author Filipe Fernandes <filipefernandes007@gmail.com>
 */
var runner = {
	run: function() {
		while(!turingMachine.halted) {
			var tuple = turingMachine.table.delta();

			if(turingMachine.toRender) {
				render.add(tuple);	
			}
		}
	}
}

var render = {
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
}
