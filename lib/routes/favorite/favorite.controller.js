'use strict';

exports.getAllFavorites = function(req, res) {
    req.user
        .fetch({withRelated: ['favorites']})
        .then(function(user) {
            res.send(user.related('favorites').toJSON());
        });
};

exports.addFavorite = function(req,res){
    req.user
        .fetch({withRelated: ['favorites']})
        .then(function(user){
            //todo: i should be attaching the course id
            user.related('favorites').attach(req.body);

        }).then(function(favorite) {
            res.send(favorite.toJSON());
        })
        .catch(function(err) {
            res.status(500).send('Server error.');
        });
};

exports.removeFavorite = function(req,res){
    req.user
        .fetch({withRelated: ['favorites']})
        .then(function(user){
            user.related('favorites').detach([req.params.id]);
        }).catch(function(err) {
            res.status(500).send('Server error.');
        });
};