import { Constructor, getMetadata, MethodTarget } from '@dandi/common';
import { getResourceMetadata, RESOURCE_META_KEY } from '@dandi/hal';

import { getAccessorMetadata } from './resource.accessor.decorator';

export function resourceListAccessor(resource: Constructor<any>, target: MethodTarget<any>, propertyKey: string) {
  const meta = getResourceMetadata(resource);
  meta.listAccessor = getAccessorMetadata(target, propertyKey);
  meta.listAccessor.resource = resource;

  // also set a reference to the metadata on the method itself so it can be retrieved and updated by resourceIdDecorator
  getMetadata(RESOURCE_META_KEY, () => meta, target[propertyKey]);
}

export function ResourceListAccessor(resource: Constructor<any>) {
  return resourceListAccessor.bind(null, resource);
}
