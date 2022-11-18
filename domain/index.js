const Event = require('./event')
const Health = require('./health')
const Signing = require('./signing')
const Updating = require('./updating')
const Listing = require('./listing')
const Creating = require('./creating')
const Uploading = require('./uploading')
const Inserting = require('./inserting')
const Deleting = require('./deleting')

module.exports = {
  New: ({ httpTool, services }) => {
    const {
      authService,
      userService,
      roleService,
      permissionService,
      clinicService,
      scheduleService,
      profileService,
      doctorService,
      provinceService,
      cityService,
      districtService,
      villageService,
      addressService,
      patientService,
      insuranceService,
      outpatientService,
      // pharmacy
      medicineService,
      pharmacyPoolService,
      batchService,
    } = services

    const {} = Event({})

    Health({ httpTool })
    Signing({ httpTool, authService, userService })
    Updating({
      httpTool,
      roleService,
      permissionService,
      clinicService,
      scheduleService,
      profileService,
      userService,
      doctorService,
      provinceService,
      cityService,
      districtService,
      villageService,
      addressService,
      patientService,
      insuranceService,
      outpatientService,
      // pharmacy
      medicineService,
      pharmacyPoolService,
      batchService,
    })
    Listing({
      httpTool,
      userService,
      roleService,
      permissionService,
      clinicService,
      scheduleService,
      profileService,
      doctorService,
      provinceService,
      cityService,
      districtService,
      villageService,
      addressService,
      patientService,
      insuranceService,
      outpatientService,
      // pharmacy
      medicineService,
      pharmacyPoolService,
      batchService,
    })
    Creating({
      httpTool,
      userService,
      roleService,
      permissionService,
      clinicService,
      scheduleService,
      profileService,
      doctorService,
      provinceService,
      cityService,
      districtService,
      villageService,
      addressService,
      patientService,
      insuranceService,
      outpatientService,
      // pharmacy
      medicineService,
      pharmacyPoolService,
      batchService,
    })
    Uploading({
      httpTool,
      userService,
      roleService,
      permissionService,
      clinicService,
      scheduleService,
      profileService,
      doctorService,
      insuranceService,
    })
    Inserting({
      httpTool,
      userService,
      roleService,
      permissionService,
      clinicService,
      scheduleService,
      profileService,
      doctorService,
      patientService,
      addressService,
      insuranceService,
      // pharmacy
      medicineService,
      pharmacyPoolService,
      batchService,
    })
    Deleting({
      httpTool,
      roleService,
      permissionService,
      clinicService,
      scheduleService,
      profileService,
      userService,
      doctorService,
      provinceService,
      cityService,
      districtService,
      villageService,
      addressService,
      patientService,
      insuranceService,
      outpatientService,
      // pharmacy
      medicineService,
      pharmacyPoolService,
      batchService,
    })
  },
}
