var express = require('express');
var router = express.Router();

//Get Leave model 
var Leave = require('./../models/leave');


/*
Get Dashboard page
*/
router.get('/', (req, res) => {
    res.render('user/dashboard', {
        'message': 'Content of Dashboard comming soon...'
    });
});
/*
 * Get leave index
 */
router.get('/user/leaves', (req, res) => {
    var count;
    Leave.count(function (err, c) {
        count = c;
    });
    Leave.find(function (err, leaves) {
        if (err)
            return console.log(err);
        res.render('user/leave_listing', {
            leaves: leaves,
            count: count
        });
    });
});
/*
 * Get leave page 
 */
router.get('/user/leaves/add-leave', (req, res) => {

    var reason = "";
    var day = "";
    res.render('user/add_leave', {
        reason: reason,
        day: day
    });
});
/*
 * Post leave page 
 */
router.post('/user/leaves/add-leave', (req, res) => {

    req.checkBody('reason', 'Reason must have a value.').notEmpty();
    req.checkBody('day', 'Day must have a value.').notEmpty();
    var reason = req.body.reason;
    var day = req.body.day;

    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        res.render('user/add_leave', {
            errors: errors,
            reason: reason,
            day: day
        });
    } else {
        console.log("success");
        days = parseInt(day, 10);
        var leave = new Leave({
            reason: reason,
            day: days
        });

        leave.save(function (err) {
            if (err)
                return console.log(err);
            req.flash('success', 'Leave added!');
            res.redirect('/user/leaves');
        });
    }

});

/*
 * Get category page 
 */
router.get('/edit-category/:id', (req, res) => {
    Category.findById(req.params.id, function (err, category) {
        if (err)
            return console.log(err);
        res.render('admin/edit_category', {
            title: category.title,
            id: category._id
        });
    });
});

/*
 * POST edit category 
 */
router.post('/edit-category/:id', (req, res) => {

    req.checkBody('title', 'Title must have a value.').notEmpty();
    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var id = req.params.id;
    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        res.render('admin/edit_category', {
            errors: errors,
            title: title,
            id: id
        });
    } else {
        Category.findOne({ slug: slug, _id: { '$ne': id } }, function (err, category) {
            if (category) {
                req.flash('danger', 'Category title exists,choose another');
                res.render('admin/edit_page', {
                    errors: errors,
                    title: title,
                    id: id
                });
            } else {
                Category.findById(id, function (err, category) {
                    if (err)
                        return console.log(err);
                    category.title = title;
                    category.slug = slug;
                    category.save(function (err) {
                        if (err)
                            return console.log(err);
                        req.flash('success', 'Category edited!');
                        res.redirect('/admin/categories/edit-category/' + id);
                    });
                });
            }
        });
    }
});
/*
 * GET delete category
 */
router.get('/delete-category/:id', (req, res) => {
    Category.findByIdAndRemove({ _id: req.params.id }, function (err) {
        if (err) {
            return console.log(err);
        }
        req.flash('success', 'Category deleted!');
        res.redirect('/admin/categories');
    });
});
module.exports = router;