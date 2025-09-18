/**
 * @file debounce.ts
 * @description Provides a debounce utility function to limit the rate at which a function can fire
 * 
 * @module utils/debounce
 * @author Cursor AI Time Tracking Team
 * @version 1.0.0
 */

/**
 * Options for the debounce function
 */
export interface DebounceOptions {
  /**
   * If true, the function will be called at the beginning of the timeout period
   * instead of the end
   */
  immediate?: boolean;
  
  /**
   * If true, the function will be called with the context (this) of the debounced function
   */
  preserveContext?: boolean;
  
  /**
   * Maximum time to wait before forcing execution, regardless of subsequent calls
   * Set to 0 to disable
   */
  maxWait?: number;
}

/**
 * Creates a debounced version of the provided function that delays invoking the function
 * until after the specified wait time has elapsed since the last invocation.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: DebounceOptions = {}
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime: number = 0;
  let lastArgs: Parameters<T> | null = null;
  let result: ReturnType<T>;
  let lastThis: any;
  
  // Extract options with defaults
  const { immediate = false, preserveContext = true, maxWait = 0 } = options;
  
  /**
   * Clears the timeout and resets state
   */
  function clearDebounceTimeout(): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }
  
  /**
   * Executes the debounced function with the last provided arguments
   */
  function executeFunc(): void {
    // Clear any existing timeout
    clearDebounceTimeout();
    
    if (lastArgs) {
      // Execute the function with the correct context and arguments
      const context = preserveContext ? lastThis : undefined;
      result = func.apply(context, lastArgs);
      lastArgs = null;
      lastCallTime = Date.now();
    }
  }
  
  /**
   * The debounced function that will be returned
   */
  const debouncedFunc = function(this: any, ...args: Parameters<T>): void {
    // Store the arguments and context for later execution
    lastArgs = args;
    lastThis = this;
    const now = Date.now();
    
    // If this is the first call or immediate execution is requested
    const isFirstCall = !timeoutId && immediate;
    
    // Clear any existing timeout
    clearDebounceTimeout();
    
    // If immediate execution is requested and this is the first call, execute now
    if (isFirstCall) {
      executeFunc();
      return;
    }
    
    // Check if we've exceeded the maximum wait time
    if (maxWait > 0 && now - lastCallTime >= maxWait) {
      executeFunc();
      return;
    }
    
    // Set a new timeout
    timeoutId = setTimeout(() => {
      executeFunc();
    }, wait);
  };
  
  /**
   * Cancels any pending debounced invocation
   */
  debouncedFunc.cancel = function(): void {
    clearDebounceTimeout();
    lastArgs = null;
  };
  
  /**
   * Forces immediate execution of any pending debounced invocation
   */
  debouncedFunc.flush = function(): ReturnType<T> | undefined {
    if (lastArgs) {
      executeFunc();
      return result;
    }
    return undefined;
  };
  
  return debouncedFunc;
}

/**
 * Creates a throttled version of the provided function that limits how often the function can be called
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastCallTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any;
  
  function executeFunc(): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    if (lastArgs) {
      func.apply(lastThis, lastArgs);
      lastCallTime = Date.now();
      lastArgs = null;
    }
  }
  
  const throttledFunc = function(this: any, ...args: Parameters<T>): void {
    const now = Date.now();
    lastArgs = args;
    lastThis = this;
    
    // If we haven't called the function recently, call it immediately
    if (now - lastCallTime >= wait) {
      executeFunc();
    } else if (!timeoutId) {
      // Otherwise, schedule to call at the end of the wait period
      timeoutId = setTimeout(() => {
        executeFunc();
      }, wait - (now - lastCallTime));
    }
  };
  
  throttledFunc.cancel = function(): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
  };
  
  return throttledFunc;
}
