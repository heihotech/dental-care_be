;(async () => {
  require('./internal/config').Init()

  const config = require('./internal/config').Var
  const { models, httpRouter } = await require('./infra').Init()
  const {
    middleware,
    profileService,
    userService,
    roleService,
    permissionService,
    authService,
    clinicService,
    scheduleService,
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
  } = require('./services').Init({
    models,
  })

  require('./domain').New({
    httpTool: {
      httpRouter,
      middleware,
    },
    services: {
      profileService,
      userService,
      roleService,
      permissionService,
      authService,
      clinicService,
      scheduleService,
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
    },
  })

  require('./infra/httpserver')
    .Invoke(httpRouter)
    .listen(config.AppPort, () => {
      console.log(`+++ Application is Running on Port ${config.AppPort}. +++`)
    })
})()
