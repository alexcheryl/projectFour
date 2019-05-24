app = {};

app.key = `12566759-41f529f34c688ea00af1b8bca`;

app.collectiveURL = `https://api.myjson.com/bins/18g2uk`;

app.photoURL = `https://pixabay.com/api/?`;
// key=12566759-41f529f34c688ea00af1b8bca&q=elephant&image_type=photo

app.collectiveResults = (pluralAnimal, singularAnimal) => {
	
	$.ajax({
	url: app.collectiveURL,
	method: 'GET',
	dataType: 'json',
	data: {
		format: 'json'
	}
	}).then(function (results) {
		
		if (results.animals[singularAnimal] === undefined) {
			console.log(results.animals[pluralAnimal])
		} else if (results.animals[pluralAnimal] === undefined) {
			console.log(results.animals[singularAnimal])
		} else {
			// this is sketchy // try kangaroos but also purple but also injfjgdnrg - gives diff things
			console.log('please enter valid animal')
		}
	
		app.photoResults = $.ajax({
			url: app.photoURL, 
			method: 'GET',
			dataType: 'json',
			data: {
			key: app.key,
			format: 'json',
			q: `${pluralAnimal}`
			}
		}).then(function (results) {
			console.log(results.hits[1].largeImageURL);
		})
	})
	
} 



app.displayPhoto = () => {

};

app.displayCollective = () => {

};

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
}


app.userInput = () => {
	$('#submitAnimal').click(function (event) {
    	event.preventDefault()
		const userAnimal = $('input[id=textBox]').val();
		const animal = userAnimal.toLowerCase();
		const animalInLetters = animal.split('');
		app.userInputErrorHandle(animalInLetters);
	});
};
app.userInput();

app.init = () => {
	// app.userInput();
};
$(function () {
	app.init();
});