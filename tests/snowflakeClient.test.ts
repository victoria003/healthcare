import { assert } from "console";
import { convertBinds } from "../lib/database/snowflakeClient";

/**
 * Self-contained unit tests for the Snowflake SQL API Client.
 * Run in any TypeScript compilation environment.
 */
export function runUnitTests(): void {
  console.log("[Test Runner] Starting Snowflake REST client unit tests...");

  try {
    // Test 1: Convert binds mapping from '?' to named positional binds
    const query = "SELECT * FROM CORE.USERS WHERE EMAIL = ? AND STATUS = ?;";
    const binds = ["test@example.com", "active"];
    const result = convertBinds(query, binds);

    if (result.statement !== "SELECT * FROM CORE.USERS WHERE EMAIL = :1 AND STATUS = :2;") {
      throw new Error(`Test 1 Failed: Statement translation incorrect: ${result.statement}`);
    }

    if (
      result.bindings["1"].type !== "TEXT" ||
      result.bindings["1"].value !== "test@example.com" ||
      result.bindings["2"].type !== "TEXT" ||
      result.bindings["2"].value !== "active"
    ) {
      throw new Error("Test 1 Failed: Binding payload structure incorrect.");
    }
    console.log("✓ Test 1: Positional bind conversion passed.");

    // Test 2: Convert numbers and boolean binds
    const query2 = "UPDATE STAFF_PROFILES SET RATING = ?, LIVENESS_VERIFIED = ?;";
    const binds2 = [4.8, true];
    const result2 = convertBinds(query2, binds2);

    if (
      result2.bindings["1"].type !== "REAL" ||
      result2.bindings["1"].value !== "4.8" ||
      result2.bindings["2"].type !== "BOOLEAN" ||
      result2.bindings["2"].value !== "true"
    ) {
      throw new Error("Test 2 Failed: Data type mapping incorrect.");
    }
    console.log("✓ Test 2: Binding type coercion passed.");

    // Test 3: Null value bindings
    const query3 = "INSERT INTO DOCUMENTS (FILE_URL) VALUES (?);";
    const binds3 = [null];
    const result3 = convertBinds(query3, binds3);

    if (result3.bindings["1"].type !== "TEXT" || result3.bindings["1"].value !== null) {
      throw new Error("Test 3 Failed: Null parameter binding incorrect.");
    }
    console.log("✓ Test 3: Null variable formatting passed.");

    console.log("[Test Runner] All unit tests completed successfully!");
  } catch (err: any) {
    console.error("[Test Runner] Unit tests failed:", err.message);
    throw err;
  }
}
