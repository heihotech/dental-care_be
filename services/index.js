module.exports = {
  Init: ({ models }) => {
    return {
      middleware: require('./middleware')({ models }),
      userService: require('./user')({ models }),
      roleService: require('./role')({ models }),
      permissionService: require('./permission')({ models }),
      authService: require('./auth')({ models }),
      profileService: require('./profile')({ models }),
      doctorService: require('./doctor')({ models }),
      clinicService: require('./clinic')({ models }),
      scheduleService: require('./schedule')({ models }),
      patientService: require('./patient')({ models }),
      provinceService: require('./region/province')({ models }),
      cityService: require('./region/city')({ models }),
      districtService: require('./region/district')({ models }),
      villageService: require('./region/village')({ models }),
      addressService: require('./region/address')({ models }),
      insuranceService: require('./insurance')({ models }),
      outpatientService: require('./outpatient')({ models }),
      //
      medicineService: require('./pharmacy/medicine')({ models }),
      pharmacyPoolService: require('./pharmacy/pharmacy-pool')({ models }),
      batchService: require('./pharmacy/batch')({ models }),
    }
  },
}
