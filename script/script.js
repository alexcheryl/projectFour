app = {};

app.key = `12566759-41f529f34c688ea00af1b8bca`;

app.collectiveURL = `https://api.myjson.com/bins/18g2uk`;

app.photoURL = `https://pixabay.com/api/?key=12566759-41f529f34c688ea00af1b8bca&q=elephants&image_type=photo`;

app.collectiveResults = $.ajax({
		url: app.collectiveURL,
		method: 'GET',
		dataType: 'json',
		data: {
			format: 'json',
			q: ``
		}
}).then(function (results) {
	console.log(results)
	app.photoResults = $.ajax({
		url: app.photoURL,
		method: 'GET',
		dataType: 'json',
		data: {
			key: app.key,
			format: 'json',
			q: ``
		}
	}).then(function (results) {
		console.log(results)
	});
});

app.displayPhoto = () => {

};

app.displayCollective = () => {

};

app.userInput = () => {

};

app.init = () => {
	// app.userInput();
};
$(function () {
	app.init();
});