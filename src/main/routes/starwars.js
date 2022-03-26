
const got = require('got');
const baseApiUrl = "https://swapi.dev/api/"

//improvement: logging and log level, maybe

function get(url) {
	// console.debug(`${new Date()} called get:\"${url}\"`)
	
	return got(url, {responseType: 'json'}).then(response => {
	  return response.body;
	}).catch(error => {
	  console.warn(error);
	});
}


function list(whichType) {
	const listUrl = baseApiUrl + whichType
	
	return get(listUrl);
}

function search(whichType, searchString) {
	const searchUrl = baseApiUrl + whichType + "/?search=" + searchString
	
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
	if(!!planet && !! planet.residents && planet.residents.length > 0) return planet.residents.includes(person.url);
	return false;
}

function getOrElse(optional, elseValue) {
	if (!!optional) return optional;
	else return elseValue;
}

function getInformationImpl(
		bigScaryDeathMachine = "Death Star",
		innocentVictimForEmotionalGutWrench = "Alderaan",
		evilWarlord = "Darth Vader",
		aGirlWorthFightingFor = "Leia Organa"
	) {
	// console.log(`${new Date()} called getInformationImpl`)
	return Promise.all([getStarships(bigScaryDeathMachine), getPlanet(innocentVictimForEmotionalGutWrench), getPeople(evilWarlord), getPeople(aGirlWorthFightingFor)])
		.then( async responses => {
			
			//galaxy is screwed if "Darth Vader", etc returns more than 1
			//TODO: Check with business, what if no results? Default or error?
			const deathstar = getOrElse(responses[0].results[0], {})
			const alderaan  = getOrElse(responses[1].results[0], {})
			const darthvader = getOrElse(responses[2].results[0], {})
			const leia = getOrElse(responses[3].results[0], {})
			
			const deathstarCrew = getOrElse(deathstar.crew, 0);
			let dvStarship = {}
			
			if (!!darthvader.starships && darthvader.starships.length > 0) {
				const dvStarshipUrl = darthvader.starships[0] //TODO: check how to choose which startship. Temporarily assume first listed starship is his primary starship. requirement only wants 1 starship in returned info
				
				dvStarship = await get(dvStarshipUrl);
			}
			
			const theForceThatBindsEverything = {"starship": dvStarship, "crew": deathstarCrew, "isLeiaOnPlanet": isPersonOnPlanet(leia, alderaan)};
			return theForceThatBindsEverything;
		})
		.catch( error => {
			console.warn(`Failed to fetch, error is: ${error}`)
			return error;
		});
}

async function getInformation(req, res) {
	// console.log(`${new Date()} called getInformation`)
	const obj = await getInformationImpl("Death Star", "Alderaan", "Darth Vader", "Leia Organa")
	res.json(obj)
}

//export all the functions
module.exports = { getInformation, getInformationImpl};