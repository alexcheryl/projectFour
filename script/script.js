app = {};

app.key = `12566759-41f529f34c688ea00af1b8bca`;

app.collectiveURL = `https://api.myjson.com/bins/18g2uk`;

app.photoURL = `https://pixabay.com/api/?`;

app.animalInput;

app.collectiveResults = (pluralAnimal, singularAnimal) => {
	
	$.ajax({
	url: app.collectiveURL,
	method: 'GET',
	dataType: 'json',
	data: {
		format: 'json'
	}
	}).then(function (results) {
		
		if (results.animals[singularAnimal] !== undefined) {
			app.animalInput = results.animals[singularAnimal]			
			console.log(animalInput)
		} else if (results.animals[pluralAnimal] !== undefined) {
			app.animalInput = results.animals[pluralAnimal]
		} else {
			console.log('please enter valid animal')
		}

		console.log(app.animalInput);

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
					image_type: `photo`
				}
			}).then(function (results) {
				app.displayBackground(results.hits[0].largeImageURL)
			})
		}
	});
};



app.displayBackground = (results) => {
	console.log(results)
	$(`body`).css(`"background-image", "url(${results})"`);
};

// app.displayCollective = () => {

// };

app.userInputErrorHandle = (animalInLetters) => {
	const lastLetter = animalInLetters.slice(-1);
	if (lastLetter[0] === 's') {
		const pluralAnimal = animalInLetters.join('');
		const singular = animalInLetters.slice(0, -1);
		const singularAnimal = singular.join('');
		app.collectiveResults(pluralAnimal, singularAnimal);
		
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

// app.userInput();

app.init = () => {
	app.userInput();
};
$(function () {
	app.init();
});