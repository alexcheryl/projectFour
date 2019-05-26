app = {};

app.key = `12566759-41f529f34c688ea00af1b8bca`;

app.collectiveURL = `https://api.myjson.com/bins/18g2uk`;

app.photoURL = `https://pixabay.com/api/?`;

app.animalInput;

app.randomChoice;

app.collectiveResults = (pluralAnimal, singularAnimal) => {
	
	$.ajax({
	url: app.collectiveURL,
	method: 'GET',
	dataType: 'json',
	data: {
		format: 'json'
	}
	}).then(function (results) {
	
		if (pluralAnimal >= 0) {
			let randomAnimalArray = Object.entries(results.animals)
			app.animalInput = randomAnimalArray[pluralAnimal];	
		} else if (results.animals[singularAnimal] !== undefined) {
			app.animalInput = results.animals[singularAnimal]			
			console.log(app.animalInput)
		} else if (results.animals[pluralAnimal] !== undefined) {
			app.animalInput = results.animals[pluralAnimal]
			console.log(app.animalInput)
		} else if (singularAnimal === '' || pluralAnimal === 's') {
			$(`#instruction`).html(`Please type in an animal before hitting submit! (ex. Dogs)`)
			console.log('please type an animal')	
		} else {
			console.log('please enter valid animal')
			$(`#instruction`).html(`Sorry, that animal is not in our database. Try another one! (ex. Cats)`);
		};

		app.displayCollective(pluralAnimal, app.animalInput);																											

		if (app.animalInput !== undefined) {
			app.photoResults = $.ajax({
				url: app.photoURL, 
				method: 'GET',
				dataType: 'json',
				data: {
					key: app.key,
					format: 'json',
					q: `${pluralAnimal}`,
					orientation: `horizontal`,
					image_type: `photo`,
					editors_choice: true
				}
			}).then(function (results) {
				// problem with the ferret was that it was coming back undefined, so I just put an extra if / else statement that if its undefined then do ajax call without editors choice :)

				if (results.hits[0] !== undefined) {
					app.displayBackground(results.hits[0].largeImageURL)
				} else {
					app.photoResults = $.ajax({
					url: app.photoURL, 
					method: 'GET',
					dataType: 'json',
					data: {
						key: app.key,
						format: 'json',
						q: `${pluralAnimal}`,
						orientation: `horizontal`,
						image_type: `photo`,
						}
					}).then(function (results) {
						app.displayBackground(results.hits[0].largeImageURL)
					})
				}
			})
		}
	});
};


app.displayBackground = (results) => {
	$(`.newBackground`).css(`background-image`, `url(${results})`);
	};

app.displayCollective = (animal, results) => {
	if (animal >= 0) {
		$(`#instructionContainer`).html(`<p class="fact">A collection of <span class="animalText">${app.animalInput[0]}</span> is known as a:</p><span class="collectiveText">${results[1].collective}</span>`);
	} else {
		$(`#instructionContainer`).html(`<p class="fact">A collection of <span class="animalText">${animal}</span> is known as a:</p><span class="collectiveText">${results.collective}</span>`);
	}
};

app.userInputErrorHandle = (animalInLetters) => {
	const lastLetter = animalInLetters.slice(-1);
	const secondLast = animalInLetters.slice(-2);
	const originalAnimal = animalInLetters.join('');
	if (secondLast[0] === 'e'&& lastLetter[0] === 's') {
		const pluralAnimal = animalInLetters.join('');
		const singular = animalInLetters.slice(0, -2);
		const singularAnimal = singular.join('');
		app.collectiveResults(pluralAnimal, singularAnimal);
	} else if (lastLetter[0] === 's') {
		const pluralAnimal = animalInLetters.join('');
		const singular = animalInLetters.slice(0, -1);
		const singularAnimal = singular.join('');
		app.collectiveResults(pluralAnimal, singularAnimal);
	} else if (secondLast[0] === 's' && lastLetter[0] === 'h') {
		const singularAnimal = animalInLetters.join('');
		const plural = animalInLetters.push('e', 's');
		const pluralAnimal = animalInLetters.join('');
		app.collectiveResults(pluralAnimal, singularAnimal)
	} else if (lastLetter[0] != 's') {
		const singularAnimal = animalInLetters.join('');
		const plural = animalInLetters.push('s');
		const pluralAnimal = animalInLetters.join('');
		app.collectiveResults(pluralAnimal, singularAnimal)
	} 
};

app.userInput = () => {
	$('#submitAnimal').click(function (event) {
    	event.preventDefault()
		const userAnimal = $('input[id=textBox]').val();
		const animal = userAnimal.toLowerCase();
		const animalInLetters = animal.split('');
		app.userInputErrorHandle(animalInLetters);
	});
};

app.randomChoice = () => {
	$(`#randomCollective`).click(function (event) {
		event.preventDefault()
		let randomChoice = Math.floor(Math.random() * 1000) + 1;
		app.collectiveResults(randomChoice)
	});
};

app.init = () => {
	app.userInput();
	app.randomChoice();
};

$(function () {
	app.init();
});