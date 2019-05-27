app = {};
// api variables
app.key = `12566759-41f529f34c688ea00af1b8bca`;
app.collectiveURL = `https://api.myjson.com/bins/1gtczo`;
app.photoURL = `https://pixabay.com/api/?`;
//some helpful variables
app.animalInput;
app.randomClick;
app.holdAnimalVariable;
// jquery variables
app.$instructions = $(`#instruction`);
app.$instructionContainer = $(`#instructionContainer`);
app.$newBackground = $(`.newBackground`);
app.$submitAnimal = $(`#submitAnimal`);
app.$randomCollective = $(`#randomCollective`);
app.$tryAgain = $(`.tryAgain`);
app.$submitContainer = $(`.submitContainer, .collectiveTextBox`);
// ajax call
app.collectiveResults = (pluralAnimal, singularAnimal) => {
	//calling our collective names api
	$.ajax({
	url: app.collectiveURL,
	method: `GET`,
	dataType: `json`,
	data: {
		format: `json`
	}
	}).then(function (results) {
		//when pluralAnimal is a number it means it has been passed from the randomClick function
		if (pluralAnimal >= 0) {
			// turn the returned object into an array
			let randomAnimalArray = Object.entries(results.animals)
			// and assign it to a variable
			app.animalInput = randomAnimalArray[pluralAnimal];
			// if only a pluralAnimal has been passed
		} else if (results.animals[singularAnimal] !== undefined) {
			// assign the return that cooresponds to the user's search to a variable
			app.animalInput = results.animals[singularAnimal];
			// hold animal variable
			app.holdAnimalVariable = singularAnimal;
			// if only a singularAnimal has been passed
		} else if (results.animals[pluralAnimal] !== undefined) {
			// assign the return that cooresponds to the user's search to a variable
			app.animalInput = results.animals[pluralAnimal];
			// hold animal variable
			app.holdAnimalVariable = pluralAnimal;
			// controlling for users entering nothing
		} else if (singularAnimal === `` || pluralAnimal === `s`) {
			app.$instructions.html(`Please type in an animal before hitting submit! (ex. Dogs)`)
			app.$instructions.attr(`aria-label`, `Please type an animal in the textbox before hitting submit! (ex. Dogs)`);

			// if user's search has content but returns nothing
		} else {
			app.$instructions.html(`Sorry, that animal is not in our database. Please try another one! (ex. Cats)`);
			app.$instructions.attr(`aria-label`, `Sorry, that animal is not in our database. Please try another one! (ex. Cats)`)
		};
		// only search for the photo if we get a result from the first call
		if (app.animalInput !== undefined) {
			// handling the fact that pluralAnimal is different depending on which button we use 
			if (pluralAnimal >= 0) {
				query = app.animalInput[0];
			} else {
				query = pluralAnimal;
			}
			//pixabay call
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
				// if we get a picture back
				if (results.hits[0] !== undefined) {
					app.displayBackground(results.hits[0].largeImageURL)
					app.displayCollective(app.animalInput);
					app.hideButton();
					//else, do the search again without the editor's choice requirement
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
						// if we get a picture back
						if (results.hits[0] !== undefined) {
							app.displayBackground(results.hits[0].largeImageURL);
							app.displayCollective(app.animalInput);
							app.hideButton();
						} else {
							// call the randomClick function again, looping until we have a result from both calls
							app.randomClick()
						}
					})
				}
			})
		}
	});
};
// displaying the returned picture to the background of our page
app.displayBackground = (results) => {
	app.$newBackground.css(`background-image`, `url(${results})`);
};
// displaying the returned animal collective to our page
app.displayCollective = (results) => {
	console.log(results.collective)
	// handling the fact that pluralAnimal is different depending on which button we use 
	if (typeof results.collective === `string`) {
		app.$instructionContainer.html(`<p class="fact">A collection of <span class="animalText">${app.holdAnimalVariable}</span> is known as</p><span class="collectiveText">${results.collective}</span>`);
		app.$instructionContainer.attr(`aria-label`, `A collective of ${app.holdAnimalVariable} is known as ${results.collective}`)

	} else {
		let resultsString = results[1].collective;
		let lowerCaseString = resultsString.toLowerCase();
		app.$instructionContainer.html(`<p class="fact">A collection of <span class="animalText">${results[0]}</span> is known as</p><span /class="collectiveText">${lowerCaseString}</span>`);
		
		app.$instructionContainer.attr(
		`aria-label`,
		`A collective of ${results[0]} is known as ${lowerCaseString}`
		)
	}
};

// user error handling
app.userInputErrorHandle = (animal) => {
	// split it into individual letters
	const animalArray = animal.split(``);
	// grab the last two letters of the word
	const lastLetter = animalArray.slice(-1);
	const secondLast = animalArray.slice(-2);
	// turn the array back into a single word
	let originalAnimal = animalArray.join(``);
	// if the animalArray ends in y
	if (lastLetter[0] === `y`) {
		// remove the last letter
		animalArray.pop(1);
		// add ies to the end
		animalArray.push(`i`, `e`, `s`);
		// turn the array back into a single word
		const pluralAnimal = animalArray.join(``);
		app.collectiveResults(pluralAnimal, originalAnimal);
		// if the animalArray ends in es
	} else if (secondLast[0] === `e`&& lastLetter[0] === `s`) {
		// remove the last two letters
		const singular = animalArray.slice(0, -2);
		// turn the array back into a single word
		const singularAnimal = singular.join(``);
		app.collectiveResults(originalAnimal, singularAnimal);
		// if the animalArray ends in s
	} else if (lastLetter[0] === `s`) {
		// remove the last letter
		const singular = animalArray.slice(0, -1);
		// turn the array back into a single word
		const singularAnimal = singular.join(``);
		app.collectiveResults(originalAnimal, singularAnimal);
		// if the animalArray ends in sh
	} else if (secondLast[0] === `s` && lastLetter[0] === `h`) {
		// turn the array back intoa  single word
		const singularAnimal = animalArray.join(``);
		// turn the array back into a single word
		const pluralAnimal = animalArray.join(``);
		app.collectiveResults(pluralAnimal, singularAnimal)
		// if the animalArray doesn't end in es
	} else if (lastLetter[0] != `s`) {
		const singularAnimal = animalArray.join(``);
		// add an s to the end of the array
		animalArray.push(`s`)
		// turn the array back into a single word
		const pluralAnimal = animalArray.join(``);
		app.collectiveResults(pluralAnimal, singularAnimal)
	} 
};

// user input handler
app.userInput = () => {
	// event listener for the user submit button
	app.$submitAnimal.click(function (event) {
		event.preventDefault()
		// grab the value from the user input
		const userAnimal = $(`input[id=textBox]`).val();
		// make sure it's all lowercase
		const animal = userAnimal.toLowerCase();
		// call the error handling function
		app.userInputErrorHandle(animal);
	});
};

// random animal function
app.randomClick = () => {
	// random animal button event listener
	app.$randomCollective.click(function (event) {
		event.preventDefault()
		let random = Math.floor(Math.random() * 340) + 1;
		app.collectiveResults(random)
	});
};

// go again function
app.GoAgain = () => {
	// random animal button event listener
	app.$tryAgain.click(function (event) {
		event.preventDefault();
		app.$submitContainer.show(`700`);
		app.$tryAgain.hide(`1000`);
		document.getElementById(`form`).reset();
	});
};

// hide form function
app.hideButton = () => {
	app.$submitContainer.hide(`1000`);
	app.$tryAgain.show(`700`);
}

// init function
app.init = () => {
	app.userInput();
	app.randomClick();
	app.GoAgain();
};

// document ready
$(function () {
	app.init();
});