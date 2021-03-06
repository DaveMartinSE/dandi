import { Constructor } from '@dandi/common';

import { ProviderOptions } from './provider';
import { Repository } from './repository';

import { InjectionToken, InjectionTokenTypeError, isInjectionToken } from './injection.token';

export interface InjectableDecorator<T> {
  (options?: InjectionToken<T>): ClassDecorator;
  new (options?: InjectionToken<T>): InjectionToken<T>;
}

export function injectableDecorator<T>(
  injectable: InjectionToken<T>,
  injectableOptions: InjectableOption[],
  target: Constructor<T>,
): void {
  if (injectable && !isInjectionToken(injectable)) {
    throw new InjectionTokenTypeError(injectable);
  }
  const providerOptions: ProviderOptions<T> = {};
  if (injectable) {
    providerOptions.provide = injectable;
  }
  injectableOptions.forEach((option) => option.setOptions(providerOptions));
  Repository.global.register(target, providerOptions);
  Reflect.set(target, ProviderOptions.valueOf() as symbol, providerOptions);
}

export function Injectable<T>(
  injectableOrOption: InjectionToken<T> | InjectableOption = null,
  ...options: InjectableOption[]
): ClassDecorator {
  const injectable: InjectionToken<T> = isInjectableOption(injectableOrOption) ? null : injectableOrOption;
  if (isInjectableOption(injectableOrOption)) {
    options.unshift(injectableOrOption);
  }
  return injectableDecorator.bind(null, injectable, options);
}

function isInjectableOption(obj: any): obj is InjectableOption {
  return obj instanceof InjectableOption;
}

export class InjectableOption {
  constructor(private _setOptions: (options: ProviderOptions<any>) => void) {}
  public setOptions(options: ProviderOptions<any>): void {
    this._setOptions(options);
  }
}

export const Singleton = new InjectableOption((options: ProviderOptions<any>) => (options.singleton = true));
export const Multi = new InjectableOption((options: ProviderOptions<any>) => (options.multi = true));
