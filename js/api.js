const API_KEY = "f8981e75556746109f462b4db6b27908";
const BASE_URL = "https://api.football-data.org/v2/";

const LEAGUE_ID = 2021;

const ENDPOINT_COMPETITION = `${BASE_URL}competitions/${LEAGUE_ID}/standings`;
const ENDPOINT_TEAMS = `${BASE_URL}competitions/${LEAGUE_ID}/teams`;

const fetchAPI = url => {
	return fetch(url, {
		headers: {
			'X-Auth-Token': API_KEY
		}
	})
	.then(res => {
		if (res.status !== 200) {
			console.log("Error: " + res.status);
			return Promise.reject(new Error(res.statusText))
		} else {
			return Promise.resolve(res)
		}
	})
	.then(res => res.json())
	.catch(err => {
		console.log(err)
	})
};

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

function getAllStandings() {
	if ("caches" in window) {
		caches.match(ENDPOINT_COMPETITION).then(function (response) {
			if (response) {
				response.json().then(function (data) {
					console.log("Competition Data: " + data);
					showStanding(data);
				})
			}
		})
	}

	fetchAPI(ENDPOINT_COMPETITION)
		.then(data => {
			showStanding(data);
		})
		.catch(error => {
			console.log(error)
		})
}

function showStanding(data) {
	let standings = "";
	let standingElement =  document.getElementById("homeStandings");

	data.standings[0].table.forEach(function (standing) {
			standings += `
							<tr>
								<td><img src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="30px" alt="badge"/></td>
								<td>${standing.team.name}</td>
								<td>${standing.won}</td>
								<td>${standing.draw}</td>
								<td>${standing.lost}</td>
								<td>${standing.points}</td>
								<td>${standing.goalsFor}</td>
								<td>${standing.goalsAgainst}</td>
								<td>${standing.goalDifference}</td>
							</tr>
			`;
	});

	standingElement.innerHTML = `
					<div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">
						<table class="striped responsive-table">
							<thead>
								<tr>
									<th></th>
									<th>Team Name</th>
									<th>W</th>
									<th>D</th>
									<th>L</th>
									<th>P</th>
									<th>GF</th>
									<th>GA</th>
									<th>GD</th>
								</tr>
							</thead>
							<tbody id="standings">
								${standings}
							</tbody>
						</table>
					</div>
    `;
}

function getAllTeams() {
	if ("caches" in window) {
		caches.match(ENDPOINT_TEAMS).then(function (response) {
			if (response) {
				response.json().then(function (data) {
					console.log("Teams Data: " + data);
					showTeams(data);
				})
			}
		})
	}

	fetchAPI(ENDPOINT_TEAMS)
		.then(data => {
			showTeams(data);
		})
		.catch(error => {
			console.log(error)
		})
}

function showTeams(data) {
	let teams = "";
	let teamsElement =  document.getElementById("teams");

	data.teams.forEach(function (team) {
			teams += `
				<div class="col s12 m6">
					<div class="card">
						<div class="card-content cardteam">
							<div class="card-image">
								<img class="responsive-img" src="${team.crestUrl.replace(/^http:\/\//i, 'https://')}">
							</div>
							<div class="card-content center-align">
								<h5>${team.name} - ${team.area.name}</h3>
								<p>${team.shortName}</p>
								<p>${team.address}</p>
								<a href="${team.website}">${team.website}</a>
								<p>${team.founded}</p>
							</div>
							<div class="card-action center-align">
								<a href="./detail-team.html?id=${team.id}" class="blue-text">Detail Team</a>
							</div>
						</div>
					</div>
				</div>
			`;
	});

	teamsElement.innerHTML = `
			<div class="row">
				${teams}
			</div>
	`;
}

function getTeamsById() {
	return new Promise(function(resolve, reject) {
		// Ambil nilai query parameter (?id=)
		let urlParams = new URLSearchParams(window.location.search);
		let idParam = urlParams.get("id");
		let datas = "";
		let squad = "";

		if ("caches" in window) {
			caches.match(BASE_URL + "teams/" + idParam).then(function(response) {
				if (response) {
					response.json().then(function(data) {

						data.activeCompetitions.forEach(function (data) {
						datas += `
							<tr>
								<td>${data.area.name}</td>
								<td>${data.name}</td>
							</tr>
							`;
						});

						data.squad.forEach(function (data) {
							squad += `
							<tr>
								<td>${data.name}</td>
								<td>${data.position}</td>
								<td>${data.dateOfBirth}</td>
								<td>${data.countryOfBirth}</td>
								<td>${data.role}</td>
							</tr>
							`;
						});

						var articleHTML = `
						<div class="row">

							<div class="col s12 m6">
								<div class="card horizontal">
									<div class="card-image">
										<img class="responsive-img" src="${data.crestUrl}">
									</div>
									<div class="card-content center-align">
									<span class="card-title">${data.name}</span>
										<p>${data.shortName}</p>
										<p>${data.address}</p>
										<p>${data.phone}</p>
										<p>${data.venue}</p>
										<a href="${data.website}">${data.website}</a>
										<p>${data.founded}</p>
									</div>
								</div>
							</div>

							<div class="col s12 m6 center-align">
								<h5>Active Competitions</h5>
								<table class="striped">
									<thead>
										<tr>
											<th>Area</th>
											<th>Competitions Name</th>
										</tr>
									</thead>

									<tbody>
										${datas}
									</tbody>
								</table>
							</div>

							<div class="col s12 m12 center-align">
								<h4>Squad Team</h4>
								<table class="responsive-table">
									<thead>
										<tr>
											<th>Name</th>
											<th>Position</th>
											<th>Date Of Birth</th>
											<th>Country Of Birth</th>
											<th>Role</th>
										</tr>
									</thead>

									<tbody>
										${squad}
									</tbody>
								</table>
							</div>

						</div>
						`;
						// Sisipkan komponen card ke dalam elemen dengan id #content
						document.getElementById("body-content").innerHTML = articleHTML;

						// Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
						resolve(data);
					});
				}
			});
		}
  
		fetch(BASE_URL + "teams/" + idParam, {
			headers: {
					'X-Auth-Token': API_KEY
			}})
			.then(status)
			.then(json)
			.then(function(data) {

				data.activeCompetitions.forEach(function (data) {
					datas += `
						<tr>
							<td>${data.area.name}</td>
							<td>${data.name}</td>
						</tr>
						`;
				});

				data.squad.forEach(function (data) {
					squad += `
					<tr>
						<td>${data.name}</td>
						<td>${data.position}</td>
						<td>${data.dateOfBirth}</td>
						<td>${data.countryOfBirth}</td>
						<td>${data.role}</td>
					</tr>
					`;
				});

				// Objek JavaScript dari response.json() masuk lewat variabel data.
				// console.log(data);
				// Menyusun komponen card artikel secara dinamis
				var articleHTML = `
				<div class="row">

					<div class="col s12 m6">
						<div class="card horizontal">
							<div class="card-image">
								<img class="responsive-img" src="${data.crestUrl}">
							</div>
							<div class="card-content center-align">
							<span class="card-title">${data.name}</span>
								<p>${data.shortName}</p>
								<p>${data.address}</p>
								<p>${data.phone}</p>
								<p>${data.venue}</p>
								<a href="${data.website}">${data.website}</a>
								<p>${data.founded}</p>
							</div>
						</div>
					</div>

					<div class="col s12 m6 center-align">
						<h5>Active Competitions</h5>
						<table class="striped">
							<thead>
								<tr>
									<th>Area</th>
									<th>Competitions Name</th>
								</tr>
							</thead>

							<tbody>
								${datas}
							</tbody>
						</table>
					</div>

					<div class="col s12 m12 center-align">
						<h4>Squad Team</h4>
						<table class="responsive-table">
							<thead>
								<tr>
									<th>Name</th>
									<th>Position</th>
									<th>Date Of Birth</th>
									<th>Country Of Birth</th>
									<th>Role</th>
								</tr>
							</thead>

							<tbody>
								${squad}
							</tbody>
						</table>
					</div>

				</div>
				`;
				// Sisipkan komponen card ke dalam elemen dengan id #content
				document.getElementById("body-content").innerHTML = articleHTML;
				// Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
				resolve(data);
			});
		});
}

function getSavedTeams() {
	getAll().then(function(teams) {
	  console.log("data saved team : ",teams);
	  // Menyusun komponen card artikel secara dinamis
	  var teamsHTML = "";
	  teams.forEach(function(team) {
		teamsHTML += `
			<div class="col s12 m6">
				<div class="card">
					<div class="card-content cardteam">
						<div class="card-image">
							<a id="del-saved-${team.id}" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">cancel</i></a>
							<img class="responsive-img" src="${team.crestUrl.replace(/^http:\/\//i, 'https://')}">
						</div>
						<div class="card-content center-align">
							<h5>${team.name} - ${team.area.name}</h3>
							<p>${team.shortName}</p>
							<p>${team.address}</p>
							<a href="${team.website}">${team.website}</a>
							<p>${team.founded}</p>
						</div>
						<div class="card-action center-align">
							<a href="./detail-team.html?id=${team.id}&saved=true" class="blue-text">Detail Team</a>
						</div>
					</div>
				</div>
			</div>
				`;
		});
		// Sisipkan komponen card ke dalam elemen dengan id #body-content
		document.getElementById("saved").innerHTML = teamsHTML;
			
		teams.forEach((team) => {
			let delSaved = document.getElementById(`del-saved-${team.id}`);
			delSaved.onclick = () => {
				console.log("berhasil di clik delete")
				deleteSavedTeam(team);
				document.getElementById("saved").innerHTML = teamsHTML
			};
		});
	});
}

function getSavedTeamById() {
	let urlParams = new URLSearchParams(window.location.search);
	let idParam = urlParams.get("id");
	let datas = "";
	let squad = "";
	
	getById(parseInt(idParam)).then(function(team) {
		console.log("team",team);
		team.activeCompetitions.forEach(function (team) {
			datas += `
				<tr>
					<td>${team.area.name}</td>
					<td>${team.name}</td>
				</tr>
				`;
		});

		team.squad.forEach(function (team) {
			squad += `
			<tr>
				<td>${team.name}</td>
				<td>${team.position}</td>
				<td>${team.dateOfBirth}</td>
				<td>${team.countryOfBirth}</td>
				<td>${team.role}</td>
			</tr>
			`;
		});

		// Objek JavaScript dari response.json() masuk lewat variabel team.
		// console.log(team);
		// Menyusun komponen card artikel secara dinamis
		let teamHTML = `
		<div class="row">

			<div class="col s12 m6">
				<div class="card horizontal">
					<div class="card-image">
						<img class="responsive-img" src="${team.crestUrl}">
					</div>
					<div class="card-content center-align">
					<span class="card-title">${team.name}</span>
						<p>${team.shortName}</p>
						<p>${team.address}</p>
						<p>${team.phone}</p>
						<p>${team.venue}</p>
						<a href="${team.website}">${team.website}</a>
						<p>${team.founded}</p>
					</div>
				</div>
			</div>

			<div class="col s12 m6 center-align">
				<h5>Active Competitions</h5>
				<table class="striped">
					<thead>
						<tr>
							<th>Area</th>
							<th>Competitions Name</th>
						</tr>
					</thead>

					<tbody>
						${datas}
					</tbody>
				</table>
			</div>

			<div class="col s12 m12 center-align">
				<h4>Squad Team</h4>
				<table class="responsive-table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Position</th>
							<th>Date Of Birth</th>
							<th>Country Of Birth</th>
							<th>Role</th>
						</tr>
					</thead>

					<tbody>
						${squad}
					</tbody>
				</table>
			</div>

		</div>
		`;
		
	  // Sisipkan komponen card ke dalam elemen dengan id #content
	  document.getElementById("body-content").innerHTML = teamHTML;
	});
}