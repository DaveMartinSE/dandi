import { Constructor, MethodTarget } from '@dandi/common';
import { getInjectableParamMetadata, ParamMetadata, Provider } from '@dandi/core';
import { ModelBuilder, ModelBuilderOptions } from '@dandi/model-builder';

import { ModelBindingError } from './errors';
import { MvcRequest } from './mvc.request';
import { RequestParamModelBuilderOptions, RequestParamModelBuilderOptionsProvider } from './request.param.decorator';
import { HttpRequestBody } from './tokens';

export interface RequestBody<TModel, TTarget> extends ParamMetadata<TTarget> {
  model: Constructor<TModel>;
}

export function requestBodyProvider(model: Constructor<any>): Provider<any> {
  return {
    provide: HttpRequestBody,
    useFactory: (req: MvcRequest, builder: ModelBuilder, options: ModelBuilderOptions) => {
      if (!req.body) {
        return undefined;
      }
      if (!model) {
        return req.body;
      }
      try {
        return builder.constructModel(model, req.body, options);
      } catch (err) {
        throw new ModelBindingError(err);
      }
    },
    singleton: true,
    deps: [MvcRequest, ModelBuilder, RequestParamModelBuilderOptions],
    providers: [RequestParamModelBuilderOptionsProvider],
  };
}

export function requestBodyDecorator<TModel, TTarget>(
  requestBody: RequestBody<TModel, TTarget>,
  target: MethodTarget<TTarget>,
  propertyName: string,
  paramIndex: number,
) {
  const meta = getInjectableParamMetadata<TTarget, RequestBody<TModel, TTarget>>(target, propertyName, paramIndex);
  meta.token = HttpRequestBody;
  meta.providers = [requestBodyProvider(requestBody.model)];
}

export function RequestBody<TModel, TTarget>(model?: Constructor<TModel>): ParameterDecorator {
  return requestBodyDecorator.bind(null, { model });
}
