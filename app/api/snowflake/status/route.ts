import { NextResponse } from"next/server";
import { executeQuery, getSnowflakeConfig } from"../../../../lib/database/executeQuery";

export const dynamic ="force-dynamic";

export async function GET() {
 try {
 const config = getSnowflakeConfig();
 const hasEnvConfig = !!(config.account && config.username && config.privateKey);

 let isConnected = false;
 if (hasEnvConfig) {
 try {
 await executeQuery("SELECT CURRENT_TIMESTAMP();");
 isConnected = true;
 } catch (err: any) {
 console.error("Snowflake status check failed:", err.message);
 }
 }

 return NextResponse.json({
 success: true,
 isConnected,
 account: config.account ||"",
 username: config.username ||"",
 isEnvConfigured: hasEnvConfig,
 queryLog: []
 });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
