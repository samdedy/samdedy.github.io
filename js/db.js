//pembuatan database
var dbPromised = idb.open("football", 1, function(upgradeDb) {
	var articlesObjectStore = upgradeDb.createObjectStore("teams", {
		keyPath: "id"
	});
	articlesObjectStore.createIndex("id", "id", { unique: false });
});

//save new team
function saveTeam(team) {
  dbPromised
    .then(function(db) {
      let tx = db.transaction("teams", "readwrite");
      let store = tx.objectStore("teams");
      console.log(team);
			store.put(team);
			// store.put(team);
			console.log("Team berhasil di simpan.");
      return tx.complete;
    })
		.catch((err) => {
      console.error("Team gagal disimpan", err);
    });
}

const saveForLater = (result) => {
  let yes = confirm(
    `Apakah Anda Yakin ingin menyimpan ${result.name} ke saved?`
  );
  if (yes) {
    //Delete Team From db
    saveTeam(result);
    //Display Toast
    M.toast({
      html: `Berhasil Menyimpan ${result.name}`,
      classes: "rounded",
    });
  }
};

// get all teams
function getAll() {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        let tx = db.transaction("teams", "readonly");
        let store = tx.objectStore("teams");
        return store.getAll();
      })
      .then(function(teams) {
        resolve(teams);
      });
  });
}

// get team by id
function getById(id) {
	return new Promise(function(resolve, reject) {
	  dbPromised
		.then(function(db) {
		  let tx = db.transaction("teams", "readonly");
		  let store = tx.objectStore("teams");
		  return store.get(id);
		})
		.then(function(team) {
		  resolve(team);
		});
	});
}

const deleteSavedTeam = (result) => {
  let yes = confirm(
    `Apakah Anda Yakin ingin menghapus ${result.name} dari Saved?`
  );
  if (yes) {
    //Delete Team From db
    deleteTeam(result.id);
    //Fetch All Team
    getSavedTeams();
    //Display Toast
    M.toast({
      html: `Berhasil Menghapus ${result.name}`,
      classes: "rounded",
    });
  }
};

//Delete Team Database Listener
const deleteTeam = (teamId) => {
  dbPromised
    .then((db) => {
      let tx = db.transaction("teams", "readwrite");
      let store = tx.objectStore("teams");
      store.delete(teamId);
      return tx.complete;
    })
    .catch((err) => {
      console.error("Error: ", err);
    });
};