app = {};

app.key = `12566759-41f529f34c688ea00af1b8bca`;

app.collectiveURL = `https://api.myjson.com/bins/1gtczo`;

app.photoURL = `https://pixabay.com/api/?`;

app.animalInput;

app.randomChoice;

app.collectiveResults = (pluralAnimal, singularAnimal) => {
	
	$.ajax({
	url: app.collectiveURL,
	method: `GET`,
	dataType: `json`,
	data: {
		format: `json`
	}
	}).then(function (results) {
		if (pluralAnimal >= 0) {
			let randomAnimalArray = Object.entries(results.animals)
			app.animalInput = randomAnimalArray[pluralAnimal];
			console.log(app.animalInput)
		} else if (results.animals[singularAnimal] !== undefined) {
			app.animalInput = results.animals[singularAnimal]			
			console.log(app.animalInput)
		} else if (results.animals[pluralAnimal] !== undefined) {
			app.animalInput = results.animals[pluralAnimal]
			console.log(app.animalInput)
		} else if (singularAnimal === `` || pluralAnimal === `s`) {
			$(`#instruction`).html(`Please type in an animal before hitting submit! (ex. Dogs)`)
		} else {
			$(`#instruction`).html(`Sorry, that animal is not in our database. Please try another one! (ex. Cats)`);
		};

		if (app.animalInput !== undefined) {
			if (pluralAnimal >= 0) {
				query = app.animalInput[0];				
			} else {
				query = pluralAnimal;
			}

			app.photoResults = $.ajax({
				url: app.photoURL, 
				method: `GET`,
				dataType: `json`,
				data: {
					key: app.key,
					format: `json`,
					q: query,
					orientation: `horizontal`,
					image_type: `photo`,
					editors_choice: true
				}
			}).then(function (results) {
				if (results.hits[0] !== undefined) {
					app.displayBackground(results.hits[0].largeImageURL)
					app.displayCollective(pluralAnimal, app.animalInput);
					app.hideButton();
				} else {
					app.photoResults = $.ajax({
					url: app.photoURL, 
					method: `GET`,
					dataType: `json`,
					data: {
						key: app.key,
						format: `json`,
						q: query,
						orientation: `horizontal`,
						image_type: `photo`,
						editors_choice: false
					}
				}).then(function (results) {
						if (results.hits[0] !== undefined) {
							app.displayBackground(results.hits[0].largeImageURL)
							app.displayCollective(pluralAnimal, app.animalInput);
							app.hideButton();
						} else {
							console.log(`looped!`)
							app.randomChoice()
						}
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
		let randomResultsString = results[1].collective;
		let randomLowerCaseString = randomResultsString.toLowerCase();
		$(`#instructionContainer`).html(`<p class="fact">A collection of <span class="animalText">${app.animalInput[0]}</span> is known as</p><span class="collectiveText">${randomLowerCaseString}</span>`);
	} else {
		let resultsString = results.collective;
		let lowerCaseString = resultsString.toLowerCase();
		$(`#instructionContainer`).html(`<p class="fact">A collection of <span class="animalText">${animal}</span> is known as</p><span class="collectiveText">${lowerCaseString}</span>`);
	}
};

app.userInputErrorHandle = (animal) => {
	// split it into individual letters
	const animalInLetters = animal.split(``);
	// the last three letters of the word
	const lastLetter = animalInLetters.slice(-1);
	const secondLast = animalInLetters.slice(-2);
	const thirdLast = animalInLetters.slice(-3);
	let originalAnimal = animalInLetters.join(``);
	if (lastLetter[0] === `y`) {
		// const singular = animalInLetters.slice(-1)
		console.log(lastLetter)
	} else if (secondLast[0] === `e`&& lastLetter[0] === `s`) {
		const singular = animalInLetters.slice(0, -2);
		const singularAnimal = singular.join(``);
		app.collectiveResults(originalAnimal, singularAnimal);
	} else if (lastLetter[0] === `s`) {
		const singular = animalInLetters.slice(0, -1);
		const singularAnimal = singular.join(``);
		app.collectiveResults(originalAnimal, singularAnimal);
	} else if (secondLast[0] === `s` && lastLetter[0] === `h`) {
		const singularAnimal = animalInLetters.join(``);
		console.log(singularAnimal)		
		const pluralAnimal = animalInLetters.join(``);
		console.log(pluralAnimal)		
		app.collectiveResults(pluralAnimal, singularAnimal)
		console.log(singularAnimal)	
	} else if (lastLetter[0] != `s`) {
		animalInLetters.push(`s`)
		console.log(animalInLetters)
		const singularAnimal = animalInLetters.join(``);
		console.log(singularAnimal)
		const pluralAnimal = animalInLetters.join(``);
		console.log(pluralAnimal)
		app.collectiveResults(pluralAnimal, singularAnimal)
	} 
};

app.userInput = () => {
	$(`#submitAnimal`).click(function (event) {
		event.preventDefault()
		// grab the value from the user input
		const userAnimal = $(`input[id=textBox]`).val();
		// make sure it's all lowercase
		const animal = userAnimal.toLowerCase();
		// call the error handling function
		app.userInputErrorHandle(animal);
	});
};

app.randomClick = () => {
	$(`#randomCollective`).click(function (event) {
		event.preventDefault()
		app.randomChoice();
	});
};

app.hideButton = () => {
	$(`.submitContainer, .collectiveTextBox`).hide(`1000`);
	$(`.tryAgain`).show(`700`)
}

app.randomChoice = () => {
	let random = Math.floor(Math.random() * 340) + 1;
	app.collectiveResults(random)
};


app.init = () => {
	app.userInput();
	app.randomClick();
};

$(function () {
	app.init();
});