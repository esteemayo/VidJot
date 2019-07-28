const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');
const {ensureAuthenticated} = require('../helpers/auth');


// IDEA INDEX PAGE
router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({user: req.user.id})
        .sort({date: 'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

// ADD IDEA FORM
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

// POST IDEA FORM
router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({msg: 'Please add a title'});
    }

    if (!req.body.details) {
        errors.push({msg: 'Please add some details'});
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details,
        });
    } else {
        const newIdea = new Idea({
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        })
        newIdea.save()
            .then(ideas => {
                res.redirect('/ideas');
            });
    }
});

// EDIT IDEA ROUTE
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            if (idea.user !== req.user.id) {
                req.flash('error_msg', 'Not Authorized');
                res.redirect('/ideas');
            } else {
                res.render('ideas/edit', {
                    idea: idea
                });
            }
        });
});

// EDIT FORM PROCESS
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    req.flash('success_msg', 'Video Idea Updated');
                    res.redirect('/ideas');
                });
        });
});

// DELETE IDEA
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.deleteOne({_id: req.params.id})
        .then(() => {
            req.flash('success_msg', 'Video Idea Deleted');
            res.redirect('/ideas');
        });
});









module.exports = router;