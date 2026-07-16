module.exports=[93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},52766,82087,e=>{"use strict";let t=null,a=0,E=null,i=null,r=null,n=null,s=new TextEncoder;class A extends Error{statusCode;sqlState;code;constructor(e,t,a,E){super(e),this.name="SnowflakeError",this.statusCode=t,this.sqlState=a,this.code=E}}function R(){return{account:process.env.SNOWFLAKE_ACCOUNT||"",username:process.env.SNOWFLAKE_USERNAME||process.env.SNOWFLAKE_USER||"",privateKey:process.env.SNOWFLAKE_PRIVATE_KEY||"",password:process.env.SNOWFLAKE_PASSWORD||"",warehouse:process.env.SNOWFLAKE_WAREHOUSE||"",database:process.env.SNOWFLAKE_DATABASE||"",schema:process.env.SNOWFLAKE_SCHEMA||"",role:process.env.SNOWFLAKE_ROLE||"",publicKeyFingerprint:process.env.SNOWFLAKE_PUBLIC_KEY_FINGERPRINT||""}}function T(e){return btoa(e).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function u(e){let t=atob(e.replace(/\\n/g,"\n").replace(/-----BEGIN (RSA )?PRIVATE KEY-----/g,"").replace(/-----END (RSA )?PRIVATE KEY-----/g,"").replace(/\s/g,"")),a=new ArrayBuffer(t.length),E=new Uint8Array(a);for(let e=0;e<t.length;e++)E[e]=t.charCodeAt(e);return a}async function _(e){if(i&&r===e)return i;let t=u(e),a=await crypto.subtle.importKey("pkcs8",t,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},!0,["sign"]),E=await crypto.subtle.exportKey("jwk",a),n={kty:E.kty,n:E.n,e:E.e},s=await crypto.subtle.importKey("jwk",n,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},!0,["verify"]),A=await crypto.subtle.exportKey("spki",s),R=btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest("SHA-256",A))));return i=`SHA256:${R}`,r=e,i}async function S(e){let E=Math.floor(Date.now()/1e3);return t&&E<a-300?t:(n||(n=(async()=>{try{let i=await d(e);return t=i,a=E+3600,i}finally{n=null}})()),n)}async function d(e){let t=e.account.toUpperCase(),a=e.username.toUpperCase(),i=`${t}.${a}`,n=e.publicKeyFingerprint;if(!n)try{n=await _(e.privateKey)}catch{console.warn("[Snowflake REST] Unable to derive public fingerprint. Proceeding with user identity.")}let A=n?`${i}.${n}`:i,R=Math.floor(Date.now()/1e3),S=T(JSON.stringify({alg:"RS256",typ:"JWT"})),d=T(JSON.stringify({iss:A,sub:i,iat:R-60,exp:R+3600})),c=`${S}.${d}`;if(!E||r!==e.privateKey){let t=u(e.privateKey);E=await crypto.subtle.importKey("pkcs8",t,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},!1,["sign"]),r=e.privateKey}let o=function(e){let t="";for(let a=0;a<e.length;a++)t+=String.fromCharCode(e[a]);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}(new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5",E,s.encode(c))));return`${c}.${o}`}async function c(e,t,a=0){let E=new AbortController,i=setTimeout(()=>E.abort(),3e4);try{let r=await fetch(e,{...t,signal:E.signal});clearTimeout(i);let n=r.status;if(![429,500,502,503,504].includes(n)||a>=3)return r;let s=1e3*Math.pow(2,a);return console.warn(`[Snowflake REST] Retriable HTTP status ${n} hit. Retrying in ${s}ms... (Attempt ${a+1}/3)`),await new Promise(e=>setTimeout(e,s)),c(e,t,a+1)}catch(n){clearTimeout(i);let E="AbortError"===n.name,r=n instanceof TypeError;if((E||r)&&a<3){let i=1e3*Math.pow(2,a);return console.warn(`[Snowflake REST] Request ${E?"Timeout":"Network error"} hit. Retrying in ${i}ms... (Attempt ${a+1}/3)`),await new Promise(e=>setTimeout(e,i)),c(e,t,a+1)}throw n}}function o(e){return`https://${e}.snowflakecomputing.com`}async function I(e,t){let a=await S(e),E=o(e.account),i=`${E}/api/v2/statements?async=false`,r={statement:t.statement,timeout:t.timeout||60,database:t.database||e.database,schema:t.schema||e.schema,warehouse:t.warehouse||e.warehouse};(t.role||e.role)&&(r.role=t.role||e.role),t.bindings&&Object.keys(t.bindings).length>0&&(r.bindings=t.bindings),t.parameters&&(r.parameters=t.parameters);let n=Date.now(),s=await c(i,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${a}`,Accept:"application/json","User-Agent":"HomeCare-Marketplace/1.0","X-Snowflake-Authorization-Token-Type":"KEYPAIR_JWT"},body:JSON.stringify(r)}),R=await s.json(),T=Date.now()-n;if(202===s.status&&R.statementHandle)return await C(e,R.statementHandle);if(!s.ok)throw new A(R.message||`Snowflake REST API execution failure: HTTP ${s.status}`,s.status,R.sqlState,R.code);return console.log(`[Snowflake REST] Query completed | Handle: ${R.statementHandle||"N/A"} | Status: ${s.status} | Duration: ${T}ms`),R}async function C(e,t,a=60,E=1e3){let i=await S(e),r=o(e.account),n=`${r}/api/v2/statements/${t}`;for(let e=0;e<a;e++){let e=await c(n,{method:"GET",headers:{Authorization:`Bearer ${i}`,Accept:"application/json","X-Snowflake-Authorization-Token-Type":"KEYPAIR_JWT"}}),t=await e.json();if(200===e.status)return t;if(202===e.status){await new Promise(e=>setTimeout(e,E));continue}throw new A(t.message||`Snowflake execution polling failed: HTTP ${e.status}`,e.status,t.sqlState,t.code)}throw new A(`Snowflake polling timed out after ${a} attempts. Handle: ${t}`,408)}async function N(e,t=[]){let a=R(),E=[];if(a.account||E.push("SNOWFLAKE_ACCOUNT"),a.username||E.push("SNOWFLAKE_USERNAME / SNOWFLAKE_USER"),a.privateKey||E.push("SNOWFLAKE_PRIVATE_KEY"),a.warehouse||E.push("SNOWFLAKE_WAREHOUSE"),a.database||E.push("SNOWFLAKE_DATABASE"),a.schema||E.push("SNOWFLAKE_SCHEMA"),E.length>0)throw new A(`Missing required Snowflake configuration parameters: ${E.join(", ")}`,500);let{statement:i,bindings:r}=function(e,t){if(!t||0===t.length)return{statement:e,bindings:{}};let a=0,E=e.replace(/\?/g,()=>(a++,`:${a}`)),i={};return t.forEach((e,t)=>{let a=String(t+1);null==e?i[a]={type:"TEXT",value:null}:"number"==typeof e?Number.isInteger(e)?i[a]={type:"FIXED",value:String(e)}:i[a]={type:"REAL",value:String(e)}:"boolean"==typeof e?i[a]={type:"BOOLEAN",value:String(e)}:i[a]={type:"TEXT",value:String(e)}}),{statement:E,bindings:i}}(e,t);var n=await I(a,{statement:i,bindings:r});if(!n.data||!n.resultSetMetaData?.rowType)return[];let s=n.resultSetMetaData.rowType;return n.data.map(e=>{let t={};return s.forEach((a,E)=>{let i=e[E];if(null==i)t[a.name]=null;else{let e=a.type.toUpperCase();"FIXED"===e||"NUMBER"===e||"DECIMAL"===e||"NUMERIC"===e||"INT"===e||"INTEGER"===e||"BIGINT"===e||"SMALLINT"===e||"TINYINT"===e||"FLOAT"===e||"DOUBLE"===e||"REAL"===e?t[a.name]=Number(i):"BOOLEAN"===e?t[a.name]="true"===i||"1"===i:t[a.name]=i}}),t})}e.s(["executeQuery",0,N,"getSnowflakeConfig",0,R],82087),e.s([],52766)},74736,e=>{"use strict";e.i(52766);var t=e.i(82087);e.s(["AuthRepository",0,{async createUser(e){let a=new Date().toISOString(),E={id:e.id,firstName:e.firstName,lastName:e.lastName,email:e.email,phone:e.phone,status:"active",createdAt:a,updatedAt:a},i=`
      INSERT INTO CORE.APP_USER (user_id, first_name, last_name, email, phone, password_hash, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'active', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
    `;await (0,t.executeQuery)(i,[e.id,e.firstName,e.lastName,e.email,e.phone,e.passwordHash]);let r={PATIENT:"role-1",PROFESSIONAL:"role-2",AGENCY:"role-3",ADMIN:"role-4",SUPER_ADMIN:"role-5"}[e.role.toUpperCase()]||"role-1",n=`ur-${Date.now()}`,s=`
      INSERT INTO CORE.USER_ROLE (user_role_id, user_id, role_id, created_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP());
    `;return await (0,t.executeQuery)(s,[n,e.id,r]),E},async findUserByEmail(e){let a=`
      SELECT u.*, r.role_name 
      FROM CORE.APP_USER u
      LEFT JOIN CORE.USER_ROLE ur ON u.user_id = ur.user_id
      LEFT JOIN CORE.ROLE r ON ur.role_id = r.role_id
      WHERE LOWER(u.email) = LOWER(?);
    `,E=await (0,t.executeQuery)(a,[e]);if(E&&E.length>0){let e=E[0];return{id:e.USER_ID||e.user_id,firstName:e.FIRST_NAME||e.first_name,lastName:e.LAST_NAME||e.last_name,email:e.EMAIL||e.email,phone:e.PHONE||e.phone,status:e.STATUS||e.status||"active",createdAt:e.CREATED_AT||e.created_at,updatedAt:e.UPDATED_AT||e.updated_at,passwordHash:e.PASSWORD_HASH||e.password_hash,role:e.ROLE_NAME||e.role_name||"PATIENT"}}},async findUserById(e){let a=`
      SELECT u.*, r.role_name 
      FROM CORE.APP_USER u
      LEFT JOIN CORE.USER_ROLE ur ON u.user_id = ur.user_id
      LEFT JOIN CORE.ROLE r ON ur.role_id = r.role_id
      WHERE u.user_id = ?;
    `,E=await (0,t.executeQuery)(a,[e]);if(E&&E.length>0){let e=E[0];return{id:e.USER_ID||e.user_id,firstName:e.FIRST_NAME||e.first_name,lastName:e.LAST_NAME||e.last_name,email:e.EMAIL||e.email,phone:e.PHONE||e.phone,status:e.STATUS||e.status||"active",createdAt:e.CREATED_AT||e.created_at,updatedAt:e.UPDATED_AT||e.updated_at,passwordHash:e.PASSWORD_HASH||e.password_hash,role:e.ROLE_NAME||e.role_name||"PATIENT"}}},async updatePassword(e,a){let E=`
      UPDATE CORE.APP_USER 
      SET password_hash = ?, updated_at = CURRENT_TIMESTAMP()
      WHERE user_id = ?;
    `;return await (0,t.executeQuery)(E,[a,e]),!0},async saveSession(e){let a=`
      INSERT INTO CORE.USER_SESSION (session_id, user_id, token, refresh_token, expires_at, revoked, created_at)
      VALUES (?, ?, ?, ?, ?, FALSE, CURRENT_TIMESTAMP());
    `;return await (0,t.executeQuery)(a,[e.id,e.userId,e.token,e.refreshToken,e.expiresAt]),e},async deleteSession(e){let a=`
      UPDATE CORE.USER_SESSION 
      SET revoked = TRUE 
      WHERE token = ? OR refresh_token = ?;
    `;return await (0,t.executeQuery)(a,[e,e]),!0},async saveResetToken(e,a,E){let i=`reset-${Date.now()}`,r=`
      INSERT INTO CORE.PASSWORD_RESET (reset_id, user_id, token, expires_at, used, created_at)
      VALUES (?, ?, ?, ?, FALSE, CURRENT_TIMESTAMP());
    `;return await (0,t.executeQuery)(r,[i,e,a,E]),!0},async findResetToken(e){let a=`
      SELECT * FROM CORE.PASSWORD_RESET 
      WHERE token = ? AND used = FALSE;
    `,E=await (0,t.executeQuery)(a,[e]);if(E&&E.length>0){let e=E[0];return{userId:e.USER_ID||e.user_id,expiresAt:e.EXPIRES_AT||e.expires_at,used:!!(e.USED||e.used)}}},async updateLastLogin(e){let a=`
      UPDATE CORE.APP_USER 
      SET updated_at = CURRENT_TIMESTAMP()
      WHERE user_id = ?;
    `;return await (0,t.executeQuery)(a,[e]),!0},async logLoginHistory(e){let a=`hist-${Date.now()}`,E=`
      INSERT INTO CORE.LOGIN_HISTORY (history_id, user_id, login_at, ip_address, user_agent, status, failure_reason)
      VALUES (?, ?, CURRENT_TIMESTAMP(), ?, ?, ?, ?);
    `;return await (0,t.executeQuery)(E,[a,e.userId,e.ipAddress,e.userAgent,e.status,e.failureReason||""]),!0}}])},37730,e=>{"use strict";e.i(52766);var t=e.i(82087);function a(e){let t=[];try{e.SKILLS&&(t="string"==typeof e.SKILLS?JSON.parse(e.SKILLS):Array.isArray(e.SKILLS)?e.SKILLS:[])}catch{t=[]}return{id:e.STAFF_ID||e.staff_id,agencyId:e.AGENCY_ID||e.agency_id,fullName:e.FULL_NAME||e.full_name||"Care Professional",role:e.ROLE||e.role||"Caregiver",skills:t,experienceYears:Number(e.EXPERIENCE_YEARS||e.experience_years||2),rating:Number(e.RATING||e.rating||5),status:e.STATUS||e.status||"active"}}e.s(["StaffRepository",0,{async getAll(){let e=`
      SELECT 
        s.STAFF_ID, s.AGENCY_ID, s.SKILLS, s.EXPERIENCE_YEARS, s.RATING, s.STATUS,
        u.EMAIL, u.FULL_NAME, u.PHONE_NUMBER, u.ROLE, a.NAME as AGENCY_NAME
      FROM CORE.STAFF_PROFILES s
      JOIN CORE.USERS u ON s.STAFF_ID = u.USER_ID
      LEFT JOIN CORE.AGENCIES a ON s.AGENCY_ID = a.AGENCY_ID;
    `;return(await (0,t.executeQuery)(e)).map(a)},async findById(e){let E=`
      SELECT 
        s.STAFF_ID, s.AGENCY_ID, s.SKILLS, s.EXPERIENCE_YEARS, s.RATING, s.STATUS,
        u.EMAIL, u.FULL_NAME, u.PHONE_NUMBER, u.ROLE, a.NAME as AGENCY_NAME
      FROM CORE.STAFF_PROFILES s
      JOIN CORE.USERS u ON s.STAFF_ID = u.USER_ID
      LEFT JOIN CORE.AGENCIES a ON s.AGENCY_ID = a.AGENCY_ID
      WHERE s.STAFF_ID = ?;
    `,i=await (0,t.executeQuery)(E,[e]);return i[0]?a(i[0]):void 0},async findByAgency(e){let E=`
      SELECT 
        s.STAFF_ID, s.AGENCY_ID, s.SKILLS, s.EXPERIENCE_YEARS, s.RATING, s.STATUS,
        u.EMAIL, u.FULL_NAME, u.PHONE_NUMBER, u.ROLE, a.NAME as AGENCY_NAME
      FROM CORE.STAFF_PROFILES s
      JOIN CORE.USERS u ON s.STAFF_ID = u.USER_ID
      LEFT JOIN CORE.AGENCIES a ON s.AGENCY_ID = a.AGENCY_ID
      WHERE s.AGENCY_ID = ?;
    `;return(await (0,t.executeQuery)(E,[e])).map(a)}}])},40376,e=>{"use strict";e.i(52766);var t=e.i(82087);function a(e){let t=[],a=[];try{e.GOALS&&(t="string"==typeof e.GOALS?JSON.parse(e.GOALS):Array.isArray(e.GOALS)?e.GOALS:[])}catch{t=[]}try{e.PRESCRIPTIONS&&(a="string"==typeof e.PRESCRIPTIONS?JSON.parse(e.PRESCRIPTIONS):Array.isArray(e.PRESCRIPTIONS)?e.PRESCRIPTIONS:[])}catch{a=[]}return{id:e.ID||e.id,patientId:e.PATIENT_ID||e.patient_id,patientName:e.PATIENT_NAME||e.patient_name||"Demo Patient",agencyId:e.AGENCY_ID||e.agency_id,diagnosis:e.DIAGNOSIS||e.diagnosis||"",goals:t,frequency:e.FREQUENCY||e.frequency||"",prescriptions:a,riskAssessment:e.RISK_ASSESSMENT||e.risk_assessment||"low",riskDetails:e.RISK_DETAILS||e.risk_details||"",createdBy:e.CREATED_BY||e.created_by||"Clinical Admin",createdAt:e.CREATED_AT||e.created_at}}e.s(["ClinicalRepository",0,{async getCarePlansByPatient(e){let E=`
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
    `;await (0,t.executeQuery)(E);let i=`
      SELECT cp.*, u.full_name AS patient_name
      FROM CORE.CARE_PLANS cp
      LEFT JOIN CORE.USERS u ON cp.patient_id = u.user_id
      WHERE cp.patient_id = ?;
    `;return(await (0,t.executeQuery)(i,[e])).map(a)},async getCarePlanById(e){let E=`
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
    `;await (0,t.executeQuery)(E);let i=`
      SELECT cp.*, u.full_name AS patient_name
      FROM CORE.CARE_PLANS cp
      LEFT JOIN CORE.USERS u ON cp.patient_id = u.user_id
      WHERE cp.id = ?;
    `,r=await (0,t.executeQuery)(i,[e]);return r[0]?a(r[0]):void 0},async createCarePlan(e){let a=`
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
    `;await (0,t.executeQuery)(a);let E=`cp-${Date.now()}`,i=JSON.stringify(e.goals||[]),r=JSON.stringify(e.prescriptions||[]),n=`
      INSERT INTO CORE.CARE_PLANS (id, patient_id, agency_id, diagnosis, goals, frequency, prescriptions, risk_assessment, risk_details, created_by)
      VALUES (?, ?, ?, ?, PARSE_JSON(?), ?, PARSE_JSON(?), ?, ?, ?);
    `;await (0,t.executeQuery)(n,[E,e.patientId,e.agencyId,e.diagnosis,i,e.frequency,r,e.riskAssessment,e.riskDetails||"",e.createdBy]);let s=await this.getCarePlanById(E);if(!s)throw Error("Failed to retrieve created care plan.");return s},async getMedicalTimeline(e){let a=`
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
    `;await (0,t.executeQuery)(a);let E=`mte-${Date.now()}`,i=`
      INSERT INTO CORE.MEDICAL_TIMELINE (id, patient_id, title, description, category)
      VALUES (?, ?, ?, ?, ?);
    `;return await (0,t.executeQuery)(i,[E,e.patientId,e.title,e.description,e.category]),{id:E,...e,timestamp:new Date().toISOString()}},async getVisitTemplates(e){let a=`
      CREATE TABLE IF NOT EXISTS CORE.VISIT_TEMPLATES (
        id VARCHAR(50) PRIMARY KEY,
        agency_id VARCHAR(50),
        name VARCHAR(150),
        description TEXT,
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;return await (0,t.executeQuery)(a),(await (0,t.executeQuery)("SELECT * FROM CORE.VISIT_TEMPLATES WHERE agency_id = ?;",[e])).map(e=>({id:e.ID||e.id,agencyId:e.AGENCY_ID||e.agency_id,name:e.NAME||e.name,description:e.DESCRIPTION||e.description}))}}])},77592,e=>{"use strict";e.i(52766);var t=e.i(82087);e.s(["AuditRepository",0,{async createLog(e,a,E,i){let r=`
      INSERT INTO CORE.AUDIT_LOGS (actor_id, action, details, ip_address, created_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP());
    `;return await (0,t.executeQuery)(r,[e,a,E,i||"127.0.0.1"]),{log_id:Date.now(),actor_id:e,action:a,details:E,ip_address:i||"127.0.0.1",created_at:new Date().toISOString()}},getAll:async()=>(await (0,t.executeQuery)("SELECT * FROM CORE.AUDIT_LOGS ORDER BY created_at DESC;")).map(e=>({log_id:Number(e.LOG_ID||e.log_id||0),actor_id:e.ACTOR_ID||e.actor_id,action:e.ACTION||e.action,details:e.DETAILS||e.details,ip_address:e.IP_ADDRESS||e.ip_address,created_at:e.CREATED_AT||e.created_at}))}])},59661,e=>{"use strict";e.i(52766);var t=e.i(82087);function a(e){return{id:e.USER_ID||e.user_id,email:e.EMAIL||e.email,fullName:e.FULL_NAME||e.full_name||"Demo User",role:e.ROLE||e.role||"Patient",phone:e.PHONE_NUMBER||e.phone_number||e.phone||"",avatarUrl:e.AVATAR_URL||e.avatar_url||"",status:e.STATUS||e.status||"active",createdAt:e.CREATED_AT||e.created_at}}e.s(["UserRepository",0,{getAll:async()=>(await (0,t.executeQuery)("SELECT * FROM CORE.USERS;")).map(a),async findById(e){let E=await (0,t.executeQuery)("SELECT * FROM CORE.USERS WHERE USER_ID = ?;",[e]);return E[0]?a(E[0]):void 0},async findByEmail(e){let E=await (0,t.executeQuery)("SELECT * FROM CORE.USERS WHERE LOWER(EMAIL) = LOWER(?);",[e]);return E[0]?{...a(E[0]),passwordHash:E[0].PASSWORD_HASH||E[0].password_hash}:void 0},async findByPhone(e){let E=await (0,t.executeQuery)("SELECT * FROM CORE.USERS WHERE PHONE_NUMBER = ?;",[e]);return E[0]?a(E[0]):void 0},async create(e){let a=`u-${Date.now()}`,E=new Date().toISOString(),i=`
      INSERT INTO CORE.USERS (user_id, email, password_hash, full_name, phone_number, role, avatar_url, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'active', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
    `;return await (0,t.executeQuery)(i,[a,e.email,e.passwordHash,e.fullName,e.phone,e.role,e.avatarUrl||null]),{...e,id:a,createdAt:E}}}])},30219,e=>{"use strict";e.i(52766);var t=e.i(82087);e.s(["AgencyRepository",0,{async getAll(){let e=`
      SELECT 
        a.AGENCY_ID, 
        a.AGENCY_NAME, 
        a.REGISTRATION_NO, 
        a.GST_NO, 
        a.PHONE, 
        a.EMAIL, 
        c.CITY_NAME as CITY,
        a.VERIFICATION_STATUS_ID,
        a.CREATED_AT
      FROM CORE.AGENCY a
      LEFT JOIN CORE.CITY_MASTER c ON a.CITY_ID = c.CITY_ID;
    `;return(await (0,t.executeQuery)(e)).map(e=>({id:e.AGENCY_ID||e.agency_id,name:e.AGENCY_NAME||e.agency_name,description:"",registrationNumber:e.REGISTRATION_NO||e.registration_no,gstNumber:e.GST_NO||e.gst_no,panNumber:"",ownerName:"",phone:e.PHONE||e.phone,email:e.EMAIL||e.email,city:e.CITY||e.city||"",state:"",pincode:"",rating:5,reviewCount:0,verified:3===e.VERIFICATION_STATUS_ID,status:"approved",documents:[],createdAt:e.CREATED_AT||e.created_at}))},async findById(e){let a=`
      SELECT 
        a.AGENCY_ID, 
        a.AGENCY_NAME, 
        a.REGISTRATION_NO, 
        a.GST_NO, 
        a.PHONE, 
        a.EMAIL, 
        c.CITY_NAME as CITY,
        a.VERIFICATION_STATUS_ID,
        a.CREATED_AT
      FROM CORE.AGENCY a
      LEFT JOIN CORE.CITY_MASTER c ON a.CITY_ID = c.CITY_ID
      WHERE a.AGENCY_ID = ?;
    `,E=await (0,t.executeQuery)(a,[e]);if(E&&E.length>0){let e=E[0];return{id:e.AGENCY_ID||e.agency_id,name:e.AGENCY_NAME||e.agency_name,description:"",registrationNumber:e.REGISTRATION_NO||e.registration_no,gstNumber:e.GST_NO||e.gst_no,panNumber:"",ownerName:"",phone:e.PHONE||e.phone,email:e.EMAIL||e.email,city:e.CITY||e.city||"",state:"",pincode:"",rating:5,reviewCount:0,verified:3===e.VERIFICATION_STATUS_ID,status:"approved",documents:[],createdAt:e.CREATED_AT||e.created_at}}},async findByEmail(e){let a=await (0,t.executeQuery)("SELECT * FROM CORE.AGENCIES WHERE EMAIL = ?;",[e]);if(a&&a.length>0){let e=a[0];return{id:e.AGENCY_ID||e.agency_id,name:e.NAME||e.name,description:e.DESCRIPTION||e.description,registrationNumber:e.REGISTRATION_NUMBER||e.registration_number,gstNumber:e.GST_NUMBER||e.gst_number,panNumber:e.PAN_NUMBER||e.pan_number,ownerName:e.OWNER_NAME||e.owner_name,phone:e.PHONE||e.phone,email:e.EMAIL||e.email,city:e.CITY||e.city,state:e.STATE||e.state,pincode:e.PINCODE||e.pincode,rating:Number(e.RATING||e.rating||5),reviewCount:Number(e.REVIEW_COUNT||e.review_count||0),verified:!!(e.VERIFIED||e.verified),status:e.STATUS||e.status||"pending",documents:[],createdAt:e.CREATED_AT||e.created_at}}},async create(e){new Date().toISOString();let a=`
      INSERT INTO CORE.AGENCY (
        AGENCY_NAME, REGISTRATION_NO, GST_NO, PHONE, EMAIL, CITY_ID, VERIFICATION_STATUS_ID, CREATED_AT
      ) VALUES (?, ?, ?, ?, ?, 1, 1, CURRENT_TIMESTAMP());
    `;await (0,t.executeQuery)(a,[e.name,e.registrationNumber,e.gstNumber||null,e.phone,e.email]);let E=await this.findByEmail(e.email);if(!E)throw Error("Failed to create agency");return E},async update(e,a){let E=[],i=[];if(a.name&&(E.push("AGENCY_NAME = ?"),i.push(a.name)),a.registrationNumber&&(E.push("REGISTRATION_NO = ?"),i.push(a.registrationNumber)),a.gstNumber&&(E.push("GST_NO = ?"),i.push(a.gstNumber)),a.phone&&(E.push("PHONE = ?"),i.push(a.phone)),a.email&&(E.push("EMAIL = ?"),i.push(a.email)),E.length>0){i.push(e);let a=`UPDATE CORE.AGENCY SET ${E.join(", ")} WHERE AGENCY_ID = ?;`;await (0,t.executeQuery)(a,i)}return this.findById(e)},async delete(e){await (0,t.executeQuery)("DELETE FROM CORE.AGENCY WHERE AGENCY_ID = ?;",[e])},async saveDocument(e,a){let E=`doc-${Date.now()}`,i=`
      CREATE TABLE IF NOT EXISTS CORE.DOCUMENTS (
        document_id VARCHAR(50) PRIMARY KEY,
        owner_id VARCHAR(50),
        type VARCHAR(50),
        file_url VARCHAR(500),
        status VARCHAR(20),
        uploaded_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;await (0,t.executeQuery)(i);let r=`
      INSERT INTO CORE.DOCUMENTS (document_id, owner_id, type, file_url, status)
      VALUES (?, ?, ?, ?, 'pending');
    `;return await (0,t.executeQuery)(r,[E,e,a.type,a.fileUrl]),{id:E,status:"pending",uploadedAt:new Date().toISOString(),...a}}}])},6203,e=>{"use strict";e.i(52766);var t=e.i(82087);function a(e){return{id:e.INVOICE_ID||e.invoice_id,bookingId:e.BOOKING_ID||e.booking_id,patientName:e.PATIENT_NAME||e.patient_name||"Demo Patient",agencyName:e.AGENCY_NAME||e.agency_name||"Nisarga Home Healthcare Services",amount:Number(e.AMOUNT||e.amount||0),tax:Number(e.TAX||e.tax||0),discount:Number(e.DISCOUNT||e.discount||0),total:Number(e.TOTAL_AMOUNT||e.total_amount||0),status:e.STATUS||e.status||"unpaid",dueDate:e.DUE_DATE||e.due_date||"",createdAt:e.CREATED_AT||e.created_at}}e.s(["PaymentsRepository",0,{async getInvoices(){let e=`
      SELECT i.*, u.full_name AS patient_name, a.name AS agency_name
      FROM CORE.INVOICES i
      JOIN CORE.BOOKINGS b ON i.booking_id = b.booking_id
      JOIN CORE.USERS u ON b.patient_id = u.user_id
      JOIN CORE.AGENCIES a ON b.agency_id = a.agency_id;
    `;return(await (0,t.executeQuery)(e)).map(a)},async findInvoiceById(e){let E=`
      SELECT i.*, u.full_name AS patient_name, a.name AS agency_name
      FROM CORE.INVOICES i
      JOIN CORE.BOOKINGS b ON i.booking_id = b.booking_id
      JOIN CORE.USERS u ON b.patient_id = u.user_id
      JOIN CORE.AGENCIES a ON b.agency_id = a.agency_id
      WHERE i.invoice_id = ?;
    `,i=await (0,t.executeQuery)(E,[e]);return i[0]?a(i[0]):void 0},async updateInvoiceStatus(e,a){return await (0,t.executeQuery)("UPDATE CORE.INVOICES SET status = ? WHERE invoice_id = ?;",[a,e]),this.findInvoiceById(e)},async getSubscriptionsByAgency(e){let a=`
      CREATE TABLE IF NOT EXISTS CORE.SUBSCRIPTIONS (
        id VARCHAR(50) PRIMARY KEY,
        agency_id VARCHAR(50),
        plan VARCHAR(20),
        amount DECIMAL(10,2),
        status VARCHAR(20),
        next_billing_date DATE,
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;return await (0,t.executeQuery)(a),(await (0,t.executeQuery)("SELECT * FROM CORE.SUBSCRIPTIONS WHERE agency_id = ?;",[e])).map(e=>({id:e.ID||e.id,agencyId:e.AGENCY_ID||e.agency_id,plan:e.PLAN||e.plan,amount:Number(e.AMOUNT||e.amount||0),status:e.STATUS||e.status,nextBillingDate:e.NEXT_BILLING_DATE||e.next_billing_date}))},async createSubscription(e){let a=`
      CREATE TABLE IF NOT EXISTS CORE.SUBSCRIPTIONS (
        id VARCHAR(50) PRIMARY KEY,
        agency_id VARCHAR(50),
        plan VARCHAR(20),
        amount DECIMAL(10,2),
        status VARCHAR(20),
        next_billing_date DATE,
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;await (0,t.executeQuery)(a);let E=`sub-${Date.now()}`,i=`
      INSERT INTO CORE.SUBSCRIPTIONS (id, agency_id, plan, amount, status, next_billing_date)
      VALUES (?, ?, ?, ?, ?, ?);
    `;return await (0,t.executeQuery)(i,[E,e.agencyId,e.plan,e.amount,e.status,e.nextBillingDate]),{id:E,...e}},async getPayrollByAgency(e){let a=`
      CREATE TABLE IF NOT EXISTS CORE.PAYROLL (
        id VARCHAR(50) PRIMARY KEY,
        agency_id VARCHAR(50),
        staff_id VARCHAR(50),
        amount DECIMAL(10,2),
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;return await (0,t.executeQuery)(a),(await (0,t.executeQuery)("SELECT * FROM CORE.PAYROLL WHERE agency_id = ?;",[e])).map(e=>({id:e.ID||e.id,agencyId:e.AGENCY_ID||e.agency_id,staffId:e.STAFF_ID||e.staff_id,amount:Number(e.AMOUNT||e.amount||0),status:e.STATUS||e.status}))}}])},81619,7682,43211,e=>{"use strict";e.i(52766);var t=e.i(82087);function a(e){return{id:e.BOOKING_ID||e.booking_id,agencyId:e.AGENCY_ID||e.agency_id,agencyName:e.AGENCY_NAME||e.agency_name||"Nisarga Home Healthcare Services",patientId:e.PATIENT_ID||e.patient_id,patientName:e.PATIENT_NAME||e.patient_name||"Demo Patient",serviceCategory:e.SERVICE_CATEGORY||e.service_category,serviceName:e.SERVICE_NAME||e.service_name,status:e.STATUS||e.status||"pending",date:e.BOOKING_DATE||e.booking_date||"",timeSlot:e.TIME_SLOT||e.time_slot,durationHours:Number(e.DURATION_HOURS||e.duration_hours||0),frequency:e.FREQUENCY||e.frequency,address:{id:"addr-1",label:"Home",addressLine:e.ADDRESS_LINE||e.address_line||"",city:e.CITY||e.city||"",state:e.STATE||e.state||"",pincode:e.PINCODE||e.pincode||"",lat:17.4442,lng:78.3562},amount:Number(e.AMOUNT||e.amount||0),paymentStatus:e.PAYMENT_STATUS||e.payment_status||"unpaid",assignedStaffId:e.ASSIGNED_STAFF_ID||e.assigned_staff_id||null,assignedStaffName:e.ASSIGNED_STAFF_NAME||e.assigned_staff_name||null,assignedStaffPhone:e.ASSIGNED_STAFF_PHONE||e.assigned_staff_phone||null,assignedStaffAvatar:e.ASSIGNED_STAFF_AVATAR||e.assigned_staff_avatar||null,createdAt:e.CREATED_AT||e.created_at}}e.s(["BookingRepository",0,{async getAll(){let e=`
      SELECT b.*, a.name AS agency_name, u.full_name AS patient_name
      FROM CORE.BOOKINGS b
      LEFT JOIN CORE.AGENCIES a ON b.agency_id = a.agency_id
      LEFT JOIN CORE.USERS u ON b.patient_id = u.user_id;
    `;return(await (0,t.executeQuery)(e)).map(a)},async findById(e){let E=`
      SELECT b.*, a.name AS agency_name, u.full_name AS patient_name
      FROM CORE.BOOKINGS b
      LEFT JOIN CORE.AGENCIES a ON b.agency_id = a.agency_id
      LEFT JOIN CORE.USERS u ON b.patient_id = u.user_id
      WHERE b.booking_id = ?;
    `,i=await (0,t.executeQuery)(E,[e]);return i[0]?a(i[0]):void 0},async findByPatient(e){let E=`
      SELECT b.*, a.name AS agency_name, u.full_name AS patient_name
      FROM CORE.BOOKINGS b
      LEFT JOIN CORE.AGENCIES a ON b.agency_id = a.agency_id
      LEFT JOIN CORE.USERS u ON b.patient_id = u.user_id
      WHERE b.patient_id = ?;
    `;return(await (0,t.executeQuery)(E,[e])).map(a)},async findByAgency(e){let E=`
      SELECT b.*, a.name AS agency_name, u.full_name AS patient_name
      FROM CORE.BOOKINGS b
      LEFT JOIN CORE.AGENCIES a ON b.agency_id = a.agency_id
      LEFT JOIN CORE.USERS u ON b.patient_id = u.user_id
      WHERE b.agency_id = ?;
    `;return(await (0,t.executeQuery)(E,[e])).map(a)},async findByStaff(e){let E=`
      SELECT b.*, a.name AS agency_name, u.full_name AS patient_name
      FROM CORE.BOOKINGS b
      LEFT JOIN CORE.AGENCIES a ON b.agency_id = a.agency_id
      LEFT JOIN CORE.USERS u ON b.patient_id = u.user_id
      WHERE b.assigned_staff_id = ?;
    `;return(await (0,t.executeQuery)(E,[e])).map(a)},async create(e){let a=`book-${Date.now()}`,E=new Date().toISOString(),i=`
      INSERT INTO CORE.BOOKINGS (
        booking_id, agency_id, patient_id, service_category, service_name, status, 
        booking_date, time_slot, duration_hours, frequency, address_line, city, state, pincode, amount, payment_status
      ) VALUES (?, ?, ?, ?, ?, 'booking_created', ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unpaid');
    `;await (0,t.executeQuery)(i,[a,e.agencyId,e.patientId,e.serviceCategory,e.serviceName,e.date,e.timeSlot,e.durationHours,e.frequency,e.address?.addressLine||"",e.address?.city||"",e.address?.state||"",e.address?.pincode||"",e.amount]);let r=`
      INSERT INTO CORE.INVOICES (
        invoice_id, booking_id, amount, tax, discount, total_amount, status, due_date, created_at
      ) VALUES (?, ?, ?, ?, 0, ?, 'unpaid', DATEADD(day, 5, CURRENT_DATE()), CURRENT_TIMESTAMP());
    `;return await (0,t.executeQuery)(r,[`INV-${Date.now()}`,a,e.amount,Math.round(.18*e.amount),Math.round(1.18*e.amount)]),{...e,id:a,status:"booking_created",paymentStatus:"unpaid",createdAt:E}},async update(e,a){let E=Object.keys(a).filter(e=>"id"!==e&&"createdAt"!==e&&void 0!==a[e]);if(E.length>0){let i=E.map(e=>{let t=e.replace(/([A-Z])/g,"_$1").toUpperCase();return`${t} = ?`}).join(", "),r=E.map(e=>a[e]);r.push(e);let n=`UPDATE CORE.BOOKINGS SET ${i}, UPDATED_AT = CURRENT_TIMESTAMP() WHERE BOOKING_ID = ?;`;await (0,t.executeQuery)(n,r)}return this.findById(e)}}],81619),e.s(["SchedulingRepository",0,{async getAttendanceByStaff(e){let a=`
      CREATE TABLE IF NOT EXISTS CORE.ATTENDANCE (
        id VARCHAR(50) PRIMARY KEY,
        staff_id VARCHAR(50),
        agency_id VARCHAR(50),
        date VARCHAR(20),
        check_in VARCHAR(20),
        check_out VARCHAR(20),
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;return await (0,t.executeQuery)(a),(await (0,t.executeQuery)("SELECT * FROM CORE.ATTENDANCE WHERE staff_id = ? ORDER BY date DESC;",[e])).map(e=>({id:e.ID||e.id,staffId:e.STAFF_ID||e.staff_id,agencyId:e.AGENCY_ID||e.agency_id,date:e.DATE||e.date,checkIn:e.CHECK_IN||e.check_in,checkOut:e.CHECK_OUT||e.check_out,status:e.STATUS||e.status}))},async logAttendance(e){let a=`
      CREATE TABLE IF NOT EXISTS CORE.ATTENDANCE (
        id VARCHAR(50) PRIMARY KEY,
        staff_id VARCHAR(50),
        agency_id VARCHAR(50),
        date VARCHAR(20),
        check_in VARCHAR(20),
        check_out VARCHAR(20),
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;await (0,t.executeQuery)(a);let E=`att-${Date.now()}`,i=`
      INSERT INTO CORE.ATTENDANCE (id, staff_id, agency_id, date, check_in, check_out, status)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;return await (0,t.executeQuery)(i,[E,e.staffId,e.agencyId,e.date,e.checkIn,e.checkOut,e.status]),{id:E,...e}},async getLeaveRecordsByStaff(e){let a=`
      CREATE TABLE IF NOT EXISTS CORE.LEAVE_RECORDS (
        id VARCHAR(50) PRIMARY KEY,
        staff_id VARCHAR(50),
        date VARCHAR(20),
        type VARCHAR(20),
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;return await (0,t.executeQuery)(a),(await (0,t.executeQuery)("SELECT * FROM CORE.LEAVE_RECORDS WHERE staff_id = ? ORDER BY date DESC;",[e])).map(e=>({id:e.ID||e.id,staffId:e.STAFF_ID||e.staff_id,date:e.DATE||e.date,type:e.TYPE||e.type,status:e.STATUS||e.status}))},async requestLeave(e){let a=`
      CREATE TABLE IF NOT EXISTS CORE.LEAVE_RECORDS (
        id VARCHAR(50) PRIMARY KEY,
        staff_id VARCHAR(50),
        date VARCHAR(20),
        type VARCHAR(20),
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;await (0,t.executeQuery)(a);let E=`lv-${Date.now()}`,i=`
      INSERT INTO CORE.LEAVE_RECORDS (id, staff_id, date, type, status)
      VALUES (?, ?, ?, ?, ?);
    `;return await (0,t.executeQuery)(i,[E,e.staffId,e.date,e.type,e.status]),{id:E,...e}},async updateLeaveStatus(e,a){let E=`
      CREATE TABLE IF NOT EXISTS CORE.LEAVE_RECORDS (
        id VARCHAR(50) PRIMARY KEY,
        staff_id VARCHAR(50),
        date VARCHAR(20),
        type VARCHAR(20),
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;await (0,t.executeQuery)(E),await (0,t.executeQuery)("UPDATE CORE.LEAVE_RECORDS SET status = ? WHERE id = ?;",[a,e]);let i=await (0,t.executeQuery)("SELECT * FROM CORE.LEAVE_RECORDS WHERE id = ?;",[e]);if(i[0]){let e=i[0];return{id:e.ID||e.id,staffId:e.STAFF_ID||e.staff_id,date:e.DATE||e.date,type:e.TYPE||e.type,status:e.STATUS||e.status}}},async getCertificationsByStaff(e){let a=`
      CREATE TABLE IF NOT EXISTS CORE.CERTIFICATIONS (
        id VARCHAR(50) PRIMARY KEY,
        staff_id VARCHAR(50),
        name VARCHAR(150),
        authority VARCHAR(100),
        issue_date VARCHAR(20),
        expiry_date VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;return await (0,t.executeQuery)(a),(await (0,t.executeQuery)("SELECT * FROM CORE.CERTIFICATIONS WHERE staff_id = ?;",[e])).map(e=>({id:e.ID||e.id,staffId:e.STAFF_ID||e.staff_id,name:e.NAME||e.name,authority:e.AUTHORITY||e.authority,issueDate:e.ISSUE_DATE||e.issue_date,expiryDate:e.EXPIRY_DATE||e.expiry_date}))}}],7682),e.s(["SupportRepository",0,{async getTicketsByUser(e){let a=`
      CREATE TABLE IF NOT EXISTS CORE.SUPPORT_TICKETS (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50),
        subject VARCHAR(200),
        message TEXT,
        category VARCHAR(20),
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;return await (0,t.executeQuery)(a),(await (0,t.executeQuery)("SELECT * FROM CORE.SUPPORT_TICKETS WHERE user_id = ? ORDER BY created_at DESC;",[e])).map(e=>({id:e.ID||e.id,userId:e.USER_ID||e.user_id,subject:e.SUBJECT||e.subject,message:e.MESSAGE||e.message,category:e.CATEGORY||e.category,status:e.STATUS||e.status,createdAt:e.CREATED_AT||e.created_at}))},async getTickets(){let e=`
      CREATE TABLE IF NOT EXISTS CORE.SUPPORT_TICKETS (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50),
        subject VARCHAR(200),
        message TEXT,
        category VARCHAR(20),
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;return await (0,t.executeQuery)(e),(await (0,t.executeQuery)("SELECT * FROM CORE.SUPPORT_TICKETS ORDER BY created_at DESC;")).map(e=>({id:e.ID||e.id,userId:e.USER_ID||e.user_id,subject:e.SUBJECT||e.subject,message:e.MESSAGE||e.message,category:e.CATEGORY||e.category,status:e.STATUS||e.status,createdAt:e.CREATED_AT||e.created_at}))},async createTicket(e){let a=`
      CREATE TABLE IF NOT EXISTS CORE.SUPPORT_TICKETS (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50),
        subject VARCHAR(200),
        message TEXT,
        category VARCHAR(20),
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;await (0,t.executeQuery)(a);let E=`t-${Date.now()}`,i=`
      INSERT INTO CORE.SUPPORT_TICKETS (id, user_id, subject, message, category, status)
      VALUES (?, ?, ?, ?, ?, ?);
    `;return await (0,t.executeQuery)(i,[E,e.userId,e.subject,e.message,e.category,e.status]),{id:E,...e,createdAt:new Date().toISOString()}},async getComplaints(){let e=`
      CREATE TABLE IF NOT EXISTS CORE.COMPLAINTS (
        id VARCHAR(50) PRIMARY KEY,
        booking_id VARCHAR(50),
        complainant_id VARCHAR(50),
        description TEXT,
        escalation_level INT,
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;return await (0,t.executeQuery)(e),(await (0,t.executeQuery)("SELECT * FROM CORE.COMPLAINTS ORDER BY created_at DESC;")).map(e=>({id:e.ID||e.id,bookingId:e.BOOKING_ID||e.booking_id,complainantId:e.COMPLAINANT_ID||e.complainant_id,description:e.DESCRIPTION||e.description,escalationLevel:Number(e.ESCALATION_LEVEL||e.escalation_level||1),status:e.STATUS||e.status,createdAt:e.CREATED_AT||e.created_at}))},async fileComplaint(e){let a=`
      CREATE TABLE IF NOT EXISTS CORE.COMPLAINTS (
        id VARCHAR(50) PRIMARY KEY,
        booking_id VARCHAR(50),
        complainant_id VARCHAR(50),
        description TEXT,
        escalation_level INT,
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;await (0,t.executeQuery)(a);let E=`comp-${Date.now()}`,i=`
      INSERT INTO CORE.COMPLAINTS (id, booking_id, complainant_id, description, escalation_level, status)
      VALUES (?, ?, ?, ?, ?, ?);
    `;return await (0,t.executeQuery)(i,[E,e.bookingId,e.complainantId,e.description,e.escalationLevel,e.status]),{id:E,...e}},async updateComplaintStatus(e,a){let E=`
      CREATE TABLE IF NOT EXISTS CORE.COMPLAINTS (
        id VARCHAR(50) PRIMARY KEY,
        booking_id VARCHAR(50),
        complainant_id VARCHAR(50),
        description TEXT,
        escalation_level INT,
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;await (0,t.executeQuery)(E),await (0,t.executeQuery)("UPDATE CORE.COMPLAINTS SET status = ? WHERE id = ?;",[a,e]);let i=await (0,t.executeQuery)("SELECT * FROM CORE.COMPLAINTS WHERE id = ?;",[e]);if(i[0]){let e=i[0];return{id:e.ID||e.id,bookingId:e.BOOKING_ID||e.booking_id,complainantId:e.COMPLAINANT_ID||e.complainant_id,description:e.DESCRIPTION||e.description,escalationLevel:Number(e.ESCALATION_LEVEL||e.escalation_level||1),status:e.STATUS||e.status}}}}],43211)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__1u2pe0l._.js.map