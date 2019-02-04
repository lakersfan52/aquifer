// @ts-check
import * as fs from 'fs';

export { AquiferAssert } from './AquiferAssert';
export { AquiferFunctionalPersister } from './AquiferFunctionalPersister';
export { log } from './AquiferLog';
export { AquiferTaskPersister } from './AquiferTaskPersister';
export { AquiferTimer } from './AquiferTimer';
export { AquiferWait } from './AquiferWait';
export { key } from './Key';
export { Page } from './Page';
export { UiContainer } from './UiContainer';
export { UiElement } from './UiElement';

export const iconDir = fs.existsSync('./icon') ? './icon' : './node_modules/aquifer/icon';
