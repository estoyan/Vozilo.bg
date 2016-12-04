/* globals module require */
'use strict';

const mapper = require('../utils/mapper');

const START_YEAR = 1980;
const MAX_DAYS_PER_MONTH = 31;
// function getLastDateOfMonth(currentDate) {
//     let date = currentDate,
//         y = date.getFullYear(),
//         m = date.getMonth();
//     return new Date(y, m, 0).getDate();
// }

module.exports = function(data) {
    return {
        loadCreateCarForm(req, res) {
            data.getAllBrands()
                .then(brands => {

                    return res.status(200)
                        .render('car/create-form', {
                            result: {
                                user: req.user,
                                brands,
                                endDate: new Date().getFullYear(),
                                startDate: START_YEAR
                            }
                        });
                })
                .catch(err => {
                    res.status(500)
                        .send(err);
                });

        },
        craeteCar(req, res) {
            let user = req.user;
            let carInfo = req.body;
            data.addCar(user, carInfo)
                .then(car => {
                    return data.addCarToUser(user, car);
                })
                .then(() => {
                    return res.status(201)
                        .redirect('/');
                })
                .catch(err => {
                    return res.status(400)
                        .render('status-codes/status-code-error', {
                            result: {
                                code: 400,
                                err
                            }
                        });
                });
        },
        loadCarDetails(req, res) {
            let carDetails = {};
            data.getCarById(req.params.id)
                .then(car => {
                    if (car) {
                        carDetails = car;

                        return data.getUserByUsername(car.owner.username);
                    }

                    return res.status(404).send('There is not such car');
                })
                .then(user => {
                    carDetails.owner.receivedReviews = user.receivedReviews;

                    return res.status(200).render('car/details', {
                        result: {
                            user: req.user,
                            carDetails
                        }
                    });
                })
                .catch(err => {
                    return res.status(500).send(err);
                });
        },
        getCalendar(req, res) {
            let year = parseInt(req.query.year, 10);
            let month = parseInt(req.query.month, 10);
            let startDate = new Date(`${year}-${month + 1}-1`);
            let endDate = new Date(`${year}-${month + 1}-${MAX_DAYS_PER_MONTH}`);

            data.getDatesFromCalendar(req.params.id, startDate, endDate)
                .then(dates => {
                    let result = dates[0].availability.filter(m => m.date <= endDate && m.date >= startDate && m.isAvailable === true)
                        .map(m => m.date);

                    return res.send(result);
                });
        },
        loadRentCarForm(req, res) {
            let user = req.user,
                carId = req.params.id;
            if (user) {
                return res
                    .status(200)
                    .render('car/rent-form', {
                        result: {
                            user: mapper.map(req.user, 'username', 'role', 'email', 'firstName', 'lastName'),
                            carId
                        }
                    });
            }

            //TODO redirect to error page when implemented
            return res
                .status(300)
                .redirect('/sign-in');
        },
        rentCar(req, res) {
            let user = req.user;
            if (user) {
                let { startDate, endDate, message, carId } = req.body;
                return data.getCarById(carId)
                    .then((car) => {
                        let carProjection = {
                            id: car._id,
                            brand: car.brand,
                            model: car.model
                        };
                        let carOwner = {
                            username: car.owner.username,
                            imageUrl: car.owner.imageUrl
                        };
                        let renter = {
                            username: user.username,
                            imageUrl: user.picture
                        };
                        let messages = [{
                            text: message,
                            date: new Date(),
                            sender: user.username
                        }];
                        let rentalInfo = {
                            startDate,
                            endDate,
                            status: 'Pending'
                        };

                        let rentalModelInfo = {
                            car: carProjection,
                            carOwner,
                            renter,
                            messages,
                            rentalInfo
                        };

                        return data.addRental(rentalModelInfo);
                    })
                    .then(() => {
                        //TODO redirect to rentals page
                        return res.status(200).redirect('/');
                    })
                    .catch(err => {
                        return res.status(400)
                            .render('status-codes/status-code-error', {
                                result: {
                                    code: 400,
                                    err
                                }
                            });
                    });
            }

            //TODO redirect to error page when implemented
            return res
                .status(300)
                .redirect('/sign-in');
        }
    };
};