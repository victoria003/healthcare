/**
 * Database Query Execution Layer
 * 
 * Re-exports query functions from the Snowflake SQL API client.
 * This module is the single import point for all repositories.
 */

export {
  executeQuery,
  executeTransaction,
  executePaginatedQuery,
  isSnowflakeConfigured,
  getSnowflakeConfig,
  SnowflakeAPIError,
} from "./snowflakeClient";
