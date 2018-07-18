import { Constructor, getMetadata }    from '@dandi/core';

import { AuthorizationMetadata }       from './authorization.metadata';
import { CorsConfig }                  from './cors.config';
import { HttpMethod }                  from './http.method';
import { ControllerMethod, RoutePath } from './http.method.decorator';
import { mvcGlobalSymbol }             from './mvc.global.symbol';
import { MvcMetadata }                 from './mvc.metadata';

export class RouteMap extends Map<ControllerMethod, ControllerMethodMetadata> {}
export interface ControllerMethodMetadata extends AuthorizationMetadata {
    routePaths?: RouteMapEntry;
    cors?: CorsConfig | boolean;
}
export class RouteMapEntry extends Map<RoutePath, Set<HttpMethod>> {}

const META_KEY = mvcGlobalSymbol('meta:controller');

export interface ControllerMetadata extends MvcMetadata, AuthorizationMetadata {
    routeMap?: RouteMap;
}

export function getControllerMetadata(target: Constructor<any>): ControllerMetadata {
    return getMetadata(META_KEY, () => ({ routeMap: new RouteMap() }), target);
}