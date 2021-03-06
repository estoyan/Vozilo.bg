/* globals module */
'use strict';

module.exports = function({ models }) {
    let {
        CarBrandDetail
    } = models;

    return {
        getAllBrands() {
            return new Promise((resolve, reject) => {
                CarBrandDetail.find()
                    .select('brand')
                    .exec((err, res) => {
                        if (err) {
                            return reject(err);
                        }

                        resolve(res);
                    });
            });
        },
        getModels(brand) {
            return new Promise((resolve, reject) => {
                CarBrandDetail.find({
                    brand
                })
                    .select('models.model')
                    .exec((err, res) => {
                        if (err) {
                            return reject(err);
                        }

                        resolve(res);
                    });
            });
        }
    };
};