module.exports=[18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},24361,(e,t,r)=>{t.exports=e.x("util",()=>require("util"))},14747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},3848,55038,96547,e=>{"use strict";e.i(59661),e.i(30219),e.i(81619),e.i(37730),e.i(52766);var t=e.i(82087);function r(e){let t=[];try{e.SKILLS&&(t="string"==typeof e.SKILLS?JSON.parse(e.SKILLS):Array.isArray(e.SKILLS)?e.SKILLS:[])}catch{t=[]}let r=(e.ROLE||e.role||"").toLowerCase(),a="Caregivers";return r.includes("nurse")||"nursing"===r?a="Nurses":r.includes("doctor")||r.includes("physician")||r.includes("specialist")?a="Doctors":r.includes("physiotherapist")||r.includes("physio")?a="Physiotherapists":t.some(e=>e.toLowerCase().includes("icu")||e.toLowerCase().includes("nurs"))&&(a="Nurses"),{id:e.STAFF_ID||e.staff_id,agencyId:e.AGENCY_ID||e.agency_id,fullName:e.FULL_NAME||e.full_name,email:e.EMAIL||e.email,phone:e.PHONE_NUMBER||e.phone_number||e.phone,avatarUrl:e.AVATAR_URL||e.avatar_url||"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",category:a,role:e.ROLE||e.role||"Caregiver",organization:e.AGENCY_NAME||e.agency_name||"HomeCare Partner",rating:Number(e.RATING||e.rating||5),experienceYears:Number(e.EXPERIENCE_YEARS||e.experience_years||2),status:e.STATUS||e.status||"active",skills:t}}e.i(77592),e.i(40376),e.i(7682),e.i(6203),e.i(43211),e.i(74736),e.s(["ProfessionalRepository",0,{async getAll(){let e=`
      SELECT 
        p.PROFESSIONAL_ID as STAFF_ID,
        p.FIRST_NAME || ' ' || p.LAST_NAME as FULL_NAME,
        p.EMAIL,
        p.PHONE,
        pc.CATEGORY_CODE as ROLE,
        sm.SPECIALIZATION_NAME as SKILLS,
        p.EXPERIENCE_YEARS,
        p.VERIFICATION_STATUS_ID,
        5.0 as RATING,
        'active' as STATUS,
        '' as AVATAR_URL,
        NULL as AGENCY_ID,
        '' as AGENCY_NAME
      FROM CORE.PROFESSIONAL p
      LEFT JOIN CORE.PROFESSIONAL_CATEGORY_MASTER pc ON p.PROFESSIONAL_CATEGORY_ID = pc.PROFESSIONAL_CATEGORY_ID
      LEFT JOIN CORE.SPECIALIZATION_MASTER sm ON p.SPECIALIZATION_ID = sm.SPECIALIZATION_ID;
    `;return(await (0,t.executeQuery)(e)).map(r)},async findById(e){let a=`
      SELECT 
        p.PROFESSIONAL_ID as STAFF_ID,
        p.FIRST_NAME || ' ' || p.LAST_NAME as FULL_NAME,
        p.EMAIL,
        p.PHONE,
        pc.CATEGORY_CODE as ROLE,
        sm.SPECIALIZATION_NAME as SKILLS,
        p.EXPERIENCE_YEARS,
        p.VERIFICATION_STATUS_ID,
        5.0 as RATING,
        'active' as STATUS,
        '' as AVATAR_URL,
        NULL as AGENCY_ID,
        '' as AGENCY_NAME
      FROM CORE.PROFESSIONAL p
      LEFT JOIN CORE.PROFESSIONAL_CATEGORY_MASTER pc ON p.PROFESSIONAL_CATEGORY_ID = pc.PROFESSIONAL_CATEGORY_ID
      LEFT JOIN CORE.SPECIALIZATION_MASTER sm ON p.SPECIALIZATION_ID = sm.SPECIALIZATION_ID
      WHERE p.PROFESSIONAL_ID = ?;
    `,i=await (0,t.executeQuery)(a,[e]);return i[0]?r(i[0]):void 0},findByAgency:async e=>[],async create(e){let a=e.fullName.split(" "),i=a[0],s=a.slice(1).join(" ")||"",n=`
      INSERT INTO CORE.PROFESSIONAL (
        FIRST_NAME, LAST_NAME, EMAIL, PHONE, EXPERIENCE_YEARS, PROFESSIONAL_CATEGORY_ID, SPECIALIZATION_ID, VERIFICATION_STATUS_ID, CREATED_AT
      ) VALUES (?, ?, ?, ?, ?, 1, 1, 1, CURRENT_TIMESTAMP());
    `;await (0,t.executeQuery)(n,[i,s,e.email,e.phone,e.experienceYears]);let o=`
      SELECT 
        p.PROFESSIONAL_ID as STAFF_ID,
        p.FIRST_NAME || ' ' || p.LAST_NAME as FULL_NAME,
        p.EMAIL,
        p.PHONE,
        pc.CATEGORY_CODE as ROLE,
        sm.SPECIALIZATION_NAME as SKILLS,
        p.EXPERIENCE_YEARS,
        p.VERIFICATION_STATUS_ID,
        5.0 as RATING,
        'active' as STATUS,
        '' as AVATAR_URL,
        NULL as AGENCY_ID,
        '' as AGENCY_NAME
      FROM CORE.PROFESSIONAL p
      LEFT JOIN CORE.PROFESSIONAL_CATEGORY_MASTER pc ON p.PROFESSIONAL_CATEGORY_ID = pc.PROFESSIONAL_CATEGORY_ID
      LEFT JOIN CORE.SPECIALIZATION_MASTER sm ON p.SPECIALIZATION_ID = sm.SPECIALIZATION_ID
      WHERE p.EMAIL = ?;
    `,E=await (0,t.executeQuery)(o,[e.email]);if(!E||0===E.length)throw Error("Failed to retrieve created professional.");return r(E[0])},async update(e,r){let a=[],i=[];if(r.fullName){let e=r.fullName.split(" ");a.push("FIRST_NAME = ?"),i.push(e[0]),a.push("LAST_NAME = ?"),i.push(e.slice(1).join(" "))}if(r.email&&(a.push("EMAIL = ?"),i.push(r.email)),r.phone&&(a.push("PHONE = ?"),i.push(r.phone)),void 0!==r.experienceYears&&(a.push("EXPERIENCE_YEARS = ?"),i.push(r.experienceYears)),a.length>0){i.push(e);let r=`UPDATE CORE.PROFESSIONAL SET ${a.join(", ")} WHERE PROFESSIONAL_ID = ?`;await (0,t.executeQuery)(r,i)}return this.findById(e)},async delete(e){await (0,t.executeQuery)("DELETE FROM CORE.PROFESSIONAL WHERE PROFESSIONAL_ID = ?",[e])}}],55038),e.s(["PatientRepository",0,{async getAll(){let e=`
      SELECT 
        p.PATIENT_ID,
        u.EMAIL,
        u.FULL_NAME,
        u.PHONE_NUMBER,
        u.AVATAR_URL
      FROM CORE.PATIENT_PROFILES p
      JOIN CORE.USERS u ON p.PATIENT_ID = u.USER_ID;
    `;return(await (0,t.executeQuery)(e)).map(e=>{let t=(e.FULL_NAME||e.full_name||"Demo Patient").split(" "),r=t[0]||"",a=t.slice(1).join(" ")||"";return{id:e.PATIENT_ID||e.patient_id,firstName:r,lastName:a,email:e.EMAIL||e.email||"",phone:e.PHONE_NUMBER||e.phone_number||e.phone||"",profilePhoto:e.AVATAR_URL||e.avatar_url||""}})},async getPatient(e){let t=await this.getProfile(e);return t?.patient},async getProfile(e){let r=`
      SELECT 
        p.PATIENT_ID,
        p.MEDICAL_HISTORY,
        p.ALLERGIES,
        p.BLOOD_GROUP,
        u.EMAIL,
        u.FULL_NAME,
        u.PHONE_NUMBER,
        u.AVATAR_URL
      FROM CORE.PATIENT_PROFILES p
      JOIN CORE.USERS u ON p.PATIENT_ID = u.USER_ID
      WHERE p.PATIENT_ID = ?;
    `,a=await (0,t.executeQuery)(r,[e]);return a[0]?function(e){let t=(e.FULL_NAME||"Demo Patient").split(" "),r=t[0]||"",a=t.slice(1).join(" ")||"",i=[];try{e.ALLERGIES&&(i="string"==typeof e.ALLERGIES?JSON.parse(e.ALLERGIES):Array.isArray(e.ALLERGIES)?e.ALLERGIES:[])}catch{i=[]}return{patient:{id:e.PATIENT_ID||e.patient_id,firstName:r,lastName:a,email:e.EMAIL||e.email||"",phone:e.PHONE_NUMBER||e.phone_number||e.phone||"",profilePhoto:e.AVATAR_URL||e.avatar_url||""},dateOfBirth:"1990-01-01",gender:"Male",bloodGroup:e.BLOOD_GROUP||e.blood_group||"O+",address:{street:"123 Care Street",city:"Hyderabad",state:"Telangana",postalCode:"500081",country:"India"},medicalHistory:e.MEDICAL_HISTORY||e.medical_history||"",allergies:i}}(a[0]):void 0},async create(e){let r=e.medicalHistory||"",a=JSON.stringify(e.allergies||[]),i=e.bloodGroup||"",s=`
      INSERT INTO CORE.PATIENT_PROFILES (PATIENT_ID, MEDICAL_HISTORY, ALLERGIES, BLOOD_GROUP, CREATED_AT, UPDATED_AT)
      VALUES (?, ?, PARSE_JSON(?), ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
    `;await (0,t.executeQuery)(s,[e.patientId,r,a,i]);let n=await this.getProfile(e.patientId);if(!n)throw Error("Failed to retrieve created patient profile.");return n}}],96547),e.s([],3848)},54799,(e,t,r)=>{t.exports=e.x("crypto",()=>require("crypto"))},874,(e,t,r)=>{t.exports=e.x("buffer",()=>require("buffer"))},81111,(e,t,r)=>{t.exports=e.x("node:stream",()=>require("node:stream"))},24836,(e,t,r)=>{t.exports=e.x("https",()=>require("https"))},21517,(e,t,r)=>{t.exports=e.x("http",()=>require("http"))},4446,(e,t,r)=>{t.exports=e.x("net",()=>require("net"))},55004,(e,t,r)=>{t.exports=e.x("tls",()=>require("tls"))},92509,(e,t,r)=>{t.exports=e.x("url",()=>require("url"))},28228,65051,e=>{"use strict";e.i(59661),(t={}).PATIENT="Patient",t.FAMILY_MEMBER="Family Member",t.AGENCY_OWNER="Agency Owner",t.AGENCY_ADMIN="Agency Admin",t.NURSE="Nurse",t.CAREGIVER="Caregiver",t.PHYSIOTHERAPIST="Physiotherapist",t.DOCTOR="Doctor",t.PLATFORM_ADMIN="Platform Admin",(r={}).NURSING="Nursing",r.CAREGIVER="Caregiver",r.PHYSIOTHERAPY="Physiotherapy",r.DOCTOR="Doctors",r.MOTHER_BABY="Mother & Baby",e.i(7682),e.i(81619),e.i(30219),e.i(37730),e.i(52766);var t,r,a=e.i(82087);e.s(["NotificationService",0,{async sendNotification(e){let t=`
      CREATE TABLE IF NOT EXISTS CORE.NOTIFICATIONS (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50),
        title VARCHAR(200),
        message TEXT,
        status VARCHAR(20),
        retries INT,
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;await (0,a.executeQuery)(t);let r=e.template;Object.keys(e.variables).forEach(t=>{r=r.replace(`{{${t}}}`,e.variables[t])});let i=`notif-${Date.now()}`,s=`
      INSERT INTO CORE.NOTIFICATIONS (id, user_id, title, message, status, retries)
      VALUES (?, ?, ?, ?, 'delivered', 0);
    `;return await (0,a.executeQuery)(s,[i,e.userId,e.title,r]),{id:i,userId:e.userId,title:e.title,message:r,status:"delivered",retries:0,createdAt:new Date().toISOString()}},async getHistory(e){let t=`
      CREATE TABLE IF NOT EXISTS CORE.NOTIFICATIONS (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50),
        title VARCHAR(200),
        message TEXT,
        status VARCHAR(20),
        retries INT,
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;return await (0,a.executeQuery)(t),(await (0,a.executeQuery)("SELECT * FROM CORE.NOTIFICATIONS WHERE user_id = ? ORDER BY created_at DESC;",[e])).map(e=>({id:e.ID||e.id,userId:e.USER_ID||e.user_id,title:e.TITLE||e.title,message:e.MESSAGE||e.message,status:e.STATUS||e.status,retries:Number(e.RETRIES||e.retries||0),createdAt:e.CREATED_AT||e.created_at}))}}],65051),e.i(6203),e.i(85527),e.i(40376),e.i(43211),e.i(62591),e.s([],28228)},15282,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),i=e.i(59756),s=e.i(61916),n=e.i(74677),o=e.i(19163),E=e.i(16795),l=e.i(87718),A=e.i(95169),u=e.i(47587),p=e.i(66012),R=e.i(70101),I=e.i(26937),d=e.i(10372),c=e.i(93695);e.i(52474);var T=e.i(220),S=e.i(89171);e.i(3848);var N=e.i(77592);e.i(28228);var O=e.i(65051);async function _(e){try{let{bookingId:t,patientId:r,patientName:a,coordinates:i,message:s}=await e.json(),n=e.headers.get("x-forwarded-for")||"127.0.0.1";return await N.AuditRepository.createLog(r||"u-1","SOS EMERGENCY TRIGGERED",`CRITICAL SOS TRIGGERED by ${a||"Patient"}. Booking ID: ${t||"N/A"}. Coordinates: [${i?.lat||"N/A"}, ${i?.lng||"N/A"}]. Note: ${s||"Immediate ambulance/clinical triage required."}`,n),await O.NotificationService.sendNotification({userId:"u-2",title:"🚨 CRITICAL SOS ESCALATION 🚨",template:"Emergency trigger received from {{patientName}}. Immediate dispatch recommended.",variables:{patientName:a||"Ankala Victoria Rani"}}),S.NextResponse.json({success:!0,message:"Emergency medical response team and clinical supervisors have been notified. Keep your device active.",dispatched:!0,timestamp:new Date().toISOString()})}catch(e){return S.NextResponse.json({success:!1,error:e.message},{status:500})}}e.s(["POST",0,_],6467);var C=e.i(6467);let L=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/sos/trigger/route",pathname:"/api/sos/trigger",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/sos/trigger/route.ts",nextConfigOutput:"",userland:C,...{}}),{workAsyncStorage:h,workUnitAsyncStorage:P,serverHooks:m}=L;async function y(e,t,a){a.requestMeta&&(0,i.setRequestMeta)(e,a.requestMeta),L.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let S="/api/sos/trigger/route";S=S.replace(/\/index$/,"")||"/";let N=await L.prepare(e,t,{srcPage:S,multiZoneDraftMode:!1});if(!N)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:O,deploymentId:_,params:C,nextConfig:h,parsedUrl:P,isDraftMode:m,prerenderManifest:y,routerServerContext:g,isOnDemandRevalidate:v,revalidateOnlyGenerated:x,resolvedPathname:M,clientReferenceManifest:f,serverActionsManifest:D}=N,F=(0,o.normalizeAppPath)(S),w=!!(y.dynamicRoutes[F]||y.routes[M]),U=async()=>((null==g?void 0:g.render404)?await g.render404(e,t,P,!1):t.end("This page could not be found"),null);if(w&&!m){let e=!!y.routes[M],t=y.dynamicRoutes[F];if(t&&!1===t.fallback&&!e){if(h.adapterPath)return await U();throw new c.NoFallbackError}}let H=null;!w||L.isDev||m||(H="/index"===(H=M)?"/":H);let G=!0===L.isDev||!w,b=w&&!G;D&&f&&(0,n.setManifestsSingleton)({page:S,clientReferenceManifest:f,serverActionsManifest:D});let Y=e.method||"GET",q=(0,s.getTracer)(),V=q.getActiveScopeSpan(),j=!!(null==g?void 0:g.isWrappedByNextServer),k=!!(0,i.getRequestMeta)(e,"minimalMode"),B=(0,i.getRequestMeta)(e,"incrementalCache")||await L.getIncrementalCache(e,h,y,k);null==B||B.resetRequestCache(),globalThis.__incrementalCache=B;let K={params:C,previewProps:y.preview,renderOpts:{experimental:{authInterrupts:!!h.experimental.authInterrupts},cacheComponents:!!h.cacheComponents,supportsDynamicResponse:G,incrementalCache:B,cacheLifeProfiles:h.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,i)=>L.onRequestError(e,t,a,i,g)},sharedContext:{buildId:O,deploymentId:_}},$=new E.NodeNextRequest(e),Z=new E.NodeNextResponse(t),Q=l.NextRequestAdapter.fromNodeNextRequest($,(0,l.signalFromNodeResponse)(t));try{let i,n=async e=>L.handle(Q,K).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=q.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==A.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${Y} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),i&&i!==e&&(i.setAttribute("http.route",a),i.updateName(t))}else e.updateName(`${Y} ${S}`)}),o=async i=>{var s,o;let E=async({previousCacheEntry:r})=>{try{if(!k&&v&&x&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await n(i);e.fetchMetrics=K.renderOpts.fetchMetrics;let o=K.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let E=K.renderOpts.collectedTags;if(!w)return await (0,p.sendResponse)($,Z,s,K.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,R.toNodeOutgoingHttpHeaders)(s.headers);E&&(t[d.NEXT_CACHE_TAGS_HEADER]=E),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==K.renderOpts.collectedRevalidate&&!(K.renderOpts.collectedRevalidate>=d.INFINITE_CACHE)&&K.renderOpts.collectedRevalidate,a=void 0===K.renderOpts.collectedExpire||K.renderOpts.collectedExpire>=d.INFINITE_CACHE?void 0:K.renderOpts.collectedExpire;return{value:{kind:T.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await L.onRequestError(e,t,{routerKind:"App Router",routePath:S,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:b,isOnDemandRevalidate:v})},!1,g),t}},l=await L.handleResponse({req:e,nextConfig:h,cacheKey:H,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:v,revalidateOnlyGenerated:x,responseGenerator:E,waitUntil:a.waitUntil,isMinimalMode:k});if(!w)return null;if((null==l||null==(s=l.value)?void 0:s.kind)!==T.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(o=l.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});k||t.setHeader("x-nextjs-cache",v?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),m&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let A=(0,R.fromNodeOutgoingHttpHeaders)(l.value.headers);return k&&w||A.delete(d.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||A.get("Cache-Control")||A.set("Cache-Control",(0,I.getCacheControlHeader)(l.cacheControl)),await (0,p.sendResponse)($,Z,new Response(l.value.body,{headers:A,status:l.value.status||200})),null};j&&V?await o(V):(i=q.getActiveScopeSpan(),await q.withPropagatedContext(e.headers,()=>q.trace(A.BaseServerSpan.handleRequest,{spanName:`${Y} ${S}`,kind:s.SpanKind.SERVER,attributes:{"http.method":Y,"http.target":e.url}},o),void 0,!j))}catch(t){if(t instanceof c.NoFallbackError||await L.onRequestError(e,t,{routerKind:"App Router",routePath:F,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:b,isOnDemandRevalidate:v})},!1,g),w)throw t;return await (0,p.sendResponse)($,Z,new Response(null,{status:500})),null}}e.s(["handler",0,y,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:h,workUnitAsyncStorage:P})},"routeModule",0,L,"serverHooks",0,m,"workAsyncStorage",0,h,"workUnitAsyncStorage",0,P],15282)},85685,e=>{e.v(e=>Promise.resolve().then(()=>e(54799)))},91961,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__20ne-ty._.js"].map(t=>e.l(t))).then(()=>t(12111)))},72331,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__1mwf4e5._.js","server/chunks/[root-of-the-server]__1k5x3fc._.js","server/chunks/[root-of-the-server]__0sdbg-b._.js"].map(t=>e.l(t))).then(()=>t(20442)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0zq83zi._.js.map