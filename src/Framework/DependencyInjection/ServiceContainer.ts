import Service from "../../Data/Service";
import ServiceContainerInterface from './ServiceContainerInterface';

export default class ServiceContainer implements ServiceContainerInterface{
  private services: Service[] = []

  constructor() {
    this.services = [];
  }

  getService(name: string): any {
    const service = this.services.filter((service: Service) => service.getName() === name)

    if (service.length !== 1) {
      throw new Error(`Unexpected numbers of services found for name ${name}: ${service.length}`)
    }

    return service[0];
  }
}
