// PROVIDED CODE BELOW (LINES 1 - 80) DO NOT REMOVE

let store = {
	track_id: undefined,
	player_id: undefined,
	race_id: undefined,
}

document.addEventListener("DOMContentLoaded", function() {
	onPageLoad()
	setupClickHandlers()
})

async function onPageLoad() {
	try {
		getTracks()
			.then(tracks => {
				const html = renderTrackCards(tracks)
				renderAt('#tracks', html)
			})

		getRacers()
			.then((racers) => {
				const html = renderRacerCars(racers)
				renderAt('#racers', html)
			})
	} catch(error) {
		console.log("Problem getting tracks and racers ::", error.message)
		console.error(error)
	}
}

function setupClickHandlers() {
	document.addEventListener('click', function(event) {
		const { target } = event

		// Race track form field
		if (target.matches('.card.track')) {
			handleSelectTrack(target)
		}

		// Podracer form field
		if (target.matches('.card.podracer')) {
			handleSelectPodRacer(target)
		}

		// Submit create race form
		if (target.matches('#submit-create-race')) {
			event.preventDefault()
	
			// start race
			handleCreateRace()
		}

		// Handle acceleration click
		if (target.matches('#gas-peddle')) {
			handleAccelerate(target)
		}

	}, false)
}

async function delay(ms) {
	try {
		return await new Promise(resolve => setTimeout(resolve, ms));
	} catch(error) {
		console.log("an error shouldn't be possible here")
		console.log(error)
	}
}
// ^ PROVIDED CODE ^ DO NOT REMOVE

async function handleCreateRace() { 

	const player_id = store.player_id;
	const track_id = store.track_id;
	try {
		/*if (!player_id || !track_id){
			console.log("Track and/or Player NOT Selected")
			return `Error: Select Track and Player`
		}*/
		const race = await createRace(player_id, track_id);
		//player_id = race.PlayerID;
		store.race_id = parseInt(race.ID) - 1 //https://knowledge.udacity.com/questions/445732
		console.log("Race: ", race)
		console.log(store.race_id)
		
		renderAt('#race', renderRaceStartView(race.Track, race.Cars))
		console.log("raceid", store.race_id);
		

	await runCountdown()

	await startRace(store.race_id)
	
	await runRace(store.race_id)
	} catch(error) { 
    	console.log("error: ", error.message)
	}
}
function runRace(raceID) {
	return new Promise(resolve => {
		const raceInterval = setInterval(async () => {
			let racing = await getRace(raceID)
			console.log(racing)
			if (racing.status === "in-progress") {
					renderAt('#leaderBoard', raceProgress(racing.positions))
			}else if (racing.status === "finished") {
				clearInterval(raceInterval) // to stop the interval from repeating
				renderAt('#race', resultsView(racing.positions)) // to render the results view
				resolve(racing) // resolve the promise
			}
		}, 500)
	}).catch(error=> 
		console.log(error.message))

};

async function runCountdown() {
	try {
		// wait for the DOM to load
		await delay(1000)
		let timer = 3

		return new Promise(resolve => {
			
			const countdown = setInterval(() => {	
				if (timer !== 0) {
					document.getElementById('big-numbers').innerHTML = --timer
				} else {	
					clearInterval(countdown);
					resolve();
					return;
				}
			}, 1000)
		})	
	} catch(error) {
		console.error("error: ", error.message)
	}
}


function handleSelectPodRacer(target) {
	console.log("selected a pod", target.id)

	const selected = document.querySelector('#racers .selected')
	if(selected) {
		selected.classList.remove('selected')
	}

	//target_id -->> parseInt to store.player_id
	target.classList.add('selected')

	store.player_id = parseInt(target.id)
}

function handleSelectTrack(target) {
	console.log("selected a track", target.id)


	const selected = document.querySelector('#tracks .selected')
	if(selected) {
		selected.classList.remove('selected')
	}

	
	target.classList.add('selected')

	store.track_id = parseInt(target.id)
	
}

function handleAccelerate() {
	console.log("accelerate button clicked")
	accelerate(store.race_id) // https://knowledge.udacity.com/questions/451483
	//in order to ush up in ranks
}

// HTML VIEWS ------------------------------------------------
// Provided code - do not remove

function renderRacerCars(racers) {  
	if (!racers.length) {
		return `
			<h4>Loading Racers...</4>
		`
	}

	const results = racers.map(renderRacerCard).join('')

	return `
		<ul id="racers">
			${results}
		</ul>
	`
}

function renderRacerCard(racer) {
	const { id, driver_name, top_speed, acceleration, handling } = racer

	return `
		<li class="card podracer" id="${id}">
			<h3>${driver_name}</h3>
			<p>${top_speed}</p>
			<p>${acceleration}</p>
			<p>${handling}</p>
		</li>
	`
}

function renderTrackCards(tracks) {  
	if (!tracks.length) {
		return `
			<h4>Loading Tracks...</4>
		`
	}

	const results = tracks.map(renderTrackCard).join('')

	return `
		<ul id="tracks">
			${results}
		</ul>
	`
}

function renderTrackCard(track) {   
	const { id, name } = track

	return `
		<li id="${id}" class="card track">
			<h3>${name}</h3>
		</li>
	`
}

function renderCountdown(count) {   
	return `
		<h2>Race Starts In...</h2>
		<p id="big-numbers">${count}</p>
	`
}

function renderRaceStartView(track, racers) {  
	return `
		<header>
			<h1>Race: ${track.name}</h1>
		</header>
		<main id="two-columns">
			<section id="leaderBoard">
				${renderCountdown(3)}
			</section>

			<section id="accelerate">
				<h2>Directions</h2>
				<p>Click the button as fast as you can to make your racer go faster!</p>
				<button id="gas-peddle">Click Me To Win!</button>
			</section>
		</main>
		<footer></footer>
	`
}

function resultsView(positions) {  
	positions.sort((a, b) => (a.final_position > b.final_position) ? 1 : -1)

	return `
		<header>
			<h1>Race Results</h1>
		</header>
		<main>
			${raceProgress(positions)}
			<a href="/race">Start a new race</a>
		</main>
	`
}

function raceProgress(positions) {  
	const userPlayer = positions.find(e => e.id === store.player_id)
	userPlayer.driver_name += " (you)"

	positions = positions.sort((a, b) => (a.segment > b.segment) ? -1 : 1)
	let count = 1

	const results = positions.map(p => {
		return `
			<tr>
				<td>
					<h3>${count++} - ${p.driver_name}</h3>
				</td>
			</tr>
		`
	}).join(""); 

	return `
		<main>
			<h3>Leaderboard</h3>
			<section id="leaderBoard">
				${results}
			</section>
		</main>
	`
}

function renderAt(element, html) {  
	const node = document.querySelector(element)

	node.innerHTML = html
}

// ^ Provided code ^ do not remove


// API CALLS ------------------------------------------------

const SERVER = 'http://localhost:8000' 

function defaultFetchOpts() {  //default for POST GET
	return {
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin' : SERVER,
		},
	}
}


function getTracks() {
	return fetch(`${SERVER}/api/tracks`, { 
		...defaultFetchOpts(),
	})
	.then(res => res.json())
	.catch(err => console.log("Problem with createRace request::", err, err.message))
	
}

function getRacers() {
	return fetch(`${SERVER}/api/cars` 

	)
	.then(res => res.json())
	.catch(err => console.log("Problem with createRace request::", err, err.message))
	
}

function createRace(player_id, track_id) {
	player_id = parseInt(player_id)  //declared in handleCreateRace
	track_id = parseInt(track_id) //declared in handleCreateRace
	const body = { player_id, track_id }
	
	
	return fetch(`${SERVER}/api/races`, {
		method: 'POST',
		...defaultFetchOpts(),
		dataType: 'jsonp',
		body: JSON.stringify(body)
	})
	.then(res => res.json())
	.catch(err => console.log("Problem with createRace request::", err, err.message))
}

function getRace(id) {
	return fetch(`${SERVER}/api/races/${id}`
	)
		.then(res => res.json())
		.catch(err => console.log("Problem with getRace request::", err, err.message));
}

function startRace(id) {
	return fetch(`${SERVER}/api/races/${id}/start`, {
		method: 'POST',
		...defaultFetchOpts(),
	})
	.catch(err => console.log("Problem with startRace request::", err, err.message))
}

function accelerate(id) {
		return fetch(`${SERVER}/api/races/${id}/accelerate`, {
			method: 'POST'
		})
	
	.catch(err => console.log("Problem with accelerate request::", err, err.message))
};
