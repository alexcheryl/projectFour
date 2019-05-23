app = {};

app.key = `12566759-41f529f34c688ea00af1b8bca`;

app.getResults = (query) => {
	$.ajax({
		url: 'https://api.myjson.com/bins/18g2uk',
		method: 'GET',
		dataType: 'json',
		data: {
			key: app.key,
			format: 'json',
			q: query
		}
	}).then(function (results) {
		console.log(results)
	});
};
app.displayPhoto = () => {

};

app.displayCollective = () => {
// array of 

};

app.userInput = () => {

// })
};

app.init = () => {
	app.getResults(``);
	// app.userInput();
};
$(function () {
	app.init();
});