export interface ModCachePolicy {
  /**
   * Called when we encounter a source file for the first time and need to
   * decide on whether to cache.
   */
  shouldCacheSource(filepath: string): boolean;

  /**
   * Called when we encounter a source that is already cached and we want to
   * know whether to refresh the source code or to use the cached copy.
   */
  shouldRefreshSource(filepath: string): boolean;
}

export const ModSystemNeverCache: ModCachePolicy = {
  shouldCacheSource: () => false,

  shouldRefreshSource: () => false,
};
