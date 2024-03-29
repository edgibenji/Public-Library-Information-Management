const express = require('express')
const router = express.Router()
const Customer = require('../models/customer')
const Payment = require('../models/payment')
const Rental = require('../models/rental')
const Invoice = require('../models/invoice')
const Registration = require('../models/registration')
const Reservation = require('../models/reservation')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// customer login route
router.get('/login', (req, res) => {
    res.render('customer/login')
})

// customer login route
router.post('/login', async (req, res) => {
    var username = req.body.username
    var password = req.body.password
    const customer = await Customer.findOne({ username: username, password: password })
    const payments = await Payment.find({ customer: customer })
    const rentals = await Rental.find({ customer: customer })
    const invoices = await Invoice.find({ customer: customer })
    const registrations = await Registration.find({ customer : customer })
    const reservations = await Reservation.find({ customer : customer })
    if (!customer) {
        res.render('customer/login', { errorMessage: 'Error Login in' })
    } else {
        res.render('customer', {
            customer: customer,
            payments: payments,
            rentals: rentals,
            invoices: invoices,
            registrations: registrations,
            reservations: reservations
        })
    }
})

// customer register route
router.get('/register', async (req, res) => {
    res.render('customer/register', { customer: new Customer() })
})

// create customer route
router.post('/register', async (req, res) => {
    const customer = new Customer({
        username: req.body.username,
        password: req.body.password,
        fullName: req.body.firstName + ' ' + req.body.lastName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        email: req.body.email,
        phone: req.body.phone,
        street: req.body.street,
        city: req.body.city,
        zipcode: req.body.zipcode,
        state: req.body.state,
        country: req.body.country,
        identificationType: req.body.identificationType,
        identificationNumber: req.body.identificationNumber
    })
    saveCover(customer, req.body.cover)
    try {
        const newCustomer = await customer.save()
        res.redirect(`/customer/${newCustomer.id}`)
    } catch {
        res.render('customer/register', {
            customer: customer,
            errorMessage: 'Error Register Customer'
        })
    }
})

// show customer route
router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id)
        res.render('customer/show', { customer: customer })
    } catch {
        res.redirect('/')
    }
})

// edit customer route
router.get('/:id/edit', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id)
        res.render('customer/edit', { customer: customer })
    } catch {
        res.redirect('/customer')
    }
})

// update customer route
router.put('/:id', async (req, res) => {
    let customer
    try {
        customer = await Customer.findById(req.params.id)
        customer.username = req.body.username
        customer.password = req.body.password
        customer.fullName = req.body.firstName + ' ' + req.body.lastName
        customer.firstName = req.body.firstName
        customer.lastName = req.body.lastName
        customer.gender = req.body.gender
        customer.email = req.body.email
        customer.phone = req.body.phone
        customer.street = req.body.street
        customer.city = req.body.city
        customer.zipcode = req.body.zipcode
        customer.state = req.body.state
        customer.country = req.body.country
        customer.identificationType = req.body.identificationType
        customer.identificationNumber = req.body.identificationNumber
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(customer, req.body.cover)
        }
        await customer.save()
        res.redirect(`customer/${customer.id}`)
    } catch {
        if (customer == null) {
            res.redirect('/')
        } else {
            res.render('customer/edit', {
                customer: customer,
                errorMessage: 'Error Updating Customer'
            })
        }
    }
})

function saveCover(customer, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        customer.coverImage = new Buffer.from(cover.data, 'base64')
        customer.coverImageType = cover.type
    }
}

module.exports = router