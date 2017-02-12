var Travis = require('travis-ci');
// To set custom headers
var express = require('express');
var app = express();
var fs = require("fs");
var travis = new Travis({
  version: '2.0.0',
  headers: {
    'user-agent': 'MyClient/1.0.0'
  }
});
travis.auth.github.post({
    github_token: "538747f5a5f080de293284690addcb5d7a91d75f"
}, function (err, res) {
    travis.authenticate({
        access_token: res.access_token
    }, function (err) {
         // we've authenticated!
    });
});
app.get('/info', function(req, resultat) {
  travis.accounts.get(function (err, res) {
    var obj = JSON.parse(JSON.stringify(res));
    resultat.setHeader('Content-Type','text/plain');
    sortie="Id: "+obj["accounts"][0]["id"].toString()+"\n"
          +"Nom: "+obj["accounts"][0]["name"].toString()+"\n"+
    "Login: "+obj["accounts"][0]["login"].toString()+"\n"+
    "Accounts: "+obj["accounts"][0]["type"].toString()+"\n"+
    "Repos_count: "+obj["accounts"][0]["repos_count"].toString();
    resultat.end(sortie);
  });
});


app.get('/broadcasts',function(req,res){
  travis.broadcasts.get(function(err,res){
    var obj = JSON.parse(JSON.stringify(res));
    console.log(obj["broadcasts"])
  })
})
app.get('/repos/:name',function(req,resultat){
travis.repos(req.params.name).get(function (err, res) {
  var obj = JSON.parse(JSON.stringify(res));
  var retour="";
  obj["repos"].forEach(function(element){
    retour=retour+affichageInformationGeneral(element);
  });
  resultat.end(retour)
});
})

app.get('/repos/:name/:projet',function(req,resultat){
travis.repos(req.params.name).get(function (err, res) {
  var obj = JSON.parse(JSON.stringify(res));
  var retour="";
  obj["repos"].forEach(function(element){
    if (element["slug"]==req.params.name+"/"+req.params.projet)
      resultat.end(affichageInformationBuild(element));
  });
  resultat.end("Aucun projet se nomme "+req.params.projet)
});
})

app.get('/projetIntegrationContinue/:name',function(req,resultat){
travis.repos(req.params.name).get(function (err, res) {
  var obj = JSON.parse(JSON.stringify(res));
  var retour="";
  obj["repos"].forEach(function(element){
    if (element["active"]==true)
      retour=retour+affichageInformationBuild(element);
  });
  if (retour=="")
    resultat.end("Aucun projet est en Integration Continue")
  resultat.end(retour)
});
})

app.get('/builds/:name/:projet',function(req,resultat){
travis.repos(req.params.name, req.params.projet).builds.get(function (err, res) {
     var obj = JSON.parse(JSON.stringify(res));
     var retour="------- Liste des Builds du Projet "+req.params.projet+ " ------------\n";
     obj["builds"].forEach(function(element){
        retour=retour+affichageEtatBuilds(element);
     });
     resultat.end(retour)
});
});
app.get('/commits/:name/:projet',function(req,resultat){
travis.repos(req.params.name, req.params.projet).builds.get(function (err, res) {
     var obj = JSON.parse(JSON.stringify(res));
     var retour="------- Liste des Builds du Projet "+req.params.projet+ " ------------\n";
     obj["commits"].forEach(function(element){
        retour=retour+affichageCommit(element)
     });
     resultat.end(retour)
});
});

app.get('/buildInfo/:idBuild',function(req,resultat){
  travis.builds(req.params.idBuild).get(function (err, res) {
    var obj = JSON.parse(JSON.stringify(res));
    resultat.end(affichageEtatUnBuilds(obj["build"],obj["commit"]))
  });
});


function affichageInformationBuild(element){
  obj="----------------------------------\n"+
  "Nom du Projet: "+ifNull(element["slug"])+"\n"+
  "description :"+ifNull(element["description"])+"\n"+
  "ID du Dernier Build: "+ifNull(element["last_build_id"])+"\n"+
  "Numero du Dernier Build :  "+ifNull(element["last_build_number"])+"\n"+
  "Langage du Projet : "+ifNull(element["last_build_language"])+"\n"+
  "Debut du Dernier build : "+ifNull(element["last_build_started_at"])+"\n"+
  "Fin du Dernier build : "+ifNull(element["last_build"])+"\n"+
  "Etat du dernier Build : "+ifNull(element["last_build_state"])+"\n"
  return obj;
}
function affichageInformationGeneral(element){
  obj="----------------------------------\n"+
  "Nom du Projet: "+ifNull(element["slug"])+"\n"+
  "description :"+ifNull(element["description"])+"\n";
  if (element["active"]==null)
    element["active"]=false
  obj=obj+"Prise en charge de l'Integration continue ? : "+element["active"]+"\n"
  return obj;
}
function affichageEtatBuilds(element){
  obj="--------------------------------------\n"
      +"id du Build :"+ifNull(element["id"])+"\n"+
      "Build Numero "+ifNull(element["number"])+"\n"+
      "Etat :"+ifNull(element["state"])+"\n"
      "Debut du Build : "+ifNull(element["started_at"])+"\n"+
      "Fin du Build : "+ifNull(element["finished_at"])+"\n"
      "Durée du Build : "+ifNull(element["duration"])+"\n"
    return obj;
}

function affichageEtatUnBuilds(build,commit){
  obj="--------------------------------------\n"
      +"id du Build :"+ifNull(build["id"])+"\n"+
      "Build Numero "+ifNull(build["number"])+"\n"+
      "Etat :"+ifNull(build["state"])+"\n"+
      "Debut du Build : "+ifNull(build["started_at"])+"\n"+
      "Fin du Build : "+ifNull(build["finished_at"])+"\n"+
      "Durée du Build : "+ifNull(build["duration"])+"s\n"+
      "Id du Commit : " +ifNull(commit["id"])+"\n"+
      "Branch :"+ifNull(commit["branch"])+"\n"+
      "Message :"+ifNull(commit["message"])+"\n"+
      "Auteur du Commit :"+ifNull(commit["committer_name"])+"\n"+
      "Mail de l'auteur :"+ifNull(commit["committer_email"])+"\n"+
      "Date du Commit :"+ifNull(commit["committed_at"])+"\n"
  return obj


}

function affichageCommit(commit){
    obj="Id du Commit : " +ifNull(commit["id"])+"\n"+
      "Branch :"+ifNull(commit["branch"])+"\n"+
      "Message :"+ifNull(commit["message"])+"\n"+
      "Auteur du Commit :"+ifNull(commit["committer_name"])+"\n"+
      "Mail de l'auteur :"+ifNull(commit["committer_email"])+"\n"+
      "Date du Commit :"+ifNull(commit["committed_at"])+"\n"
      return obj
}

function ifNull(element){
  if (element==null || element==""){
    return "Pas d'information "
  }
  else
    return element;
}
app.listen(8080);
