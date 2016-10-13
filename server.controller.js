/**
 * Created by imalonzo on 10/11/16.
 */

var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var tools = require('./helpers/tools');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/mongoose_dashboard');

//- create a blue print of a model
var AnimalSchema = new mongoose.Schema({
    animal: String,
    nlegs: Number,
    color: String
})

//- associate collection 'Animals' to the blueprint
mongoose.model('Animals', AnimalSchema);

//- basic controllers
var Animal = mongoose.model('Animals');

var mongooseController = {
    //-- display main page
    index: function(req, res) {
          Animal.find({}, function(err, allAnimals) {
            if ( err) {
                res.render('add_view');   // load add_view.ejs
            } else {
                res.render('index', {allAnimals : allAnimals} );   // index.ejs
            }
          });
    },

    // -- display add_view to add a new animal
    mongooses_new: function(req, res) {
        res.render('add_view');   // load add_view.ejs
    },

    //-- action to add a new mongoose
    post_mongooses: function(req, res) {
        console.log("CONTROLLER mongooses");
        var animal = new Animal({animal: req.body.animal, nlegs: req.body.legs, color: req.body.color});

        animal.save(function(err) {
            if(err) {
                return res.send(500, { error: err });
            } else {
                res.redirect('/');
            }
        });
    },

    //-- show_view to display animal information
    get_mongooses_id: function(req, res) {
        Animal.find({_id: req.params.id}, function(err, animal) {
            if (err) {
                res.redirect('/');
            } else {
                res.render('show_view', {animal : animal[0]});
            }
        });
    },


    //-- display update_view for updating mongoose
    get_mongooses_id_edit: function(req, res) {
        Animal.find({_id: req.params.id}, function(err, animal) {
            if (err) {
                res.redirect('/');
            } else {
                res.render('update_view', {animal : animal[0]});
            }
        });
    },

    // -- action to update a mongoose
        post_mongooses_id: function(req, res) {
         // creates a new animal with new id
        var newAnimal = new Animal({animal: req.body.animal, nlegs: req.body.legs, color: req.body.color});

        // reset the _id to the mongoose ID you want to change
        newAnimal['_id'] =  req.params.id;

        Animal.findOneAndUpdate({_id: req.params.id}, newAnimal, function(err, animal){
            if (err) {
                return res.send(500, { error: err });
            }
            res.redirect('/');
        });
    },

    //-- action to delete a mongoose
    get_mongooses_id_destroy: function(req, res) {
         Animal.remove({_id: req.params.id}, function(err) {
            if (err) {
                return res.send(500, { error: err });
            } else {
                res.redirect('/');
            }
        });
    },

    //-- process action
    post_process_action: function(req, res) {
         if (req.body.action ===  'Show') {
            res.redirect('/mongooses/' + req.body.id);
        }

        if (req.body.action ===  'Edit') {
            res.redirect('/mongooses/' + req.body.id + '/edit');
        }

        if (req.body.action ===  'Delete') {
            res.redirect('/mongooses/' + req.body.id + '/destroy');
        }
    }
}; // End  mongooseController


// ********** routes ***********
app.get("/", mongooseController.index);
app.get("/mongooses/new", mongooseController.mongooses_new);
app.post("/mongooses", mongooseController.post_mongooses);
app.get("/mongooses/:id", mongooseController.get_mongooses_id);
app.get("/mongooses/:id/edit", mongooseController.get_mongooses_id_edit);
app.post("/mongooses/:id", mongooseController.post_mongooses_id);
app.get("/mongooses/:id/destroy", mongooseController.get_mongooses_id_destroy);
app.post("/processAction", mongooseController.post_process_action);


//-- listeners
app.listen(8000, function() {
    console.log("listening on port 8000");
})
