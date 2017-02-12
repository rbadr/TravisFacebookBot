# CI Notifier [![Build Status](https://travis-ci.com/rbadr/TravisFacebookBot.svg?token=xPpydP9QfcPypp7wkHkg&branch=master)](https://travis-ci.com/rbadr/TravisFacebookBot)

A project in software automation, by Rahal Badr & Jihad El Fakaway. IAGL, Lille University, France.


Le projet a été fortement découpé en multiples méthodes afin de le rendre très modulaire. Il est principalement subdivisé de la façon suivante :

- index.js : qui est le coeur du chatbot et s'occupe de gérer les messages reçus. 
- lib/graph-api.js : qui s'occupe de tous les appels vers l'API Facebook afin d'envoyer des messages et récuperer les informations concernant l'interlocuteur (nom, prénom ..) 
- lib/travis-api.js : qui s'occupe de tous les appels vers l'API Travis CI afin de récuperer les informations concernant un build (Description, état, auteur, date..) 
- lib/nlp.js : qui s'occupe de l'analyse des messages.
- lib/helper.js : contient des méthodes utiles (helpers) pour l'envoi d'email après demande d'un interlocuteur.
