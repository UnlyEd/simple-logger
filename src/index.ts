import { createSimpleLogger } from './simpleLogger';

// Export all members at the root level to make them easier to import without digging into /dist (DX)
export * from './simpleLogger';

export default createSimpleLogger;
