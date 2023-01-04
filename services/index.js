module.exports = {
  Init: ({ models }) => {
    return {
      middleware: require('./middleware')({ models }),
      userService: require('./user')({ models }),
      roleService: require('./role')({ models }),
      authService: require('./auth')({ models }),
      profileService: require('./profile')({ models }),
      doctorService: require('./doctor')({ models }),
      clinicService: require('./clinic')({ models }),
      patientService: require('./patient')({ models }),
      bookOrderService: require('./bookorder')({ models }),
      provinceService: require('./region/province')({ models }),
      cityService: require('./region/city')({ models }),
      districtService: require('./region/district')({ models }),
      villageService: require('./region/village')({ models }),
      addressService: require('./region/address')({ models }),
      //
    }
  },
}
