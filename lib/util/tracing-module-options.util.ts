/**
 * Created by Rain on 2020/7/21
 */
import { TracingModuleOptions } from '..';
import { TracingConfig, TracingOptions } from 'jaeger-client';

export function formatTracingModuleOptions(
  tracingModuleOptions: TracingModuleOptions,
): { tracingConfig: TracingConfig; tracingOption: TracingOptions } {
  const { tracingConfig, tracingOption } = tracingModuleOptions;

  if (tracingOption && tracingOption.contextKey) {
    tracingOption.contextKey = tracingOption.contextKey?.toLowerCase();
  }
  if (tracingOption && tracingOption.baggagePrefix) {
    tracingOption.baggagePrefix = tracingOption.baggagePrefix?.toLowerCase();
  }
  return { tracingConfig, tracingOption };
}
