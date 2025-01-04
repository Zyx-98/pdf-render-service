export class ServiceContainer {
  private services = new Map<any, any>();
  private singletons = new Map<any, any>();

  bind<T>(type: any, factory: (serviceContainer: ServiceContainer) => T) {
    this.services.set(type, factory);
  }

  singleton<T>(type: any, factory: (serviceContainer: ServiceContainer) => T) {
    this.singletons.set(type, factory(this));
  }

  make<T>(type: any): T {
    if (this.singletons.has(type)) {
      const singleton = this.singletons.get(type);
      return singleton;
    }

    const service = this.services.get(type);
    return service(this);
  }
}
