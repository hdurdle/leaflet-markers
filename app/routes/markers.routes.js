module.exports = (app) => {
    const markers = require('../controllers/markers.controller.js');

    // Create a new marker
    app.post('/markers', markers.create);

    // Retrieve all markers
    app.get('/markers', markers.findAll);

    // Retrieve a single marker with markerId
    app.get('/markers/:markerId', markers.findOne);

    // Update a marker with markerId
    app.put('/markers/:markerId', markers.update);

    // Delete a marker with markerId
    app.delete('/markers/:markerId', markers.delete);
}