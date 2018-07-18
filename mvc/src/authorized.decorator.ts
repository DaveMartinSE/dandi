import { isConstructor } from '@dandi/core';
import { Provider }      from '@dandi/di-core';

import { AuthorizationCondition } from './authorization.condition';
import { getControllerMetadata }  from './controller.metadata';

export function authorizedDecorator(conditions: Provider<AuthorizationCondition>[], target: any, propertyKey: string) {
    const metaTarget = isConstructor(target) ? target : target.constructor;
    const meta = getControllerMetadata(metaTarget);

    if (propertyKey) {
        let controllerMethodMetadata = meta.routeMap.get(propertyKey);
        if (!controllerMethodMetadata) {
            controllerMethodMetadata = {
            };
            meta.routeMap.set(propertyKey, controllerMethodMetadata);
        }
        controllerMethodMetadata.authorization = conditions;
    } else {
        meta.authorization = conditions;
    }
}

export function Authorized(...conditions: Provider<AuthorizationCondition>[]) {
    return authorizedDecorator.bind(null, conditions);
}
