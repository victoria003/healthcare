module.exports=[18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},52766,82087,e=>{"use strict";let t=null,a=0,r=null,i=null,n=null,s=null,o=new TextEncoder;class A extends Error{statusCode;sqlState;code;constructor(e,t,a,r){super(e),this.name="SnowflakeError",this.statusCode=t,this.sqlState=a,this.code=r}}function E(){return{account:process.env.SNOWFLAKE_ACCOUNT||"",username:process.env.SNOWFLAKE_USERNAME||process.env.SNOWFLAKE_USER||"",privateKey:process.env.SNOWFLAKE_PRIVATE_KEY||"",password:process.env.SNOWFLAKE_PASSWORD||"",warehouse:process.env.SNOWFLAKE_WAREHOUSE||"",database:process.env.SNOWFLAKE_DATABASE||"",schema:process.env.SNOWFLAKE_SCHEMA||"",role:process.env.SNOWFLAKE_ROLE||"",publicKeyFingerprint:process.env.SNOWFLAKE_PUBLIC_KEY_FINGERPRINT||""}}function c(e){return btoa(e).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function l(e){let t=atob(e.replace(/\\n/g,"\n").replace(/-----BEGIN (RSA )?PRIVATE KEY-----/g,"").replace(/-----END (RSA )?PRIVATE KEY-----/g,"").replace(/\s/g,"")),a=new ArrayBuffer(t.length),r=new Uint8Array(a);for(let e=0;e<t.length;e++)r[e]=t.charCodeAt(e);return a}async function p(e){if(i&&n===e)return i;let t=l(e),a=await crypto.subtle.importKey("pkcs8",t,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},!0,["sign"]),r=await crypto.subtle.exportKey("jwk",a),s={kty:r.kty,n:r.n,e:r.e},o=await crypto.subtle.importKey("jwk",s,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},!0,["verify"]),A=await crypto.subtle.exportKey("spki",o),E=btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest("SHA-256",A))));return i=`SHA256:${E}`,n=e,i}async function R(e){let r=Math.floor(Date.now()/1e3);return t&&r<a-300?t:(s||(s=(async()=>{try{let i=await u(e);return t=i,a=r+3600,i}finally{s=null}})()),s)}async function u(e){let t=e.account.toUpperCase(),a=e.username.toUpperCase(),i=`${t}.${a}`,s=e.publicKeyFingerprint;if(!s)try{s=await p(e.privateKey)}catch{console.warn("[Snowflake REST] Unable to derive public fingerprint. Proceeding with user identity.")}let A=s?`${i}.${s}`:i,E=Math.floor(Date.now()/1e3),R=c(JSON.stringify({alg:"RS256",typ:"JWT"})),u=c(JSON.stringify({iss:A,sub:i,iat:E-60,exp:E+3600})),T=`${R}.${u}`;if(!r||n!==e.privateKey){let t=l(e.privateKey);r=await crypto.subtle.importKey("pkcs8",t,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},!1,["sign"]),n=e.privateKey}let S=function(e){let t="";for(let a=0;a<e.length;a++)t+=String.fromCharCode(e[a]);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}(new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5",r,o.encode(T))));return`${T}.${S}`}async function T(e,t,a=0){let r=new AbortController,i=setTimeout(()=>r.abort(),3e4);try{let n=await fetch(e,{...t,signal:r.signal});clearTimeout(i);let s=n.status;if(![429,500,502,503,504].includes(s)||a>=3)return n;let o=1e3*Math.pow(2,a);return console.warn(`[Snowflake REST] Retriable HTTP status ${s} hit. Retrying in ${o}ms... (Attempt ${a+1}/3)`),await new Promise(e=>setTimeout(e,o)),T(e,t,a+1)}catch(s){clearTimeout(i);let r="AbortError"===s.name,n=s instanceof TypeError;if((r||n)&&a<3){let i=1e3*Math.pow(2,a);return console.warn(`[Snowflake REST] Request ${r?"Timeout":"Network error"} hit. Retrying in ${i}ms... (Attempt ${a+1}/3)`),await new Promise(e=>setTimeout(e,i)),T(e,t,a+1)}throw s}}function S(e){return`https://${e}.snowflakecomputing.com`}async function d(e,t){let a=await R(e),r=S(e.account),i=`${r}/api/v2/statements?async=false`,n={statement:t.statement,timeout:t.timeout||60,database:t.database||e.database,schema:t.schema||e.schema,warehouse:t.warehouse||e.warehouse};(t.role||e.role)&&(n.role=t.role||e.role),t.bindings&&Object.keys(t.bindings).length>0&&(n.bindings=t.bindings),t.parameters&&(n.parameters=t.parameters);let s=Date.now(),o=await T(i,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${a}`,Accept:"application/json","User-Agent":"HomeCare-Marketplace/1.0","X-Snowflake-Authorization-Token-Type":"KEYPAIR_JWT"},body:JSON.stringify(n)}),E=await o.json(),c=Date.now()-s;if(202===o.status&&E.statementHandle)return await y(e,E.statementHandle);if(!o.ok)throw new A(E.message||`Snowflake REST API execution failure: HTTP ${o.status}`,o.status,E.sqlState,E.code);return console.log(`[Snowflake REST] Query completed | Handle: ${E.statementHandle||"N/A"} | Status: ${o.status} | Duration: ${c}ms`),E}async function y(e,t,a=60,r=1e3){let i=await R(e),n=S(e.account),s=`${n}/api/v2/statements/${t}`;for(let e=0;e<a;e++){let e=await T(s,{method:"GET",headers:{Authorization:`Bearer ${i}`,Accept:"application/json","X-Snowflake-Authorization-Token-Type":"KEYPAIR_JWT"}}),t=await e.json();if(200===e.status)return t;if(202===e.status){await new Promise(e=>setTimeout(e,r));continue}throw new A(t.message||`Snowflake execution polling failed: HTTP ${e.status}`,e.status,t.sqlState,t.code)}throw new A(`Snowflake polling timed out after ${a} attempts. Handle: ${t}`,408)}async function _(e,t=[]){let a=E(),r=[];if(a.account||r.push("SNOWFLAKE_ACCOUNT"),a.username||r.push("SNOWFLAKE_USERNAME / SNOWFLAKE_USER"),a.privateKey||r.push("SNOWFLAKE_PRIVATE_KEY"),a.warehouse||r.push("SNOWFLAKE_WAREHOUSE"),a.database||r.push("SNOWFLAKE_DATABASE"),a.schema||r.push("SNOWFLAKE_SCHEMA"),r.length>0)throw new A(`Missing required Snowflake configuration parameters: ${r.join(", ")}`,500);let{statement:i,bindings:n}=function(e,t){if(!t||0===t.length)return{statement:e,bindings:{}};let a=0,r=e.replace(/\?/g,()=>(a++,`:${a}`)),i={};return t.forEach((e,t)=>{let a=String(t+1);null==e?i[a]={type:"TEXT",value:null}:"number"==typeof e?Number.isInteger(e)?i[a]={type:"FIXED",value:String(e)}:i[a]={type:"REAL",value:String(e)}:"boolean"==typeof e?i[a]={type:"BOOLEAN",value:String(e)}:i[a]={type:"TEXT",value:String(e)}}),{statement:r,bindings:i}}(e,t);var s=await d(a,{statement:i,bindings:n});if(!s.data||!s.resultSetMetaData?.rowType)return[];let o=s.resultSetMetaData.rowType;return s.data.map(e=>{let t={};return o.forEach((a,r)=>{let i=e[r];if(null==i)t[a.name]=null;else{let e=a.type.toUpperCase();"FIXED"===e||"NUMBER"===e||"DECIMAL"===e||"NUMERIC"===e||"INT"===e||"INTEGER"===e||"BIGINT"===e||"SMALLINT"===e||"TINYINT"===e||"FLOAT"===e||"DOUBLE"===e||"REAL"===e?t[a.name]=Number(i):"BOOLEAN"===e?t[a.name]="true"===i||"1"===i:t[a.name]=i}}),t})}e.s(["executeQuery",0,_,"getSnowflakeConfig",0,E],82087),e.s([],52766)},77592,e=>{"use strict";e.i(52766);var t=e.i(82087);e.s(["AuditRepository",0,{async createLog(e,a,r,i){let n=`
      INSERT INTO CORE.AUDIT_LOGS (actor_id, action, details, ip_address, created_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP());
    `;return await (0,t.executeQuery)(n,[e,a,r,i||"127.0.0.1"]),{log_id:Date.now(),actor_id:e,action:a,details:r,ip_address:i||"127.0.0.1",created_at:new Date().toISOString()}},getAll:async()=>(await (0,t.executeQuery)("SELECT * FROM CORE.AUDIT_LOGS ORDER BY created_at DESC;")).map(e=>({log_id:Number(e.LOG_ID||e.log_id||0),actor_id:e.ACTOR_ID||e.actor_id,action:e.ACTION||e.action,details:e.DETAILS||e.details,ip_address:e.IP_ADDRESS||e.ip_address,created_at:e.CREATED_AT||e.created_at}))}])},40376,e=>{"use strict";e.i(52766);var t=e.i(82087);function a(e){let t=[],a=[];try{e.GOALS&&(t="string"==typeof e.GOALS?JSON.parse(e.GOALS):Array.isArray(e.GOALS)?e.GOALS:[])}catch{t=[]}try{e.PRESCRIPTIONS&&(a="string"==typeof e.PRESCRIPTIONS?JSON.parse(e.PRESCRIPTIONS):Array.isArray(e.PRESCRIPTIONS)?e.PRESCRIPTIONS:[])}catch{a=[]}return{id:e.ID||e.id,patientId:e.PATIENT_ID||e.patient_id,patientName:e.PATIENT_NAME||e.patient_name||"Demo Patient",agencyId:e.AGENCY_ID||e.agency_id,diagnosis:e.DIAGNOSIS||e.diagnosis||"",goals:t,frequency:e.FREQUENCY||e.frequency||"",prescriptions:a,riskAssessment:e.RISK_ASSESSMENT||e.risk_assessment||"low",riskDetails:e.RISK_DETAILS||e.risk_details||"",createdBy:e.CREATED_BY||e.created_by||"Clinical Admin",createdAt:e.CREATED_AT||e.created_at}}e.s(["ClinicalRepository",0,{async getCarePlansByPatient(e){let r=`
      CREATE TABLE IF NOT EXISTS CORE.CARE_PLANS (
        id VARCHAR(50) PRIMARY KEY,
        patient_id VARCHAR(50),
        agency_id VARCHAR(50),
        diagnosis TEXT,
        goals ARRAY,
        frequency VARCHAR(100),
        prescriptions ARRAY,
        risk_assessment VARCHAR(20),
        risk_details TEXT,
        created_by VARCHAR(100),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;await (0,t.executeQuery)(r);let i=`
      SELECT cp.*, u.full_name AS patient_name
      FROM CORE.CARE_PLANS cp
      LEFT JOIN CORE.USERS u ON cp.patient_id = u.user_id
      WHERE cp.patient_id = ?;
    `;return(await (0,t.executeQuery)(i,[e])).map(a)},async getCarePlanById(e){let r=`
      CREATE TABLE IF NOT EXISTS CORE.CARE_PLANS (
        id VARCHAR(50) PRIMARY KEY,
        patient_id VARCHAR(50),
        agency_id VARCHAR(50),
        diagnosis TEXT,
        goals ARRAY,
        frequency VARCHAR(100),
        prescriptions ARRAY,
        risk_assessment VARCHAR(20),
        risk_details TEXT,
        created_by VARCHAR(100),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;await (0,t.executeQuery)(r);let i=`
      SELECT cp.*, u.full_name AS patient_name
      FROM CORE.CARE_PLANS cp
      LEFT JOIN CORE.USERS u ON cp.patient_id = u.user_id
      WHERE cp.id = ?;
    `,n=await (0,t.executeQuery)(i,[e]);return n[0]?a(n[0]):void 0},async createCarePlan(e){let a=`
      CREATE TABLE IF NOT EXISTS CORE.CARE_PLANS (
        id VARCHAR(50) PRIMARY KEY,
        patient_id VARCHAR(50),
        agency_id VARCHAR(50),
        diagnosis TEXT,
        goals ARRAY,
        frequency VARCHAR(100),
        prescriptions ARRAY,
        risk_assessment VARCHAR(20),
        risk_details TEXT,
        created_by VARCHAR(100),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;await (0,t.executeQuery)(a);let r=`cp-${Date.now()}`,i=JSON.stringify(e.goals||[]),n=JSON.stringify(e.prescriptions||[]),s=`
      INSERT INTO CORE.CARE_PLANS (id, patient_id, agency_id, diagnosis, goals, frequency, prescriptions, risk_assessment, risk_details, created_by)
      VALUES (?, ?, ?, ?, PARSE_JSON(?), ?, PARSE_JSON(?), ?, ?, ?);
    `;await (0,t.executeQuery)(s,[r,e.patientId,e.agencyId,e.diagnosis,i,e.frequency,n,e.riskAssessment,e.riskDetails||"",e.createdBy]);let o=await this.getCarePlanById(r);if(!o)throw Error("Failed to retrieve created care plan.");return o},async getMedicalTimeline(e){let a=`
      CREATE TABLE IF NOT EXISTS CORE.MEDICAL_TIMELINE (
        id VARCHAR(50) PRIMARY KEY,
        patient_id VARCHAR(50),
        title VARCHAR(200),
        description TEXT,
        category VARCHAR(20),
        timestamp TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;return await (0,t.executeQuery)(a),(await (0,t.executeQuery)("SELECT * FROM CORE.MEDICAL_TIMELINE WHERE patient_id = ? ORDER BY timestamp DESC;",[e])).map(e=>({id:e.ID||e.id,patientId:e.PATIENT_ID||e.patient_id,title:e.TITLE||e.title,description:e.DESCRIPTION||e.description,category:e.CATEGORY||e.category,timestamp:e.TIMESTAMP||e.timestamp}))},async addTimelineEvent(e){let a=`
      CREATE TABLE IF NOT EXISTS CORE.MEDICAL_TIMELINE (
        id VARCHAR(50) PRIMARY KEY,
        patient_id VARCHAR(50),
        title VARCHAR(200),
        description TEXT,
        category VARCHAR(20),
        timestamp TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;await (0,t.executeQuery)(a);let r=`mte-${Date.now()}`,i=`
      INSERT INTO CORE.MEDICAL_TIMELINE (id, patient_id, title, description, category)
      VALUES (?, ?, ?, ?, ?);
    `;return await (0,t.executeQuery)(i,[r,e.patientId,e.title,e.description,e.category]),{id:r,...e,timestamp:new Date().toISOString()}},async getVisitTemplates(e){let a=`
      CREATE TABLE IF NOT EXISTS CORE.VISIT_TEMPLATES (
        id VARCHAR(50) PRIMARY KEY,
        agency_id VARCHAR(50),
        name VARCHAR(150),
        description TEXT,
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;return await (0,t.executeQuery)(a),(await (0,t.executeQuery)("SELECT * FROM CORE.VISIT_TEMPLATES WHERE agency_id = ?;",[e])).map(e=>({id:e.ID||e.id,agencyId:e.AGENCY_ID||e.agency_id,name:e.NAME||e.name,description:e.DESCRIPTION||e.description}))}}])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__1gki7o0._.js.map