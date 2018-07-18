import { Constructor }              from '@dandi/core';
import { InjectionToken, Provider } from '@dandi/di-core';

import { AuthorizationCondition } from './authorization.condition';
import { CorsConfig }             from './cors.config';
import { HttpMethod }             from './http.method';
import { localSymbolToken }       from './local.token';

export interface Route {
    httpMethod: HttpMethod;
    siblingMethods: Set<HttpMethod>;
    cors: boolean | CorsConfig;
    path: string;
    controllerCtr: Constructor<any>;
    controllerMethod: string;
    authorization: false | Provider<AuthorizationCondition>[];
}

export const Route: InjectionToken<Route> = localSymbolToken<Route>('Route');