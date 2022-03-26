
const got = require('got');
let baseApiUrl = "https://swapi.dev/api/"



function get(url) {
	console.debug(`get:\"${url}\"`)
	
	return got(url, {responseType: 'json'}).then(response => {
	  return response.body;
	}).catch(error => {
	  console.warn(error);
	});
}


function list(whichType) {
	let listUrl = baseApiUrl + whichType
	
	return get(listUrl);
}

function search(whichType, searchString) {
	// console.debug(`search:\"${whichType}\";\"${searchString}\"`)
	let searchUrl = baseApiUrl + whichType + "/?search=" + searchString
	
	return get(searchUrl);
}


function baseFunction(whichType, maybeSearchString) {
	if(maybeSearchString.length > 0) {
		return search(whichType, maybeSearchString)
	} else {
		return list(whichType)
	}
}

function getStarships(maybeSearchString = "") {
	return baseFunction("starships", maybeSearchString)
}


function getPeople(maybeSearchString = "") {
	return baseFunction("people", maybeSearchString)
}


function getPlanet(maybeSearchString = "") {
	return baseFunction("planets", maybeSearchString)
}


function isPersonOnPlanet(person, planet) {
	return planet.residents.includes(person.url);
	// return true
}


async function getInformation(req, res) {
	
	Promise.all([getStarships("Death Star"), getPlanet("Alderaan"), getPeople("Darth Vader"), getPeople("Leia Organa")])
		.then( async responses => {
			let useTheForce = {};
			
			//galaxy is screwed if "Darth Vader", etc returns more than 1
			let deathstar = responses[0].results[0]
			let alderaan  = responses[1].results[0]
			let darthvader = responses[2].results[0]
			let leia = responses[3].results[0]
			
			let dvStarshipUrl = darthvader.starships[0] //TODO: check how to choose which startship. Temporarily assume first listed starship is his primary starship. requirement only wants 1 starship in returned info
			
			let dvStarship = await get(dvStarshipUrl);
			
			useTheForce.starship = dvStarship;
			useTheForce.crew = deathstar.crew;
			useTheForce.isLeiaOnPlanet = isPersonOnPlanet(leia, alderaan);
			res.json(useTheForce);
		})
		.catch( error => {
			console.warn(`Failed to fetch: ${error}`)
			res.json(error);
		});
	
}

//export all the functions
module.exports = { getInformation };