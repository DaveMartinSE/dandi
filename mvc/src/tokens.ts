import { Uuid }           from '@dandi/core';
import { InjectionToken } from '@dandi/di-core';

import { localOpinionatedToken, localSymbolToken } from './local.token';

export type ParamMap = { [param: string]: string }

export const HttpRequestId: InjectionToken<Uuid>            = localOpinionatedToken<Uuid>('HttpRequestId', { multi: false });

export const RequestController: InjectionToken<any>         = localSymbolToken<any>('RequestController');
export const HttpRequestBody: InjectionToken<any>           = localSymbolToken<any>('HttpRequestBody');
export const RequestPathParamMap: InjectionToken<ParamMap>  = localSymbolToken<ParamMap>('RequestPathParamMap');
export const RequestQueryParamMap: InjectionToken<ParamMap> = localSymbolToken<ParamMap>('RequestQueryParamMap');