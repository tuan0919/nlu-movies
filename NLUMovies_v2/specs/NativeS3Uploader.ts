import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
    sayHello(): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
    'NativeS3Uploader',
) as Spec;
