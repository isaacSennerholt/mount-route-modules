
module.exports =
  expressRouter => {
    return function mountRouteModules({
      resources = [],
      resourceMountPath = '/',
      parentRouteModule = expressRouter
    }) {
      resources.forEach(resource => {
        const {
          resourceModule = () => expressRouter,
          subResourceMountPath = '/',
          resourceDependencies = [],
          subResources = []
        } = resource

        if (typeof resourceModule !== 'function') {
          throw new Error('Expected resourceModule to be a function.')
        }

        const routeModule =
          resourceModule(...Object.values(resourceDependencies))

        if (!!subResources.length) {
          mountRouteModules({
            resources: subResources,
            resourceMountPath: subResourceMountPath,
            parentRouteModule: routeModule
          })
        }

        parentRouteModule.use(resourceMountPath, routeModule)
      })
    }
  }
