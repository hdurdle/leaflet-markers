const Marker = require('../models/markers.model.js');

// Create and Save a new marker
exports.create = (req, res) => {
    // Validate request
    if(!req.body.location) {
        return res.status(400).send({
            message: "marker location can not be empty"
        });
    }

    // Create a marker
    const marker = new Marker({
        firstname: req.body.firstname || "Anonymous",
        lastname: req.body.lastname || "",
        email: req.body.email || "Not provided.",
        location: req.body.location,
        lat: req.body.lat,
        long: req.body.long,
        isVerified: false,
        isAdmin: false
    });

    // Save marker in the database
    marker.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the marker."
        });
    });
};

// Retrieve and return all markers from the database.
exports.findAll = (req, res) => {
    Marker.find()
        .then(markers => {
            res.send(markers);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving markers."
        });
    });
};

// Find a single marker with a markerId
exports.findOne = (req, res) => {
    Marker.findById(req.params.markerId)
        .then(marker => {
            if(!marker) {
                return res.status(404).send({
                    message: "Marker not found with id " + req.params.markerId
                });
            }
            res.send(marker);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Marker not found with id " + req.params.markerId
            });
        }
        return res.status(500).send({
            message: "Error retrieving Marker with id " + req.params.markerId
        });
    });
};

// Update a marker identified by the markerId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.location) {
        return res.status(400).send({
            message: "Marker location can not be empty"
        });
    }

    // Find marker and update it with the request body
    Marker.findByIdAndUpdate(req.params.markerId, {
           firstname: req.body.firstname || "Anonymous",
        lastname: req.body.lastname || "",
        email: req.body.email,
        location: req.body.location,
        lat: req.body.lat,
        long: req.body.long,
        isVerified: false,
        isAdmin: false

    }, {new: true})
        .then(marker => {
            if(!marker) {
                return res.status(404).send({
                    message: "Marker not found with id " + req.params.markerId
                });
            }
            res.send(marker);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Marker not found with id " + req.params.markerId
            });
        }
        return res.status(500).send({
            message: "Error updating marker with id " + req.params.markerId
        });
    });
};

// Delete a marker with the specified markerId in the request
exports.delete = (req, res) => {
    Marker.findByIdAndRemove(req.params.markerId)
        .then(marker => {
            if(!marker) {
                return res.status(404).send({
                    message: "Marker not found with id " + req.params.markerId
                });
            }
            res.send({message: "Marker deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Marker not found with id " + req.params.markerId
            });
        }
        return res.status(500).send({
            message: "Could not delete marker with id " + req.params.markerId
        });
    });
};