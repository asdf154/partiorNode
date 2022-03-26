//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let Starwars = require('../main/routes/starwars');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../main/server');
let assert = require('assert');
let should = chai.should();
const tieAdvanced = {
	name: 'TIE Advanced x1',
	model: 'Twin Ion Engine Advanced x1',
	manufacturer: 'Sienar Fleet Systems',
	cost_in_credits: 'unknown',
	length: '9.2',
	max_atmosphering_speed: '1200',
	crew: '1',
	passengers: '0',
	cargo_capacity: '150',
	consumables: '5 days',
	hyperdrive_rating: '1.0',
	MGLT: '105',
	starship_class: 'Starfighter',
	pilots: [ 'https://swapi.dev/api/people/4/' ],
	films: [ 'https://swapi.dev/api/films/1/' ],
	created: '2014-12-12T11:21:32.991000Z',
	edited: '2014-12-20T21:23:49.889000Z',
	url: 'https://swapi.dev/api/starships/13/'
}


chai.use(chaiHttp);


describe('Starwars', () => {
	describe('Testing getInformationImpl', () => {
		it('when using defaults', async (done) => {
			Starwars.getInformationImpl().then((result) => {
				assert.deepEqual(result.starship, tieAdvanced)
				assert.equal(result.crew, "342,953")
				assert.equal(result.isLeiaOnPlanet, true)
				done();
			}).catch((err) => done(err));
		});
		it('when using wrong bigScaryDeathMachine', async (done) => {
			Starwars.getInformationImpl("Daleks", "Alderaan", "Darth Vader", "Leia Organa").then((result) => {
				assert.deepEqual(result.starship, tieAdvanced)
				assert.equal(result.crew, "0")
				assert.equal(result.isLeiaOnPlanet, true)
				done();
			}).catch((err) => done(err));
		});
		it('when using wrong innocentVictimForEmotionalGutWrench', async (done) => {
			Starwars.getInformationImpl("Death Star", "Bambi's mother", "Darth Vader", "Leia Organa").then((result) => {
				assert.deepEqual(result.starship, tieAdvanced)
				assert.equal(result.crew, "342,953")
				assert.equal(result.isLeiaOnPlanet, false)
				done();
			}).catch((err) => done(err));
		});
		it('when using wrong evilWarlord', async (done) => {
			Starwars.getInformationImpl("Death Star", "Alderaan", "Mickey Mouse", "Leia Organa").then((result) => {
				assert.deepEqual(result.starship, {})
				assert.equal(result.crew, "342,953")
				assert.equal(result.isLeiaOnPlanet, true)
				done();
			}).catch((err) => done(err));
		});
		it('when using wrong aGirlWorthFightingFor', async (done) => {
			Starwars.getInformationImpl("Death Star", "Alderaan", "Darth Vader", "Slave Leia").then((result) => {
				assert.deepEqual(result.starship, tieAdvanced)
				assert.equal(result.crew, "342,953")
				assert.equal(result.isLeiaOnPlanet, false)
				done();
			}).catch((err) => done(err));
		});
		it('when using wrong innocentVictimForEmotionalGutWrench and aGirlWorthFightingFor. Just in case 2 double negatives become a positive', async (done) => {
			Starwars.getInformationImpl("Death Star", "Alderaan", "Darth Vader", "Slave Leia").then((result) => {
				assert.deepEqual(result.starship, tieAdvanced)
				assert.equal(result.crew, "342,953")
				assert.equal(result.isLeiaOnPlanet, false)
				done();
			}).catch((err) => done(err));
		});
		//improvement: does mocha support property driven or table driven testing?
	});
	describe('/information', () => {
		it('it should return the json of starwars info', async (done) => {
		chai.request(server)
		.get('/information')
		.end((err, res) => {
			// console.log(res.body)
			res.should.have.status(200);
			res.body.crew.should.be.eql("342,953");
			res.body.isLeiaOnPlanet.should.be.eql(true);
			res.body.should.be.a('Object');

			//todo: test starship internal data
			res.body.starship.should.be.a('Object');
			res.body.starship.should.be.eql(tieAdvanced);
			done();
		});
		});
	});
});